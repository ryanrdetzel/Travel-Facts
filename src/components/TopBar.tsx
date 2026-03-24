import { useAppStore } from '../store';
import type { GpsStatus } from '../lib/types';

const statusConfig: Record<GpsStatus, { color: string; label: string; pulse: boolean }> = {
  off: { color: 'bg-gray-500', label: 'GPS Off', pulse: false },
  acquiring: { color: 'bg-yellow-500', label: 'Acquiring', pulse: true },
  active: { color: 'bg-green-500', label: 'GPS Active', pulse: true },
  error: { color: 'bg-red-500', label: 'GPS Error', pulse: false },
};

export function TopBar() {
  const { gpsStatus, isSimulating, currentView, setCurrentView } = useAppStore();
  const status = statusConfig[isSimulating ? 'active' : gpsStatus];

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-navy-800 border-b border-navy-600">
      <button
        onClick={() => setCurrentView('main')}
        className="flex items-center gap-2 cursor-pointer bg-transparent border-none"
      >
        <span className="font-display text-xl text-gold">RoadLore</span>
      </button>

      <div className="flex items-center gap-3">
        {currentView === 'main' ? (
          <button
            onClick={() => setCurrentView('download')}
            className="text-xs text-slate-400 hover:text-gold transition-colors bg-transparent border-none cursor-pointer px-2 py-1"
          >
            Packs
          </button>
        ) : (
          <button
            onClick={() => setCurrentView('main')}
            className="text-xs text-slate-400 hover:text-gold transition-colors bg-transparent border-none cursor-pointer px-2 py-1"
          >
            Back
          </button>
        )}

        <div className="flex items-center gap-2 bg-navy-700 rounded-full px-3 py-1.5">
          <div className={`w-2 h-2 rounded-full ${status.color} ${status.pulse ? 'gps-pulse' : ''}`} />
          <span className="text-xs font-mono text-slate-300">
            {isSimulating ? 'Simulating' : status.label}
          </span>
        </div>
      </div>
    </header>
  );
}
