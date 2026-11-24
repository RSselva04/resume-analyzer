import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight } from 'lucide-react';

export default function BulletRewriter({ bulletRewrites = [] }) {
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (!bulletRewrites || bulletRewrites.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">
            AI Bullet Point Optimizer (Action & Metrics)
          </h3>
          <p className="text-xs text-slate-500">
            Transform passive responsibilities into high-impact accomplishments
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {bulletRewrites.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
          >
            {/* Original vs Improved */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original */}
              <div className="bg-white rounded-lg p-3.5 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Original Phrasing
                </span>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{item.original}"
                </p>
              </div>

              {/* Improved */}
              <div className="bg-indigo-50/40 rounded-lg p-3.5 border border-indigo-200 relative group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                    Recommended AI Rewrite
                  </span>
                  <button
                    onClick={() => handleCopy(item.improved, idx)}
                    className="inline-flex items-center text-[11px] font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedIdx === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-900 font-medium leading-relaxed">
                  "{item.improved}"
                </p>
              </div>
            </div>

            {/* Rationale */}
            {item.rationale && (
              <div className="text-[11px] text-slate-500 flex items-start pt-1">
                <ArrowRight className="w-3.5 h-3.5 mr-1.5 text-indigo-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-700">Why this works:</strong> {item.rationale}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
