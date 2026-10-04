import { useState } from 'react';
import api from '../api';

// Flashcard tab: generates and displays flip cards for studying
function FlashcardTab({ documentId }) {
  const [cards, setCards] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch flashcards from backend
  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/flashcards', { document_id: documentId });
      setCards(res.data.flashcards);
      setCurrentIndex(0);
      setFlipped(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate flashcards');
    } finally {
      setLoading(false);
    }
  };

  // Navigate to the next flashcard
  const next = () => {
    setFlipped(false);
    setCurrentIndex(prev => Math.min(prev + 1, cards.length - 1));
  };

  // Navigate to the previous flashcard
  const prev = () => {
    setFlipped(false);
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="p-6 sm:p-8">
      {!cards && (
        <div className="text-center py-16 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl">
            🃏
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-1">Study Flashcards</h3>
          <p className="text-sm text-slate-400 mb-6">Generate interactive study flashcards to test key terms and concepts.</p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-amber-600/20 disabled:opacity-50 hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Generating Cards...</span>
              </>
            ) : (
              <span>Generate Flashcards</span>
            )}
          </button>
          {error && <p className="mt-4 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 py-2 px-4 rounded-lg inline-block">{error}</p>}
        </div>
      )}

      {cards && cards.length > 0 && (
        <div className="flex flex-col items-center py-4">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-md">
              Card {currentIndex + 1} of {cards.length}
            </span>
          </div>

          <div
            className={`flip-card w-full max-w-lg h-72 cursor-pointer ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="flip-card-inner relative w-full h-full">
              {/* Front side */}
              <div className="flip-card-front absolute w-full h-full bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col items-center justify-center p-8 shadow-2xl text-center group hover:border-violet-500/40 transition-colors">
                <span className="text-[10px] uppercase font-bold text-violet-400 tracking-widest bg-violet-500/10 px-2.5 py-1 rounded-full mb-4">
                  Question / Term
                </span>
                <p className="text-lg font-semibold text-slate-100 leading-snug">{cards[currentIndex].front}</p>
                <span className="text-xs text-slate-500 mt-6 flex items-center gap-1">
                  <span>💡</span> Click to flip answer
                </span>
              </div>

              {/* Back side */}
              <div className="flip-card-back absolute w-full h-full bg-gradient-to-br from-violet-950/80 to-slate-900/90 rounded-2xl border border-violet-500/40 flex flex-col items-center justify-center p-8 shadow-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full mb-4">
                  Answer / Definition
                </span>
                <p className="text-base text-violet-100 leading-relaxed font-normal">{cards[currentIndex].back}</p>
                <span className="text-xs text-violet-400/60 mt-6 flex items-center gap-1">
                  <span>↺</span> Click to flip front
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-medium py-2.5 px-6 rounded-xl text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={next}
              disabled={currentIndex === cards.length - 1}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-medium py-2.5 px-6 rounded-xl text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>

          <button
            onClick={() => { setCards(null); setFlipped(false); }}
            className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ↻ Reset & Regenerate Cards
          </button>
        </div>
      )}
    </div>
  );
}

export default FlashcardTab;
