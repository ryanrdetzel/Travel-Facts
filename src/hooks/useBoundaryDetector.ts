import { useEffect, useRef } from 'react';
import { BoundaryDetector } from '../lib/geo/detector';
import { useAppStore } from '../store';
import { sampleStates, sampleCounties, sampleTowns } from '../data/sample/azMaCorridor';
import type { Boundary, BoundaryType } from '../lib/types';

export function useBoundaryDetector() {
  const detectorRef = useRef<BoundaryDetector | null>(null);
  const position = useAppStore((s) => s.position);
  const activeMode = useAppStore((s) => s.activeMode);

  // Use refs for store actions so effects don't depend on them
  const setCurrentLocationRef = useRef(useAppStore.getState().setCurrentLocation);
  const setPolyChecksRef = useRef(useAppStore.getState().setPolyChecks);

  // Initialize detector once
  useEffect(() => {
    const detector = new BoundaryDetector();
    const allBoundaries: Boundary[] = [...sampleStates, ...sampleCounties, ...sampleTowns];
    detector.loadBoundaries(allBoundaries);

    detector.setTransitionCallback((boundary: Boundary | null, type: BoundaryType) => {
      setCurrentLocationRef.current(type, boundary);
    });

    detectorRef.current = detector;

    return () => {
      detector.destroy();
    };
  }, []);

  // Process position updates
  useEffect(() => {
    if (!position || !detectorRef.current) return;

    const checks = detectorRef.current.update(
      position.latitude,
      position.longitude,
      activeMode
    );
    setPolyChecksRef.current(checks);
  }, [position, activeMode]);

  return detectorRef;
}
