import { useState, useEffect } from 'react';
import { Mail, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const PhishingModule = () => {
  const { currentQuestion, submitAnswer, feedback, loading, progress, nextQuestion } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState('');

  useEffect(() => {
    setSelectedAnswer('');
  }, [currentQuestion]);

  if (!currentQuestion) return null;

  const handleSubmit = () => {
    if (selectedAnswer) {
      submitAnswer(selectedAnswer);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="cyber-card overflow-hidden">
        <div className="relative bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white p-4 md:p-6 overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%),
                linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%)
              `,
              backgroundSize: '20px 20px'
            }}></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="cyber-card p-2 md:p-3 bg-gray-900/50 border-gray-500">
                  <Mail className="w-6 h-6 md:w-8 md:h-8 text-gray-300 cyber-text-glow" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white mb-1 font-mono">E-POSTA ANALİZİ</h2>
                  <p className="text-xs md:text-sm text-gray-300 font-mono">Phishing saldırılarını tespit edin</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 md:gap-4">
                {/* Progress indicator - Mobile optimized */}
                <div className="cyber-card bg-gray-900/50 border-gray-500 px-3 py-2 md:px-6 md:py-3">
                  <div className="flex items-center gap-2 md:gap-3">
                    {/* Mobile: Compact view */}
                    <div className="md:hidden">
                      <p className="text-xs text-gray-400 font-mono uppercase tracking-wide">SORU</p>
                      <p className="text-sm font-bold text-white font-mono">
                        {progress.current + 1}/{progress.total}
                      </p>
                    </div>
                    
                    {/* Desktop: Full view */}
                    <div className="hidden md:block text-right">
                      <p className="text-xs text-gray-400 font-mono uppercase tracking-wide">SORU</p>
                      <p className="text-lg font-bold text-white font-mono">
                        {progress.current + 1} / {progress.total}
                      </p>
                    </div>
                    
                    {/* Percentage circle - smaller on mobile */}
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-gray-400 flex items-center justify-center bg-gray-800/50">
                      <span className="text-xs md:text-sm font-bold text-gray-300 font-mono">
                        {Math.round(((progress.current + 1) / progress.total) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="cyber-progress h-2 bg-gray-900/50">
              <div 
                className="cyber-progress-bar bg-gradient-to-r from-gray-400 to-gray-300"
                style={{ width: `${((progress.current + 1) / progress.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="grid md:grid-cols-2 gap-4 items-start">
            <div className="cyber-card p-4 mb-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-sm font-bold text-gray-400 min-w-24 font-mono">GÖNDEREN:</span>
                  <span className="text-sm text-white font-mono cyber-text-glow">{currentQuestion.email.from}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-sm font-bold text-gray-400 min-w-24 font-mono">KONU:</span>
                  <span className="text-sm text-white font-mono">{currentQuestion.email.subject}</span>
                </div>
                <div className="border-t border-gray-400 my-4"></div>
                <div className="text-sm text-gray-300 leading-relaxed font-mono">
                  {currentQuestion.email.body}
                </div>
                <div className="mt-4 space-y-2">
                  {currentQuestion.email.hasLink && (
                    <div className="flex items-center gap-2 px-3 py-1 cyber-alert-warning rounded-full text-xs font-mono">
                      <AlertTriangle className="w-3 h-3" />
                      Bu e-posta bir link içeriyor
                    </div>
                  )}
                  {currentQuestion.email.urgency === 'high' && (
                    <div className="flex items-center gap-2 px-3 py-1 cyber-alert-error rounded-full text-xs font-mono">
                      <AlertTriangle className="w-3 h-3" />
                      Bu e-posta aciliyet belirtiyor
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-start-2 space-y-4">
              <div className="mb-4">
                <p className="text-base font-bold text-white mb-4 font-mono cyber-text-glow">{currentQuestion.question}</p>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedAnswer(option)}
                      disabled={loading || !!feedback}
                      className={`w-full text-left p-3 cyber-card transition-all duration-300 ${
                        selectedAnswer === option
                          ? 'border-gray-400 bg-gray-400/10 cyber-hover-glow'
                          : 'border-gray-600 hover:border-gray-400 hover:bg-gray-400/5'
                      } ${loading || feedback ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer cyber-hover-scale'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswer === option ? 'border-gray-400' : 'border-gray-500'
                          }`}
                        >
                          {selectedAnswer === option && (
                            <div className="w-4 h-4 rounded-full bg-gray-400 cyber-text-glow"></div>
                          )}
                        </div>
                        <span className="text-white font-mono">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {feedback && (
                <div className="mb-4">
                  <div
                    className={`mb-3 p-3 cyber-card ${
                      feedback.isCorrect ? 'cyber-alert-success' : 'cyber-alert-error'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {feedback.isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5 cyber-text-glow" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5 cyber-text-glow" />
                      )}
                      <div>
                        <p className={`font-bold mb-2 font-mono ${feedback.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                          {feedback.isCorrect ? 'DOĞRU!' : 'YANLIŞ!'}
                        </p>
                        <p className={`text-sm font-mono ${feedback.isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                          {feedback.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={nextQuestion}
                    disabled={loading}
                    className="btn-secondary w-full py-3 px-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="cyber-loading"></div>
                        YÜKLENİYOR...
                      </span>
                    ) : (
                      'SONRAKİ SORUYA GEÇ'
                    )}
                  </button>
                </div>
              )}

              {!feedback && (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer || loading}
                  className="cyber-btn w-full py-3 px-6 text-base font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="cyber-loading"></div>
                      GÖNDERİLİYOR...
                    </span>
                  ) : (
                    'CEVABI GÖNDER'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
