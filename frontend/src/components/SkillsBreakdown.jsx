import React from 'react';
import { Check, AlertCircle, Sparkles } from 'lucide-react';

export default function SkillsBreakdown({ matchedSkills = [], missingSkills = [] }) {
  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Matched Skills */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2" />
              Matched Keywords & Skills ({matchedSkills.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Found in both your resume and the job description</p>
          </div>
        </div>

        {matchedSkills.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4">No matching keywords detected.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs"
              >
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Missing Skills */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2" />
              Missing / Gap Keywords ({missingSkills.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Emphasized in the JD but not found on your resume</p>
          </div>
        </div>

        {missingSkills.length === 0 ? (
          <p className="text-xs text-emerald-600 font-medium py-4">
            Great job! No major skill gaps identified.
          </p>
        ) : (
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {missingSkills.map((item, idx) => {
              const skillName = typeof item === 'string' ? item : item.skill;
              const priority = typeof item === 'object' ? item.priority : 'Medium';
              const reason = typeof item === 'object' ? item.reason : '';

              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{skillName}</span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(
                          priority
                        )}`}
                      >
                        {priority} Priority
                      </span>
                    </div>
                    {reason && (
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">{reason}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
