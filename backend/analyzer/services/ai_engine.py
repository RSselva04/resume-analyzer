import json
import logging
import re
from django.conf import settings

logger = logging.getLogger(__name__)

SYSTEM_INSTRUCTION = """
You are an expert Career Coach, Senior Technical Recruiter, and Applicant Tracking System (ATS) Specialist.
Your task is to analyze a Job Seeker's Resume against a target Job Description (JD).

You must provide a rigorous, constructive, and highly actionable analysis in VALID JSON format.

JSON Schema to follow strictly:
{
  "candidate_name": "Extracted candidate name or null",
  "job_title": "Target job title identified from JD",
  "match_score": 75, // integer 0-100 based on skill overlap, experience level, and qualifications
  "ats_score": 80,   // integer 0-100 based on standard formatting, action verbs, clear section headings, metrics
  "summary": "2-3 sentences summarizing overall fit and the main gap to address.",
  "matched_skills": ["Python", "Django", "SQL"],
  "missing_skills": [
    {"skill": "Docker", "priority": "High", "reason": "Mentioned as required in the JD but not found in the resume."},
    {"skill": "AWS", "priority": "Medium", "reason": "Preferred qualification that would strengthen the profile."}
  ],
  "strengths": [
    "Strong demonstrated experience with Python backend development.",
    "Measurable accomplishments mentioned in previous engineering roles."
  ],
  "improvements": [
    "Include more quantitative metrics (e.g., % improvement, revenue, latency reduced).",
    "Add a dedicated Skills summary near the top for faster recruiter skimming."
  ],
  "bullet_rewrites": [
    {
      "original": "Worked on backend APIs and database queries.",
      "improved": "Architected and optimized 15+ RESTful APIs in Django, reducing query latency by 35% across 500K daily active users.",
      "rationale": "Quantified the impact, specified tools (Django), and replaced passive phrasing with strong action verb 'Architected'."
    }
  ],
  "section_feedback": {
    "formatting": "Clear chronological format. Ensure standard fonts and no complex multi-column tables.",
    "contact": "Contact information is complete and professional.",
    "experience": "Strong overall, but several bullet points lack quantifiable business metrics.",
    "skills": "Good coverage of core technologies, but missing cloud deployment tools specified in JD.",
    "education": "Clearly presented."
  }
}
"""

def mock_fallback_analysis(resume_text: str, jd_text: str) -> dict:
    """
    Intelligent heuristic fallback if GEMINI_API_KEY is not configured.
    Ensures the application never crashes and can be tested immediately.
    """
    resume_lower = resume_text.lower()
    jd_lower = jd_text.lower()
    
    # Common tech & professional keywords to look for
    common_keywords = [
        "python", "django", "react", "javascript", "typescript", "sql", "postgresql", 
        "docker", "kubernetes", "aws", "azure", "git", "rest api", "graphql", 
        "ci/cd", "agile", "scrum", "leadership", "analytics", "testing", "fastapi"
    ]
    
    matched = []
    missing = []
    
    for kw in common_keywords:
        if kw in jd_lower:
            if kw in resume_lower:
                matched.append(kw.title())
            else:
                missing.append({
                    "skill": kw.title(),
                    "priority": "High" if kw in ["python", "react", "sql", "docker"] else "Medium",
                    "reason": f"Required or emphasized in the job description but not clearly listed in your resume."
                })
                
    if not matched:
        matched = ["General Problem Solving", "Communication", "Team Collaboration"]
    if not missing:
        missing = [{"skill": "Cloud Infrastructure", "priority": "Medium", "reason": "Demonstrating cloud deployment boosts your profile."}]
        
    score_ratio = len(matched) / max(len(matched) + len(missing), 1)
    match_score = int(min(max(score_ratio * 100, 45), 92))
    
    # Simple ATS check
    has_metrics = bool(re.search(r'\d+%', resume_text) or re.search(r'\$\d+', resume_text))
    ats_score = 82 if has_metrics else 68
    
    return {
        "candidate_name": "Job Seeker",
        "job_title": "Target Role",
        "match_score": match_score,
        "ats_score": ats_score,
        "summary": "Your profile demonstrates a solid foundation for this position. Bridging the highlighted skill gaps and quantifying your achievements will significantly increase your interview callback rate.",
        "matched_skills": matched[:8],
        "missing_skills": missing[:6],
        "strengths": [
            "Relevant technical foundation aligned with key responsibilities.",
            "Clear chronological career progression and readable format."
        ],
        "improvements": [
            "Tailor your experience section with exact keywords mentioned in the target job description.",
            "Incorporate measurable outcomes (e.g., % increase in efficiency, reduction in load times)."
        ],
        "bullet_rewrites": [
            {
                "original": "Responsible for managing and maintaining web applications.",
                "improved": "Spearheaded maintenance and optimization of core web applications, boosting uptime to 99.9% and reducing page load time by 28%.",
                "rationale": "Uses strong action verb 'Spearheaded' and adds quantifiable impact metrics."
            }
        ],
        "section_feedback": {
            "formatting": "Good readable layout. Ensure clean margins and standard bullet points.",
            "contact": "Check that your LinkedIn profile and GitHub links are clickable.",
            "experience": "Focus each bullet point on Action + Context + Measurable Result.",
            "skills": "Group skills logically (e.g. Languages, Frameworks, Databases, Tools).",
            "education": "Appropriate degree and institutional details present."
        }
    }

def analyze_resume_with_gemini(resume_text: str, jd_text: str) -> dict:
    """
    Sends resume and job description to Gemini and returns parsed JSON analysis.
    """
    api_key = getattr(settings, 'GEMINI_API_KEY', '') or ''
    api_key = api_key.strip()
    
    # If no API key configured, use intelligent fallback
    if not api_key or api_key == 'your_gemini_api_key_here':
        logger.warning("No GEMINI_API_KEY found in environment. Using fallback heuristic analyzer.")
        return mock_fallback_analysis(resume_text, jd_text)
        
    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)
        
        prompt = f"""
TARGET JOB DESCRIPTION:
\"\"\"
{jd_text}
\"\"\"

CANDIDATE RESUME:
\"\"\"
{resume_text}
\"\"\"

Please evaluate the candidate's resume strictly against the target job description.
Return ONLY valid JSON matching the schema provided in the instructions.
"""

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                response_mime_type="application/json",
                temperature=0.2,
            )
        )
        
        content = response.text.strip()
        data = json.loads(content)
        return data

    except Exception as e:
        logger.error(f"Gemini API error: {str(e)}. Falling back to heuristic analysis.")
        fallback = mock_fallback_analysis(resume_text, jd_text)
        fallback["summary"] += f" (Note: Gemini API call had an issue: {str(e)})"
        return fallback
