import React from 'react';
import { Palette, Check, Sparkles, Wand2, ShieldAlert, FileImage } from 'lucide-react';
import { ColorizeOptions, ColorizePalette } from '../types';

interface ColorizeControlsProps {
  options: ColorizeOptions;
  onChange: React.Dispatch<React.SetStateAction<ColorizeOptions>>;
  onSelectSample?: () => void;
}

const PALETTE_OPTIONS: {
  id: ColorizePalette;
  name: string;
  nameSk: string;
  desc: string;
  colors: string[];
}[] = [
  {
    id: 'authentic_vintage',
    name: 'Authentic Period (1940-1960)',
    nameSk: 'Autentické dobové (1940-60)',
    desc: 'Prírodné tóny pleti, historické organické pigmenty a dobová farebnosť.',
    colors: ['#D4A373', '#FAEDCD', '#CCD5AE', '#E9EDC9']
  },
  {
    id: 'kodachrome',
    name: 'Kodachrome 64 Analog',
    nameSk: 'Analógový Kodachrome 64',
    desc: 'Sýte teplé červené, jantárové a azúrové tóny legendárneho filmu.',
    colors: ['#E63946', '#F4A261', '#E76F51', '#2A9D8F']
  },
  {
    id: 'vibrant_restored',
    name: 'Vibrant Restored',
    nameSk: 'Vysoké rozlíšenie & Živé tóny',
    desc: 'Krištáľovo čisté moderné farby s bohatým kontrastom a hĺbkou.',
    colors: ['#3A86FF', '#8338EC', '#FF006E', '#FB5607']
  },
  {
    id: 'soft_pastel',
    name: 'Soft Hand-Tinted Pastel',
    nameSk: 'Ručne kolorovaný pastel',
    desc: 'Jemné akvarelové lazúry, nostalgický vzhľad historických pohľadníc.',
    colors: ['#FDE2E4', '#FFCAD4', '#B5E2FA', '#EDDEA4']
  },
  {
    id: 'monochrome_tint',
    name: 'Platinum Palladium / Sepia',
    nameSk: 'Platinotypia / Teplá sepia',
    desc: 'Umelecká dvojtónová archiválna fotografia s hlbokým tónovaním.',
    colors: ['#3D342B', '#8C7A6B', '#D1C7BD', '#F7F4EB']
  }
];

const ColorizeControls: React.FC<ColorizeControlsProps> = ({
  options,
  onChange,
  onSelectSample
}) => {
  return (
    <div className="space-y-5">
      {/* Palette Selection */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span>Farebná paleta reštaurovania</span>
          </label>
        </div>

        <div className="space-y-2">
          {PALETTE_OPTIONS.map((pal) => {
            const isSelected = options.palette === pal.id;
            return (
              <button
                key={pal.id}
                onClick={() => onChange(prev => ({ ...prev, palette: pal.id }))}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-start justify-between ${
                  isSelected
                    ? 'border-blue-500 bg-blue-950/40 shadow-sm shadow-blue-500/20'
                    : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="space-y-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                      {pal.nameSk}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    {pal.desc}
                  </p>
                </div>

                <div className="flex -space-x-1 flex-shrink-0 pt-0.5">
                  {pal.colors.map((c, i) => (
                    <div
                      key={i}
                      className="w-3.5 h-3.5 rounded-full border border-black/50 shadow-xs"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Restoration Toggles */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
          <Wand2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Fyzické vylepšenia a opravy chýb</span>
        </label>

        <div className="space-y-2 bg-black/40 border border-white/10 rounded-lg p-3">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="space-y-0.5 pr-2">
              <span className="text-xs font-semibold text-gray-200 group-hover:text-white">
                Odstránenie škrabancov a prachu
              </span>
              <p className="text-[10px] text-gray-400">
                Opraví ryhy, praskliny, záhyby na papieri a filmový šum.
              </p>
            </div>
            <input
              type="checkbox"
              checked={options.repairScratches}
              onChange={(e) => onChange(prev => ({ ...prev, repairScratches: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </label>

          <div className="border-t border-white/5 pt-2">
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-semibold text-gray-200 group-hover:text-white">
                  Zostrenie tváre a očí
                </span>
                <p className="text-[10px] text-gray-400">
                  Vyčistí zreničky, mihalnice a textúru pokožky bez zmeny identity.
                </p>
              </div>
              <input
                type="checkbox"
                checked={options.enhanceFaces}
                onChange={(e) => onChange(prev => ({ ...prev, enhanceFaces: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </label>
          </div>

          <div className="border-t border-white/5 pt-2">
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-semibold text-gray-200 group-hover:text-white">
                  Redukcia filmového šumu skenovania
                </span>
                <p className="text-[10px] text-gray-400">
                  Vyhladí digitálny šum pri zachovaní organickej fotografickej textúry.
                </p>
              </div>
              <input
                type="checkbox"
                checked={options.reduceNoise}
                onChange={(e) => onChange(prev => ({ ...prev, reduceNoise: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Custom Color Notes */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Vlastné pokyny k farbám (voliteľné)</span>
          </span>
          <span className="text-[10px] text-gray-500 lowercase">napr. modré oči, červené šaty</span>
        </label>

        <textarea
          value={options.customColorNotes}
          onChange={(e) => onChange(prev => ({ ...prev, customColorNotes: e.target.value }))}
          placeholder="Napr.: Pán má tmavomodrý kabát so zlatými gombíkmi, dáma smaragdové šaty a gaštanové vlasy..."
          rows={2}
          className="w-full text-xs bg-black/50 border border-white/10 rounded-lg p-2.5 text-gray-200 placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
        />
      </div>
    </div>
  );
};

export default ColorizeControls;
