import { useGeoTracker } from '../hooks/useGeoTracker';
import { useAppStore } from '../store';

export function GpsControls() {
  const { start, stop } = useGeoTracker();
  const { gpsStatus, isSimulating } = useAppStore();

  if (isSimulating) return null;

  const isTracking = gpsStatus === 'active' || gpsStatus === 'acquiring';

  return (
    <div className="px-4 py-2">
      <button
        onClick={isTracking ? stop : start}
        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border ${
          isTracking
            ? 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25'
            : 'bg-gold/15 text-gold border-gold/30 hover:bg-gold/25'
        }`}
      >
        {isTracking ? 'Stop GPS Tracking' : 'Start GPS Tracking'}
      </button>
    </div>
  );
}
