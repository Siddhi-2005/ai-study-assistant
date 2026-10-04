import { useState } from 'react';
import api from '../api';

// Upload box component for selecting and uploading a PDF file
function UploadBox({ onUpload }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  // Handle file selection and upload to backend
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File must be under 10 MB');
      return;
    }
    setFileName(file.name);
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload', formData);
      onUpload(res.data.document_id);
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 sm:p-12 text-center border border-slate-800 shadow-2xl relative group overflow-hidden glass-card-hover">
      {/* Background ambient gradient flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-gradient-to-b from-violet-600/20 via-indigo-600/10 to-transparent blur-2xl pointer-events-none"></div>

      <div className="relative z-10 max-w-lg mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-violet-600/30 via-indigo-600/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center text-4xl shadow-xl shadow-violet-600/15 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10">
          📄
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight mb-2">
          Transform PDFs into Smart Study Tools
        </h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Upload any lecture note, textbook chapter, or research paper (PDF up to 10 MB) to get instant RAG Q&A, Quizzes, Flashcards & Summaries.
        </p>
        
        <label className="cursor-pointer inline-flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold py-4 px-9 rounded-2xl transition-all duration-300 shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 hover:-translate-y-1 active:translate-y-0 text-base">
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Processing & Embedding PDF...</span>
            </>
          ) : (
            <>
              <span>Upload PDF Document</span>
              <span className="text-xl">➔</span>
            </>
          )}
          <input type="file" accept=".pdf" onChange={handleUpload} className="hidden" disabled={loading} />
        </label>

        {fileName && !error && (
          <div className="mt-5 text-xs font-semibold text-slate-300 bg-slate-900/80 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700/60 shadow-sm">
            <span>📎</span> File Selected: {fileName}
          </div>
        )}
        {error && (
          <div className="mt-5 text-xs text-rose-300 bg-rose-500/15 border border-rose-500/30 py-2.5 px-5 rounded-xl inline-block font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* Feature Highlights Bar */}
        <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
            <span className="text-base block mb-1">💬</span>
            <span className="text-[11px] font-semibold text-slate-400">Context RAG Q&A</span>
          </div>
          <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
            <span className="text-base block mb-1">🧠</span>
            <span className="text-[11px] font-semibold text-slate-400">5-MCQ Quiz</span>
          </div>
          <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
            <span className="text-base block mb-1">🃏</span>
            <span className="text-[11px] font-semibold text-slate-400">Flip Flashcards</span>
          </div>
          <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
            <span className="text-base block mb-1">📝</span>
            <span className="text-[11px] font-semibold text-slate-400">5-Min Summary</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadBox;
