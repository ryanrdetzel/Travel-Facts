export type BoundaryType = 'town' | 'county' | 'state';

export type GpsStatus = 'off' | 'acquiring' | 'active' | 'error';

export interface BoundaryFacts {
  population?: string;
  founded?: string;
  statehood?: string;
  capital?: string;
  countySeat?: string;
  elevation?: string;
  area?: string;
  nickname?: string;
  history: string;
}

export interface Boundary {
  id: string;
  name: string;
  type: BoundaryType;
  stateCode?: string;
  countyName?: string;
  polygon: [number, number][][]; // Array of rings, each ring is [lng, lat][]
  bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  facts: BoundaryFacts;
}

export interface StatePack {
  stateCode: string;
  generatedAt: string;
  boundaries: {
    states: Boundary[];
    counties: Boundary[];
    towns: Boundary[];
  };
}

export interface GpsPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number | null;
  timestamp: number;
}

export interface HistoryEntry {
  id: string;
  boundary: Boundary;
  enteredAt: number;
  exitedAt?: number;
}

export interface SimulationWaypoint {
  lat: number;
  lng: number;
  label?: string;
}

export interface RBushItem {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  boundary: Boundary;
}
