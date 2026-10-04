import { useState } from 'react';
import api from '../api';

// Quiz tab component: generates and displays MCQs with scoring
function QuizTab({ documentId }) {
  const [quiz, setQuiz] = useState(null);
  const [selected, setSelected] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch quiz questions from backend
  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setSelected({});
    setShowResults(false);
    try {
      const res = await api.post('/quiz', { document_id: documentId });
      setQuiz(res.data.quiz);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  // Calculate the user's score
  const getScore = () => {
    if (!quiz) return 0;
    return quiz.filter((q, i) => selected[i] === q.correct).length;
  };

  return (
    <div className="p-6 sm:p-8">
      {!quiz && (
        <div className="text-center py-16 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl">
            🧠
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-1">Knowledge Quiz</h3>
          <p className="text-sm text-slate-400 mb-6">Test your mastery of key concepts from the document with 5 AI-generated MCQs.</p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-600/20 disabled:opacity-50 hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Generating Quiz...</span>
              </>
            ) : (
              <span>Generate Quiz</span>
            )}
          </button>
          {error && <p className="mt-4 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 py-2 px-4 rounded-lg inline-block">{error}</p>}
        </div>
      )}

      {quiz && (
        <div className="space-y-6 max-w-3xl mx-auto">
          {quiz.map((q, qi) => (
            <div key={qi} className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  Q{qi + 1}
                </span>
                <p className="font-semibold text-slate-100 text-base">{q.question}</p>
              </div>

              <div className="space-y-2.5 pl-10">
                {q.options.map((opt, oi) => {
                  const letter = opt.charAt(0);
                  const isSelected = selected[qi] === letter;
                  const isCorrect = letter === q.correct;
                  let optClass = 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50';
                  if (showResults) {
                    if (isCorrect) optClass = 'border-emerald-500/80 bg-emerald-500/15 text-emerald-200 font-medium';
                    else if (isSelected && !isCorrect) optClass = 'border-rose-500/80 bg-rose-500/15 text-rose-200';
                  } else if (isSelected) {
                    optClass = 'border-violet-500 bg-violet-500/15 text-violet-200 font-medium shadow-sm';
                  }
                  return (
                    <button
                      key={oi}
                      onClick={() => !showResults && setSelected(prev => ({ ...prev, [qi]: letter }))}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all duration-200 flex items-center justify-between ${optClass}`}
                    >
                      <span>{opt}</span>
                      {showResults && isCorrect && <span className="text-emerald-400 font-bold text-xs">✓ Correct</span>}
                      {showResults && isSelected && !isCorrect && <span className="text-rose-400 font-bold text-xs">✕ Your choice</span>}
                    </button>
                  );
                })}
              </div>

              {showResults && q.explanation && (
                <div className="mt-3 text-xs text-slate-300 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-start gap-2.5">
                  <span className="text-emerald-400 shrink-0 mt-0.5">💡</span>
                  <div>
                    <span className="font-semibold text-slate-200">Explanation: </span>
                    <span className="text-slate-400">{q.explanation}</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-4 justify-center pt-4 pb-2">
            {!showResults ? (
              <button
                onClick={() => setShowResults(true)}
                disabled={Object.keys(selected).length === 0}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 px-8 rounded-xl text-sm transition-all shadow-md shadow-violet-600/20 disabled:opacity-40"
              >
                Submit Answers ({Object.keys(selected).length}/{quiz.length})
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="bg-slate-900 px-6 py-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Your Score:</span>
                  <span className="text-xl font-bold text-emerald-400">{getScore()} / {quiz.length}</span>
                </div>
                <button
                  onClick={() => { setQuiz(null); setSelected({}); setShowResults(false); }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-6 rounded-xl text-sm border border-slate-700 transition-all"
                >
                  ↻ Try New Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizTab;
