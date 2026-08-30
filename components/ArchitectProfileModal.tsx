import React from 'react';
import { 
  X, 
  Compass, 
  MapPin, 
  Building2, 
  Sparkles, 
  Camera, 
  Layers, 
  Award,
  CheckCircle2
} from 'lucide-react';
import { SamplePhoto } from '../types';

interface ArchitectProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyArchPrompt: (prompt: string) => void;
  onSelectSample: (photo: SamplePhoto) => void;
}

const ARCHITECTURAL_PRESETS = [
  {
    title: 'Historická architektúra Plešivec – Kamenná fasáda',
    prompt: 'Autentická historická architektúra v obci Plešivec, teplé pieskovcové a kamenné murivo, dobové okná, slnečné popoludňajšie svetlo Gemera.',
    mode: 'colorize'
  },
  {
    title: 'Gotické a renesančné klenby Gemera',
    prompt: 'Historický sakrálny interiér gotického kostola v regióne Plešivec, rebrové klenby, fresky a mäkké dopadajúce svetlo z vitráže.',
    mode: 'colorize'
  },
  {
    title: 'Architektonický koncept & Moderný rendering',
    prompt: 'Moderný architektonický návrh ateliéru s čistými líniami, drevenými lamelami, veľkoformátovým zasklením a štúdiovým osvetlením.',
    mode: 'generate'
  }
];

const ArchitectProfileModal: React.FC<ArchitectProfileModalProps> = ({
  isOpen,
  onClose,
  onApplyArchPrompt
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111] border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="relative p-6 bg-gradient-to-r from-blue-950/70 via-[#161b26] to-indigo-950/70 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-xl flex-shrink-0">
              <div className="w-full h-full bg-[#0e121a] rounded-[14px] flex items-center justify-center">
                <Compass className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Hlavný architekt & kurátor
                </span>
                <span className="text-[10px] text-amber-400 flex items-center gap-1 font-mono">
                  <Award className="w-3 h-3" /> Plešivec
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Architekt Johan Fako
              </h2>
              <p className="text-xs text-gray-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>Plešivec • Gemerský región • Slovenská republika</span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto text-xs text-gray-300 leading-relaxed">
          <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Architektonický ateliér a pamiatková obnova</span>
            </div>
            <p className="text-gray-300 text-[11px]">
              Architekt <strong>Johan Fako</strong> z Plešivca sa venuje prepájaniu architektúry, urbanizmu, 
              fotodokumentácie a digitálnej obnovy historických pamiatok regiónu Gemer. Táto platforma 
              využíva pokročilé AI modely na autentické kolorovanie archívnych fotografií, rekonštrukciu 
              fasád a štúdiovú vizualizáciu.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-white font-semibold">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Architektonické predvoľby (Johan Fako Plešivec)</span>
              </span>
              <span className="text-[10px] text-gray-400 font-normal">Kliknutím aplikujete prompt</span>
            </div>

            <div className="space-y-2">
              {ARCHITECTURAL_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onApplyArchPrompt(preset.prompt);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-lg border border-white/10 bg-black/50 hover:bg-blue-950/30 hover:border-blue-500/50 transition-all flex items-start justify-between group"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-gray-200 group-hover:text-blue-300">
                      {preset.title}
                    </div>
                    <div className="text-[10px] text-gray-400 line-clamp-1">
                      {preset.prompt}
                    </div>
                  </div>
                  <span className="text-[10px] text-blue-400 font-semibold uppercase font-mono ml-3 group-hover:underline flex-shrink-0">
                    Použiť →
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-1">
              <div className="font-semibold text-gray-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pamiatková kolorácia</span>
              </div>
              <p className="text-[10px] text-gray-400">
                Presné kolorovanie fasád a prírodných stavebných materiálov (tehla, kameň, drevo).
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-1">
              <div className="font-semibold text-gray-200 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>Optika & Svetlo</span>
              </div>
              <p className="text-[10px] text-gray-400">
                Simulácia reálneho slnečného nasvietenia a optických objektívov pre priestorové zobrazenie.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-[#0d0d0d] flex items-center justify-between">
          <span className="text-[10px] text-gray-500 font-mono">
            Architekt Johan Fako • Plešivec Studio AI Lab
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zatvoriť</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ArchitectProfileModal;
