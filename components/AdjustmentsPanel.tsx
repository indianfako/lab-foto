import React from 'react';
import { Sliders, RotateCcw, Sun, Contrast, Droplets, Sparkles, CircleDot, Flame } from 'lucide-react';
import { StudioAdjustments } from '../types';

interface AdjustmentsPanelProps {
  adjustments: StudioAdjustments;
  onChange: React.Dispatch<React.SetStateAction<StudioAdjustments>>;
  onReset: () => void;
}

const AdjustmentsPanel: React.FC<AdjustmentsPanelProps> = ({
  adjustments,
  onChange,
  onReset
}) => {
  const update = (key: keyof StudioAdjustments, val: number) => {
    onChange(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-1 border-b border-white/10">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <span>Laboratórne doladenie (Live Lab)</span>
          </h3>
          <p className="text-[10px] text-gray-400">
            Úpravy sa aplikujú okamžite na zobrazený výsledok a prenesú sa do sťahovaného súboru.
          </p>
        </div>
        <button
          onClick={onReset}
          className="text-[10px] font-semibold text-gray-400 hover:text-white flex items-center gap-1 p-1 rounded hover:bg-white/10 transition-colors"
          title="Resetovať všetky úpravy"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        
        {/* Brightness */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Jas (Brightness)</span>
            </span>
            <span className="font-mono text-gray-400 text-[11px]">
              {Math.round(adjustments.brightness * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.01"
            value={adjustments.brightness}
            onChange={(e) => update('brightness', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Contrast */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300 flex items-center gap-1.5">
              <Contrast className="w-3.5 h-3.5 text-blue-400" />
              <span>Kontrast (Contrast)</span>
            </span>
            <span className="font-mono text-gray-400 text-[11px]">
              {Math.round(adjustments.contrast * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.01"
            value={adjustments.contrast}
            onChange={(e) => update('contrast', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Saturation */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-purple-400" />
              <span>Sýtosť farieb (Saturation)</span>
            </span>
            <span className="font-mono text-gray-400 text-[11px]">
              {Math.round(adjustments.saturation * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.02"
            value={adjustments.saturation}
            onChange={(e) => update('saturation', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        {/* Warmth */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Teplota tónu (Warmth / Hue)</span>
            </span>
            <span className="font-mono text-gray-400 text-[11px]">
              {adjustments.warmth > 0 ? `+${adjustments.warmth}` : adjustments.warmth}°
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="1"
            value={adjustments.warmth}
            onChange={(e) => update('warmth', parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>

        {/* Film Grain */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Organické filmové zrno (Grain)</span>
            </span>
            <span className="font-mono text-gray-400 text-[11px]">
              {adjustments.grain}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={adjustments.grain}
            onChange={(e) => update('grain', parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
        </div>

        {/* Vignette */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300 flex items-center gap-1.5">
              <CircleDot className="w-3.5 h-3.5 text-teal-400" />
              <span>Ateliérová vinetácia (Vignette)</span>
            </span>
            <span className="font-mono text-gray-400 text-[11px]">
              {Math.round(adjustments.vignette * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={adjustments.vignette}
            onChange={(e) => update('vignette', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
          />
        </div>

        {/* Sepia */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300 flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#8C7A6B] inline-block" />
              <span>Sepiové tónovanie (Sepia)</span>
            </span>
            <span className="font-mono text-gray-400 text-[11px]">
              {adjustments.sepia}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={adjustments.sepia}
            onChange={(e) => update('sepia', parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-stone-500"
          />
        </div>

      </div>
    </div>
  );
};

export default AdjustmentsPanel;
