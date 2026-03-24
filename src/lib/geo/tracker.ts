import type { GpsDebugStats, GpsPosition, GpsStatus } from '../types';

export interface TrackerCallbacks {
  onPosition: (pos: GpsPosition) => void;
  onStatusChange: (status: GpsStatus) => void;
  onError: (message: string) => void;
  onDebugStats?: (stats: GpsDebugStats) => void;
}

/** Positions older than this are rejected as stale cache. */
const MAX_POSITION_AGE_MS = 10_000;
/** Polling interval for getCurrentPosition fallback. */
const POLL_INTERVAL_MS = 3_000;

export class GpsTracker {
  private watchId: number | null = null;
  private callbacks: TrackerCallbacks;
  private maxAccuracy: number;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private lastEmittedTimestamp = 0;
  private prevLat = 0;
  private prevLng = 0;
  private debugStats: GpsDebugStats = {
    rawCount: 0,
    filteredCount: 0,
    movedCount: 0,
    restartCount: 0,
    lastRawTime: 0,
    lastRawAccuracy: 0,
    lastRawLat: 0,
    lastRawLng: 0,
  };

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
    this.startPolling();
  }

  private startWatch() {
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

  private startPolling() {
    this.stopPolling();

    this.pollTimer = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => this.handlePosition(position),
        () => {}, // Ignore poll errors — watchPosition handles error reporting
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }, POLL_INTERVAL_MS);
  }

  private handlePosition(position: GeolocationPosition) {
    const { latitude, longitude, accuracy, speed } = position.coords;

    // Track every raw position for debug
    this.debugStats.rawCount++;
    this.debugStats.lastRawTime = Date.now();
    this.debugStats.lastRawAccuracy = accuracy;
    this.debugStats.lastRawLat = latitude;
    this.debugStats.lastRawLng = longitude;

    // Reject stale cached positions
    const age = Date.now() - position.timestamp;
    if (age > MAX_POSITION_AGE_MS) {
      this.debugStats.filteredCount++;
      this.emitDebugStats();
      return;
    }

    // Deduplicate: skip if we already processed this exact fix
    if (position.timestamp <= this.lastEmittedTimestamp) {
      this.emitDebugStats();
      return;
    }

    if (accuracy > this.maxAccuracy) {
      this.debugStats.filteredCount++;
      this.emitDebugStats();
      return;
    }

    // Check if position actually changed
    if (latitude !== this.prevLat || longitude !== this.prevLng) {
      this.debugStats.movedCount++;
      this.prevLat = latitude;
      this.prevLng = longitude;
    }

    this.lastEmittedTimestamp = position.timestamp;
    this.emitDebugStats();

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

  private emitDebugStats() {
    this.callbacks.onDebugStats?.({ ...this.debugStats });
  }

  private handleError(error: GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        this.callbacks.onStatusChange('error');
        this.callbacks.onError('Location permission denied');
        // Permission denied is fatal — stop everything
        this.stopPolling();
        break;
      case error.POSITION_UNAVAILABLE:
        this.callbacks.onError('Location temporarily unavailable, retrying…');
        break;
      case error.TIMEOUT:
        this.callbacks.onError('Location request timed out, retrying…');
        break;
      default:
        this.callbacks.onError('Unknown location error');
    }
  }

  private stopPolling() {
    if (this.pollTimer !== null) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
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
    this.stopPolling();
    this.callbacks.onStatusChange('off');
  }

  isRunning(): boolean {
    return this.watchId !== null || this.pollTimer !== null;
  }
}
