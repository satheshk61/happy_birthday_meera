import React from 'react';
import { Sparkles, Heart, Gift, ArrowRight, Gamepad2, Camera } from 'lucide-react';
import { BirthdayConfig } from '../birthdayConfig';
import { sound } from '../utils/audio';

interface HeroSectionProps {
  config: BirthdayConfig;
  onNavigateToMemories: () => void;
  onNavigateToLetter: () => void;
  onOpenSurprise: () => void;
  onNavigateToGames?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  onNavigateToMemories,
  onNavigateToLetter,
  onOpenSurprise,
  onNavigateToGames,
}) => {
  return (
    <section className="relative min-h-[calc(100dvh-5rem)] flex flex-col items-center justify-center px-3 sm:px-6 py-6 sm:py-12 md:py-16 text-center max-w-5xl mx-auto">
      {/* Decorative Editorial Kicker */}
      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/5 border border-[#f7e7ce]/20 backdrop-blur-md mb-4 sm:mb-6 shadow-sm">
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ffdab9] shrink-0" />
        <span className="font-serif-display text-[9px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.15em] text-[#ffdab9] uppercase font-medium">
          A Celebration Dedicated to You • 2026
        </span>
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ffdab9] shrink-0" />
      </div>

      {/* Main Heading with High-Fashion Editorial Typography Lockup */}
      <div className="relative mb-4 sm:mb-6 max-w-3xl mx-auto w-full">
        {/* Subtle decorative floating accents */}
        <Heart className="absolute -top-4 sm:-top-6 -left-1 sm:-left-6 md:-left-12 w-5 h-5 sm:w-6 sm:h-6 text-[#b76e79]/70 fill-[#b76e79]/30 animate-float" />
        <Sparkles className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-6 md:-right-10 w-5 h-5 sm:w-6 sm:h-6 text-[#ffdab9]/80 animate-pulse-soft" />

        <div className="flex flex-col items-center">
          <span className="font-serif-display italic font-normal text-xl sm:text-3xl md:text-5xl text-[#ffdab9] tracking-wide block mb-0.5 sm:mb-1">
            Happy Birthday,
          </span>
          <h1 className="font-script font-bold text-4xl sm:text-7xl md:text-8xl gold-foil-text drop-shadow-2xl tracking-tight leading-tight py-1">
            {config.name}
          </h1>
        </div>
      </div>

      {/* Subtitle */}
      <p className="font-serif-display text-xs sm:text-lg md:text-xl text-[#f7e7ce]/90 max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed font-light tracking-wide text-balance px-2">
        {config.subtitle}
      </p>

      {/* Primary Actions / Exploration Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3.5 w-full max-w-2xl mx-auto px-1 sm:px-2">
        <button
          type="button"
          onClick={() => {
            sound.playNavClick();
            onOpenSurprise();
          }}
          className="group w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-2xl sm:rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-stone-950 font-serif-display font-bold text-xs sm:text-sm tracking-wider uppercase shadow-2xl shadow-amber-400/30 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 animate-pulse"
        >
          <span>Cut Birthday Cake 🎂</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playNavClick();
            onNavigateToMemories();
          }}
          className="group w-full sm:w-auto min-h-[44px] px-5 py-3 rounded-2xl sm:rounded-full bg-gradient-to-r from-[#b76e79] via-[#c47c87] to-[#8d3d4b] hover:from-[#c57984] hover:to-[#9b4957] text-[#fffdf9] text-xs sm:text-sm font-serif-display font-medium tracking-wide shadow-xl shadow-[#b76e79]/35 border border-[#f7e7ce]/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Camera className="w-4 h-4 text-[#ffdab9] group-hover:scale-110 transition-transform shrink-0" />
          <span>Best Photos & Milestones</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
        </button>

        {onNavigateToGames && (
          <button
            type="button"
            onClick={() => {
              sound.playNavClick();
              onNavigateToGames();
            }}
            className="group w-full sm:w-auto min-h-[44px] px-5 py-3 rounded-2xl sm:rounded-full bg-white/10 hover:bg-white/15 border border-[#f7e7ce]/30 text-[#fffdf9] text-xs sm:text-sm font-serif-display font-medium tracking-wide shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Gamepad2 className="w-4 h-4 text-[#ffdab9] group-hover:rotate-12 transition-transform shrink-0" />
            <span>Play Birthday Games</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            sound.playNavClick();
            onNavigateToLetter();
          }}
          className="w-full sm:w-auto min-h-[44px] px-5 py-3 rounded-2xl sm:rounded-full bg-white/10 hover:bg-white/15 border border-[#f7e7ce]/30 text-[#fffdf9] text-xs sm:text-sm font-serif-display font-medium tracking-wide backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-md"
        >
          <Gift className="w-4 h-4 text-[#ffdab9] shrink-0" />
          <span>Read Doctor Paapa's Letter</span>
        </button>
      </div>
    </section>
  );
};
