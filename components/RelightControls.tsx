import React from 'react';
import { Sun, Check, Zap, Sparkles, Moon, Flame } from 'lucide-react';
import { LightingProfile } from '../types';

interface RelightControlsProps {
  profile: LightingProfile;
  onChange: (profile: LightingProfile) => void;
}

const LIGHTING_PROFILES: {
  id: LightingProfile;
  name: string;
  nameSk: string;
  desc: string;
  badge: string;
  color: string;
}[] = [
  {
    id: 'rembrandt',
    name: 'Rembrandt 45° Key',
    nameSk: 'Klasické Rembrandtovo svetlo',
    desc: 'Ikonický svetelný trojuholník pod okom na zatienenej strane líca, plastické filmové tiene.',
    badge: 'Ateliérová klasika',
    color: 'from-amber-700 to-yellow-600'
  },
  {
    id: 'high_key',
    name: 'High-Key Beauty Dish',
    nameSk: 'High-Key / Beauty portrét',
    desc: 'Veľmi svetlé, čisté, žiarivé difúzne svetlo s minimom tieňov pre modernú módnu fotografiu.',
    badge: 'Glamour & Móda',
    color: 'from-blue-200 to-slate-100'
  },
  {
    id: 'cinematic_low',
    name: 'Cinematic Low-Key Noir',
    nameSk: 'Filmový Low-Key / Noir',
    desc: 'Tmavá dramatická atmosféra, ostré obrysové svetlo (rim light) vykresľujúce líniu brady a vlasov.',
    badge: 'Film & Dráma',
    color: 'from-slate-800 to-indigo-950'
  },
  {
    id: 'golden_hour',
    name: 'Golden Hour Sunset',
    nameSk: 'Zlatá hodinka (Západ slnka)',
    desc: 'Teplé bočné zlatisté slnečné lúče, jemné odlesky vo vlasoch a príjemná prirodzená atmosféra.',
    badge: 'Prírodné svetlo',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'cyberpunk_neon',
    name: 'Cyberpunk Neon Split',
    nameSk: 'Kyberpunkové neónové svetlo',
    desc: 'Dvojfarebné osvetlenie s výrazným azúrovým a purpurovým / jantárovým protisvetlom.',
    badge: 'Futurizmus',
    color: 'from-cyan-500 to-pink-500'
  },
  {
    id: 'softbox_studio',
    name: 'Octabox Commercial',
    nameSk: 'Veľký štúdiový Octabox',
    desc: 'Jemné plynulé prechody tieňov, profesionálny komerčný vzhľad s čistými odleskami v očiach.',
    badge: 'Komerčné štúdio',
    color: 'from-sky-400 to-blue-600'
  },
  {
    id: 'dramatic_split',
    name: 'Dramatic Split Chiaroscuro',
    nameSk: 'Dramatické polovičné svetlo (Split)',
    desc: 'Presná polovica tváre v plnom svetle a druhá polovica ponorená v hlbokom tieni.',
    badge: 'Vysoký kontrast',
    color: 'from-stone-900 to-amber-200'
  },
  {
    id: 'neutral',
    name: 'Neutral Lab Lighting',
    nameSk: 'Neutrálne laboratórne osvetlenie',
    desc: 'Rovnomerné bezestieňové nasvietenie pre maximálnu čitateľnosť detailov a textúr.',
    badge: 'Technický štandard',
    color: 'from-gray-400 to-gray-200'
  }
];

const RelightControls: React.FC<RelightControlsProps> = ({ profile, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-yellow-400" />
          <span>Voľba štúdiového osvetlenia</span>
        </label>
        <p className="text-[11px] text-gray-400 mt-1">
          AI prepočíta trojrozmernú geometriu tváre a simuluje nové svetelné zdroje, odlesky a tiene.
        </p>
      </div>

      <div className="space-y-2">
        {LIGHTING_PROFILES.map((p) => {
          const isSelected = profile === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all flex items-start justify-between ${
                isSelected
                  ? 'border-yellow-500 bg-yellow-950/30 shadow-sm shadow-yellow-500/20'
                  : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="space-y-1 pr-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                    {p.nameSk}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/10 text-gray-300 font-mono">
                    {p.badge}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 leading-tight">
                  {p.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-tr ${p.color} border border-white/20 shadow-xs`} />
                {isSelected && <Check className="w-3.5 h-3.5 text-yellow-400" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RelightControls;
