import { useEffect, useState } from 'react';
import { getAllPackCodes, deletePack } from '../lib/storage/packStore';

const ALL_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' }, { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
];

export function PackManager() {
  const [cachedPacks, setCachedPacks] = useState<string[]>([]);

  useEffect(() => {
    getAllPackCodes().then(setCachedPacks);
  }, []);

  const handleDelete = async (code: string) => {
    await deletePack(code);
    setCachedPacks((prev) => prev.filter((c) => c !== code));
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <h2 className="font-display text-xl text-white mb-1">State Packs</h2>
      <p className="text-xs text-slate-500 mb-4">
        Download boundary data for offline use. Currently using built-in sample data for the AZ→MA corridor.
      </p>

      <div className="space-y-1">
        {ALL_STATES.map((state) => {
          const isCached = cachedPacks.includes(state.code);
          return (
            <div
              key={state.code}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-navy-800/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-500 w-6">{state.code}</span>
                <span className="text-sm text-slate-200">{state.name}</span>
              </div>
              <div>
                {isCached ? (
                  <button
                    onClick={() => handleDelete(state.code)}
                    className="px-3 py-1 rounded text-[10px] font-medium bg-red-500/15 text-red-400 border border-red-500/30 cursor-pointer hover:bg-red-500/25 transition-colors"
                  >
                    Delete
                  </button>
                ) : (
                  <span className="px-3 py-1 rounded text-[10px] font-medium text-slate-600 border border-navy-600">
                    Not available
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
