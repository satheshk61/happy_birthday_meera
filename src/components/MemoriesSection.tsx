import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Calendar, Heart, Camera, Upload, SlidersHorizontal, Check, Download, CheckCircle2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { MemoryItem, TimelineItem } from '../birthdayConfig';
import { sound } from '../utils/audio';
import { triggerTapSparkle } from '../utils/confetti';

export type PhotoFilterId = 'normal' | 'vintage' | 'soft-glow' | 'sepia' | 'rose-gold' | 'noir';

export interface PhotoFilter {
  id: PhotoFilterId;
  name: string;
  description: string;
  cssFilter: string;
  overlayClass?: string;
}

export const PHOTO_FILTERS: PhotoFilter[] = [
  {
    id: 'normal',
    name: 'Original',
    description: 'Natural tones',
    cssFilter: 'none',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Warm 35mm film',
    cssFilter: 'sepia(0.32) contrast(1.12) brightness(0.96) saturate(1.15) hue-rotate(-8deg)',
    overlayClass: 'bg-amber-950/10 mix-blend-color-burn',
  },
  {
    id: 'soft-glow',
    name: 'Soft Glow',
    description: 'Luminous highlights',
    cssFilter: 'brightness(1.08) contrast(0.95) saturate(1.15) drop-shadow(0 0 12px rgba(255,218,185,0.35))',
    overlayClass: 'bg-radial from-[#ffd4a3]/20 via-transparent to-transparent mix-blend-screen',
  },
  {
    id: 'sepia',
    name: 'Sepia',
    description: 'Golden antique memory',
    cssFilter: 'sepia(0.68) contrast(1.06) brightness(0.94) hue-rotate(-12deg)',
    overlayClass: 'bg-[#b76e79]/10 mix-blend-multiply',
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    description: 'Romantic blush glow',
    cssFilter: 'sepia(0.22) saturate(1.3) hue-rotate(325deg) contrast(1.08) brightness(1.02)',
    overlayClass: 'bg-gradient-to-tr from-[#b76e79]/15 via-transparent to-[#ffdab9]/15 mix-blend-overlay',
  },
  {
    id: 'noir',
    name: 'Classic Noir',
    description: 'Timeless monochrome',
    cssFilter: 'grayscale(1) contrast(1.22) brightness(0.96)',
    overlayClass: 'bg-black/10 mix-blend-multiply',
  },
];

interface MemoriesSectionProps {
  memories: MemoryItem[];
  timeline: TimelineItem[];
}

export const MemoriesSection: React.FC<MemoriesSectionProps> = ({ memories, timeline }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFilterId, setSelectedFilterId] = useState<PhotoFilterId>('normal');
  const [customImages, setCustomImages] = useState<{ [id: number]: string }>({});
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentMemory = memories[currentIndex];
  const activeFilter = PHOTO_FILTERS.find((f) => f.id === selectedFilterId) || PHOTO_FILTERS[0];

  const handlePrev = () => {
    sound.playNavClick();
    setCurrentIndex((prev) => (prev === 0 ? memories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    sound.playNavClick();
    setCurrentIndex((prev) => (prev === memories.length - 1 ? 0 : prev + 1));
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomImages((prev) => ({
        ...prev,
        [currentMemory.id]: url,
      }));
    }
  };

  const handleTakeSnapshot = async () => {
    if (!cardRef.current || isCapturing) return;

    try {
      // 1. Audio and Flash feedback
      sound.playCameraShutter();
      setShowFlash(true);
      setIsCapturing(true);

      setTimeout(() => {
        setShowFlash(false);
      }, 250);

      // 2. Wait a tick for DOM to settle
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 3. Render PNG using html-to-image
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#1d0724',
        filter: (node) => {
          if (node instanceof HTMLElement && node.classList.contains('hide-on-snapshot')) {
            return false;
          }
          return true;
        },
      });

      // 4. Download file
      const link = document.createElement('a');
      const safeTitle = currentMemory.title
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .slice(0, 30);
      link.download = `Meera_${safeTitle}_${activeFilter.name.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();

      // 5. Success toast and sparkle celebration
      triggerTapSparkle(window.innerWidth / 2, window.innerHeight / 2);
      setToastMessage('Snapshot saved to your device! 📸');
      setTimeout(() => {
        setToastMessage(null);
      }, 3500);
    } catch (err) {
      console.error('Failed to capture snapshot:', err);
      setToastMessage('Could not save snapshot. Please try again!');
      setTimeout(() => {
        setToastMessage(null);
      }, 3500);
    } finally {
      setIsCapturing(false);
    }
  };

  const displayImage = customImages[currentMemory.id] || currentMemory.image;

  return (
    <section className="relative py-12 md:py-20 px-4 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-10 md:mb-14">
        <span className="text-xs font-serif-display uppercase tracking-widest text-[#ffdab9] flex items-center justify-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          A Digital Keepsake
        </span>
        <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#fffdf9] via-[#ffdab9] to-[#f7e7ce] font-semibold py-1">
          Our Cherished Memories
        </h2>
        <p className="font-serif-display text-sm sm:text-base text-[#e6e6fa]/70 max-w-lg mx-auto mt-2 italic">
          Every snapshot holds a story, every laugh is a treasure kept close to the heart.
        </p>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-6 right-6 z-50 max-w-sm px-4 py-3 rounded-2xl bg-[#2e0935]/95 border border-[#ffdab9]/50 text-[#fffdf9] font-serif-display text-xs sm:text-sm shadow-2xl flex items-center gap-2.5 backdrop-blur-xl animate-fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Memory Album Carousel */}
      <div
        ref={cardRef}
        className="relative glass-panel rounded-3xl p-4 sm:p-8 md:p-10 mb-16 shadow-2xl overflow-hidden border border-[#f7e7ce]/20"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Camera Flash Animation Overlay */}
        {showFlash && (
          <div className="absolute inset-0 z-50 bg-white/75 backdrop-blur-xs transition-opacity duration-200 pointer-events-none" />
        )}

        {/* Soft atmospheric gradient behind card */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#b76e79]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#ffdab9]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header inside carousel: Unboxed Metadata & Snapshot Action */}
        <div className="flex items-center justify-between mb-4 md:mb-6 text-xs sm:text-sm font-serif-display text-[#f7e7ce]/80">
          <div className="flex items-center gap-2">
            <span className="font-mono tabular-nums text-base sm:text-lg font-bold text-[#ffdab9]">
              {String(currentIndex + 1).padStart(2, '0')} / {String(memories.length).padStart(2, '0')}
            </span>
            <span aria-hidden="true" className="text-[#f7e7ce]/30">·</span>
            <span className="text-[#ffdab9] font-medium tracking-wide">
              {currentMemory.tag || 'Chapter'}
            </span>
            {currentMemory.date && (
              <>
                <span aria-hidden="true" className="text-[#f7e7ce]/30 hidden sm:inline">·</span>
                <span className="hidden sm:inline text-[#e6e6fa]/70">
                  {currentMemory.date}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Snapshot Button */}
            <button
              type="button"
              onClick={handleTakeSnapshot}
              disabled={isCapturing}
              className="hide-on-snapshot px-4 py-1.5 rounded-full bg-gradient-to-r from-[#b76e79] via-[#c47c87] to-[#8d3d4b] hover:from-[#c57984] hover:to-[#9b4957] border border-[#f7e7ce]/40 text-xs font-serif-display font-medium text-[#fffdf9] flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#b76e79]/20 transition-all active:scale-95 disabled:opacity-50"
              title="Save memory card as an image file"
            >
              <Camera className="w-3.5 h-3.5 text-[#ffdab9]" />
              <span>{isCapturing ? 'Saving...' : 'Snapshot'}</span>
            </button>
          </div>
        </div>

        {/* Carousel Image Container with Ken Burns effect */}
        <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#240a2c] border border-[#f7e7ce]/20 shadow-inner group">
          {displayImage ? (
            <img
              src={displayImage}
              alt={currentMemory.title}
              className="w-full h-full object-cover animate-ken-burns transition-all duration-700"
              style={{
                filter: activeFilter.cssFilter,
                transition: 'filter 0.4s ease-in-out',
              }}
            />
          ) : (
            /* Elegant styled SVG photo placeholder when no custom photo is supplied */
            <div
              className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#3b0f44] via-[#2a0b32] to-[#1c0622] relative overflow-hidden transition-all duration-500"
              style={{
                filter: activeFilter.cssFilter !== 'none' ? activeFilter.cssFilter : undefined,
                transition: 'filter 0.4s ease-in-out',
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(#b76e79_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

              <div className="relative z-10 w-20 h-20 rounded-full bg-[#f7e7ce]/10 border border-[#ffdab9]/30 flex items-center justify-center mb-4 text-[#ffdab9] shadow-lg animate-pulse-soft">
                <Camera className="w-10 h-10" />
              </div>

              <span className="relative z-10 font-serif-display text-lg sm:text-xl md:text-2xl text-[#fffdf9] font-medium mb-1">
                {currentMemory.title}
              </span>

              <p className="relative z-10 text-xs sm:text-sm text-[#e6e6fa]/70 max-w-md font-sans italic">
                "{currentMemory.caption}"
              </p>

              <div className="relative z-10 mt-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-[#f7e7ce]/30 text-xs font-serif-display text-[#fffdf9] flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5 text-[#ffdab9]" />
                  <span>Personalize Photo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCustomUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Aesthetic Filter Overlay Layer */}
          {activeFilter.overlayClass && (
            <div
              className={`absolute inset-0 pointer-events-none transition-all duration-500 ${activeFilter.overlayClass}`}
            />
          )}

          {/* Active Filter Badge */}
          {activeFilter.id !== 'normal' && (
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-serif-display text-[#ffdab9] pointer-events-none flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-[#ffdab9]" />
              <span>{activeFilter.name} Tone</span>
            </div>
          )}

          {/* Quick upload icon in corner */}
          {displayImage && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Replace photo"
              className="hide-on-snapshot absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-[#fffdf9] border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
            </button>
          )}

          {/* Side arrow buttons */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous memory"
            className="hide-on-snapshot absolute left-3 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-[#fffdf9] border border-white/20 backdrop-blur-md transition-all cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next memory"
            className="hide-on-snapshot absolute right-3 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-[#fffdf9] border border-white/20 backdrop-blur-md transition-all cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Aesthetic Photo Filter Segmented Control */}
        <div className="hide-on-snapshot mt-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 px-1 py-1">
          <div className="flex items-center gap-1.5 text-xs font-serif-display text-[#f7e7ce]/80">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#ffdab9]" />
            <span className="font-medium tracking-wide">Photo Filter:</span>
            <span className="text-[#ffdab9] font-normal italic">
              {activeFilter.name} · {activeFilter.description}
            </span>
          </div>

          <div
            role="toolbar"
            aria-label="Photo filter selection"
            className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-[#f7e7ce]/15 backdrop-blur-md overflow-x-auto max-w-full"
          >
            {PHOTO_FILTERS.map((filter) => {
              const isActive = selectedFilterId === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => {
                    sound.playNavClick();
                    setSelectedFilterId(filter.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-serif-display transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#b76e79] to-[#914d57] text-[#fffdf9] shadow-sm font-semibold'
                      : 'text-[#e6e6fa]/70 hover:text-[#fffdf9] hover:bg-white/5'
                  }`}
                  aria-pressed={isActive}
                  title={filter.description}
                >
                  {isActive && <Check className="w-3 h-3 text-[#ffdab9]" />}
                  <span>{filter.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Caption below Image */}
        <div className="mt-4 text-center px-4">
          <p className="font-serif-display text-base sm:text-lg md:text-xl text-[#f7e7ce] leading-relaxed">
            "{currentMemory.caption}"
          </p>
        </div>

        {/* Keepsake Footer Watermark (visible in snapshot) */}
        <div className="mt-5 pt-3 border-t border-[#f7e7ce]/10 flex items-center justify-between text-[11px] font-serif-display text-[#ffdab9]/70 px-2">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#ffdab9]" />
            <span>Dedicated to Meera</span>
          </span>
          <span className="italic">Happy Birthday Meera ✨</span>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="hide-on-snapshot flex items-center justify-center gap-2 mt-5">
          {memories.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                sound.playNavClick();
                setCurrentIndex(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-8 bg-[#ffdab9] shadow-sm'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Memory Timeline Section */}
      <div className="mt-16 md:mt-24">
        <div className="text-center mb-12">
          <span className="text-xs font-serif-display uppercase tracking-widest text-[#ffdab9] flex items-center justify-center gap-1.5 mb-2">
            <Heart className="w-3.5 h-3.5 fill-[#ffdab9]/30" />
            Milestones of Us
          </span>
          <h3 className="font-serif-display text-3xl sm:text-4xl text-[#fffdf9] font-medium">
            The Journey Timeline
          </h3>
          <p className="text-xs sm:text-sm text-[#e6e6fa]/70 max-w-md mx-auto mt-1 font-sans">
            From the very first hello to celebrating you today and all the adventures still ahead.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l border-[#b76e79]/30 ml-4 sm:ml-8 md:ml-32 space-y-8 md:space-y-12">
          {timeline.map((item, idx) => {
            const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
            const roman = romanNumerals[idx] || `${idx + 1}`;
            return (
              <div key={item.id} className="relative pl-6 sm:pl-8 group">
                {/* Timeline Node Dot */}
                <div
                  className={`absolute -left-[11px] top-2 w-5 h-5 rounded-full border-2 transition-transform duration-300 flex items-center justify-center ${
                    item.highlight
                      ? 'bg-[#b76e79] border-[#ffdab9] scale-125 shadow-lg shadow-[#b76e79]/60 animate-pulse-soft'
                      : 'bg-[#25092f] border-[#f7e7ce]/40 group-hover:border-[#ffdab9]'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#fffdf9]" />
                </div>

                {/* Timeline Card */}
                <div
                  className={`glass-panel rounded-2xl p-5 sm:p-7 transition-all duration-300 hover:translate-x-1.5 ${
                    item.highlight
                      ? 'border-[#ffdab9]/40 bg-gradient-to-r from-[#440f4e]/90 via-[#310b38]/90 to-[#220727]/90 shadow-2xl shadow-[#b76e79]/25 ring-1 ring-[#ffdab9]/30'
                      : 'border-[#f7e7ce]/15'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                    <span className="font-serif-display uppercase tracking-[0.2em] text-[#ffdab9] font-semibold">
                      Chapter {roman}
                    </span>
                    {item.highlight && (
                      <span className="font-serif-display italic text-[#ffdab9] text-xs">
                        Birthday Celebration ✨
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif-display text-xl sm:text-2xl font-semibold text-[#fffdf9] mb-2 tracking-wide">
                    {item.title}
                  </h4>

                  <p className="font-serif-display text-xs sm:text-sm text-[#e6e6fa]/90 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
