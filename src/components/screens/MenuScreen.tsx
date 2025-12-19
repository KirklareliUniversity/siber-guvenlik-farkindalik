import { Mail, Lock, Target } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const MenuScreen = () => {
  const { userName, selectGameMode, loading } = useGame();

  const handleModeSelect = (mode: string) => {
    selectGameMode(mode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}></div>
      
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-8">
          <h1 className="heading-hero mb-4 cyber-text-glow">
            <span className="cyber-text-typing">HOŞ GELDİNİZ</span>
          </h1>
          <p className="text-xl text-gray-300 font-mono mb-2">
            {userName}
          </p>
          <p className="text-lg text-gray-400 font-mono">
            Oyun modunu seçin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phishing Only */}
          <button
            onClick={() => handleModeSelect('PHISHING_ONLY')}
            disabled={loading}
            className="cyber-card p-6 hover:cyber-hover-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-center">
              <div className="cyber-card p-4 mb-4 inline-block">
                <Mail className="w-12 h-12 text-gray-400 cyber-text-glow mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-mono cyber-text-glow">
                PHISHING TESTİ
              </h3>
              <p className="text-sm text-gray-400 font-mono mb-4">
                10 e-posta senaryosu ile phishing tespiti
              </p>
              <div className="text-xs text-gray-500 font-mono">
                Sadece phishing soruları
              </div>
            </div>
          </button>

          {/* Password Only */}
          <button
            onClick={() => handleModeSelect('PASSWORD_ONLY')}
            disabled={loading}
            className="cyber-card p-6 hover:cyber-hover-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-center">
              <div className="cyber-card p-4 mb-4 inline-block">
                <Lock className="w-12 h-12 text-gray-400 cyber-text-glow mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-mono cyber-text-glow">
                ŞİFRE GÜVENLİĞİ
              </h3>
              <p className="text-sm text-gray-400 font-mono mb-4">
                Güçlü şifre oluşturma ve analiz
              </p>
              <div className="text-xs text-gray-500 font-mono">
                Sadece şifre analizi
              </div>
            </div>
          </button>

          {/* Mixed Mode */}
          <button
            onClick={() => handleModeSelect('MIXED')}
            disabled={loading}
            className="cyber-card p-6 hover:cyber-hover-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-center">
              <div className="cyber-card p-4 mb-4 inline-block">
                <Target className="w-12 h-12 text-gray-400 cyber-text-glow mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-mono cyber-text-glow">
                KARIŞIK
              </h3>
              <p className="text-sm text-gray-400 font-mono mb-4">
                Phishing testi + Şifre güvenliği
              </p>
              <div className="text-xs text-gray-500 font-mono">
                Her ikisi de
              </div>
            </div>
          </button>
        </div>

        {loading && (
          <div className="text-center mt-8">
            <div className="cyber-loading inline-block"></div>
            <p className="text-gray-400 font-mono mt-2">Yükleniyor...</p>
          </div>
        )}
      </div>
    </div>
  );
};

