import { useState, useEffect } from 'react';
import { Lock, CheckCircle, XCircle, Eye, EyeOff, Check, X } from 'lucide-react';
import { useGame } from '../../context/GameContext';

interface PasswordQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const PasswordModule = () => {
  const { currentPasswordQuestion, submitAnswer, submitPassword, feedback, loading, progress, nextQuestion, gameMode } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Şifre girişi gerekip gerekmediğini kontrol et
  // currentPasswordQuestion null/undefined ise ve progress.current === progress.total - 1 ise şifre girişi ekranı
  // progress.total soru sayısı + 1 olacak (örnek: 10 soru + 1 şifre girişi = 11 total)
  const isPasswordInputStep = (currentPasswordQuestion === null || currentPasswordQuestion === undefined) 
    && progress.total > 0 
    && progress.current === progress.total - 1;
  
  // Sadece PASSWORD_ONLY veya MIXED modunda şifre girişi göster
  const shouldShowPasswordInput = isPasswordInputStep && (gameMode === 'PASSWORD_ONLY' || gameMode === 'MIXED');

  useEffect(() => {
    setSelectedAnswer('');
  }, [currentPasswordQuestion]);

  useEffect(() => {
    setPassword('');
  }, [shouldShowPasswordInput]);

  if (shouldShowPasswordInput) {
    // Şifre girişi ekranı
  const criteria = [
    { label: 'En az 8 karakter', test: (pwd: string) => pwd.length >= 8 },
    { label: 'En az 12 karakter (önerilen)', test: (pwd: string) => pwd.length >= 12 },
    { label: 'Büyük harf içeriyor', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: 'Küçük harf içeriyor', test: (pwd: string) => /[a-z]/.test(pwd) },
    { label: 'Rakam içeriyor', test: (pwd: string) => /[0-9]/.test(pwd) },
    { label: 'Özel karakter içeriyor (!@#$%^&*)', test: (pwd: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd) }
  ];

  const getPasswordStrength = () => {
    const passedCriteria = criteria.filter(c => c.test(password)).length;
    if (passedCriteria >= 5) return { level: 'strong', label: 'Güçlü', color: 'green' };
    if (passedCriteria >= 3) return { level: 'medium', label: 'Orta', color: 'yellow' };
    return { level: 'weak', label: 'Zayıf', color: 'red' };
  };

  const strength = password ? getPasswordStrength() : null;

    const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      submitPassword(password);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="cyber-card overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white p-4 md:p-6">
          <div className="flex items-center gap-4 mb-2">
            <Lock className="w-6 h-6 cyber-text-glow" />
              <h2 className="section-title">ŞİFRE OLUŞTURMA</h2>
          </div>
            <p className="helper-text">Güçlü bir örnek şifre oluşturun</p>
        </div>

        <div className="p-4 md:p-6">
            <form onSubmit={handlePasswordSubmit}>
              <div className="relative mb-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Örnek şifrenizi girin..."
                  className="cyber-input w-full pr-12 text-lg"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {strength && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-400 font-mono">ŞİFRE GÜCÜ:</span>
                    <span className={`text-sm font-bold font-mono ${
                      strength.color === 'green' ? 'text-green-400 cyber-text-glow' :
                      strength.color === 'yellow' ? 'text-yellow-400 cyber-text-glow' :
                      'text-red-400 cyber-text-glow'
                    }`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="cyber-progress w-full h-3">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength.color === 'green' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                        strength.color === 'yellow' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                        'bg-gradient-to-r from-red-400 to-red-500'
                      }`}
                      style={{
                        width: strength.level === 'strong' ? '100%' :
                               strength.level === 'medium' ? '60%' : '30%'
                      }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-6">
                {criteria.map((criterion, index) => {
                  const passed = password && criterion.test(password);
                  return (
                    <div key={index} className="flex items-center gap-3 cyber-card p-3">
                      {passed ? (
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 cyber-text-glow" />
                      ) : (
                        <X className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                      <span className={`text-sm font-mono ${passed ? 'text-green-300' : 'text-gray-400'}`}>
                        {criterion.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                type="submit"
                disabled={!password || loading}
                className="btn-secondary w-full py-3 px-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="cyber-loading"></div>
                    GÖNDERİLİYOR...
                  </span>
                ) : (
                  'DEVAM ET'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPasswordQuestion) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="cyber-card p-6 text-center">
          <div className="cyber-loading inline-block mb-4"></div>
          <p className="text-gray-400 font-mono">Sorular yükleniyor...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (selectedAnswer) {
      submitAnswer(selectedAnswer);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="cyber-card overflow-hidden">
        <div className="relative bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white p-4 md:p-6 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%),
                linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%)
              `,
              backgroundSize: '20px 20px'
            }}></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="cyber-card p-2 md:p-3 bg-gray-900/50 border-gray-500">
                  <Lock className="w-6 h-6 md:w-8 md:h-8 text-gray-300 cyber-text-glow" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white mb-1 font-mono">ŞİFRE GÜVENLİĞİ TESTİ</h2>
                  <p className="text-xs md:text-sm text-gray-300 font-mono">Şifre güvenliği bilginizi test edin</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 md:gap-4">
                <div className="cyber-card bg-gray-900/50 border-gray-500 px-3 py-2 md:px-6 md:py-3">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="md:hidden">
                      <p className="text-xs text-gray-400 font-mono uppercase tracking-wide">SORU</p>
                      <p className="text-sm font-bold text-white font-mono">
                        {progress.current + 1}/{progress.total}
                      </p>
                    </div>
                    
                    <div className="hidden md:block text-right">
                      <p className="text-xs text-gray-400 font-mono uppercase tracking-wide">SORU</p>
                      <p className="text-lg font-bold text-white font-mono">
                        {progress.current + 1} / {progress.total}
                      </p>
                    </div>
                    
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-gray-400 flex items-center justify-center bg-gray-800/50">
                      <span className="text-xs md:text-sm font-bold text-gray-300 font-mono">
                        {Math.round(((progress.current + 1) / progress.total) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="cyber-progress h-2 bg-gray-900/50">
              <div 
                className="cyber-progress-bar bg-gradient-to-r from-gray-400 to-gray-300"
                style={{ width: `${((progress.current + 1) / progress.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="space-y-4">
            <div className="mb-4">
              <p className="text-base md:text-lg font-bold text-white mb-6 font-mono cyber-text-glow">
                {currentPasswordQuestion.question}
              </p>
              <div className="space-y-3">
                {currentPasswordQuestion.options.map((option, index) => (
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
  );
};
