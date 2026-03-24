import { useAppStore } from '../store';

export function DebugPanel() {
  const { position, polyChecks, gpsError } = useAppStore();

  return (
    <div className="px-4 py-2 bg-navy-900 border-t border-navy-700 font-mono text-[10px] text-slate-500">
      <div className="flex items-center justify-between gap-4 overflow-x-auto">
        <span>
          {position
            ? `${position.latitude.toFixed(4)}, ${position.longitude.toFixed(4)}`
            : '—, —'}
        </span>
        <span>
          Acc: {position ? `${position.accuracy.toFixed(0)}m` : '—'}
        </span>
        <span>
          Spd: {position?.speed != null ? `${position.speed.toFixed(0)} mph` : '—'}
        </span>
        <span>Chk: {polyChecks}</span>
      </div>
      {gpsError && (
        <p className="text-red-400 mt-1">{gpsError}</p>
      )}
    </div>
  );
}
