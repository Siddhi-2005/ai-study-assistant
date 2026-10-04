import { useState } from 'react';
import api from '../api';

// Chat panel for asking questions about the uploaded PDF
function ChatPanel({ documentId }) {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Send question to backend and add response to chat history
  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    const q = question;
    setQuestion('');
    setChatHistory(prev => [...prev, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const res = await api.post('/ask', { document_id: documentId, question: q });
      setChatHistory(prev => [...prev, { role: 'ai', content: res.data.answer, sources: res.data.sources }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', content: 'Error: ' + (err.response?.data?.detail || 'Something went wrong') }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[520px]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-6 sm:p-8">
        {chatHistory.length === 0 && (
          <div className="text-center py-20 max-w-sm mx-auto">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-2xl">
              💬
            </div>
            <p className="text-sm text-slate-300 font-medium">Ask anything about your document</p>
            <p className="text-xs text-slate-500 mt-1">Answers are generated strictly from your uploaded PDF using RAG vector search.</p>
          </div>
        )}
        
        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0 mt-1">
                AI
              </div>
            )}
            <div className={`max-w-[85%] space-y-2`}>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-xs shadow-md shadow-violet-600/20 font-medium'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-tl-xs shadow-sm'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>

              {/* Source Context Chips if available */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="text-slate-400 font-medium flex items-center gap-1">
                    <span>📌</span> Verified Sources ({msg.sources.length} chunk{msg.sources.length > 1 ? 's' : ''}):
                  </div>
                  {msg.sources.map((src, idx) => (
                    <p key={idx} className="line-clamp-2 italic text-slate-400 pl-4 border-l border-violet-500/40">
                      "{src}"
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">
              AI
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 px-4 py-3 rounded-2xl rounded-tl-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleAsk} className="p-4 bg-slate-950/40 border-t border-slate-800/80">
        <div className="flex gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about the document..."
            className="flex-1 bg-slate-900 text-slate-100 rounded-xl px-4 py-3 text-sm outline-none border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 placeholder-slate-500 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-violet-600/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5"
          >
            <span>Ask</span>
            <span className="text-xs">➔</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatPanel;
