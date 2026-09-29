import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Calendar, Heart, Camera, Upload, SlidersHorizontal, Check, Download, CheckCircle2, LayoutGrid, Image as ImageIcon } from 'lucide-react';
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
  onNavigateToGames?: () => void;
}

export const MemoriesSection: React.FC<MemoriesSectionProps> = ({ memories, timeline, onNavigateToGames }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFilterId, setSelectedFilterId] = useState<PhotoFilterId>('normal');
  const [customImages, setCustomImages] = useState<{ [id: number]: string }>({});
  const [likes, setLikes] = useState<{ [id: number]: number }>({ 1: 12, 2: 18, 3: 15, 4: 24, 5: 19, 6: 32 });
  const [viewMode, setViewMode] = useState<'studio' | 'lookbook'>('studio');
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentMemory = memories[currentIndex] || memories[0];
  const activeFilter = PHOTO_FILTERS.find((f) => f.id === selectedFilterId) || PHOTO_FILTERS[0];

  const handlePrev = () => {
    sound.playNavClick();
    setCurrentIndex((prev) => (prev === 0 ? memories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    sound.playNavClick();
    setCurrentIndex((prev) => (prev === memories.length - 1 ? 0 : prev + 1));
  };

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

  const handleLikePhoto = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playNavClick();
    triggerTapSparkle(e.clientX, e.clientY);
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleTakeSnapshot = async () => {
    if (!cardRef.current || isCapturing) return;

    try {
      sound.playCameraShutter();
      setShowFlash(true);
      setIsCapturing(true);

      setTimeout(() => {
        setShowFlash(false);
      }, 250);

      await new Promise((resolve) => setTimeout(resolve, 100));

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

      const link = document.createElement('a');
      const safeTitle = currentMemory.title
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .slice(0, 30);
      link.download = `Meera_BestPhoto_${safeTitle}_${activeFilter.name.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();

      triggerTapSparkle(window.innerWidth / 2, window.innerHeight / 2);
      setToastMessage('Best photo snapshot saved to your device! 📸');
      setTimeout(() => {
        setToastMessage(null);
      }, 3500);
    } catch (err) {
      console.error('Failed to capture snapshot:', err);
      setToastMessage('Could not save photo. Please try again!');
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
      <div className="text-center mb-8 md:mb-12">
        <span className="text-xs font-serif-display uppercase tracking-widest text-[#ffdab9] flex items-center justify-center gap-1.5 mb-2">
          <Camera className="w-3.5 h-3.5 text-[#ffdab9]" />
          Editorial Portrait Lookbook · Dedicated to Meera
        </span>
        <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#fffdf9] via-[#ffdab9] to-[#f7e7ce] font-semibold py-1">
          Best Photos of Her
        </h2>
        <p className="font-serif-display text-sm sm:text-base text-[#e6e6fa]/70 max-w-lg mx-auto mt-2 italic">
          A handpicked visual collection capturing her radiant grace, unforgettable laughter, and timeless charm.
        </p>

        {/* View Mode Switcher: Studio Keepsake vs Lookbook Grid */}
        <div className="inline-flex items-center p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mt-6 shadow-md">
          <button
            type="button"
            onClick={() => {
              sound.playNavClick();
              setViewMode('studio');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-serif-display flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'studio'
                ? 'bg-gradient-to-r from-[#b76e79] to-[#8d3d4b] text-[#fffdf9] shadow-sm font-semibold'
                : 'text-[#e6e6fa]/70 hover:text-[#fffdf9]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Studio Keepsake</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playNavClick();
              setViewMode('lookbook');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-serif-display flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'lookbook'
                ? 'bg-gradient-to-r from-[#b76e79] to-[#8d3d4b] text-[#fffdf9] shadow-sm font-semibold'
                : 'text-[#e6e6fa]/70 hover:text-[#fffdf9]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Lookbook Gallery</span>
          </button>
        </div>
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

      {/* ======================================================== */}
      {/* VIEW MODE 1: STUDIO KEEPSAKE POLAROID SLIDER              */}
      {/* ======================================================== */}
      {viewMode === 'studio' && (
        <div
          ref={cardRef}
          className="relative glass-panel rounded-3xl p-4 sm:p-8 md:p-10 mb-16 shadow-2xl overflow-hidden border border-[#f7e7ce]/20 animate-fade-in"
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

          {/* Header inside carousel: Metadata & Snapshot Action */}
          <div className="flex items-center justify-between mb-4 md:mb-6 text-xs sm:text-sm font-serif-display text-[#f7e7ce]/80">
            <div className="flex items-center gap-2">
              <span className="font-mono tabular-nums text-base sm:text-lg font-bold text-[#ffdab9]">
                {String(currentIndex + 1).padStart(2, '0')} / {String(memories.length).padStart(2, '0')}
              </span>
              <span aria-hidden="true" className="text-[#f7e7ce]/30">·</span>
              <span className="text-[#ffdab9] font-medium tracking-wide">
                {currentMemory.tag || 'Portrait'}
              </span>
              {currentMemory.date && (
                <>
                  <span aria-hidden="true" className="text-[#f7e7ce]/30 hidden sm:inline">·</span>
                  <span className="text-[#e6e6fa]/60 hidden sm:inline font-light italic">
                    {currentMemory.date}
                  </span>
                </>
              )}
            </div>

            <div className="hide-on-snapshot flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => handleLikePhoto(currentMemory.id, e)}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-[#b76e79]/40 text-[#ffdab9] text-xs font-serif-display flex items-center gap-1.5 transition-all cursor-pointer active:scale-90"
              >
                <Heart className="w-3.5 h-3.5 fill-[#b76e79] text-[#b76e79]" />
                <span>{likes[currentMemory.id] || 0}</span>
              </button>

              <button
                type="button"
                onClick={handleTakeSnapshot}
                disabled={isCapturing}
                title="Download this photo souvenir"
                className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#b76e79] to-[#914d57] hover:from-[#c47c87] hover:to-[#a4535e] text-[#fffdf9] text-xs font-serif-display font-medium flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save Photo</span>
              </button>
            </div>
          </div>

          {/* Photo Frame Container */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black/40 border border-[#f7e7ce]/25 shadow-2xl flex items-center justify-center group">
            {displayImage ? (
              <img
                src={displayImage}
                alt={`Best photo of Meera: ${currentMemory.title}`}
                className="w-full h-full object-cover transition-all duration-700"
                style={{ filter: activeFilter.cssFilter }}
              />
            ) : (
              /* High-End Editorial Art Canvas Placeholder */
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#2a0d33] via-[#1a0720] to-[#0d0211] relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 border border-[#ffdab9]/30 flex items-center justify-center mb-3 shadow-inner group-hover:scale-105 transition-transform">
                  <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-[#ffdab9]/80" />
                </div>

                <span className="text-[11px] font-serif-display uppercase tracking-widest text-[#ffdab9] mb-1">
                  {currentMemory.tag || 'Portrait Look'}
                </span>

                <h3 className="font-serif-display text-lg sm:text-2xl text-[#fffdf9] font-medium tracking-wide max-w-md">
                  {currentMemory.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#e6e6fa]/70 max-w-sm mt-2 italic font-light">
                  "{currentMemory.caption}"
                </p>

                <div className="hide-on-snapshot mt-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-[#f7e7ce]/30 text-xs font-serif-display text-[#fffdf9] flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#ffdab9]" />
                    <span>Upload Her Best Photo</span>
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
              aria-label="Previous photo"
              className="hide-on-snapshot absolute left-3 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-[#fffdf9] border border-white/20 backdrop-blur-md transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next photo"
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
            <span className="italic">Best Photos of Her ✨</span>
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
                aria-label={`Go to photo ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-8 bg-[#ffdab9] shadow-sm'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW MODE 2: EDITORIAL PHOTO LOOKBOOK GRID                */}
      {/* ======================================================== */}
      {viewMode === 'lookbook' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16 animate-fade-in">
          {memories.map((photo, idx) => {
            const imgUrl = customImages[photo.id] || photo.image;
            return (
              <div
                key={photo.id}
                onClick={() => {
                  sound.playNavClick();
                  setCurrentIndex(idx);
                  setViewMode('studio');
                }}
                className="group relative rounded-3xl bg-black/30 border border-[#f7e7ce]/20 p-4 backdrop-blur-xl shadow-xl hover:border-[#ffdab9]/50 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
              >
                {/* Photo container */}
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#2a0d33] via-[#1a0720] to-[#0d0211] border border-white/10 mb-3 relative flex items-center justify-center">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 text-center">
                      <Camera className="w-8 h-8 text-[#ffdab9]/70 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-serif-display uppercase tracking-widest text-[#ffdab9]">
                        {photo.tag || 'Portrait'}
                      </span>
                    </div>
                  )}

                  {/* Tag badge */}
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-serif-display text-[#ffdab9]">
                    {photo.tag}
                  </span>

                  {/* Heart like button */}
                  <button
                    type="button"
                    onClick={(e) => handleLikePhoto(photo.id, e)}
                    className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-serif-display text-[#fffdf9] flex items-center gap-1 transition-all"
                  >
                    <Heart className="w-3 h-3 text-[#b76e79] fill-[#b76e79]" />
                    <span>{likes[photo.id] || 0}</span>
                  </button>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif-display text-sm sm:text-base font-bold text-[#fffdf9] mb-1 line-clamp-1">
                      {photo.title}
                    </h4>
                    <p className="text-xs text-[#e6e6fa]/70 font-sans italic line-clamp-2">
                      "{photo.caption}"
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-serif-display text-[#ffdab9]">
                    <span>View in Studio 📸</span>
                    <span className="text-white/40 text-[10px]">{photo.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Her Journey & Milestones Section */}
      <div className="mt-16 md:mt-24">
        <div className="text-center mb-12">
          <span className="text-xs font-serif-display uppercase tracking-widest text-[#ffdab9] flex items-center justify-center gap-1.5 mb-2">
            <Heart className="w-3.5 h-3.5 fill-[#ffdab9]/30" />
            Her Journey & Milestones
          </span>
          <h3 className="font-serif-display text-3xl sm:text-4xl text-[#fffdf9] font-medium">
            Chapters of Her Story
          </h3>
          <p className="text-xs sm:text-sm text-[#e6e6fa]/70 max-w-md mx-auto mt-1 font-sans">
            From the very first hello to celebrating her today and all the adventures still ahead.
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
                    <div className="flex items-center gap-2">
                      <span className="font-serif-display uppercase tracking-[0.2em] text-[#ffdab9] font-semibold">
                        Chapter {roman}
                      </span>
                      {item.period && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-sans bg-white/10 text-[#f7e7ce] border border-white/10">
                          {item.period}
                        </span>
                      )}
                    </div>
                    {item.highlight && (
                      <span className="font-serif-display italic text-[#ffdab9] text-xs">
                        Birthday Celebration ✨
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif-display text-xl sm:text-2xl font-semibold text-[#fffdf9] mb-2 tracking-wide">
                    {item.title}
                  </h4>

                  {item.quote && (
                    <blockquote className="my-2.5 pl-3 border-l-2 border-[#ffdab9]/50 italic text-[#ffdab9] text-xs sm:text-sm font-serif-display bg-white/5 py-2 pr-3 rounded-r-xl">
                      "{item.quote}"
                    </blockquote>
                  )}

                  <p className="font-serif-display text-xs sm:text-sm text-[#e6e6fa]/90 leading-relaxed font-light mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guided Storybook Flow Banner */}
      {onNavigateToGames && (
        <div className="mt-16 text-center p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#2f0c39]/90 via-[#210729]/95 to-[#16041c]/90 border border-[#ffdab9]/35 shadow-2xl">
          <span className="text-xs uppercase tracking-widest text-[#ffdab9] font-semibold block mb-1">
            Next Chapter in Your Birthday Journey ✦
          </span>
          <h4 className="font-serif-display text-xl sm:text-2xl text-[#fffdf9] font-bold mb-2">
            The Celebration Arcade & Story Matching
          </h4>
          <p className="text-xs sm:text-sm text-[#f5ecfc] max-w-md mx-auto mb-5 leading-relaxed">
            Pop secret wish balloons and reconstruct our journey milestone by milestone through the memory match game!
          </p>
          <button
            type="button"
            onClick={() => {
              sound.playNavClick();
              onNavigateToGames();
            }}
            className="px-7 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 font-serif-display font-bold text-xs tracking-wider uppercase shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Play Arcade Games & Unlock Stories 🎮</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
