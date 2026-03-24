import { useAppStore } from '../store';

export function InfoCard() {
  const { activeCard, cardKey } = useAppStore();

  if (!activeCard) return null;

  const { facts } = activeCard;

  const gridItems: { label: string; value: string }[] = [];
  if (facts.population) gridItems.push({ label: 'Population', value: facts.population });
  if (facts.founded) gridItems.push({ label: 'Founded', value: facts.founded });
  if (facts.statehood) gridItems.push({ label: 'Statehood', value: facts.statehood });
  if (facts.capital) gridItems.push({ label: 'Capital', value: facts.capital });
  if (facts.countySeat) gridItems.push({ label: 'County Seat', value: facts.countySeat });
  if (facts.elevation) gridItems.push({ label: 'Elevation', value: facts.elevation });
  if (facts.area) gridItems.push({ label: 'Area', value: facts.area });
  if (facts.nickname) gridItems.push({ label: 'Nickname', value: facts.nickname });

  return (
    <div key={cardKey} className="mx-4 animate-slide-up">
      <div className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
        {/* Fact grid */}
        {gridItems.length > 0 && (
          <div className="grid grid-cols-2 gap-px bg-navy-600">
            {gridItems.map((item) => (
              <div key={item.label} className="bg-navy-800 px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-slate-200">{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* History blurb */}
        {facts.history && (
          <div className="px-4 py-4 border-t border-navy-600">
            <p className="text-sm leading-relaxed text-slate-300">{facts.history}</p>
          </div>
        )}
      </div>
    </div>
  );
}
