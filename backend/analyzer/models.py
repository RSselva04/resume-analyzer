import uuid
from django.db import models

class ResumeAnalysis(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    candidate_name = models.CharField(max_length=255, blank=True, null=True)
    job_title = models.CharField(max_length=255, blank=True, null=True)
    resume_file = models.FileField(upload_to='resumes/')
    resume_filename = models.CharField(max_length=255, blank=True)
    job_description = models.TextField()
    
    # Quantitative Scores (0 - 100)
    match_score = models.IntegerField(default=0, help_text="Job description fit score (0-100)")
    ats_score = models.IntegerField(default=0, help_text="ATS formatting and readability score (0-100)")
    
    # Detailed AI Analysis Stored in PostgreSQL JSONField
    # Schema includes:
    # - summary (string)
    # - matched_skills (list of str)
    # - missing_skills (list of {skill, priority, reason})
    # - strengths (list of str)
    # - improvements (list of str)
    # - bullet_rewrites (list of {original, improved, rationale})
    # - section_feedback (dict: contact, education, experience, skills, formatting)
    analysis_data = models.JSONField(default=dict)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Resume Analyses'

    def __str__(self):
        title = self.job_title or "General Analysis"
        return f"{self.candidate_name or self.resume_filename} - {title} ({self.created_at.strftime('%Y-%m-%d')})"
