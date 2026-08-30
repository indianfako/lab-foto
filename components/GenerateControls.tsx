import React from 'react';
import { Sparkles, Sun, Crop, Check, Lightbulb } from 'lucide-react';
import { AspectRatio, LightingProfile } from '../types';

interface GenerateControlsProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ar: AspectRatio) => void;
  profile: LightingProfile;
  onProfileChange: (profile: LightingProfile) => void;
}

const ASPECT_RATIOS: { id: AspectRatio; label: string; iconRatio: string }[] = [
  { id: '1:1', label: '1:1 Štvorec', iconRatio: 'aspect-square' },
  { id: '3:4', label: '3:4 Portrét', iconRatio: 'aspect-[3/4]' },
  { id: '4:3', label: '4:3 Krajina', iconRatio: 'aspect-[4/3]' },
  { id: '9:16', label: '9:16 Príbeh', iconRatio: 'aspect-[9/16]' },
  { id: '16:9', label: '16:9 Širokouhlý', iconRatio: 'aspect-[16/9]' },
];

const LIGHTING_OPTIONS: { id: LightingProfile; name: string }[] = [
  { id: 'rembrandt', name: 'Rembrandt 45°' },
  { id: 'high_key', name: 'High Key Beauty' },
  { id: 'cinematic_low', name: 'Cinematic Noir' },
  { id: 'golden_hour', name: 'Golden Hour' },
  { id: 'cyberpunk_neon', name: 'Cyberpunk Neon' },
  { id: 'softbox_studio', name: 'Octabox Studio' },
  { id: 'dramatic_split', name: 'Split Light' },
  { id: 'neutral', name: 'Neutral Studio' }
];

const TEMPLATE_PROMPTS = [
  'Portrét charizmatickej ženy s vlnitými vlasmi a jemným úsmevom, historický fotoateliér 1940s',
  'Architektonický koncept modernej vily v horskom prostredí Gemera, drevené lamely, veľkoformátové sklo',
  'Filmový štúdiový portrét muža s fúzmi v koženej bunde s dramatickým bočným svetlom',
  'Vintage ateliérový portrét s jemnými pastelovými tónmi a prirodzeným mäkkým svetlom'
];

const GenerateControls: React.FC<GenerateControlsProps> = ({
  prompt,
  onPromptChange,
  aspectRatio,
  onAspectRatioChange,
  profile,
  onProfileChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Generovanie nového portrétu od nuly</span>
        </label>
        <p className="text-[11px] text-gray-400 mt-1">
          Zadajte textový popis. AI vygeneruje vysoko detailný ateliérový portrét s 85mm Prime optikou.
        </p>
      </div>

      {/* Text Prompt */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
          Popis portrétu alebo scény (Prompt)
        </label>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Napr.: Portrét architekta za rysovacou doskou s plánmi v historickom ateliéri..."
          rows={4}
          className="w-full text-xs bg-black/50 border border-white/10 rounded-lg p-2.5 text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none"
        />

        {/* Prompt Templates */}
        <div className="space-y-1 pt-1">
          <span className="text-[10px] text-gray-500 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span>Inšpiratívne námety:</span>
          </span>
          <div className="flex flex-col gap-1">
            {TEMPLATE_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => onPromptChange(p)}
                className="text-left text-[10px] text-gray-400 hover:text-emerald-300 truncate bg-white/5 p-1.5 rounded hover:bg-white/10 transition-colors"
              >
                • {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Aspect Ratio Selection */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
          <Crop className="w-3.5 h-3.5 text-blue-400" />
          <span>Pomer strán (Aspect Ratio)</span>
        </label>
        <div className="grid grid-cols-5 gap-1">
          {ASPECT_RATIOS.map((ar) => {
            const isSelected = aspectRatio === ar.id;
            return (
              <button
                key={ar.id}
                onClick={() => onAspectRatioChange(ar.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/40 text-white font-bold'
                    : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/20 hover:text-gray-200'
                }`}
              >
                <div className={`w-4 h-4 border border-current rounded-xs mb-1 ${ar.iconRatio}`} />
                <span className="text-[10px] font-mono">{ar.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lighting Style */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-yellow-400" />
          <span>Ateliérové svetlo</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {LIGHTING_OPTIONS.map((l) => {
            const isSelected = profile === l.id;
            return (
              <button
                key={l.id}
                onClick={() => onProfileChange(l.id)}
                className={`p-2 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/40 text-white'
                    : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/20 hover:text-gray-200'
                }`}
              >
                <span className="truncate text-[11px]">{l.name}</span>
                {isSelected && <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default GenerateControls;
