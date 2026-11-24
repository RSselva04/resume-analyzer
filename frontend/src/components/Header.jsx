import React from 'react';
import { FileCheck2, History, Sparkles } from 'lucide-react';

export default function Header({ onOpenHistory, historyCount = 0 }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">CareerFit AI</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
                <Sparkles className="w-3 h-3 mr-1 text-sky-600" /> Job Seeker Edition
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Resume & ATS Match Analyzer powered by Django & PostgreSQL
            </p>
          </div>
        </div>

        <button
          onClick={onOpenHistory}
          className="inline-flex items-center space-x-2 px-3.5 py-2 text-sm font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          <History className="w-4 h-4 text-slate-600" />
          <span>Past Scans</span>
          {historyCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-sky-600 text-white font-semibold">
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
