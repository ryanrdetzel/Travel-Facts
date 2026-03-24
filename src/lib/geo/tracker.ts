import type { GpsPosition, GpsStatus } from '../types';

export interface TrackerCallbacks {
  onPosition: (pos: GpsPosition) => void;
  onStatusChange: (status: GpsStatus) => void;
  onError: (message: string) => void;
}

export class GpsTracker {
  private watchId: number | null = null;
  private callbacks: TrackerCallbacks;
  private maxAccuracy: number;

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

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed } = position.coords;

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
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.callbacks.onStatusChange('error');
            this.callbacks.onError('Location permission denied');
            break;
          case error.POSITION_UNAVAILABLE:
            this.callbacks.onStatusChange('error');
            this.callbacks.onError('Location unavailable');
            break;
          case error.TIMEOUT:
            // Timeout is non-fatal — watchPosition keeps trying
            this.callbacks.onError('Location request timed out, retrying…');
            break;
          default:
            this.callbacks.onStatusChange('error');
            this.callbacks.onError('Unknown location error');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 5000,
      }
    );
  }

  stop() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.callbacks.onStatusChange('off');
    }
  }

  isRunning(): boolean {
    return this.watchId !== null;
  }
}
