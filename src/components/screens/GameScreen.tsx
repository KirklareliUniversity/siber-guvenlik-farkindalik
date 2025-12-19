import { useGame } from '../../context/GameContext';
import { PhishingModule } from '../modules/PhishingModule';
import { PasswordModule } from '../modules/PasswordModule';
import { ProgressBar } from '../ProgressBar';
import { Shield } from 'lucide-react';

export const GameScreen = () => {
  const { gameState, userName, score, progress } = useGame();

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
      
      <div className="max-w-6xl mx-auto mb-4 md:mb-8 relative z-10">
        <div className="card-section">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
            <div className="flex items-center gap-3">
              <div className="cyber-card p-2 md:p-3">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-gray-400 cyber-text-glow" />
              </div>
              <div>
                <p className="helper-text font-bold">KULLANICI</p>
                <p className="text-lg md:text-xl font-bold text-white font-mono cyber-text-glow">{userName}</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="helper-text font-bold">SKOR</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-400 font-mono cyber-text-glow">{score}</p>
            </div>
          </div>
          {progress.total > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="helper-text font-bold">İLERLEME</p>
                <p className="text-sm font-bold text-white font-mono">
                  {progress.current} / {progress.total}
                </p>
              </div>
              <ProgressBar current={progress.current} total={progress.total} />
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10">
        {gameState === 'phishing' && <PhishingModule />}
        {gameState === 'password' && <PasswordModule />}
      </div>
    </div>
  );
};
