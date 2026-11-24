import logging
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import ResumeAnalysis
from .serializers import ResumeUploadSerializer, ResumeAnalysisSerializer
from .services.parser import parse_resume_file
from .services.ai_engine import analyze_resume_with_gemini

logger = logging.getLogger(__name__)

class AnalyzeResumeView(APIView):
    """
    POST: Uploads a resume (PDF/DOCX/TXT) along with a target job description.
    Extracts text, conducts AI-powered gap and ATS analysis, saves to PostgreSQL,
    and returns the structured evaluation report.
    """
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        serializer = ResumeUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": "Validation failed", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        uploaded_file = serializer.validated_data['resume']
        job_description = serializer.validated_data['job_description']
        job_title = serializer.validated_data.get('job_title', '').strip()

        # Step 1: Parse text from uploaded resume document
        try:
            resume_text = parse_resume_file(uploaded_file)
        except ValueError as ve:
            return Response(
                {"error": str(ve)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.exception("Error extracting text from resume")
            return Response(
                {"error": f"Failed to read resume document: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Step 2: Run AI Analysis (Gemini API with fallback)
        try:
            analysis_result = analyze_resume_with_gemini(resume_text, job_description)
        except Exception as e:
            logger.exception("AI Engine error")
            return Response(
                {"error": f"Error running resume analysis: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Step 3: Extract top-level scores and metadata
        match_score = int(analysis_result.get('match_score', 0))
        ats_score = int(analysis_result.get('ats_score', 0))
        candidate_name = analysis_result.get('candidate_name')
        detected_title = job_title or analysis_result.get('job_title') or 'Target Position'

        # Step 4: Persist in PostgreSQL database
        try:
            analysis_instance = ResumeAnalysis.objects.create(
                candidate_name=candidate_name,
                job_title=detected_title,
                resume_file=uploaded_file,
                resume_filename=uploaded_file.name,
                job_description=job_description,
                match_score=match_score,
                ats_score=ats_score,
                analysis_data=analysis_result
            )
        except Exception as e:
            logger.exception("Database save error")
            return Response(
                {"error": f"Failed to save record to database: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        output_serializer = ResumeAnalysisSerializer(analysis_instance)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)


class ResumeAnalysisListView(APIView):
    """
    GET: List past analyses (ordered by latest first).
    """
    def get(self, request):
        analyses = ResumeAnalysis.objects.all()[:20]
        serializer = ResumeAnalysisSerializer(analyses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ResumeAnalysisDetailView(APIView):
    """
    GET: Retrieve a single analysis report by UUID.
    DELETE: Remove an analysis report.
    """
    def get(self, request, pk):
        try:
            analysis = ResumeAnalysis.objects.get(pk=pk)
        except ResumeAnalysis.DoesNotExist:
            return Response({"error": "Analysis report not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ResumeAnalysisSerializer(analysis)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        try:
            analysis = ResumeAnalysis.objects.get(pk=pk)
            analysis.delete()
            return Response({"message": "Report deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except ResumeAnalysis.DoesNotExist:
            return Response({"error": "Analysis report not found"}, status=status.HTTP_404_NOT_FOUND)
