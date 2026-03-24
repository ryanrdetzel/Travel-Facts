import { useEffect, useRef } from 'react';
import { GpsTracker } from '../lib/geo/tracker';
import { useAppStore } from '../store';

export function useGeoTracker() {
  const trackerRef = useRef<GpsTracker | null>(null);
  const { setGpsStatus, setPosition, setGpsError, isSimulating } = useAppStore();

  useEffect(() => {
    if (isSimulating) {
      // Don't use real GPS when simulating
      if (trackerRef.current) {
        trackerRef.current.stop();
        trackerRef.current = null;
      }
      return;
    }

    const tracker = new GpsTracker({
      onPosition: setPosition,
      onStatusChange: setGpsStatus,
      onError: (msg) => setGpsError(msg),
    });

    trackerRef.current = tracker;

    return () => {
      tracker.stop();
    };
  }, [isSimulating, setGpsStatus, setPosition, setGpsError]);

  const start = () => trackerRef.current?.start();
  const stop = () => trackerRef.current?.stop();

  return { start, stop };
}
