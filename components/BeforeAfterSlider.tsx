import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Columns2, SplitSquareVertical, Eye, Image as ImageIcon } from 'lucide-react';
import { StudioAdjustments } from '../types';

interface BeforeAfterSliderProps {
  originalUrl: string;
  processedUrl: string;
  adjustments: StudioAdjustments;
  aspectRatio?: string;
  originalLabel?: string;
  processedLabel?: string;
}

export type ViewMode = 'slider' | 'side_by_side' | 'processed_only' | 'original_only';

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  originalUrl,
  processedUrl,
  adjustments,
  originalLabel = 'PÔVODNÁ (ORIGINAL)',
  processedLabel = 'AI VÝSLEDOK (RESTORED / MERGED)'
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('slider');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const filterStyle: React.CSSProperties = {
    filter: `
      brightness(${adjustments.brightness}) 
      contrast(${adjustments.contrast}) 
      saturate(${adjustments.saturation}) 
      sepia(${adjustments.sepia / 100})
      hue-rotate(${adjustments.warmth}deg)
    `.trim()
  };

  const vignetteStyle: React.CSSProperties = {
    background: adjustments.vignette > 0 
      ? `radial-gradient(circle, transparent 40%, rgba(0,0,0,${adjustments.vignette}) 100%)` 
      : 'none'
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-black/80 backdrop-blur-md p-1 rounded-lg border border-white/10 shadow-xl">
        <button
          onClick={() => setViewMode('slider')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
            viewMode === 'slider'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          title="Rozdelené posuvníkom"
        >
          <SplitSquareVertical className="w-3.5 h-3.5" />
          <span>Posuvník</span>
        </button>

        <button
          onClick={() => setViewMode('side_by_side')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
            viewMode === 'side_by_side'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          title="Vedľa seba"
        >
          <Columns2 className="w-3.5 h-3.5" />
          <span>Vedľa seba</span>
        </button>

        <button
          onClick={() => setViewMode('processed_only')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
            viewMode === 'processed_only'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          title="Iba výsledok"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Výsledok</span>
        </button>

        <button
          onClick={() => setViewMode('original_only')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
            viewMode === 'original_only'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          title="Iba pôvodná"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Pôvodná</span>
        </button>
      </div>

      {viewMode === 'slider' && (
        <div
          ref={containerRef}
          className="relative max-h-[calc(100%-4rem)] max-w-full aspect-auto rounded-lg overflow-hidden border border-white/15 bg-black/60 shadow-2xl shadow-black cursor-ew-resize"
          onMouseDown={(e) => {
            setIsDragging(true);
            handleMove(e.clientX);
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            handleMove(e.touches[0].clientX);
          }}
        >
          <div className="relative w-full h-full max-h-[75vh]">
            <img
              src={processedUrl}
              alt="Processed"
              className="max-h-[75vh] w-auto h-auto object-contain block pointer-events-none"
              style={filterStyle}
            />
            <div className="absolute inset-0 pointer-events-none" style={vignetteStyle} />
            {adjustments.grain > 0 && (
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-overlay"
                style={{
                  opacity: adjustments.grain / 100,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
              />
            )}
          </div>

          <div
            className="absolute inset-0 overflow-hidden pointer-events-none border-r-2 border-blue-400/90 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={originalUrl}
              alt="Original"
              className="absolute top-0 left-0 max-h-[75vh] w-auto h-full object-contain pointer-events-none max-w-none"
              style={{ height: '100%' }}
            />
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono uppercase text-gray-300 border border-white/10">
              {originalLabel}
            </div>
          </div>

          <div className="absolute top-3 right-3 bg-blue-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono uppercase text-blue-300 border border-blue-500/30 pointer-events-none">
            {processedLabel}
          </div>

          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-500/40 border-2 border-white flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110">
              <SplitSquareVertical className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {viewMode === 'side_by_side' && (
        <div className="flex items-center justify-center gap-4 max-h-[calc(100%-4rem)] w-full px-4">
          <div className="relative flex-1 max-h-[75vh] flex flex-col items-center">
            <div className="relative rounded-lg overflow-hidden border border-white/15 bg-black/60 shadow-xl max-h-[70vh]">
              <img src={originalUrl} alt="Original" className="max-h-[70vh] w-auto h-auto object-contain block" />
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono uppercase text-gray-300 border border-white/10">
                {originalLabel}
              </div>
            </div>
          </div>

          <div className="relative flex-1 max-h-[75vh] flex flex-col items-center">
            <div className="relative rounded-lg overflow-hidden border border-blue-500/30 bg-black/60 shadow-xl max-h-[70vh]">
              <img
                src={processedUrl}
                alt="Processed"
                className="max-h-[70vh] w-auto h-auto object-contain block"
                style={filterStyle}
              />
              <div className="absolute inset-0 pointer-events-none" style={vignetteStyle} />
              <div className="absolute top-3 right-3 bg-blue-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono uppercase text-blue-300 border border-blue-500/30">
                {processedLabel}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'processed_only' && (
        <div className="relative max-h-[calc(100%-4rem)] rounded-lg overflow-hidden border border-blue-500/30 bg-black/60 shadow-2xl">
          <img
            src={processedUrl}
            alt="Processed"
            className="max-h-[75vh] w-auto h-auto object-contain block"
            style={filterStyle}
          />
          <div className="absolute inset-0 pointer-events-none" style={vignetteStyle} />
          <div className="absolute top-3 right-3 bg-blue-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono uppercase text-blue-300 border border-blue-500/30">
            {processedLabel}
          </div>
        </div>
      )}

      {viewMode === 'original_only' && (
        <div className="relative max-h-[calc(100%-4rem)] rounded-lg overflow-hidden border border-white/15 bg-black/60 shadow-2xl">
          <img
            src={originalUrl}
            alt="Original"
            className="max-h-[75vh] w-auto h-auto object-contain block"
          />
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono uppercase text-gray-300 border border-white/10">
            {originalLabel}
          </div>
        </div>
      )}
    </div>
  );
};

export default BeforeAfterSlider;
