import { useCallback, useEffect, useRef } from 'react';
import { GpsTracker } from '../lib/geo/tracker';
import { useAppStore } from '../store';

export function useGeoTracker() {
  const trackerRef = useRef<GpsTracker | null>(null);
  const isSimulating = useAppStore((s) => s.isSimulating);

  // Use refs for store actions so the effect doesn't depend on them
  const setPositionRef = useRef(useAppStore.getState().setPosition);
  const setGpsStatusRef = useRef(useAppStore.getState().setGpsStatus);
  const setGpsErrorRef = useRef(useAppStore.getState().setGpsError);

  useEffect(() => {
    if (isSimulating) {
      if (trackerRef.current) {
        trackerRef.current.stop();
        trackerRef.current = null;
      }
      return;
    }

    const tracker = new GpsTracker({
      onPosition: (pos) => setPositionRef.current(pos),
      onStatusChange: (status) => setGpsStatusRef.current(status),
      onError: (msg) => setGpsErrorRef.current(msg),
    });

    trackerRef.current = tracker;

    return () => {
      tracker.stop();
      trackerRef.current = null;
    };
  }, [isSimulating]);

  const start = useCallback(() => trackerRef.current?.start(), []);
  const stop = useCallback(() => trackerRef.current?.stop(), []);

  return { start, stop };
}
