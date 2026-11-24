import React from 'react';
import { Award, CheckCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';

function CircularMeter({ score, label, subtitle, colorClass, strokeColor }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex-1">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="#f1f5f9"
            strokeWidth="9"
            fill="transparent"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke={strokeColor}
            strokeWidth="9"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-3xl font-extrabold tracking-tight ${colorClass}`}>
            {score}%
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {score >= 75 ? 'Strong Match' : score >= 50 ? 'Moderate' : 'Low Match'}
          </span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <h4 className="text-sm font-bold text-slate-900">{label}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

export default function ScoreCard({ analysis, candidateName, jobTitle }) {
  const matchScore = analysis?.match_score ?? 0;
  const atsScore = analysis?.ats_score ?? 0;
  const summary = analysis?.summary || '';
  const strengths = analysis?.strengths || [];
  const improvements = analysis?.improvements || [];

  const getScoreColor = (s) => {
    if (s >= 75) return { text: 'text-emerald-600', stroke: '#059669' };
    if (s >= 50) return { text: 'text-amber-500', stroke: '#f59e0b' };
    return { text: 'text-rose-500', stroke: '#f43f5e' };
  };

  const matchColors = getScoreColor(matchScore);
  const atsColors = getScoreColor(atsScore);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-sky-200 mb-2">
            <Award className="w-3.5 h-3.5 mr-1" /> Scan Results Completed
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            {candidateName ? `${candidateName}'s Resume Analysis` : 'Resume Fit & ATS Report'}
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Targeting: <span className="font-semibold text-white">{jobTitle || 'Target Role'}</span>
          </p>
          {summary && (
            <p className="mt-4 text-xs sm:text-sm text-slate-200 bg-white/5 border border-white/10 rounded-xl p-3.5 leading-relaxed">
              {summary}
            </p>
          )}
        </div>
      </div>

      {/* Gauges & Fast Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CircularMeter
          score={matchScore}
          label="Job Match Score"
          subtitle="Skill & Qualification Fit"
          colorClass={matchColors.text}
          strokeColor={matchColors.stroke}
        />
        <CircularMeter
          score={atsScore}
          label="ATS Readability"
          subtitle="Formatting & Parser Friendliness"
          colorClass={atsColors.text}
          strokeColor={atsColors.stroke}
        />

        {/* Top Strengths */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center mb-3">
            <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-600" /> Key Strengths
          </h4>
          <ul className="space-y-2 flex-1">
            {strengths.slice(0, 3).map((s, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start leading-snug">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-2 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Priority Fixes */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center mb-3">
            <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-500" /> High-Impact Fixes
          </h4>
          <ul className="space-y-2 flex-1">
            {improvements.slice(0, 3).map((imp, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start leading-snug">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-2 shrink-0" />
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
