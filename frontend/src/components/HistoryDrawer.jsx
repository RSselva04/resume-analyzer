import React from 'react';
import { X, Trash2, Calendar, FileText, ChevronRight } from 'lucide-react';

export default function HistoryDrawer({
  isOpen,
  onClose,
  history = [],
  onSelectReport,
  onDeleteReport,
  activeId,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Scan History</h2>
              <p className="text-xs text-slate-500">Stored in PostgreSQL database</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">No previous scans found</p>
                <p className="text-xs mt-1">Upload a resume and JD to generate your first scan.</p>
              </div>
            ) : (
              history.map((item) => {
                const isActive = activeId === item.id;
                const date = new Date(item.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectReport(item);
                      onClose();
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                      isActive
                        ? 'border-sky-500 bg-sky-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 pr-6">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {item.job_title || 'Target Role'}
                        </h4>
                        <p className="text-xs text-slate-600 truncate mt-0.5">
                          {item.candidate_name || item.resume_filename}
                        </p>
                        <div className="flex items-center space-x-2 mt-2 text-[11px] text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span>{date}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <span
                          className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                            item.match_score >= 75
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.match_score >= 50
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.match_score}%
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteReport(item.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                          title="Delete report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
