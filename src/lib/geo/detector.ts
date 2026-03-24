import RBush from 'rbush';
import { pointInPolygon } from './pip';
import type { Boundary, BoundaryType, RBushItem } from '../types';

const DEBOUNCE_MS = 3500;

export class BoundaryDetector {
  private indices: Record<BoundaryType, RBush<RBushItem>> = {
    town: new RBush<RBushItem>(),
    county: new RBush<RBushItem>(),
    state: new RBush<RBushItem>(),
  };
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingMatch: Boundary | null = null;
  private currentLocations: Record<BoundaryType, Boundary | null> = {
    town: null,
    county: null,
    state: null,
  };
  private onTransition: ((boundary: Boundary, type: BoundaryType) => void) | null = null;

  setTransitionCallback(cb: (boundary: Boundary, type: BoundaryType) => void) {
    this.onTransition = cb;
  }

  loadBoundaries(boundaries: Boundary[]) {
    // Clear existing
    this.indices.town.clear();
    this.indices.county.clear();
    this.indices.state.clear();

    const items: Record<BoundaryType, RBushItem[]> = { town: [], county: [], state: [] };

    for (const b of boundaries) {
      items[b.type].push({
        minX: b.bbox[0],
        minY: b.bbox[1],
        maxX: b.bbox[2],
        maxY: b.bbox[3],
        boundary: b,
      });
    }

    this.indices.town.load(items.town);
    this.indices.county.load(items.county);
    this.indices.state.load(items.state);
  }

  addBoundaries(boundaries: Boundary[]) {
    for (const b of boundaries) {
      this.indices[b.type].insert({
        minX: b.bbox[0],
        minY: b.bbox[1],
        maxX: b.bbox[2],
        maxY: b.bbox[3],
        boundary: b,
      });
    }
  }

  findLocation(lat: number, lng: number, type: BoundaryType): Boundary | null {
    const candidates = this.indices[type].search({
      minX: lng,
      minY: lat,
      maxX: lng,
      maxY: lat,
    });

    for (const c of candidates) {
      if (pointInPolygon([lng, lat], c.boundary.polygon)) {
        return c.boundary;
      }
    }
    return null;
  }

  /**
   * Process a GPS position update. Checks all granularity levels.
   * Returns the number of polygon checks performed.
   */
  update(lat: number, lng: number, activeMode: BoundaryType): number {
    let checks = 0;

    // Always check all three levels for subtitles
    const types: BoundaryType[] = ['state', 'county', 'town'];

    for (const type of types) {
      const candidates = this.indices[type].search({
        minX: lng,
        minY: lat,
        maxX: lng,
        maxY: lat,
      });
      checks += candidates.length;

      let match: Boundary | null = null;
      for (const c of candidates) {
        if (pointInPolygon([lng, lat], c.boundary.polygon)) {
          match = c.boundary;
          break;
        }
      }

      if (match && match.id !== this.currentLocations[type]?.id) {
        if (type === activeMode) {
          // Debounce the active mode transition
          this.startDebounce(match, type, lat, lng);
        } else {
          // Immediately update non-active modes (subtitles)
          this.currentLocations[type] = match;
          this.onTransition?.(match, type);
        }
      } else if (!match && this.currentLocations[type]) {
        this.currentLocations[type] = null;
      }
    }

    return checks;
  }

  private startDebounce(match: Boundary, type: BoundaryType, lat: number, lng: number) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.pendingMatch = match;

    this.debounceTimer = setTimeout(() => {
      // Re-verify position
      const recheck = this.findLocation(lat, lng, type);
      if (recheck?.id === match.id) {
        this.currentLocations[type] = match;
        this.onTransition?.(match, type);
      }
      this.pendingMatch = null;
      this.debounceTimer = null;
    }, DEBOUNCE_MS);
  }

  getCurrentLocation(type: BoundaryType): Boundary | null {
    return this.currentLocations[type];
  }

  getPendingMatch(): Boundary | null {
    return this.pendingMatch;
  }

  getCandidateCount(type: BoundaryType): number {
    return this.indices[type].all().length;
  }

  destroy() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }
}
