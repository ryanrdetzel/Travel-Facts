import { useCallback, useEffect, useRef } from 'react';
import { useAppStore } from '../store';
import { azToMaFlightPath, azToMaDrivePath } from '../data/sample/azMaCorridor';
import type { SimulationWaypoint } from '../lib/types';

export type SimulationRoute = 'flight' | 'drive';

export function useSimulation() {
  const {
    isSimulating,
    simulationSpeed,
    setSimulating,
    setPosition,
    setGpsStatus,
  } = useAppStore();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(0);
  const routeRef = useRef<SimulationWaypoint[]>(azToMaFlightPath);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    indexRef.current = 0;
    setSimulating(false);
    setGpsStatus('off');
  }, [setSimulating, setGpsStatus]);

  const start = useCallback((route: SimulationRoute = 'flight') => {
    stop();
    routeRef.current = route === 'flight' ? azToMaFlightPath : azToMaDrivePath;
    indexRef.current = 0;
    setSimulating(true);
    setGpsStatus('active');
  }, [stop, setSimulating, setGpsStatus]);

  // Run simulation steps
  useEffect(() => {
    if (!isSimulating) return;

    const baseInterval = 2000; // 2 seconds between waypoints at 1x
    const interval = baseInterval / simulationSpeed;

    const step = () => {
      const waypoints = routeRef.current;
      if (indexRef.current >= waypoints.length) {
        stop();
        return;
      }

      const wp = waypoints[indexRef.current];

      // Interpolate between waypoints for smoother movement
      const nextIdx = Math.min(indexRef.current + 1, waypoints.length - 1);
      const next = waypoints[nextIdx];
      const speed = indexRef.current < waypoints.length - 1
        ? calculateSpeed(wp, next, interval)
        : 0;

      setPosition({
        latitude: wp.lat,
        longitude: wp.lng,
        accuracy: 10,
        speed,
        timestamp: Date.now(),
      });

      indexRef.current++;
    };

    // Fire first step immediately
    step();

    timerRef.current = setInterval(step, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isSimulating, simulationSpeed, setPosition, stop]);

  return { start, stop, isSimulating };
}

function calculateSpeed(a: SimulationWaypoint, b: SimulationWaypoint, intervalMs: number): number {
  const R = 3959; // Earth radius in miles
  const dLat = (b.lat - a.lat) * (Math.PI / 180);
  const dLng = (b.lng - a.lng) * (Math.PI / 180);
  const lat1 = a.lat * (Math.PI / 180);
  const lat2 = b.lat * (Math.PI / 180);

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  const distMiles = R * c;

  const hours = intervalMs / 3600000;
  return distMiles / hours; // mph
}
