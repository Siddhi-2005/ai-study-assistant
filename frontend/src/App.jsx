import { useState } from 'react';
import UploadBox from './components/UploadBox';
import ChatPanel from './components/ChatPanel';
import QuizTab from './components/QuizTab';
import FlashcardTab from './components/FlashcardTab';
import SummaryTab from './components/SummaryTab';

// Tab configuration for the main app navigation
const tabs = [
  { id: 'chat', label: '💬 Chat', color: 'violet' },
  { id: 'quiz', label: '🧠 Quiz', color: 'emerald' },
  { id: 'flashcards', label: '🃏 Flashcards', color: 'amber' },
  { id: 'summary', label: '📝 Summary', color: 'cyan' },
];

// Main App component managing upload state and tab navigation
function App() {
  const [documentId, setDocumentId] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden bg-grid-pattern">
      {/* Dynamic ambient lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-10 w-72 h-72 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-xl shadow-lg shadow-violet-500/25 ring-1 ring-white/20">
              🎓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-heading tracking-tight bg-gradient-to-r from-white via-slate-100 to-violet-300 bg-clip-text text-transparent">
                  AI Study Assistant
                </h1>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-violet-500/15 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full">
                  RAG v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400">Gemini 2.5 Flash • Vector RAG Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {documentId ? (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full text-xs text-emerald-400 font-semibold shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Document Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs text-slate-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Awaiting PDF</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full relative z-10 flex flex-col justify-center">
        {/* Upload State */}
        {!documentId && (
          <div className="max-w-2xl mx-auto w-full my-auto">
            <UploadBox onUpload={setDocumentId} />
          </div>
        )}

        {/* Active Document Workspace */}
        {documentId && (
          <div className="glass-card rounded-3xl border border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/5 flex flex-col">
            {/* Top Navigation Tabs */}
            <div className="flex border-b border-slate-800/80 bg-slate-950/60 p-2 gap-1.5 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-5 rounded-2xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg shadow-slate-950/80 border border-slate-700/80 ring-1 ring-violet-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  <span className="text-base">{tab.label.split(' ')[0]}</span>
                  <span>{tab.label.split(' ')[1]}</span>
                </button>
              ))}
            </div>

            {/* Main Workspace Panels */}
            <div className="min-h-[500px] flex-1 bg-slate-950/40">
              {activeTab === 'chat' && <ChatPanel documentId={documentId} />}
              {activeTab === 'quiz' && <QuizTab documentId={documentId} />}
              {activeTab === 'flashcards' && <FlashcardTab documentId={documentId} />}
              {activeTab === 'summary' && <SummaryTab documentId={documentId} />}
            </div>

            {/* Workspace Footer */}
            <div className="border-t border-slate-800/80 px-6 py-3.5 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                <span>Session ID: <code className="text-slate-300 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{documentId.slice(0, 8)}</code></span>
              </div>
              <button
                onClick={() => { setDocumentId(null); setActiveTab('chat'); }}
                className="text-slate-400 hover:text-violet-300 transition-colors flex items-center gap-1.5 font-semibold bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 cursor-pointer"
              >
                <span>↻</span> Upload Another Document
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
