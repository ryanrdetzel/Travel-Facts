import { useAppStore } from '../store';

export function HistoryLog() {
  const { history } = useAppStore();

  if (history.length === 0) return null;

  // Show most recent first, limit to 50
  const entries = [...history].reverse().slice(0, 50);

  return (
    <div className="px-4 pt-4 pb-2">
      <h2 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
        Boundary Crossings
      </h2>
      <div className="space-y-1">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center gap-3 py-2 px-3 rounded-lg bg-navy-800/50 animate-fade-in"
          >
            <div
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                entry.boundary.type === 'state'
                  ? 'bg-gold'
                  : entry.boundary.type === 'county'
                  ? 'bg-blue-400'
                  : 'bg-green-400'
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-200 truncate">{entry.boundary.name}</p>
              <p className="text-[10px] text-slate-500">
                {entry.boundary.facts.population
                  ? `Pop. ${entry.boundary.facts.population}`
                  : entry.boundary.type}
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-600 flex-shrink-0">
              {new Date(entry.enteredAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
