import { useEffect, useState } from 'react';
import { useAppStore } from '../store';

function formatAge(ms: number): string {
  if (ms < 1000) return 'just now';
  if (ms < 60_000) return `${Math.floor(ms / 1000)}s ago`;
  return `${Math.floor(ms / 60_000)}m ago`;
}

export function DebugPanel() {
  const { position, polyChecks, gpsError, gpsDebugStats, gpsStatus } = useAppStore();
  const [expanded, setExpanded] = useState(false);
  const [, setTick] = useState(0);

  // Auto-refresh timestamps every second when expanded
  useEffect(() => {
    if (!expanded) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [expanded]);

  const lastRawAge = gpsDebugStats?.lastRawTime
    ? formatAge(Date.now() - gpsDebugStats.lastRawTime)
    : '—';

  return (
    <div className="px-4 py-2 bg-navy-900 border-t border-navy-700 font-mono text-[10px] text-slate-500">
      <div
        className="flex items-center justify-between gap-4 overflow-x-auto cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
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
        <span className="text-[8px]">{expanded ? '▲' : '▼'}</span>
      </div>

      {gpsError && (
        <p className="text-red-400 mt-1">{gpsError}</p>
      )}

      {expanded && (
        <div className="mt-2 pt-2 border-t border-navy-700 space-y-1">
          <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
            GPS Diagnostics
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            <span>Status:</span>
            <span className={
              gpsStatus === 'active' ? 'text-green-400' :
              gpsStatus === 'acquiring' ? 'text-yellow-400' :
              gpsStatus === 'error' ? 'text-red-400' : 'text-slate-500'
            }>
              {gpsStatus}
            </span>

            <span>Raw fixes:</span>
            <span>{gpsDebugStats?.rawCount ?? 0}</span>

            <span>Filtered (bad acc):</span>
            <span className={gpsDebugStats && gpsDebugStats.filteredCount > 0 ? 'text-yellow-400' : ''}>
              {gpsDebugStats?.filteredCount ?? 0}
            </span>

            <span>Position changes:</span>
            <span className={
              gpsDebugStats && gpsDebugStats.rawCount > 5 && gpsDebugStats.movedCount === 0
                ? 'text-red-400' : ''
            }>
              {gpsDebugStats?.movedCount ?? 0}
            </span>

            <span>Keepalive restarts:</span>
            <span className={gpsDebugStats && gpsDebugStats.restartCount > 0 ? 'text-yellow-400' : ''}>
              {gpsDebugStats?.restartCount ?? 0}
            </span>

            <span>Last raw fix:</span>
            <span>{lastRawAge}</span>

            <span>Last raw accuracy:</span>
            <span>{gpsDebugStats?.lastRawAccuracy ? `${gpsDebugStats.lastRawAccuracy.toFixed(0)}m` : '—'}</span>

            <span>Last raw coords:</span>
            <span>
              {gpsDebugStats?.lastRawLat
                ? `${gpsDebugStats.lastRawLat.toFixed(6)}, ${gpsDebugStats.lastRawLng.toFixed(6)}`
                : '—'}
            </span>
          </div>

          {gpsDebugStats && gpsDebugStats.rawCount > 5 && gpsDebugStats.movedCount === 0 && (
            <p className="text-red-400 mt-1 text-[9px]">
              GPS is returning the same position repeatedly — likely cached/stale data.
              Try moving outdoors or toggling GPS off/on.
            </p>
          )}

          {gpsDebugStats && gpsDebugStats.filteredCount > gpsDebugStats.rawCount * 0.5 && gpsDebugStats.rawCount > 3 && (
            <p className="text-yellow-400 mt-1 text-[9px]">
              Over half of GPS fixes are being filtered for poor accuracy ({'>'}500m).
              Signal may be weak (indoors, airplane, urban canyon).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
