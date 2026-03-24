import { useCallback, useEffect, useRef, useState } from 'react';

interface GpsLogEntry {
  id: number;
  time: string;
  type: 'raw' | 'error' | 'status' | 'info';
  message: string;
  lat?: number;
  lng?: number;
  acc?: number;
  speed?: number | null;
}

let logId = 0;

export function GpsDebugPage({ onClose }: { onClose: () => void }) {
  const [logs, setLogs] = useState<GpsLogEntry[]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastPos, setLastPos] = useState<{ lat: number; lng: number; acc: number } | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const watchIdRef = useRef<number | null>(null);

  const addLog = useCallback((type: GpsLogEntry['type'], message: string, coords?: GeolocationCoordinates) => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    const entry: GpsLogEntry = {
      id: ++logId,
      time,
      type,
      message,
      lat: coords?.latitude,
      lng: coords?.longitude,
      acc: coords?.accuracy,
      speed: coords?.speed,
    };
    setLogs(prev => [...prev.slice(-200), entry]); // Keep last 200 entries
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const startGps = useCallback(() => {
    if (!navigator.geolocation) {
      addLog('error', 'Geolocation API not available');
      return;
    }

    addLog('info', 'Calling watchPosition(enableHighAccuracy=true, timeout=30s, maxAge=5s)');
    setIsRunning(true);

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed, heading, altitude } = position.coords;
        setUpdateCount(c => c + 1);
        setLastPos({ lat: latitude, lng: longitude, acc: accuracy });
        addLog(
          'raw',
          `lat=${latitude.toFixed(6)} lng=${longitude.toFixed(6)} acc=${accuracy.toFixed(0)}m spd=${speed != null ? (speed * 2.23694).toFixed(1) + 'mph' : 'null'} hdg=${heading ?? 'null'} alt=${altitude?.toFixed(0) ?? 'null'}`,
          position.coords
        );
      },
      (error) => {
        const codeNames: Record<number, string> = {
          1: 'PERMISSION_DENIED',
          2: 'POSITION_UNAVAILABLE',
          3: 'TIMEOUT',
        };
        addLog('error', `${codeNames[error.code] || 'UNKNOWN'}(${error.code}): ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 5000,
      }
    );

    watchIdRef.current = id;
    setWatchId(id);
    addLog('info', `watchPosition started, id=${id}`);
  }, [addLog]);

  const stopGps = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      addLog('info', `watchPosition stopped, id=${watchIdRef.current}`);
      watchIdRef.current = null;
      setWatchId(null);
    }
    setIsRunning(false);
  }, [addLog]);

  const oneShot = useCallback(() => {
    addLog('info', 'Calling getCurrentPosition(enableHighAccuracy=true, timeout=10s, maxAge=0)');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed } = position.coords;
        setUpdateCount(c => c + 1);
        setLastPos({ lat: latitude, lng: longitude, acc: accuracy });
        addLog(
          'raw',
          `[ONE-SHOT] lat=${latitude.toFixed(6)} lng=${longitude.toFixed(6)} acc=${accuracy.toFixed(0)}m spd=${speed != null ? (speed * 2.23694).toFixed(1) + 'mph' : 'null'}`,
          position.coords
        );
      },
      (error) => {
        addLog('error', `[ONE-SHOT] code=${error.code}: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [addLog]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Periodic keepalive check
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      addLog('status', `heartbeat — ${updateCount} total updates received so far`);
    }, 10000);
    return () => clearInterval(interval);
  }, [isRunning, updateCount, addLog]);

  const typeColor = (type: GpsLogEntry['type']) => {
    switch (type) {
      case 'raw': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'status': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-white font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-900 border-b border-gray-700">
        <span className="text-sm font-bold text-green-400">GPS DEBUG</span>
        <button
          onClick={onClose}
          className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
        >
          Close
        </button>
      </div>

      {/* Current Position Summary */}
      <div className="px-3 py-2 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center gap-4 flex-wrap">
          <span className={`inline-block w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
          <span>
            {lastPos
              ? `${lastPos.lat.toFixed(6)}, ${lastPos.lng.toFixed(6)} (±${lastPos.acc.toFixed(0)}m)`
              : 'No position yet'}
          </span>
          <span className="text-gray-500">Updates: {updateCount}</span>
          {watchId !== null && <span className="text-gray-500">watchId: {watchId}</span>}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 px-3 py-2 bg-gray-900 border-b border-gray-700">
        {!isRunning ? (
          <button
            onClick={startGps}
            className="px-3 py-1.5 bg-green-700 text-green-100 rounded font-bold"
          >
            Start watchPosition
          </button>
        ) : (
          <button
            onClick={stopGps}
            className="px-3 py-1.5 bg-red-700 text-red-100 rounded font-bold"
          >
            Stop
          </button>
        )}
        <button
          onClick={oneShot}
          className="px-3 py-1.5 bg-blue-700 text-blue-100 rounded"
        >
          One-shot getCurrentPosition
        </button>
        <button
          onClick={() => { setLogs([]); setUpdateCount(0); }}
          className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded"
        >
          Clear
        </button>
      </div>

      {/* Log Output */}
      <div className="flex-1 overflow-y-auto px-3 py-1">
        {logs.length === 0 && (
          <p className="text-gray-500 py-4">Press "Start watchPosition" to begin capturing GPS events.</p>
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
