import React from 'react';
import { Wand2, User, Shirt, Image as ImageIcon, Smile, Scissors, ShieldCheck } from 'lucide-react';
import { RetouchOptions } from '../types';

interface RetouchControlsProps {
  options: RetouchOptions;
  onChange: React.Dispatch<React.SetStateAction<RetouchOptions>>;
}

const ACTION_TYPES: {
  id: RetouchOptions['actionType'];
  label: string;
  desc: string;
  icon: any;
}[] = [
  {
    id: 'clothing',
    label: 'Zmena odevu & obleku',
    desc: 'Prezlečie osobu do dobového alebo moderného outfitu.',
    icon: Shirt
  },
  {
    id: 'background',
    label: 'Výmena pozadia',
    desc: 'Nahradí alebo upraví scénu za subjektom s adaptáciou svetla.',
    icon: ImageIcon
  },
  {
    id: 'hairstyle',
    label: 'Účes & farba vlasov',
    desc: 'Zmení strih, vlny, dĺžku alebo odtieň vlasov.',
    icon: Scissors
  },
  {
    id: 'expression',
    label: 'Výraz tváre & emócia',
    desc: 'Pridá jemný úsmev, vážny pohľad alebo zmenu smeru pohľadu.',
    icon: Smile
  },
  {
    id: 'custom',
    label: 'Vlastný retuš',
    desc: 'Akékoľvek špecifické vizuálne úpravy podľa textového zadania.',
    icon: Wand2
  }
];

const PRESET_PROMPTS: Record<RetouchOptions['actionType'], string[]> = {
  clothing: [
    'Prezleč osobu do elegantného tmavomodrého obleku z 1940s s bielou košeľou',
    'Prezleč osobu do hodvábnych večerných smaragdových šiat s perlovým náhrdelníkom',
    'Zmeň odev na ležérny pletený sveter v zemitých tónoch'
  ],
  background: [
    'Vymeň pozadie za historický kamenný ateliér s policami s knihami a teplým svetlom',
    'Umiestni subjekt do rozostreného zeleného parku so slnečným protisvetlom (bokeh)',
    'Nahraď pozadie za čisté minimalistické fotoplátno neutrálnej šedej farby'
  ],
  hairstyle: [
    'Zmeň účes na elegantné dobové vlny 1950s',
    'Pridaj hustejší moderný strih s prirodzeným leskom',
    'Zmeň farbu vlasov na teplý gaštanový odtieň'
  ],
  expression: [
    'Pridaj jemný, prirodzený, teplý úsmev s rozžiarenými očami',
    'Zmeň výraz na sebavedomý profesionálny pohľad do objektívu',
    'Vytvor zasnený jemný pohľad mierne do strany'
  ],
  custom: [
    'Vyčisti pamiatkové detaily, oživ farby a zjednoť tónovanie',
    'Pridaj jemný filmový zlatý závoj a vintage atmosféru'
  ]
};

const RetouchControls: React.FC<RetouchControlsProps> = ({ options, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
          <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Generatívny retuš a zmeny</span>
        </label>
        <p className="text-[11px] text-gray-400 mt-1">
          Vyberte kategóriu úpravy a popíšte požadovanú zmenu na fotografii.
        </p>
      </div>

      {/* Action Selector */}
      <div className="grid grid-cols-1 gap-1.5">
        {ACTION_TYPES.map((act) => {
          const Icon = act.icon;
          const isSelected = options.actionType === act.id;
          return (
            <button
              key={act.id}
              onClick={() => onChange(prev => ({ ...prev, actionType: act.id }))}
              className={`text-left p-2.5 rounded-lg border transition-all flex items-start gap-2.5 ${
                isSelected
                  ? 'border-cyan-500 bg-cyan-950/30 shadow-sm shadow-cyan-500/20'
                  : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className={`p-1.5 rounded-md ${isSelected ? 'bg-cyan-600 text-white' : 'bg-white/5 text-gray-400'}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                  {act.label}
                </div>
                <div className="text-[10px] text-gray-400 leading-tight">
                  {act.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Prompt Field */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
          Pokyn pre retuš (Prompt)
        </label>
        <textarea
          value={options.prompt}
          onChange={(e) => onChange(prev => ({ ...prev, prompt: e.target.value }))}
          placeholder="Detailne popíšte čo má AI na fotke zmeniť..."
          rows={3}
          className="w-full text-xs bg-black/50 border border-white/10 rounded-lg p-2.5 text-gray-200 placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none"
        />

        {/* Preset chips */}
        <div className="space-y-1 pt-1">
          <span className="text-[10px] text-gray-500">Rýchle nápady:</span>
          <div className="flex flex-col gap-1">
            {PRESET_PROMPTS[options.actionType]?.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onChange(prev => ({ ...prev, prompt: preset }))}
                className="text-left text-[10px] text-gray-400 hover:text-cyan-300 truncate bg-white/5 p-1 rounded hover:bg-white/10 transition-colors"
              >
                • {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Identity Protection */}
      <div className="bg-black/40 border border-white/10 rounded-lg p-3">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="space-y-0.5 pr-2">
            <span className="text-xs font-semibold text-gray-200 group-hover:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Striktné zachovanie identity tváre</span>
            </span>
            <p className="text-[10px] text-gray-400">
              Zabezpečí, že anatomická stavba tváre a črty zostanú 100% nezmenené.
            </p>
          </div>
          <input
            type="checkbox"
            checked={options.preserveIdentity}
            onChange={(e) => onChange(prev => ({ ...prev, preserveIdentity: e.target.checked }))}
            className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
          />
        </label>
      </div>

    </div>
  );
};

export default RetouchControls;
