import { TopBar } from './components/TopBar';
import { ModeToggle } from './components/ModeToggle';
import { LocationBanner } from './components/LocationBanner';
import { InfoCard } from './components/InfoCard';
import { HistoryLog } from './components/HistoryLog';
import { DebugPanel } from './components/DebugPanel';
import { SimulationControls } from './components/SimulationControls';
import { GpsControls } from './components/GpsControls';
import { PackManager } from './components/PackManager';
import { GpsDebugPage } from './components/GpsDebugPage';
import { useBoundaryDetector } from './hooks/useBoundaryDetector';
import { useAppStore } from './store';

function MainView() {
  useBoundaryDetector();

  return (
    <>
      <ModeToggle />
      <div className="flex-1 overflow-y-auto">
        <LocationBanner />
        <InfoCard />
        <HistoryLog />
      </div>
      <GpsControls />
      <SimulationControls />
      <DebugPanel />
    </>
  );
}

function App() {
  const { currentView } = useAppStore();

  return (
    <div className="h-full flex flex-col bg-navy-900">
      <TopBar />
      {currentView === 'debug' ? (
        <GpsDebugPage onClose={() => useAppStore.getState().setCurrentView('main')} />
      ) : currentView === 'main' ? (
        <MainView />
      ) : (
        <PackManager />
      )}
    </div>
  );
}

export default App;
