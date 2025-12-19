import { GameProvider, useGame } from './context/GameContext';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { MenuScreen } from './components/screens/MenuScreen';
import { GameScreen } from './components/screens/GameScreen';
import { ResultsScreen } from './components/screens/ResultsScreen';

function AppContent() {
  const { gameState, error } = useGame();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Bir Hata Oluştu</h2>
          <p className="text-gray-700">{error}</p>
          <p className="text-sm text-gray-600 mt-4">
            Lütfen sunucunun çalıştığından emin olun: <code className="bg-gray-100 px-2 py-1 rounded">npm run dev:server</code>
          </p>
        </div>
      </div>
    );
  }

  switch (gameState) {
    case 'welcome':
      return <WelcomeScreen />;
    case 'menu':
      return <MenuScreen />;
    case 'phishing':
    case 'password':
      return <GameScreen />;
    case 'results':
      return <ResultsScreen />;
    default:
      return <WelcomeScreen />;
  }
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
