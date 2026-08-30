'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { 
  Camera, 
  Palette, 
  Combine, 
  Sun, 
  Wand2, 
  Sparkles, 
  Upload, 
  Download, 
  History, 
  Zap, 
  Loader2, 
  Layers, 
  Sliders, 
  X, 
  RotateCcw, 
  Maximize2,
  Minimize2,
  FileImage,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { 
  StudioMode, 
  ColorizeOptions, 
  MergeOptions, 
  RetouchOptions, 
  LightingProfile, 
  AspectRatio, 
  StudioAdjustments, 
  GeneratedPortrait,
  SamplePhoto
} from '@/types';
import { 
  colorizeOldPhoto, 
  mergePhotosWithPrompt, 
  relightStudioPortrait, 
  retouchPhotoWithPrompt, 
  generateNewPortrait 
} from '@/services/geminiService';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import ColorizeControls from '@/components/ColorizeControls';
import MergeControls from '@/components/MergeControls';
import RelightControls from '@/components/RelightControls';
import RetouchControls from '@/components/RetouchControls';
import GenerateControls from '@/components/GenerateControls';
import AdjustmentsPanel from '@/components/AdjustmentsPanel';
import SampleGalleryModal from '@/components/SampleGalleryModal';
import ArchitectProfileModal from '@/components/ArchitectProfileModal';

const INITIAL_ADJUSTMENTS: StudioAdjustments = {
  brightness: 1,
  contrast: 1,
  saturation: 1,
  warmth: 0,
  grain: 0,
  vignette: 0,
  sharpness: 0,
  sepia: 0
};

export default function Page() {
  const [currentMode, setCurrentMode] = useState<StudioMode>('colorize');
  const [sidebarTab, setSidebarTab] = useState<'tools' | 'adjustments'>('tools');

  const [primaryImage, setPrimaryImage] = useState<string | null>(null);
  const [secondaryImage, setSecondaryImage] = useState<string | null>(null);

  const [colorizeOptions, setColorizeOptions] = useState<ColorizeOptions>({
    palette: 'authentic_vintage',
    repairScratches: true,
    enhanceFaces: true,
    reduceNoise: false,
    customColorNotes: ''
  });

  const [mergeOptions, setMergeOptions] = useState<MergeOptions>({
    mergeType: 'people_group',
    prompt: 'Vytvor spoločnú rodinnú fotografiu týchto dvoch osôb sediacich vedľa seba v prirodzenom ateliéri',
    blendIntensity: 'balanced',
    matchLighting: true
  });

  const [lightingProfile, setLightingProfile] = useState<LightingProfile>('rembrandt');

  const [retouchOptions, setRetouchOptions] = useState<RetouchOptions>({
    actionType: 'clothing',
    prompt: 'Prezleč osobu do dobového elegantného obleku s kravatou',
    preserveIdentity: true
  });

  const [generatePrompt, setGeneratePrompt] = useState<string>(
    'Portrét charizmatickej ženy s vlnitými vlasmi a jemným úsmevom, historický fotoateliér 1940s'
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('3:4');

  const [adjustments, setAdjustments] = useState<StudioAdjustments>(INITIAL_ADJUSTMENTS);

  const [currentResult, setCurrentResult] = useState<GeneratedPortrait | null>(null);
  const [history, setHistory] = useState<GeneratedPortrait[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [galleryTargetSlot, setGalleryTargetSlot] = useState<'primary' | 'secondary'>('primary');
  const [isArchitectModalOpen, setIsArchitectModalOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleApplyArchPrompt = (promptText: string) => {
    if (currentMode === 'colorize') {
      setColorizeOptions(prev => ({
        ...prev,
        customColorNotes: prev.customColorNotes ? `${prev.customColorNotes}, ${promptText}` : promptText
      }));
    } else if (currentMode === 'generate') {
      setGeneratePrompt(promptText);
    } else if (currentMode === 'retouch') {
      setRetouchOptions(prev => ({ ...prev, prompt: promptText }));
    } else if (currentMode === 'merge') {
      setMergeOptions(prev => ({ ...prev, prompt: promptText }));
    }
  };

  const handlePrimaryUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPrimaryImage(base64);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrimaryImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (photo: SamplePhoto, targetSlot: 'primary' | 'secondary' = 'primary') => {
    if (targetSlot === 'secondary') {
      setSecondaryImage(photo.url);
    } else {
      setPrimaryImage(photo.url);
      if (photo.recommendedMode) {
        setCurrentMode(photo.recommendedMode);
      }
    }
    setError(null);
  };

  const openGalleryModal = (slot: 'primary' | 'secondary' = 'primary') => {
    setGalleryTargetSlot(slot);
    setIsGalleryOpen(true);
  };

  const handleSynthesize = async () => {
    setError(null);

    if (currentMode === 'colorize' && !primaryImage) {
      setError('Nahrajte starú čiernobielu fotografiu alebo vyberte vzor zo zoznamu.');
      return;
    }
    if (currentMode === 'merge' && (!primaryImage || !secondaryImage)) {
      setError('Pre zlúčenie fotografií je potrebné nahrať Foto 1 aj Foto 2.');
      return;
    }
    if (currentMode === 'relight' && !primaryImage) {
      setError('Nahrajte portrét, ktorý chcete nanovo nasvietiť.');
      return;
    }
    if (currentMode === 'retouch' && !primaryImage) {
      setError('Nahrajte fotografiu, na ktorej chcete vykonať generatívny retuš.');
      return;
    }
    if (currentMode === 'generate' && !generatePrompt.trim()) {
      setError('Zadajte popis portrétu, ktorý chcete vytvoriť.');
      return;
    }

    setIsGenerating(true);

    try {
      let resultUrl: string | null = null;
      let promptSummary = '';

      switch (currentMode) {
        case 'colorize':
          promptSummary = `Autentické kolorovanie: ${colorizeOptions.palette}`;
          resultUrl = await colorizeOldPhoto(primaryImage!, colorizeOptions);
          break;

        case 'merge':
          promptSummary = `Zlúčenie fotiek: ${mergeOptions.prompt || mergeOptions.mergeType}`;
          resultUrl = await mergePhotosWithPrompt(primaryImage!, secondaryImage!, mergeOptions);
          break;

        case 'relight':
          promptSummary = `Štúdiové nasvietenie: ${lightingProfile}`;
          resultUrl = await relightStudioPortrait(primaryImage!, lightingProfile);
          break;

        case 'retouch':
          promptSummary = `Generatívny retuš: ${retouchOptions.prompt}`;
          resultUrl = await retouchPhotoWithPrompt(primaryImage!, retouchOptions);
          break;

        case 'generate':
          promptSummary = generatePrompt;
          resultUrl = await generateNewPortrait(generatePrompt, lightingProfile, aspectRatio);
          break;
      }

      if (resultUrl) {
        const newPortrait: GeneratedPortrait = {
          id: Date.now().toString(),
          url: resultUrl,
          originalUrl: primaryImage || undefined,
          secondaryUrl: secondaryImage || undefined,
          prompt: promptSummary,
          mode: currentMode,
          profile: lightingProfile,
          palette: colorizeOptions.palette,
          mergeType: mergeOptions.mergeType,
          timestamp: Date.now(),
          aspectRatio: aspectRatio
        };

        setCurrentResult(newPortrait);
        setHistory(prev => [newPortrait, ...prev].slice(0, 15));
      } else {
        setError('Model nevygeneroval obrazový výstup. Skúste upraviť parametre alebo prompt.');
      }
    } catch (err: any) {
      console.error('Synthesis Error:', err);
      setError(err?.message || 'Chyba pri spracovaní AI modelom. Skontrolujte parametre.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!currentResult) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width || 1200;
      canvas.height = img.naturalHeight || img.height || 1600;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.filter = `
        brightness(${adjustments.brightness}) 
        contrast(${adjustments.contrast}) 
        saturate(${adjustments.saturation}) 
        sepia(${adjustments.sepia / 100})
        hue-rotate(${adjustments.warmth}deg)
      `.trim();

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (adjustments.vignette > 0) {
        ctx.filter = 'none';
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) * 0.3,
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.7
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, `rgba(0,0,0,${adjustments.vignette})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const link = document.createElement('a');
      link.download = `photo-studio-ai-${currentResult.mode}-${currentResult.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = currentResult.url;
  };

  return (
    <div id="studio-root" className="flex h-screen w-full bg-[#080808] text-gray-200 overflow-hidden font-sans select-none">
      
      {/* LEFT SIDEBAR */}
      <aside id="studio-sidebar" className="w-80 sm:w-96 border-r border-white/10 flex flex-col bg-[#0d0d0d] flex-shrink-0 z-20">
        
        {/* Brand Header */}
        <div id="sidebar-header" className="p-4 border-b border-white/10 flex items-center justify-between bg-[#111]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30 flex-shrink-0">
              <Camera className="text-white w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xs font-bold tracking-widest uppercase text-white flex items-center gap-1.5">
                <span>Studio Photo Lab AI</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">v3.0</span>
              </h1>
              <button 
                id="arch-profile-trigger"
                onClick={() => setIsArchitectModalOpen(true)}
                className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline mt-0.5 text-left"
                title="Zobraziť profil architekta a pamiatkové predvoľby"
              >
                <Compass className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span className="truncate">Architekt: Johan Fako (Plešivec)</span>
              </button>
            </div>
          </div>

          <button
            id="gallery-open-button"
            onClick={() => openGalleryModal('primary')}
            className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 hover:text-blue-300 px-2.5 py-1 rounded bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 transition-all flex-shrink-0"
            title="Otvoriť vzorové fotografie"
          >
            <FileImage className="w-3 h-3" />
            <span>Vzory</span>
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div id="mode-tabs" className="p-2 border-b border-white/10 bg-[#0a0a0a]">
          <div className="grid grid-cols-5 gap-1 text-center">
            {[
              { id: 'colorize' as StudioMode, label: 'Kolorovať', icon: Palette, color: 'text-amber-400' },
              { id: 'merge' as StudioMode, label: 'Zlúčiť', icon: Combine, color: 'text-purple-400' },
              { id: 'relight' as StudioMode, label: 'Nasvietiť', icon: Sun, color: 'text-yellow-400' },
              { id: 'retouch' as StudioMode, label: 'Retuš', icon: Wand2, color: 'text-cyan-400' },
              { id: 'generate' as StudioMode, label: 'Vytvoriť', icon: Sparkles, color: 'text-emerald-400' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentMode === tab.id;
              return (
                <button
                  id={`mode-tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => setCurrentMode(tab.id)}
                  className={`flex flex-col items-center py-2 px-1 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 mb-1 ${isActive ? 'text-white' : tab.color}`} />
                  <span className="text-[10px] font-semibold tracking-tighter truncate w-full">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Tab Switcher */}
        <div id="sidebar-tab-switcher" className="flex border-b border-white/10 bg-[#121212] px-4 pt-2 gap-4">
          <button
            id="tab-tools"
            onClick={() => setSidebarTab('tools')}
            className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
              sidebarTab === 'tools'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Nástroje režimu</span>
          </button>

          <button
            id="tab-adjustments"
            onClick={() => setSidebarTab('adjustments')}
            className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
              sidebarTab === 'adjustments'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Úpravy (Lab)</span>
          </button>
        </div>

        {/* Scrollable Configuration Controls */}
        <div id="sidebar-controls" className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {sidebarTab === 'adjustments' ? (
            <AdjustmentsPanel
              adjustments={adjustments}
              onChange={setAdjustments}
              onReset={() => setAdjustments(INITIAL_ADJUSTMENTS)}
            />
          ) : (
            <>
              {currentMode !== 'merge' && currentMode !== 'generate' && (
                <section id="primary-upload-section">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5 text-blue-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                        {currentMode === 'colorize' ? 'Zdrojová stará fotografia' : 'Vstupný portrét'}
                      </h3>
                    </div>
                    {primaryImage && (
                      <button
                        id="clear-primary-btn"
                        onClick={() => setPrimaryImage(null)}
                        className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-0.5"
                      >
                        <X className="w-3 h-3" />
                        <span>Odstrániť</span>
                      </button>
                    )}
                  </div>

                  {!primaryImage ? (
                    <div className="space-y-2">
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full aspect-[16/9] border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-1.5 hover:border-blue-500/60 hover:bg-blue-950/20 transition-all group bg-black/40 cursor-pointer"
                      >
                        <Upload className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                        <span className="text-xs font-medium text-gray-300 group-hover:text-white">
                          {currentMode === 'colorize' ? 'Nahrať čiernobielu fotku' : 'Nahrať fotografiu'}
                        </span>
                        <span className="text-[10px] text-gray-500">alebo potiahnite súbor sem</span>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handlePrimaryUpload}
                          className="hidden"
                          accept="image/*"
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] px-1">
                        <span className="text-gray-500">Nemáte po ruke starú fotku?</span>
                        <button
                          id="open-sample-primary"
                          onClick={() => openGalleryModal('primary')}
                          className="text-blue-400 hover:text-blue-300 font-semibold hover:underline"
                        >
                          Použiť vzor z archívu →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-blue-500/50 bg-black group">
                      <img src={primaryImage} alt="Zdroj" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                        <span className="text-[10px] font-mono text-blue-300 uppercase tracking-widest">
                          {currentMode === 'colorize' ? 'HISTORICKÝ ZDROJ AKTÍVNY' : 'ZDROJOVÁ FOTO AKTÍVNA'}
                        </span>
                      </div>
                    </div>
                  )}
                </section>
              )}

              {currentMode === 'colorize' && (
                <ColorizeControls
                  options={colorizeOptions}
                  onChange={setColorizeOptions}
                  onSelectSample={() => openGalleryModal('primary')}
                />
              )}

              {currentMode === 'merge' && (
                <MergeControls
                  options={mergeOptions}
                  onChange={setMergeOptions}
                  primaryImage={primaryImage}
                  secondaryImage={secondaryImage}
                  onUploadPrimary={setPrimaryImage}
                  onUploadSecondary={setSecondaryImage}
                  onClearPrimary={() => setPrimaryImage(null)}
                  onClearSecondary={() => setSecondaryImage(null)}
                  onSelectSample={openGalleryModal}
                />
              )}

              {currentMode === 'relight' && (
                <RelightControls
                  profile={lightingProfile}
                  onChange={setLightingProfile}
                />
              )}

              {currentMode === 'retouch' && (
                <RetouchControls
                  options={retouchOptions}
                  onChange={setRetouchOptions}
                />
              )}

              {currentMode === 'generate' && (
                <GenerateControls
                  prompt={generatePrompt}
                  onPromptChange={setGeneratePrompt}
                  aspectRatio={aspectRatio}
                  onAspectRatioChange={setAspectRatio}
                  profile={lightingProfile}
                  onProfileChange={setLightingProfile}
                />
              )}
            </>
          )}
        </div>

        {/* Action Button Footer */}
        <div id="sidebar-action-footer" className="p-4 border-t border-white/10 bg-[#0a0a0a]">
          <button
            id="synthesize-button"
            onClick={handleSynthesize}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-blue-900/30 active:scale-[0.99] cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>AI Spracováva obraz...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current text-amber-300" />
                <span>
                  {currentMode === 'colorize' && 'Vyfarbiť a reštaurovať'}
                  {currentMode === 'merge' && 'Zlúčiť fotografie (AI Merge)'}
                  {currentMode === 'relight' && 'Aplikovať nasvietenie'}
                  {currentMode === 'retouch' && 'Vykonať generatívny retuš'}
                  {currentMode === 'generate' && 'Vygenerovať nový portrét'}
                </span>
              </>
            )}
          </button>

          {error && (
            <p id="synthesis-error-msg" className="mt-2.5 text-[11px] text-red-400 bg-red-950/30 border border-red-800/30 p-2 rounded text-center">
              {error}
            </p>
          )}
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main id="studio-viewport" className="flex-1 flex flex-col relative bg-[#050505] overflow-hidden">
        
        {/* Top Header Controls */}
        <header id="viewport-header" className="h-14 border-b border-white/10 flex items-center justify-between px-4 sm:px-6 bg-[#0a0a0a] z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-tight">
                Gemini Vision Engine Ready
              </span>
            </div>

            {currentMode === 'colorize' && (
              <span className="text-xs text-gray-400 hidden lg:inline">
                🎨 Autentické historické kolorovanie fotografií
              </span>
            )}
            {currentMode === 'merge' && (
              <span className="text-xs text-gray-400 hidden lg:inline">
                🪄 Zlúčenie a syntéza fotografií podľa promptu
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="arch-header-button"
              onClick={() => setIsArchitectModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/50 hover:bg-blue-900/60 text-blue-300 hover:text-white text-xs font-semibold border border-blue-500/30 transition-all shadow-sm group cursor-pointer"
              title="Profil architekta & Pamiatkové reštaurovanie Plešivec"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
              <span className="hidden md:inline">Architekt Johan Fako (Plešivec)</span>
              <span className="md:hidden">Arch. Fako</span>
            </button>

            <button
              id="gallery-header-button"
              onClick={() => openGalleryModal('primary')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
            >
              <FileImage className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Galéria vzorov</span>
            </button>

            <button
              id="download-btn"
              onClick={handleDownload}
              disabled={!currentResult}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-900/30 transition-all cursor-pointer"
              title="Stiahnuť výsledok v plnom rozlíšení"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Stiahnuť</span>
            </button>

            <button
              id="fullscreen-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title={isFullscreen ? 'Zmenšiť' : 'Celá obrazovka'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Central Visual Stage */}
        <div id="viewport-stage" className="flex-1 relative flex items-center justify-center p-4 md:p-6 overflow-hidden bg-[#070707]">
          {isGenerating ? (
            <div id="stage-generating-overlay" className="flex flex-col items-center gap-6 text-center max-w-md p-8 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
              <div className="relative">
                <div className="w-24 h-24 border-3 border-blue-600/20 border-t-blue-500 rounded-full flex items-center justify-center animate-spin">
                  <div className="w-4 h-4 bg-blue-600 rounded-sm" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-7 h-7 text-amber-400 animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-white tracking-wide">
                  {currentMode === 'colorize' && 'Kolorujem a reštaurujem starú fotografiu...'}
                  {currentMode === 'merge' && 'Zlučujem fotografie do jednotnej kompozície...'}
                  {currentMode === 'relight' && 'Nanovo prepočítavam štúdiové svetlo...'}
                  {currentMode === 'retouch' && 'Vykonávam generatívny retuš...'}
                  {currentMode === 'generate' && 'Generujem nový štúdiový portrét...'}
                </p>
                <p className="text-xs font-mono text-gray-400">
                  Multimodálny model analyzuje štruktúru, hĺbku a jemné detaily
                </p>
              </div>
            </div>
          ) : currentResult ? (
            <div id="stage-result-container" className="w-full h-full flex items-center justify-center">
              {currentResult.originalUrl ? (
                <BeforeAfterSlider
                  originalUrl={currentResult.originalUrl}
                  processedUrl={currentResult.url}
                  adjustments={adjustments}
                  originalLabel={currentResult.mode === 'colorize' ? 'PÔVODNÁ ČIERNOBIELA' : 'PÔVODNÝ ZDROJ'}
                  processedLabel={
                    currentResult.mode === 'colorize' 
                      ? 'AI VYFARBENÁ & REŠTAUROVANÁ' 
                      : currentResult.mode === 'merge'
                      ? 'AI ZLÚČENÁ FOTOGRAFIA'
                      : 'AI VÝSLEDOK'
                  }
                />
              ) : (
                <div className="relative max-h-[75vh] rounded-lg overflow-hidden border border-blue-500/30 bg-black shadow-2xl">
                  <img
                    src={currentResult.url}
                    alt="Výsledok"
                    className="max-h-[75vh] w-auto h-auto object-contain block"
                    style={{
                      filter: `
                        brightness(${adjustments.brightness}) 
                        contrast(${adjustments.contrast}) 
                        saturate(${adjustments.saturation}) 
                        sepia(${adjustments.sepia / 100})
                        hue-rotate(${adjustments.warmth}deg)
                      `.trim()
                    }}
                  />
                  {adjustments.vignette > 0 && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle, transparent 40%, rgba(0,0,0,${adjustments.vignette}) 100%)`
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          ) : primaryImage ? (
            <div id="stage-prepared-primary" className="flex flex-col items-center gap-4 max-h-[75vh]">
              <div className="relative rounded-lg overflow-hidden border border-white/20 bg-black/60 shadow-2xl max-h-[65vh]">
                <img src={primaryImage} alt="Vstup" className="max-h-[65vh] w-auto h-auto object-contain block" />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-gray-300 border border-white/10">
                  {currentMode === 'colorize' ? 'Pripravené na kolorovanie' : 'Vstupný obraz'}
                </div>
              </div>
              <button
                id="stage-start-btn"
                onClick={handleSynthesize}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-900/40 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current text-amber-300" />
                <span>
                  {currentMode === 'colorize' ? 'Spustiť kolorovanie fotky' : 'Spracovať fotografiu'}
                </span>
              </button>
            </div>
          ) : (
            <div id="stage-empty-placeholder" className="flex flex-col items-center gap-5 text-gray-500 max-w-md text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 shadow-inner">
                {currentMode === 'colorize' && <Palette className="w-8 h-8 text-amber-400/80" />}
                {currentMode === 'merge' && <Combine className="w-8 h-8 text-purple-400/80" />}
                {currentMode === 'relight' && <Sun className="w-8 h-8 text-yellow-400/80" />}
                {currentMode === 'retouch' && <Wand2 className="w-8 h-8 text-cyan-400/80" />}
                {currentMode === 'generate' && <Sparkles className="w-8 h-8 text-emerald-400/80" />}
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-semibold text-gray-200">
                  {currentMode === 'colorize' && 'Kolorovanie a obnova starých fotografií'}
                  {currentMode === 'merge' && 'Zlúčenie a kompozícia viacerých fotografií'}
                  {currentMode === 'relight' && 'Štúdiové nasvietenie a zmena svetla'}
                  {currentMode === 'retouch' && 'Generatívny retuš a zmena prvkov'}
                  {currentMode === 'generate' && 'Generovanie portrétov od nuly'}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {currentMode === 'colorize' && 'Nahrajte historickú čiernobielu fotku z rodinného archívu alebo vyskúšajte vzorové dobové zábery.'}
                  {currentMode === 'merge' && 'Nahrajte 2 fotografie a zadajte prompt pre ich prirodzené spojenie (spoločný portrét, zmena pozadia, prenos štýlu).'}
                  {currentMode === 'relight' && 'Zvoľte osvetlenie a nahrajte portrét pre simuláciu 85mm Prime objektívu a ateliérových svetiel.'}
                  {currentMode === 'retouch' && 'Zmeňte odev, pozadie, účes alebo výraz tváre s ochranou identity.'}
                  {currentMode === 'generate' && 'Napíšte popis a AI vytvorí nový fotorealistický ateliérový portrét.'}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button
                  id="empty-open-samples"
                  onClick={() => openGalleryModal('primary')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileImage className="w-3.5 h-3.5" />
                  <span>Otvoriť vzorové fotky</span>
                </button>
                {currentMode !== 'generate' && (
                  <button
                    id="empty-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white/10 hover:bg-white/15 text-gray-200 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Nahrať z disku</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM HISTORY STRIP */}
        <footer id="studio-history-strip" className="h-32 border-t border-white/10 bg-[#0a0a0a] px-4 sm:px-6 py-3 flex flex-col justify-between flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                História vytvorených snímok ({history.length})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                id="arch-footer-link"
                onClick={() => setIsArchitectModalOpen(true)}
                className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Compass className="w-3 h-3 text-amber-400" />
                <span>Architekt Johan Fako • Plešivec</span>
              </button>
              {history.length > 0 && (
                <span className="text-[10px] text-gray-500 hidden sm:inline">Kliknutím na miniatúru načítate snímok</span>
              )}
            </div>
          </div>

          <div id="history-items-container" className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/20">
            {history.length > 0 ? (
              history.map((item) => {
                const isSelected = currentResult?.id === item.id;
                return (
                  <button
                    key={item.id}
                    id={`history-item-${item.id}`}
                    onClick={() => {
                      setCurrentResult(item);
                      if (item.originalUrl) setPrimaryImage(item.originalUrl);
                      if (item.secondaryUrl) setSecondaryImage(item.secondaryUrl);
                      setCurrentMode(item.mode);
                    }}
                    className={`relative flex-shrink-0 h-16 sm:h-18 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all group cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/30 scale-105'
                        : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={item.url} alt="Snímok" className="w-full h-full object-cover" />
                    <div className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/80 text-[8px] font-mono text-gray-300 uppercase">
                      {item.mode === 'colorize' && 'Kolor'}
                      {item.mode === 'merge' && 'Merge'}
                      {item.mode === 'relight' && 'Light'}
                      {item.mode === 'retouch' && 'Retuš'}
                      {item.mode === 'generate' && 'Gen'}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="w-full flex items-center justify-center border border-dashed border-white/10 rounded-lg py-3">
                <span className="text-[11px] text-gray-600 font-mono">
                  Zatiaľ žiadne vygenerované snímky v relácii
                </span>
              </div>
            )}
          </div>
        </footer>
      </main>

      <SampleGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectPhoto={handleSelectSample}
        targetSlot={galleryTargetSlot}
        currentMode={currentMode}
      />

      <ArchitectProfileModal
        isOpen={isArchitectModalOpen}
        onClose={() => setIsArchitectModalOpen(false)}
        onApplyArchPrompt={handleApplyArchPrompt}
        onSelectSample={(p) => handleSelectSample(p, 'primary')}
      />
    </div>
  );
}
