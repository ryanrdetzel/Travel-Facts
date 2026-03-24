import { useCallback, useEffect, useRef, useState } from 'react';

interface GpsLogEntry {
  id: number;
  time: string;
  type: 'raw' | 'error' | 'status' | 'info';
  message: string;
}

let logId = 0;

type GpsMode = 'off' | 'watch' | 'poll';

export function GpsDebugPage({ onClose }: { onClose: () => void }) {
  const [logs, setLogs] = useState<GpsLogEntry[]>([]);
  const [mode, setMode] = useState<GpsMode>('off');
  const [lastPos, setLastPos] = useState<{ lat: number; lng: number; acc: number } | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const watchIdRef = useRef<number | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addLog = useCallback((type: GpsLogEntry['type'], message: string) => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    setLogs(prev => [...prev.slice(-200), { id: ++logId, time, type, message }]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const formatPosition = (position: GeolocationPosition, prefix = '') => {
    const { latitude, longitude, accuracy, speed, heading, altitude } = position.coords;
    const posAge = Date.now() - position.timestamp;
    return `${prefix}lat=${latitude.toFixed(6)} lng=${longitude.toFixed(6)} acc=${accuracy.toFixed(0)}m spd=${speed != null ? (speed * 2.23694).toFixed(1) + 'mph' : 'null'} hdg=${heading ?? 'null'} alt=${altitude?.toFixed(0) ?? 'null'} age=${posAge < 1000 ? posAge + 'ms' : (posAge / 1000).toFixed(1) + 's'}`;
  };

  const handlePosition = useCallback((position: GeolocationPosition, prefix = '') => {
    const { latitude, longitude, accuracy } = position.coords;
    setUpdateCount(c => c + 1);
    setLastPos({ lat: latitude, lng: longitude, acc: accuracy });
    addLog('raw', formatPosition(position, prefix));
  }, [addLog]);

  const handleError = useCallback((error: GeolocationPositionError, prefix = '') => {
    const codeNames: Record<number, string> = {
      1: 'PERMISSION_DENIED',
      2: 'POSITION_UNAVAILABLE',
      3: 'TIMEOUT',
    };
    addLog('error', `${prefix}${codeNames[error.code] || 'UNKNOWN'}(${error.code}): ${error.message}`);
  }, [addLog]);

  // --- watchPosition mode ---
  const startWatch = useCallback(() => {
    stopAll();
    addLog('info', 'watchPosition(enableHighAccuracy=true, timeout=30s, maxAge=5s)');
    setMode('watch');

    const id = navigator.geolocation.watchPosition(
      (pos) => handlePosition(pos),
      (err) => handleError(err),
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 5000 }
    );
    watchIdRef.current = id;
    addLog('info', `watchPosition started, id=${id}`);
  }, [addLog, handlePosition, handleError]);

  // --- polling mode (getCurrentPosition every 3s) ---
  const startPoll = useCallback(() => {
    stopAll();
    addLog('info', 'Polling mode: getCurrentPosition every 3s (maxAge=0)');
    setMode('poll');

    const doPoll = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => handlePosition(pos, '[POLL] '),
        (err) => handleError(err, '[POLL] '),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };
    doPoll(); // Immediately fire first one
    pollTimerRef.current = setInterval(doPoll, 3000);
  }, [addLog, handlePosition, handleError]);

  // --- stop everything ---
  const stopAll = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      addLog('info', `watchPosition stopped, id=${watchIdRef.current}`);
      watchIdRef.current = null;
    }
    if (pollTimerRef.current !== null) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
      addLog('info', 'Polling stopped');
    }
    setMode('off');
  }, [addLog]);

  // --- one-shot ---
  const oneShot = useCallback(() => {
    addLog('info', 'getCurrentPosition(enableHighAccuracy=true, timeout=10s, maxAge=0)');
    navigator.geolocation.getCurrentPosition(
      (pos) => handlePosition(pos, '[ONE-SHOT] '),
      (err) => handleError(err, '[ONE-SHOT] '),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [addLog, handlePosition, handleError]);

  // --- one-shot with maxAge (accepts cached) ---
  const oneShotCached = useCallback(() => {
    addLog('info', 'getCurrentPosition(enableHighAccuracy=true, timeout=10s, maxAge=60s)');
    navigator.geolocation.getCurrentPosition(
      (pos) => handlePosition(pos, '[CACHED] '),
      (err) => handleError(err, '[CACHED] '),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [addLog, handlePosition, handleError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (pollTimerRef.current !== null) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, []);

  // Periodic heartbeat
  useEffect(() => {
    if (mode === 'off') return;
    const interval = setInterval(() => {
      addLog('status', `heartbeat — ${updateCount} total updates`);
    }, 10000);
    return () => clearInterval(interval);
  }, [mode, updateCount, addLog]);

  const typeColor = (type: GpsLogEntry['type']) => {
    switch (type) {
      case 'raw': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'status': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
    }
  };

  const modeLabel = mode === 'watch' ? 'WATCH' : mode === 'poll' ? 'POLL' : 'OFF';
  const modeColor = mode !== 'off' ? 'bg-green-500 animate-pulse' : 'bg-gray-600';

  return (
    <div className="h-full flex flex-col bg-black text-white font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-900 border-b border-gray-700">
        <span className="text-sm font-bold text-green-400">GPS DEBUG</span>
        <button onClick={onClose} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
          Close
        </button>
      </div>

      {/* Current Position Summary */}
      <div className="px-3 py-2 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`inline-block w-2 h-2 rounded-full ${modeColor}`} />
          <span className="text-gray-400">{modeLabel}</span>
          <span>
            {lastPos
              ? `${lastPos.lat.toFixed(6)}, ${lastPos.lng.toFixed(6)} (±${lastPos.acc.toFixed(0)}m)`
              : 'No position yet'}
          </span>
          <span className="text-gray-500">#{updateCount}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 px-3 py-2 bg-gray-900 border-b border-gray-700">
        {mode === 'off' ? (
          <>
            <button onClick={startWatch} className="px-3 py-1.5 bg-green-700 text-green-100 rounded font-bold">
              watchPosition
            </button>
            <button onClick={startPoll} className="px-3 py-1.5 bg-purple-700 text-purple-100 rounded font-bold">
              Poll 3s
            </button>
          </>
        ) : (
          <button onClick={stopAll} className="px-3 py-1.5 bg-red-700 text-red-100 rounded font-bold">
            Stop
          </button>
        )}
        <button onClick={oneShot} className="px-3 py-1.5 bg-blue-700 text-blue-100 rounded">
          One-shot
        </button>
        <button onClick={oneShotCached} className="px-3 py-1.5 bg-cyan-700 text-cyan-100 rounded">
          Cached
        </button>
        <button onClick={() => { setLogs([]); setUpdateCount(0); }} className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded">
          Clear
        </button>
      </div>

      {/* Log Output */}
      <div className="flex-1 overflow-y-auto px-3 py-1">
        {logs.length === 0 && (
          <p className="text-gray-500 py-4">Tap a mode to start capturing GPS events.</p>
        )}
        {logs.map(entry => (
          <div key={entry.id} className="py-0.5 leading-tight">
            <span className="text-gray-500">{entry.time}</span>{' '}
            <span className={typeColor(entry.type)}>[{entry.type.toUpperCase().padEnd(6)}]</span>{' '}
            <span className="text-gray-200">{entry.message}</span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}
