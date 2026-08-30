import React, { useState } from 'react';
import { X, Check, Image as ImageIcon, Sparkles, Building2, User, Mountain, Compass, Palette } from 'lucide-react';
import { SamplePhoto, StudioMode } from '../types';
import { SAMPLE_PHOTOS } from '../data/samplePhotos';

interface SampleGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (photo: SamplePhoto, targetSlot?: 'primary' | 'secondary') => void;
  targetSlot: 'primary' | 'secondary';
  currentMode: StudioMode;
}

type FilterCategory = 'all' | 'architecture' | 'vintage' | 'people' | 'background';

const SampleGalleryModal: React.FC<SampleGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectPhoto,
  targetSlot,
  currentMode
}) => {
  const [filter, setFilter] = useState<FilterCategory>('all');

  if (!isOpen) return null;

  const filteredPhotos = SAMPLE_PHOTOS.filter((photo) => {
    if (filter === 'all') return true;
    if (filter === 'architecture') return photo.category === 'architecture';
    if (filter === 'vintage') return photo.category === 'vintage_portrait' || photo.category === 'vintage_scene';
    if (filter === 'people') return photo.category === 'person_a' || photo.category === 'person_b';
    if (filter === 'background') return photo.category === 'background';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#111] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#161616] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Archív vzorových fotografií</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                  {targetSlot === 'primary' ? 'Cieľ: Foto 1 (Hlavná)' : 'Cieľ: Foto 2 (Sekundárna)'}
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Vyberte historické zábery, architektúru Plešivec alebo portréty pre okamžité testovanie AI syntézy
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Categories */}
        <div className="p-3 border-b border-white/10 bg-[#0d0d0d] flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all' as FilterCategory, label: 'Všetky vzory', icon: Sparkles },
            { id: 'architecture' as FilterCategory, label: 'Architektúra Plešivec (Johan Fako)', icon: Building2 },
            { id: 'vintage' as FilterCategory, label: 'Dobové čiernobiele', icon: Palette },
            { id: 'people' as FilterCategory, label: 'Osoby na zlúčenie', icon: User },
            { id: 'background' as FilterCategory, label: 'Scénické pozadia', icon: Mountain },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grid List */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/40 hover:border-blue-500/60 transition-all flex flex-col shadow-lg"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                <img
                  src={photo.url}
                  alt={photo.titleSk}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {photo.architectNote && (
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-amber-400" />
                    <span>Plešivec Heritage</span>
                  </div>
                )}

                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono uppercase text-gray-300">
                  {photo.category.replace('_', ' ')}
                </div>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between space-y-2 bg-[#121212]">
                <div>
                  <h4 className="text-xs font-bold text-gray-100 group-hover:text-blue-400 transition-colors">
                    {photo.titleSk}
                  </h4>
                  <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">
                    {photo.descriptionSk}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 font-mono">
                    Odporúčané: <strong className="text-blue-300 uppercase">{photo.recommendedMode}</strong>
                  </span>

                  <button
                    onClick={() => {
                      onSelectPhoto(photo, targetSlot);
                      onClose();
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-semibold flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Check className="w-3 h-3" />
                    <span>Vybrať</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-white/10 bg-[#0d0d0d] flex items-center justify-between text-xs text-gray-400">
          <span>Celkovo vzorov: {filteredPhotos.length}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/15 text-gray-200 rounded-lg text-xs font-medium transition-colors"
          >
            Zatvoriť
          </button>
        </div>

      </div>
    </div>
  );
};

export default SampleGalleryModal;
