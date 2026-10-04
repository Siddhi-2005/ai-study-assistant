import { useState } from 'react';
import api from '../api';

// Summary tab: generates and displays a document summary
function SummaryTab({ documentId }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Fetch summary from backend
  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/summary', { document_id: documentId });
      setSummary(res.data.summary);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8">
      {!summary && (
        <div className="text-center py-16 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-3xl">
            📝
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-1">Document Summary</h3>
          <p className="text-sm text-slate-400 mb-6">Generate an instant, high-level summary of your document's key concepts.</p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-600/20 disabled:opacity-50 hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Summarizing...</span>
              </>
            ) : (
              <span>Generate Summary</span>
            )}
          </button>
          {error && <p className="mt-4 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 py-2 px-4 rounded-lg inline-block">{error}</p>}
        </div>
      )}

      {summary && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-md">
              ✨ Key Takeaways
            </div>
            <div className="flex items-center gap-3 text-xs">
              <button
                onClick={copyToClipboard}
                className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
              >
                {copied ? '✓ Copied' : '📋 Copy Text'}
              </button>
              <button
                onClick={() => setSummary('')}
                className="text-slate-400 hover:text-cyan-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
              >
                ↻ Clear
              </button>
            </div>
          </div>

          <div className="bg-slate-950/40 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-inner space-y-4">
            {summary.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-slate-200 text-sm sm:text-base leading-relaxed tracking-wide font-normal">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SummaryTab;
