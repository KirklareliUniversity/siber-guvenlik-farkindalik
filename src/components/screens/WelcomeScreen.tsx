import { useState } from 'react';
import { Shield, Mail, Lock, Target, Trophy } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { LeaderboardScreen } from './LeaderboardScreen';

export const WelcomeScreen = () => {
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [profession, setProfession] = useState('');
  const [hasCybersecurityTraining, setHasCybersecurityTraining] = useState(false);
  const [step, setStep] = useState<'info' | 'name'>('info');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { startGame, loading, registerUser } = useGame();

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || loading) return; // Çift submit'i önle
    
    if (fullName.trim() && birthDate && educationLevel && profession) {
      setIsSubmitting(true);
      try {
        const userId = await registerUser({
          fullName: fullName.trim(),
          birthDate,
          educationLevel,
          profession,
          hasCybersecurityTraining
        });
        if (userId) {
          setStep('name');
        }
      } catch (error) {
        console.error('Kullanıcı kaydı hatası:', error);
        alert('Kullanıcı kaydı sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim()) {
      startGame(fullName.trim());
    }
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
      
      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 cyber-card mb-6 cyber-hover-glow">
            <Shield className="w-12 h-12 text-gray-400 cyber-text-glow" />
          </div>
          <h1 className="heading-hero mb-4 cyber-text-glow">
            <span className="cyber-text-typing">SİBER GÜVENLİK</span>
          </h1>
          <h2 className="heading-sub mb-3">
            FARKINDALIK OYUNU
          </h2>
          <p className="text-lg text-gray-300 font-mono">
            Phishing saldırılarını tespit etme ve güçlü şifreler oluşturma becerilerinizi test edin
          </p>
              
              {/* Liderlik Tablosu Butonu */}
              <div className="mt-6">
                <button
                  onClick={() => setShowLeaderboard(true)}
                  className="cyber-btn py-3 px-6 text-base font-mono flex items-center justify-center gap-2 cyber-hover-glow mx-auto"
                >
                  <Trophy className="w-5 h-5" />
                  LİDERLİK TABLOSU
                </button>
              </div>
        </div>

        <div className="card-section mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            <div className="text-center p-3 cyber-hover-glow transition-all duration-300">
              <div className="cyber-card p-3 mb-2">
                <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto cyber-text-glow" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mb-1 font-mono">PHISHING TESTİ</h3>
              <p className="text-xs sm:text-sm text-gray-400 font-mono">10 e-posta senaryosu</p>
            </div>
            <div className="text-center p-3 cyber-hover-glow transition-all duration-300">
              <div className="cyber-card p-3 mb-2">
                <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto cyber-text-glow" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mb-1 font-mono">ŞİFRE GÜVENLİĞİ</h3>
              <p className="text-xs sm:text-sm text-gray-400 font-mono">Güçlü şifre oluşturma</p>
            </div>
            <div className="text-center p-3 cyber-hover-glow transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="cyber-card p-3 mb-2">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto cyber-text-glow" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mb-1 font-mono">DETAYLI RAPOR</h3>
              <p className="text-xs sm:text-sm text-gray-400 font-mono">Performans analizi</p>
            </div>
          </div>

            {step === 'info' ? (
              <form onSubmit={handleInfoSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="label">
                    AD SOYAD
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Adınızı ve soyadınızı girin..."
                    className="cyber-input w-full text-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="birthDate" className="label">
                    DOĞUM TARİHİ
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="cyber-input w-full text-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="educationLevel" className="label">
                    EĞİTİM SEVİYESİ
                  </label>
                  <select
                    id="educationLevel"
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="cyber-input w-full text-lg"
                    required
                  >
                    <option value="">Seçiniz...</option>
                    <option value="İlkokul">İlkokul</option>
                    <option value="Ortaokul">Ortaokul</option>
                    <option value="Lise">Lise</option>
                    <option value="Üniversite">Üniversite</option>
                    <option value="Yüksek Lisans">Yüksek Lisans</option>
                    <option value="Doktora">Doktora</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="profession" className="label">
                    MESLEK
                  </label>
                  <input
                    type="text"
                    id="profession"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="Mesleğinizi girin..."
                    className="cyber-input w-full text-lg"
                    required
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="hasCybersecurityTraining"
                    checked={hasCybersecurityTraining}
                    onChange={(e) => setHasCybersecurityTraining(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <label htmlFor="hasCybersecurityTraining" className="text-gray-300 font-mono">
                    Siber güvenlik eğitimi aldım
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading || isSubmitting || !fullName.trim() || !birthDate || !educationLevel || !profession}
                  className="btn-secondary w-full py-3 px-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="cyber-loading"></div>
                      KAYDEDİLİYOR...
                    </span>
                  ) : (
                    'DEVAM ET'
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleNameSubmit} className="space-y-4">
            <div>
                  <label htmlFor="userName" className="label">
                    OYUN İÇİN KULLANICI ADI
              </label>
              <input
                type="text"
                    id="userName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Oyun için kullanıcı adınızı girin..."
                className="cyber-input w-full text-lg"
                required
              />
            </div>
            <button
              type="submit"
                  disabled={loading || !fullName.trim()}
              className="btn-secondary w-full py-3 px-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="cyber-loading"></div>
                  BAŞLATILIYOR...
                </span>
              ) : (
                'OYUNA BAŞLA'
              )}
            </button>
          </form>
            )}
        </div>

        <div className="text-center text-sm text-gray-400 font-mono mt-4">
          <p className="cyber-text-glow">
            Bu oyun eğitim amaçlıdır ve gerçek siber güvenlik tehditleri hakkında farkındalık yaratmayı hedefler.
          </p>
        </div>
      </div>

      {/* Liderlik Tablosu Modal */}
      {showLeaderboard && (
        <LeaderboardScreen onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
};
