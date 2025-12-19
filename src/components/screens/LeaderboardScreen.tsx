import { useState, useEffect } from 'react';
import { Trophy, X, Medal, GraduationCap } from 'lucide-react';
import { USER_API_URL } from '../../context/GameContext';

interface LeaderboardEntry {
  rank: number;
  fullName: string;
  score: number;
  percentage: number;
  grade: string;
  gameMode: string;
  playedAt: string;
  hasCybersecurityTraining?: boolean;
}

interface LeaderboardScreenProps {
  onClose: () => void;
}

export const LeaderboardScreen = ({ onClose }: LeaderboardScreenProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${USER_API_URL}/leaderboard`);
      const data = await response.json();
      
      if (data.success) {
        setLeaderboard(data.leaderboard || []);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGameModeLabel = (mode: string) => {
    switch (mode) {
      case 'PHISHING_ONLY': return 'Phishing';
      case 'PASSWORD_ONLY': return 'Şifre';
      case 'MIXED': return 'Karışık';
      default: return mode;
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-gray-400 font-mono">#{rank}</span>;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto cyber-card relative">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-gray-400 cyber-text-glow" />
            <h2 className="text-xl font-bold text-white font-mono cyber-text-glow">LİDERLİK TABLOSU</h2>
          </div>
          <button
            onClick={onClose}
            className="cyber-card p-2 hover:cyber-hover-glow transition-all"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="cyber-loading inline-block mb-4"></div>
              <p className="text-gray-400 font-mono">Yükleniyor...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 font-mono">Henüz oyun sonucu bulunmuyor.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`cyber-card p-4 flex items-center justify-between ${
                    entry.rank <= 3 ? 'cyber-hover-glow' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 flex items-center justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white font-mono cyber-text-glow">
                        {entry.fullName}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-400 font-mono">
                          {getGameModeLabel(entry.gameMode)}
                        </span>
                        <span className="text-sm text-gray-400 font-mono">
                          {entry.percentage}%
                        </span>
                        <span className={`text-sm font-bold font-mono ${
                          entry.grade === 'A+' || entry.grade === 'A' ? 'text-green-400' :
                          entry.grade === 'B' ? 'text-yellow-400' :
                          entry.grade === 'C' ? 'text-orange-400' :
                          'text-red-400'
                        }`}>
                          {entry.grade}
                        </span>
                        {entry.hasCybersecurityTraining && (
                          <span className="flex items-center gap-1 text-xs text-cyan-400 font-mono" title="Siber güvenlik eğitimi aldı">
                            <GraduationCap className="w-3 h-3" />
                            Eğitimli
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-400 font-mono cyber-text-glow">
                      {entry.score}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {new Date(entry.playedAt).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

