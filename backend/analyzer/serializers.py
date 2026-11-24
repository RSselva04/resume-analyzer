from rest_framework import serializers
from .models import ResumeAnalysis

ALLOWED_EXTENSIONS = ['pdf', 'docx', 'doc', 'txt']
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

class ResumeUploadSerializer(serializers.Serializer):
    resume = serializers.FileField(required=True)
    job_description = serializers.CharField(required=True, min_length=20)
    job_title = serializers.CharField(required=False, allow_blank=True, max_length=255)

    def validate_resume(self, value):
        ext = value.name.split('.')[-1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise serializers.ValidationError(
                f"Unsupported file format '{ext}'. Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        if value.size > MAX_FILE_SIZE:
            raise serializers.ValidationError("File size must not exceed 10MB.")
        return value

class ResumeAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeAnalysis
        fields = [
            'id',
            'candidate_name',
            'job_title',
            'resume_file',
            'resume_filename',
            'job_description',
            'match_score',
            'ats_score',
            'analysis_data',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'match_score', 'ats_score', 'analysis_data']
