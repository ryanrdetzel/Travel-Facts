import { useAppStore } from '../store';

export function LocationBanner() {
  const { activeCard, activeMode, currentCounty, currentState } = useAppStore();

  if (!activeCard) {
    return (
      <div className="text-center py-8 px-4">
        <p className="text-slate-500 font-display text-lg">Waiting for location...</p>
        <p className="text-slate-600 text-sm mt-2">
          Start GPS tracking or run a simulation to detect boundaries
        </p>
      </div>
    );
  }

  // Determine subtitle based on active mode
  let subtitle = '';
  if (activeMode === 'town') {
    const parts = [];
    if (currentCounty) parts.push(currentCounty.name);
    if (currentState) parts.push(currentState.name);
    subtitle = parts.join(', ');
  } else if (activeMode === 'county') {
    if (currentState) subtitle = currentState.name;
  }

  const badge = activeMode.charAt(0).toUpperCase() + activeMode.slice(1);

  return (
    <div className="text-center py-4 px-4 animate-fade-in">
      <p className="text-gold text-xs uppercase tracking-widest font-medium mb-1">
        Now Entering
      </p>
      <h1 className="font-display text-3xl text-white mb-1">{activeCard.name}</h1>
      {subtitle && (
        <p className="text-slate-400 text-sm">{subtitle}</p>
      )}
      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-gold/15 text-gold border border-gold/30">
        {badge}
      </span>
    </div>
  );
}
