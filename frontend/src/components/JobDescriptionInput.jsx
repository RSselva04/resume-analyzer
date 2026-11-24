import React from 'react';
import { Briefcase, Sparkles } from 'lucide-react';

const SAMPLE_JD = `Role: Senior Full Stack Developer (Python & React)

About the Job:
We are looking for a Senior Full Stack Engineer with strong experience in Python, Django or FastAPI, and React.js. You will architect scalable RESTful APIs, work with PostgreSQL, and build interactive frontends.

Key Requirements:
- 3+ years of hands-on experience with Python backend frameworks (Django, DRF, or FastAPI).
- Strong proficiency in modern JavaScript/TypeScript, React.js, and Tailwind CSS.
- Experience with relational databases, specifically PostgreSQL schema design, indexing, and query optimization.
- Familiarity with Docker, CI/CD pipelines, and cloud platforms (AWS or GCP).
- Experience integrating AI/LLM APIs and asynchronous background tasks (Celery/Redis).
- Passion for writing clean, testable, and well-documented code.`;

export default function JobDescriptionInput({
  jobDescription,
  setJobDescription,
  jobTitle,
  setJobTitle,
}) {
  const handleLoadSample = () => {
    setJobTitle('Senior Full Stack Developer (Python & React)');
    setJobDescription(SAMPLE_JD);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs inline-flex items-center justify-center mr-2">2</span>
            Target Job Description
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Paste the requirements you are applying for</p>
        </div>
        <button
          type="button"
          onClick={handleLoadSample}
          className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200/50"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Load Sample JD</span>
        </button>
      </div>

      <div className="space-y-3 flex-1 flex flex-col">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Job Title (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="e.g. Senior Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Job Requirements & Description *
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description, required skills, and responsibilities here..."
            className="flex-1 w-full min-h-[140px] p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none leading-relaxed"
          />
          <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-400">
            <span>Minimum 20 characters</span>
            <span>{jobDescription.length} characters</span>
          </div>
        </div>
      </div>
    </div>
  );
}
