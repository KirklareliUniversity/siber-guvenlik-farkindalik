import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Question {
  id: number;
  email: {
    from: string;
    subject: string;
    body: string;
    hasLink: boolean;
    urgency: string;
  };
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface PasswordQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface Progress {
  current: number;
  total: number;
}

interface Feedback {
  isCorrect: boolean;
  explanation: string;
}

interface Report {
  userName?: string;
  totalScore?: number;
  maxScore?: number;
  overallRating?: string;
  summary?: string;
  // Java server response format
  correctAnswers?: number;
  totalQuestions?: number;
  percentage?: number;
  grade?: string;
  feedback?: string;
  passwordAnalysis?: {
    strength: string;
    score: number;
    length: number;
    feedback: string;
  };
  // Legacy fields for backward compatibility
  phishingResults?: {
    correct: number;
    incorrect: number;
    total: number;
    percentage: number;
  };
  passwordResults?: {
    strength: string;
    score: number;
    analysis: {
      length: number;
      hasUpperCase: boolean;
      hasLowerCase: boolean;
      hasNumber: boolean;
      hasSpecialChar: boolean;
    };
  };
  detailedAnswers?: any[];
  recommendations?: string[];
}

interface GameContextType {
  gameState: string;
  userName: string;
  userId: number | null;
  gameMode: string | null;
  currentQuestion: Question | null;
  currentPasswordQuestion: PasswordQuestion | null;
  score: number;
  progress: Progress;
  feedback: Feedback | null;
  report: Report | null;
  loading: boolean;
  error: string | null;
  startGame: (name: string) => Promise<void>;
  selectGameMode: (mode: string) => Promise<void>;
  submitAnswer: (answer: string) => Promise<void>;
  submitPassword: (password: string) => Promise<void>;
  getResults: () => Promise<void>;
  restartGame: () => Promise<void>;
  nextQuestion: () => Promise<void>;
  registerUser: (userData: {
    fullName: string;
    birthDate: string;
    educationLevel: string;
    profession: string;
    hasCybersecurityTraining: boolean;
  }) => Promise<number | null>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Canlı backend için güncellenen API adresleri
export const API_URL = 'https://backend.test.com/api/game';
export const USER_API_URL = 'https://backend.test.com/api/user';

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<string>('welcome');
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<number | null>(null);
  const [gameMode, setGameMode] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentPasswordQuestion, setCurrentPasswordQuestion] = useState<PasswordQuestion | null>(null);
  const [score, setScore] = useState<number>(0);
  const [progress, setProgress] = useState<Progress>({ current: 0, total: 0 });
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState<string>(() => `session_${Date.now()}_${Math.random()}`);

  const startGame = useCallback(async (name: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: name, sessionId })
      });

      if (!response.ok) throw new Error('Oyun başlatılamadı');

      const data = await response.json();
      setUserName(name);
      setGameState(data.gameState);
      setCurrentQuestion(data.currentQuestion || data.question);
      setProgress(data.progress);
      setScore(0);
      setGameMode(data.gameMode || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const selectGameMode = useCallback(async (mode: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          actionType: 'SELECT_GAME_MODE',
          payload: { gameMode: mode }
        })
      });

      if (!response.ok) throw new Error('Oyun modu seçilemedi');

      const data = await response.json();
      setGameMode(data.gameMode || mode);
      setGameState(data.gameState);
      
      if (data.currentQuestion) {
        setCurrentQuestion(data.currentQuestion);
        setCurrentPasswordQuestion(null);
      }
      if (data.currentPasswordQuestion) {
        setCurrentPasswordQuestion(data.currentPasswordQuestion);
        setCurrentQuestion(null);
      }
      if (data.progress) {
        setProgress(data.progress);
      }
      if (data.score !== undefined) {
        setScore(data.score);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const submitAnswer = useCallback(async (answer: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          actionType: 'SUBMIT_ANSWER',
          payload: { answer }
        })
      });

      if (!response.ok) throw new Error('Cevap gönderilemedi');

      const data = await response.json();
      setFeedback({
        isCorrect: data.isCorrect || data.correct,
        explanation: data.explanation
      });
      setScore(data.score);
      setGameMode(data.gameMode || gameMode);
      
      // Password question güncelle
      if (data.currentPasswordQuestion) {
        setCurrentPasswordQuestion(data.currentPasswordQuestion);
      }

      // Otomatik geçiş kaldırıldı - manuel buton ile geçiş yapılacak
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [sessionId, gameMode]);

  const submitPassword = useCallback(async (password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          actionType: 'SUBMIT_PASSWORD',
          payload: { password }
        })
      });

      if (!response.ok) throw new Error('Şifre gönderilemedi');

      const data = await response.json();
      setGameState(data.gameState);
      setScore(data.score);
      setGameMode(data.gameMode || gameMode);
      
      // Java server'ı SUBMIT_PASSWORD'da results state'ine geçiyor
      // Eğer results state'ine geçtiyse, sonuçları getir
      if (data.gameState === 'results') {
        // Java server'ı zaten results döndürüyor, ayrıca getResults çağırmaya gerek yok
        if (data.results) {
          // results ve passwordAnalysis'i birleştir
          const fullReport = {
            ...data.results,
            passwordAnalysis: data.passwordAnalysis
          };
          setReport(fullReport);

          // Oyun sonuçlarını kaydet
          if (userId && fullReport) {
            try {
              const saveResponse = await fetch(`${USER_API_URL}/save-result`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: userId,
                  gameMode: data.gameMode || gameMode || 'PASSWORD_ONLY',
                  score: fullReport.totalScore || fullReport.correctAnswers || 0,
                  totalQuestions: fullReport.totalQuestions || fullReport.maxScore || 0,
                  correctAnswers: fullReport.correctAnswers || 0,
                  percentage: fullReport.percentage || 0,
                  grade: fullReport.grade || fullReport.overallRating || 'D'
                })
              });

              if (saveResponse.ok) {
                console.log('Oyun sonucu başarıyla kaydedildi');
              } else {
                console.error('Oyun sonucu kaydedilemedi');
              }
            } catch (saveErr) {
              console.error('Oyun sonucu kaydedilirken hata:', saveErr);
            }
          }
        } else {
          // Eğer results yoksa, getResults çağır
          await getResults();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [sessionId, gameMode]);

  const getResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/results/${sessionId}`);

      if (!response.ok) throw new Error('Sonuçlar alınamadı');

      const data = await response.json();
      setGameState(data.gameState);
      setGameMode(data.gameMode || gameMode);
      
      // results ve passwordAnalysis'i birleştir
      const fullReport = {
        ...data.results,
        passwordAnalysis: data.passwordAnalysis
      };
      setReport(fullReport);

      // Oyun sonuçlarını kaydet
      if (userId && fullReport) {
        try {
          const saveResponse = await fetch(`${USER_API_URL}/save-result`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: userId,
              gameMode: gameMode || 'PHISHING_ONLY',
              score: fullReport.totalScore || fullReport.correctAnswers || 0,
              totalQuestions: fullReport.totalQuestions || fullReport.maxScore || 0,
              correctAnswers: fullReport.correctAnswers || 0,
              percentage: fullReport.percentage || 0,
              grade: fullReport.grade || fullReport.overallRating || 'D'
            })
          });

          if (saveResponse.ok) {
            console.log('Oyun sonucu başarıyla kaydedildi');
          } else {
            console.error('Oyun sonucu kaydedilemedi');
          }
        } catch (saveErr) {
          console.error('Oyun sonucu kaydedilirken hata:', saveErr);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [sessionId, gameMode, userId]);

  const restartGame = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await fetch(`${API_URL}/restart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      setGameState('welcome');
      setUserName('');
      setGameMode(null);
      setCurrentQuestion(null);
      setCurrentPasswordQuestion(null);
      setScore(0);
      setProgress({ current: 0, total: 0 });
      setFeedback(null);
      setReport(null);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const nextQuestion = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          actionType: 'NEXT_QUESTION',
          payload: {}
        })
      });

      if (!response.ok) throw new Error('Sonraki soru alınamadı');

      const data = await response.json();
      setFeedback(null);
      setGameState(data.gameState);
      setGameMode(data.gameMode || gameMode);

      if (data.gameState === 'phishing' && (data.currentQuestion || data.question)) {
        setCurrentQuestion(data.currentQuestion || data.question);
        setCurrentPasswordQuestion(null);
        setProgress(data.progress);
      } else if (data.gameState === 'password') {
        setCurrentQuestion(null);
        // currentPasswordQuestion null ise şifre girişi ekranına geçiliyor
        // Backend'den null olarak gelebilir, bu durumda şifre girişi ekranı gösterilecek
        setCurrentPasswordQuestion(data.currentPasswordQuestion || null);
        if (data.progress) {
          setProgress(data.progress);
        }
      } else if (data.gameState === 'results') {
        setCurrentQuestion(null);
        setCurrentPasswordQuestion(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [sessionId, gameMode]);

  const registerUser = useCallback(async (userData: {
    fullName: string;
    birthDate: string;
    educationLevel: string;
    profession: string;
    hasCybersecurityTraining: boolean;
  }): Promise<number | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${USER_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) throw new Error('Kullanıcı kaydı başarısız');
      
      const data = await response.json();
      if (data.success && data.userId) {
        setUserId(data.userId); // userId'yi context'te sakla
        return data.userId;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    gameState,
    userName,
    userId,
    gameMode,
    currentQuestion,
    currentPasswordQuestion,
    score,
    progress,
    feedback,
    report,
    loading,
    error,
    startGame,
    selectGameMode,
    submitAnswer,
    submitPassword,
    getResults,
    restartGame,
    nextQuestion,
    registerUser
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
