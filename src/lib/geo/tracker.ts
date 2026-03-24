import type { GpsPosition, GpsStatus } from '../types';

export interface TrackerCallbacks {
  onPosition: (pos: GpsPosition) => void;
  onStatusChange: (status: GpsStatus) => void;
  onError: (message: string) => void;
}

/** How long to wait before assuming watchPosition has stalled. */
const STALE_THRESHOLD_MS = 15_000;
/** How often to check for stale positions. */
const KEEPALIVE_INTERVAL_MS = 10_000;

export class GpsTracker {
  private watchId: number | null = null;
  private callbacks: TrackerCallbacks;
  private maxAccuracy: number;
  private lastFixTime = 0;
  private keepaliveTimer: ReturnType<typeof setInterval> | null = null;

  constructor(callbacks: TrackerCallbacks, maxAccuracy = 500) {
    this.callbacks = callbacks;
    this.maxAccuracy = maxAccuracy;
  }

  start() {
    if (!navigator.geolocation) {
      this.callbacks.onError('Geolocation is not supported by this browser');
      this.callbacks.onStatusChange('error');
      return;
    }

    this.callbacks.onStatusChange('acquiring');
    this.startWatch();
    this.startKeepalive();
  }

  private startWatch() {
    // Clear any existing watch before creating a new one
    this.clearWatch();

    this.watchId = navigator.geolocation.watchPosition(
      (position) => this.handlePosition(position),
      (error) => this.handleError(error),
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 5000,
      }
    );
  }

  private handlePosition(position: GeolocationPosition) {
    const { latitude, longitude, accuracy, speed } = position.coords;
    this.lastFixTime = Date.now();

    if (accuracy > this.maxAccuracy) {
      return; // Skip inaccurate readings
    }

    // Clear any previous error on successful fix
    this.callbacks.onError('');
    this.callbacks.onStatusChange('active');
    this.callbacks.onPosition({
      latitude,
      longitude,
      accuracy,
      speed: speed != null ? speed * 2.23694 : null, // Convert m/s to mph
      timestamp: position.timestamp,
    });
  }

  private handleError(error: GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        this.callbacks.onStatusChange('error');
        this.callbacks.onError('Location permission denied');
        // Permission denied is fatal — stop everything
        this.stopKeepalive();
        break;
      case error.POSITION_UNAVAILABLE:
        // Non-fatal on mobile — watchPosition may recover, keepalive will help
        this.callbacks.onError('Location temporarily unavailable, retrying…');
        break;
      case error.TIMEOUT:
        // Timeout is non-fatal — watchPosition keeps trying
        this.callbacks.onError('Location request timed out, retrying…');
        break;
      default:
        this.callbacks.onError('Unknown location error');
    }
  }

  /**
   * Periodically checks if watchPosition has gone silent.
   * If no fix has arrived recently, requests a one-shot position as a nudge
   * and restarts watchPosition to recover from stalls.
   */
  private startKeepalive() {
    this.stopKeepalive();

    this.keepaliveTimer = setInterval(() => {
      if (this.watchId === null) return; // Not tracking

      const elapsed = Date.now() - this.lastFixTime;
      if (elapsed > STALE_THRESHOLD_MS) {
        // watchPosition appears stalled — restart it and try a one-shot
        this.startWatch();
        navigator.geolocation.getCurrentPosition(
          (position) => this.handlePosition(position),
          () => {}, // Ignore errors from one-shot fallback
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      }
    }, KEEPALIVE_INTERVAL_MS);
  }

  private stopKeepalive() {
    if (this.keepaliveTimer !== null) {
      clearInterval(this.keepaliveTimer);
      this.keepaliveTimer = null;
    }
  }

  private clearWatch() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  stop() {
    this.clearWatch();
    this.stopKeepalive();
    this.callbacks.onStatusChange('off');
  }

  isRunning(): boolean {
    return this.watchId !== null;
  }
}
