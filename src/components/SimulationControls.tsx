import { useSimulation, type SimulationRoute } from '../hooks/useSimulation';
import { useAppStore } from '../store';

const speeds = [1, 5, 20];

export function SimulationControls() {
  const { start, stop, isSimulating } = useSimulation();
  const { simulationSpeed, setSimulationSpeed } = useAppStore();

  const handleStart = (route: SimulationRoute) => {
    start(route);
  };

  return (
    <div className="px-4 py-3 bg-navy-800/30 border-t border-navy-700">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
          Simulation
        </span>
      </div>

      {!isSimulating ? (
        <div className="flex gap-2">
          <button
            onClick={() => handleStart('flight')}
            className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25 transition-colors cursor-pointer"
          >
            AZ → MA Flight
          </button>
          <button
            onClick={() => handleStart('drive')}
            className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 transition-colors cursor-pointer"
          >
            AZ → MA Drive
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={stop}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition-colors cursor-pointer"
          >
            Stop
          </button>
          <div className="flex items-center gap-1">
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => setSimulationSpeed(s)}
                className={`px-2 py-1 rounded text-[10px] font-mono border cursor-pointer transition-colors ${
                  simulationSpeed === s
                    ? 'bg-gold/20 text-gold border-gold/40'
                    : 'bg-transparent text-slate-500 border-navy-600 hover:border-slate-500'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
