import { useEffect, useRef } from 'react';
import { BoundaryDetector } from '../lib/geo/detector';
import { useAppStore } from '../store';
import { sampleStates, sampleCounties, sampleTowns } from '../data/sample/azMaCorridor';
import type { Boundary, BoundaryType } from '../lib/types';

export function useBoundaryDetector() {
  const detectorRef = useRef<BoundaryDetector | null>(null);
  const { position, activeMode, setCurrentLocation, setPolyChecks } = useAppStore();

  // Initialize detector with sample data
  useEffect(() => {
    const detector = new BoundaryDetector();
    const allBoundaries: Boundary[] = [...sampleStates, ...sampleCounties, ...sampleTowns];
    detector.loadBoundaries(allBoundaries);

    detector.setTransitionCallback((boundary: Boundary, type: BoundaryType) => {
      setCurrentLocation(type, boundary);
    });

    detectorRef.current = detector;

    return () => {
      detector.destroy();
    };
  }, [setCurrentLocation]);

  // Process position updates
  useEffect(() => {
    if (!position || !detectorRef.current) return;

    const checks = detectorRef.current.update(
      position.latitude,
      position.longitude,
      activeMode
    );
    setPolyChecks(checks);
  }, [position, activeMode, setPolyChecks]);

  return detectorRef;
}
