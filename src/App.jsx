import { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { Splash } from './components/Splash';
import { MainMenu } from './components/MainMenu';
import { MapSelection } from './components/MapSelection';
import { Encyclopedia } from './components/Encyclopedia';
import { StatsPage } from './components/StatsPage';
import { DebugVisualizer } from './components/DebugVisualizer';
import { MAPS } from './data/Maps';

function App() {
  const [view, setView] = useState('splash'); // 'splash', 'menu', 'game', 'map-select', 'towers', 'enemies', 'stats', 'debug'
  const [selectedMapId, setSelectedMapId] = useState('village');

  const handleStart = () => setView('menu');
  const handleNavigate = (target) => setView(target);

  // Debug mode handler
  const handleDebug = () => setView('debug');

  const handleMapSelect = (mapId) => {
    console.log('Map selected:', mapId);
    setSelectedMapId(mapId);
    setView('game');
  };

  return (
    <div className="app-container">
      {view === 'splash' && <Splash onStart={handleStart} onDebug={handleDebug} />}
      {view === 'menu' && <MainMenu onNavigate={handleNavigate} />}
      {view === 'map-select' && <MapSelection onSelect={handleMapSelect} onBack={() => setView('menu')} />}

      {(view === 'towers' || view === 'enemies') && (
        <Encyclopedia initialTab={view} onBack={() => setView('menu')} />
      )}

      {view === 'stats' && <StatsPage onBack={() => setView('menu')} />}

      {view === 'debug' && <DebugVisualizer onBack={() => setView('splash')} />}

      {view === 'game' && (
        <div className="game-wrapper" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
          <GameCanvas mapConfig={MAPS[selectedMapId]} onQuit={() => setView('menu')} />
        </div>
      )}
    </div>
  )
}

export default App;
