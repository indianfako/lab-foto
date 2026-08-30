import React, { useRef, ChangeEvent } from 'react';
import { 
  Combine, 
  Upload, 
  X, 
  FileImage, 
  Users, 
  Sparkles, 
  SunMedium, 
  Layers,
  Wand2,
  Check
} from 'lucide-react';
import { MergeOptions, MergeType } from '../types';

interface MergeControlsProps {
  options: MergeOptions;
  onChange: React.Dispatch<React.SetStateAction<MergeOptions>>;
  primaryImage: string | null;
  secondaryImage: string | null;
  onUploadPrimary: (base64: string) => void;
  onUploadSecondary: (base64: string) => void;
  onClearPrimary: () => void;
  onClearSecondary: () => void;
  onSelectSample: (slot: 'primary' | 'secondary') => void;
}

const MERGE_TYPES: {
  id: MergeType;
  title: string;
  desc: string;
  icon: any;
}[] = [
  {
    id: 'people_group',
    title: 'Spoločný portrét osôb',
    desc: 'Spojí dve samostatné osoby do jednej prirodzenej rodinnej či párovej fotografie.',
    icon: Users
  },
  {
    id: 'subject_background',
    title: 'Vloženie osoby do pozadia',
    desc: 'Osobu z Foto 1 vyreže a realisticky umiestni do prostredia z Foto 2 so zladeným svetlom.',
    icon: Layers
  },
  {
    id: 'style_transfer',
    title: 'Prenos štýlu a atmosféry',
    desc: 'Prekreslí Foto 1 do vizuálneho a svetelného štýlu Foto 2.',
    icon: Sparkles
  },
  {
    id: 'artistic_blend',
    title: 'Umelecká dvojexpozícia',
    desc: 'Vytvorí kreatívnu výtvarnú fúziu a poetické prelínanie oboch záberov.',
    icon: Wand2
  },
  {
    id: 'custom_prompt',
    title: 'Vlastná AI fúzia (Prompt)',
    desc: 'Prepojí fotografie presne podľa vášho detailného textového zadania.',
    icon: Combine
  }
];

const SUGGESTED_PROMPTS = [
  'Vytvor spoločný štúdiový rodinný portrét oboch osôb stojacich vedľa seba v teplom svetle',
  'Umiestni osobu z prvej fotky pred scenériu hôr so zapadajúcim slnkom a prirodzeným tieňom',
  'Posaď oboch ľudí za stôl v historickej kaviarni pri šálke kávy v štýle 1950s',
  'Premeň kompozíciu na umeleckú dvojexpozíciu s prelínaním portrétu a architektúry'
];

const MergeControls: React.FC<MergeControlsProps> = ({
  options,
  onChange,
  primaryImage,
  secondaryImage,
  onUploadPrimary,
  onUploadSecondary,
  onClearPrimary,
  onClearSecondary,
  onSelectSample
}) => {
  const file1Ref = useRef<HTMLInputElement>(null);
  const file2Ref = useRef<HTMLInputElement>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>, onUpload: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Dual Upload Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
          <Combine className="w-3.5 h-3.5 text-purple-400" />
          <span>Vstupné fotografie pre zlúčenie</span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          {/* Photo 1 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-gray-300">Foto 1 (Hlavná)</span>
              {primaryImage && (
                <button
                  onClick={onClearPrimary}
                  className="text-red-400 hover:text-red-300 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {primaryImage ? (
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-purple-500/50 bg-black">
                <img src={primaryImage} alt="Foto 1" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-[4/3] border border-dashed border-white/20 rounded-lg p-2 flex flex-col items-center justify-center gap-1 bg-black/40 hover:border-purple-500/50 transition-all">
                <button
                  onClick={() => file1Ref.current?.click()}
                  className="text-[11px] font-medium text-purple-300 hover:underline flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Nahrať</span>
                </button>
                <button
                  onClick={() => onSelectSample('primary')}
                  className="text-[10px] text-gray-400 hover:text-white"
                >
                  Zo vzorov
                </button>
                <input
                  type="file"
                  ref={file1Ref}
                  onChange={(e) => handleFile(e, onUploadPrimary)}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            )}
          </div>

          {/* Photo 2 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-gray-300">Foto 2 (Sekundárna)</span>
              {secondaryImage && (
                <button
                  onClick={onClearSecondary}
                  className="text-red-400 hover:text-red-300 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {secondaryImage ? (
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-purple-500/50 bg-black">
                <img src={secondaryImage} alt="Foto 2" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-[4/3] border border-dashed border-white/20 rounded-lg p-2 flex flex-col items-center justify-center gap-1 bg-black/40 hover:border-purple-500/50 transition-all">
                <button
                  onClick={() => file2Ref.current?.click()}
                  className="text-[11px] font-medium text-purple-300 hover:underline flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Nahrať</span>
                </button>
                <button
                  onClick={() => onSelectSample('secondary')}
                  className="text-[10px] text-gray-400 hover:text-white"
                >
                  Zo vzorov
                </button>
                <input
                  type="file"
                  ref={file2Ref}
                  onChange={(e) => handleFile(e, onUploadSecondary)}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Merge Type */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
          Režim kompozície a zlúčenia
        </label>

        <div className="space-y-1.5">
          {MERGE_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = options.mergeType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => onChange(prev => ({ ...prev, mergeType: type.id }))}
                className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start gap-2.5 ${
                  isSelected
                    ? 'border-purple-500 bg-purple-950/40 shadow-sm shadow-purple-500/20'
                    : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className={`p-1.5 rounded-md ${isSelected ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                      {type.title}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                  </div>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    {type.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prompt Directive */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center justify-between">
          <span>Inštrukcie pre syntézu (Prompt)</span>
        </label>

        <textarea
          value={options.prompt}
          onChange={(e) => onChange(prev => ({ ...prev, prompt: e.target.value }))}
          placeholder="Podrobne popíšte, ako má AI prepojiť Foto 1 a Foto 2..."
          rows={3}
          className="w-full text-xs bg-black/50 border border-white/10 rounded-lg p-2.5 text-gray-200 placeholder-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
        />

        {/* Quick prompt suggestions */}
        <div className="space-y-1 pt-1">
          <span className="text-[10px] text-gray-500">Rýchle šablóny:</span>
          <div className="flex flex-col gap-1">
            {SUGGESTED_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => onChange(prev => ({ ...prev, prompt: p }))}
                className="text-left text-[10px] text-gray-400 hover:text-purple-300 truncate bg-white/5 p-1 rounded hover:bg-white/10 transition-colors"
              >
                • {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lighting Match Toggle */}
      <div className="bg-black/40 border border-white/10 rounded-lg p-3">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="space-y-0.5 pr-2">
            <span className="text-xs font-semibold text-gray-200 group-hover:text-white flex items-center gap-1.5">
              <SunMedium className="w-3.5 h-3.5 text-amber-400" />
              <span>Harmonizácia svetla a tieňov</span>
            </span>
            <p className="text-[10px] text-gray-400">
              Automaticky zjednotí farebnú teplotu a smer tieňov na oboch subjektoch.
            </p>
          </div>
          <input
            type="checkbox"
            checked={options.matchLighting}
            onChange={(e) => onChange(prev => ({ ...prev, matchLighting: e.target.checked }))}
            className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-purple-600 focus:ring-purple-500 cursor-pointer"
          />
        </label>
      </div>

    </div>
  );
};

export default MergeControls;
