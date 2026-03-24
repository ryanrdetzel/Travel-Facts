import { create } from 'zustand';
import type { Boundary, BoundaryType, GpsDebugStats, GpsPosition, GpsStatus, HistoryEntry } from './lib/types';

interface AppState {
  // GPS
  gpsStatus: GpsStatus;
  position: GpsPosition | null;
  setGpsStatus: (status: GpsStatus) => void;
  setPosition: (pos: GpsPosition) => void;

  // Mode
  activeMode: BoundaryType;
  setActiveMode: (mode: BoundaryType) => void;

  // Current locations (one per type)
  currentTown: Boundary | null;
  currentCounty: Boundary | null;
  currentState: Boundary | null;
  setCurrentLocation: (type: BoundaryType, boundary: Boundary | null) => void;

  // Active card (what's displayed prominently)
  activeCard: Boundary | null;
  cardKey: number; // For re-triggering animation
  setActiveCard: (boundary: Boundary | null) => void;

  // History
  history: HistoryEntry[];
  addHistoryEntry: (boundary: Boundary) => void;
  clearHistory: () => void;

  // Simulation
  isSimulating: boolean;
  simulationSpeed: number;
  setSimulating: (v: boolean) => void;
  setSimulationSpeed: (speed: number) => void;

  // Debug
  polyChecks: number;
  setPolyChecks: (n: number) => void;
  gpsError: string | null;
  setGpsError: (err: string | null) => void;
  gpsDebugStats: GpsDebugStats | null;
  setGpsDebugStats: (stats: GpsDebugStats) => void;

  // View
  currentView: 'main' | 'download' | 'settings';
  setCurrentView: (view: 'main' | 'download' | 'settings') => void;
}

export const useAppStore = create<AppState>((set) => ({
  gpsStatus: 'off',
  position: null,
  setGpsStatus: (gpsStatus) => set({ gpsStatus }),
  setPosition: (position) => set({ position }),

  activeMode: 'state',
  setActiveMode: (activeMode) => set({ activeMode }),

  currentTown: null,
  currentCounty: null,
  currentState: null,
  setCurrentLocation: (type, boundary) =>
    set((state) => {
      const update: Partial<AppState> = {};
      if (type === 'town') update.currentTown = boundary;
      if (type === 'county') update.currentCounty = boundary;
      if (type === 'state') update.currentState = boundary;

      // Update active card if this is the active mode
      if (type === state.activeMode && boundary) {
        update.activeCard = boundary;
        update.cardKey = Date.now();
      }

      // Add to history
      if (boundary) {
        const entry: HistoryEntry = {
          id: `${boundary.id}-${Date.now()}`,
          boundary,
          enteredAt: Date.now(),
        };
        update.history = [...state.history, entry];
      }

      return update;
    }),

  activeCard: null,
  cardKey: 0,
  setActiveCard: (activeCard) => set({ activeCard, cardKey: Date.now() }),

  history: [],
  addHistoryEntry: (boundary) =>
    set((state) => ({
      history: [
        ...state.history,
        { id: `${boundary.id}-${Date.now()}`, boundary, enteredAt: Date.now() },
      ],
    })),
  clearHistory: () => set({ history: [] }),

  isSimulating: false,
  simulationSpeed: 1,
  setSimulating: (isSimulating) => set({ isSimulating }),
  setSimulationSpeed: (simulationSpeed) => set({ simulationSpeed }),

  polyChecks: 0,
  setPolyChecks: (polyChecks) => set({ polyChecks }),
  gpsError: null,
  setGpsError: (gpsError) => set({ gpsError }),
  gpsDebugStats: null,
  setGpsDebugStats: (gpsDebugStats) => set({ gpsDebugStats }),

  currentView: 'main',
  setCurrentView: (currentView) => set({ currentView }),
}));
