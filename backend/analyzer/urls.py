from django.urls import path
from .views import (
    AnalyzeResumeView,
    ResumeAnalysisListView,
    ResumeAnalysisDetailView,
)

urlpatterns = [
    path('analyze/', AnalyzeResumeView.as_view(), name='analyze-resume'),
    path('analyses/', ResumeAnalysisListView.as_view(), name='analysis-list'),
    path('analyses/<uuid:pk>/', ResumeAnalysisDetailView.as_view(), name='analysis-detail'),
]
