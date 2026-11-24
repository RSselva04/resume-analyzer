import React from 'react';
import { LayoutList, Briefcase, GraduationCap, Phone, FileCheck } from 'lucide-react';

export default function SectionFeedback({ sectionFeedback = {} }) {
  if (!sectionFeedback || Object.keys(sectionFeedback).length === 0) {
    return null;
  }

  const sections = [
    {
      key: 'formatting',
      label: 'ATS Formatting & Layout',
      icon: LayoutList,
      color: 'text-sky-600 bg-sky-50',
    },
    {
      key: 'experience',
      label: 'Work Experience Section',
      icon: Briefcase,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      key: 'skills',
      label: 'Skills Section Presentation',
      icon: FileCheck,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      key: 'contact',
      label: 'Contact & Header Info',
      icon: Phone,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      key: 'education',
      label: 'Education & Certifications',
      icon: GraduationCap,
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 mb-4">
        Detailed Section-by-Section Assessment
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(({ key, label, icon: Icon, color }) => {
          const feedback = sectionFeedback[key];
          if (!feedback) return null;

          return (
            <div
              key={key}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex space-x-3.5"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{label}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{feedback}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
