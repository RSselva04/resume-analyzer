import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Loader2, RotateCcw, AlertCircle } from 'lucide-react';
import Header from './components/Header';
import ResumeUploader from './components/ResumeUploader';
import JobDescriptionInput from './components/JobDescriptionInput';
import ScoreCard from './components/ScoreCard';
import SkillsBreakdown from './components/SkillsBreakdown';
import BulletRewriter from './components/BulletRewriter';
import SectionFeedback from './components/SectionFeedback';
import HistoryDrawer from './components/HistoryDrawer';
import { analyzeResume, fetchHistory, deleteAnalysis } from './services/api';

export default function App() {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [currentReport, setCurrentReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Load past scans on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await fetchHistory();
      setHistory(data || []);
    } catch (err) {
      console.warn('Could not load history from backend:', err);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please upload your resume file (PDF or DOCX).');
      return;
    }
    if (!jobDescription || jobDescription.trim().length < 20) {
      setError('Please provide a complete Job Description (at least 20 characters).');
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeResume(file, jobDescription, jobTitle);
      setCurrentReport(result);
      // Refresh history list
      loadHistory();
      // Scroll down to results smoothly
      window.scrollTo({ top: 380, behavior: 'smooth' });
    } catch (err) {
      console.error('Analysis failed:', err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.details?.resume?.[0] ||
        err.message ||
        'Failed to analyze resume. Please ensure the backend is running.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobTitle('');
    setJobDescription('');
    setCurrentReport(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistoryItem = async (id) => {
    try {
      await deleteAnalysis(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (currentReport?.id === id) {
        setCurrentReport(null);
      }
    } catch (err) {
      console.error('Failed to delete report:', err);
    }
  };

  const analysisData = currentReport?.analysis_data || {};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        onOpenHistory={() => setHistoryOpen(true)}
        historyCount={history.length}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Optimize Your Resume for Any Job
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Compare your resume directly against the job description. Uncover missing keywords, get ATS readability scores, and turn weak bullets into measurable achievements.
          </p>
        </div>

        {/* Input Form Cards */}
        <form onSubmit={handleAnalyze} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <ResumeUploader file={file} setFile={setFile} />
            <JobDescriptionInput
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              jobTitle={jobTitle}
              setJobTitle={setJobTitle}
            />
          </div>

          {error && (
            <div className="max-w-2xl mx-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Analysis Request Failed</p>
                <p className="text-xs text-rose-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || !file || jobDescription.trim().length < 20}
              className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl text-base font-bold shadow-lg transition-all ${
                loading || !file || jobDescription.trim().length < 20
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white shadow-sky-600/25 hover:shadow-sky-600/40 hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Scanning & Evaluating with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze Resume & Match with JD</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            {currentReport && (
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Start New Scan</span>
              </button>
            )}
          </div>
        </form>

        {/* Results Dashboard */}
        {currentReport && (
          <section className="space-y-6 pt-4 animate-in fade-in duration-500">
            <ScoreCard
              analysis={analysisData}
              candidateName={currentReport.candidate_name}
              jobTitle={currentReport.job_title}
            />

            <SkillsBreakdown
              matchedSkills={analysisData.matched_skills}
              missingSkills={analysisData.missing_skills}
            />

            <BulletRewriter
              bulletRewrites={analysisData.bullet_rewrites}
            />

            <SectionFeedback
              sectionFeedback={analysisData.section_feedback}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          CareerFit AI • Built with React, Django REST Framework, PostgreSQL, and Google Gemini
        </div>
      </footer>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        activeId={currentReport?.id}
        onSelectReport={(report) => {
          setCurrentReport(report);
          setJobTitle(report.job_title || '');
          setJobDescription(report.job_description || '');
          window.scrollTo({ top: 380, behavior: 'smooth' });
        }}
        onDeleteReport={handleDeleteHistoryItem}
      />
    </div>
  );
}
