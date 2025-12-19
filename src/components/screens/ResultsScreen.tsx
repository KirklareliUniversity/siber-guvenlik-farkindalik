import { useEffect } from 'react';
import { Trophy, Mail, Lock, TrendingUp, Award, AlertCircle, RefreshCw } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const ResultsScreen = () => {
  const { report, getResults, restartGame, loading, userName, gameMode } = useGame();

  useEffect(() => {
    if (!report) {
      getResults();
    }
  }, [report, getResults]);

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        {/* Cyber Grid Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}></div>
        
        <div className="text-center relative z-10">
          <div className="cyber-loading mx-auto mb-4" style={{ width: '48px', height: '48px' }}></div>
          <p className="mt-4 helper-text cyber-text-glow">SONUÇLAR HAZIRLANIYOR...</p>
        </div>
      </div>
    );
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'A+': return 'cyber-alert-success';
      case 'A': return 'cyber-alert-success';
      case 'B': return 'cyber-alert-warning';
      case 'C': return 'cyber-alert-warning';
      default: return 'cyber-alert-error';
    }
  };

  const getPasswordColor = (strength: string) => {
    switch (strength) {
      case 'Güçlü': return 'cyber-alert-success';
      case 'Orta': return 'cyber-alert-warning';
      default: return 'cyber-alert-error';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}></div>
      
      <div className="max-w-4xl mx-auto relative z-10 space-y-6 md:space-y-8">
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 cyber-card mb-4 md:mb-6 cyber-hover-glow">
            <Trophy className="w-8 h-8 md:w-12 md:h-12 text-gray-400 cyber-text-glow" />
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-mono mb-3 md:mb-4 cyber-text-glow">
            TEBRİKLER, {report.userName || userName || 'OYUNCU'}!
          </h1>
          <p className="text-base md:text-lg font-bold text-gray-300 font-mono">Siber güvenlik testini tamamladınız</p>
        </div>

        <div className="cyber-card overflow-hidden mb-6 md:mb-8">
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="helper-text mb-2">TOPLAM PUANINIZ</p>
                <p className="text-3xl md:text-5xl font-bold font-mono cyber-text-glow">{report.correctAnswers || 0} / {report.totalQuestions || 0}</p>
              </div>
              <div className={`px-4 py-2 md:px-6 md:py-3 cyber-card ${getRatingColor(report.grade || 'D')}`}>
                <p className="font-bold text-lg md:text-xl font-mono">{report.grade || 'D'}</p>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <p className="text-sm md:text-base text-gray-300 leading-relaxed font-mono">{report.feedback || 'Oyun tamamlandı!'}</p>
          </div>
        </div>

        <div className={`grid grid-cols-1 gap-4 md:gap-6 mb-6 ${gameMode === 'PHISHING_ONLY' ? 'md:grid-cols-1 max-w-2xl mx-auto' : 'md:grid-cols-2'}`}>
          <div className="cyber-card p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="cyber-card p-2 md:p-3">
                {gameMode === 'MIXED' ? (
                  <Trophy className="w-5 h-5 md:w-6 md:h-6 text-gray-400 cyber-text-glow" />
                ) : gameMode === 'PASSWORD_ONLY' ? (
                  <Lock className="w-5 h-5 md:w-6 md:h-6 text-gray-400 cyber-text-glow" />
                ) : (
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-gray-400 cyber-text-glow" />
                )}
              </div>
              <h3 className="text-base md:text-lg font-bold text-white font-mono">
                {gameMode === 'MIXED' ? 'KARIŞIK TEST SONUCU' : 
                 gameMode === 'PASSWORD_ONLY' ? 'ŞİFRE GÜVENLİĞİ TESTİ' : 
                 'PHISHING TESTİ'}
              </h3>
            </div>
            {gameMode === 'MIXED' ? (
              <div className="space-y-6">
                {/* Phishing İstatistikleri */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <h4 className="text-sm font-bold text-gray-300 font-mono">PHISHING TESTİ</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="helper-text">Doğru Cevaplar</span>
                      <span className="font-bold text-green-400 font-mono cyber-text-glow">
                        {(report as any).phishingStats?.correct || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="helper-text">Yanlış Cevaplar</span>
                      <span className="font-bold text-red-400 font-mono cyber-text-glow">
                        {(report as any).phishingStats?.incorrect || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="helper-text">Başarı Oranı</span>
                      <span className="font-bold text-gray-400 font-mono cyber-text-glow">
                        {(report as any).phishingStats?.percentage || 0}%
                      </span>
                    </div>
                    <div className="cyber-progress w-full h-3 mt-3">
                      <div
                        className="cyber-progress-bar h-full transition-all"
                        style={{ width: `${(report as any).phishingStats?.percentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Şifre Güvenliği İstatistikleri */}
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <h4 className="text-sm font-bold text-gray-300 font-mono">ŞİFRE GÜVENLİĞİ</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="helper-text">Doğru Cevaplar</span>
                      <span className="font-bold text-green-400 font-mono cyber-text-glow">
                        {(report as any).passwordStats?.correct || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="helper-text">Yanlış Cevaplar</span>
                      <span className="font-bold text-red-400 font-mono cyber-text-glow">
                        {(report as any).passwordStats?.incorrect || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="helper-text">Başarı Oranı</span>
                      <span className="font-bold text-gray-400 font-mono cyber-text-glow">
                        {(report as any).passwordStats?.percentage || 0}%
                      </span>
                    </div>
                    <div className="cyber-progress w-full h-3 mt-3">
                      <div
                        className="cyber-progress-bar h-full transition-all"
                        style={{ width: `${(report as any).passwordStats?.percentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="helper-text">Doğru Cevaplar</span>
                <span className="font-bold text-green-400 font-mono cyber-text-glow">{report.correctAnswers || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="helper-text">Yanlış Cevaplar</span>
                <span className="font-bold text-red-400 font-mono cyber-text-glow">{(report.totalQuestions || 0) - (report.correctAnswers || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="helper-text">Başarı Oranı</span>
                <span className="font-bold text-gray-400 font-mono cyber-text-glow">{report.percentage || 0}%</span>
              </div>
              <div className="cyber-progress w-full h-3 mt-3">
                <div
                  className="cyber-progress-bar h-full transition-all"
                  style={{ width: `${report.percentage || 0}%` }}
                ></div>
              </div>
            </div>
            )}
          </div>

          {(gameMode === 'PASSWORD_ONLY' || gameMode === 'MIXED') && (
           <div className="cyber-card p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="cyber-card p-2 md:p-3">
                <Lock className="w-5 h-5 md:w-6 md:h-6 text-gray-400 cyber-text-glow" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-white font-mono">ŞİFRE GÜVENLİĞİ</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-mono">Şifre Gücü</span>
                <span className={`font-bold px-3 py-1 cyber-card ${getPasswordColor(report.passwordAnalysis?.strength || 'weak')}`}>
                  {report.passwordAnalysis?.strength === 'Güçlü' ? 'Güçlü' :
                   report.passwordAnalysis?.strength === 'Orta' ? 'Orta' : 'Zayıf'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-mono">Kazanılan Puan</span>
                <span className="font-bold text-green-400 font-mono cyber-text-glow">{report.passwordAnalysis?.score || 0}</span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm cyber-card p-3">
                  <Award className="w-4 h-4 text-green-400 cyber-text-glow" />
                  <span className="text-green-300 font-mono">Şifre uzunluğu: {report.passwordAnalysis?.length || 0} karakter</span>
                </div>
                <div className="text-sm text-gray-300 font-mono whitespace-pre-line cyber-card p-3">
                  {report.passwordAnalysis?.feedback || 'Şifre analizi yapılamadı'}
                </div>
              </div>
            </div>
          </div>
          )}
        </div>

        <div className="cyber-card p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="cyber-card p-3">
              <TrendingUp className="w-6 h-6 text-gray-400 cyber-text-glow" />
            </div>
            <h3 className="text-lg font-bold text-white font-mono">GELİŞİM ÖNERİLERİ</h3>
          </div>
          <ul className="space-y-4">
            {report.recommendations?.map((rec, index) => (
              <li key={index} className="flex items-start gap-4 cyber-card p-4">
                <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5 cyber-text-glow" />
                <span className="text-gray-300 font-mono">{rec}</span>
              </li>
            )) || (
              <li className="flex items-start gap-4 cyber-card p-4">
                <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5 cyber-text-glow" />
                <span className="text-gray-300 font-mono">Öneriler yükleniyor...</span>
              </li>
            )}
          </ul>
        </div>

        <div className="flex justify-center">
          <button
            onClick={restartGame}
            disabled={loading}
            className="cyber-btn py-4 px-8 text-lg font-mono disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="cyber-loading"></div>
                YENİDEN BAŞLATILIYOR...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                TEKRAR OYNA
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
