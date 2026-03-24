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

        this.callbacks.onStatusChange('active');
        this.callbacks.onPosition({
          latitude,
          longitude,
          accuracy,
          speed,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        this.callbacks.onStatusChange('error');
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.callbacks.onError('Location permission denied');
            break;
          case error.POSITION_UNAVAILABLE:
            this.callbacks.onError('Location unavailable');
            break;
          case error.TIMEOUT:
            this.callbacks.onError('Location request timed out');
            break;
          default:
            this.callbacks.onError('Unknown location error');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 2000,
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
