import { useAppStore } from '../store';
import type { BoundaryType } from '../lib/types';

const modes: { value: BoundaryType; label: string }[] = [
  { value: 'town', label: 'Town' },
  { value: 'county', label: 'County' },
  { value: 'state', label: 'State' },
];

export function ModeToggle() {
  const { activeMode, setActiveMode } = useAppStore();

  return (
    <div className="flex items-center justify-center gap-1 px-4 py-2 bg-navy-800/50">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => setActiveMode(mode.value)}
          className={`
            px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border
            ${
              activeMode === mode.value
                ? 'bg-gold text-navy-900 border-gold'
                : 'bg-transparent text-slate-400 border-navy-600 hover:border-gold-dark hover:text-slate-200'
            }
          `}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
