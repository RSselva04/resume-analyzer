import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, X, AlertCircle } from 'lucide-react';

export default function ResumeUploader({ file, setFile }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const allowedExtensions = ['pdf', 'docx', 'doc', 'txt'];

  const validateAndSet = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setError(`Unsupported file format. Please upload PDF, DOCX, or TXT.`);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError(`File size exceeds 10MB limit.`);
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSet(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold text-xs inline-flex items-center justify-center mr-2">1</span>
            Upload Your Resume
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Supports PDF, DOCX, and TXT (Max 10MB)</p>
        </div>
      </div>

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex-1 min-h-[220px] rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center ${
            isDragging
              ? 'border-sky-500 bg-sky-50/70 scale-[0.99]'
              : 'border-slate-300 hover:border-sky-400 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) validateAndSet(e.target.files[0]);
            }}
          />
          <div className="w-14 h-14 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            Click to upload or drag & drop
          </p>
          <p className="text-xs text-slate-500 mt-1">PDF or DOCX recommended for ATS check</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center">
          <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-4 relative">
            <button
              onClick={() => setFile(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200/50 transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0 pr-6">
                <p className="text-sm font-semibold text-slate-900 truncate">{file.name}</p>
                <div className="flex items-center space-x-2 mt-1 text-xs text-slate-500">
                  <span>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-medium inline-flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Ready for scan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
