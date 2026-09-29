import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Clock, Gift, ArrowRight, Gamepad2, Camera } from 'lucide-react';
import { BirthdayConfig } from '../birthdayConfig';
import { triggerHeroConfetti } from '../utils/confetti';
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
  // Live counter calculation
  const [timePassed, setTimePassed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const startDate = new Date(config.friendshipDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - startDate);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimePassed({ days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [config.friendshipDate]);

  const handleCelebrateClick = () => {
    sound.playEnvelopeOpen();
    triggerHeroConfetti();
  };

  return (
    <section className="relative min-h-[calc(100dvh-5.5rem)] flex flex-col items-center justify-center px-4 sm:px-6 py-8 md:py-16 text-center max-w-5xl mx-auto">
      {/* Decorative Editorial Kicker */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 rounded-full bg-white/5 border border-[#f7e7ce]/20 backdrop-blur-md mb-5 sm:mb-6 shadow-sm">
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ffdab9]" />
        <span className="font-serif-display text-[10px] sm:text-[11px] tracking-[0.15em] text-[#ffdab9] uppercase font-medium">
          A Celebration Dedicated to You · 2026
        </span>
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ffdab9]" />
      </div>

      {/* Main Heading with High-Fashion Editorial Typography Lockup */}
      <div className="relative mb-6 max-w-3xl mx-auto">
        {/* Subtle decorative floating accents */}
        <Heart className="absolute -top-6 -left-3 sm:-left-8 md:-left-12 w-6 h-6 text-[#b76e79]/70 fill-[#b76e79]/30 animate-float" />
        <Sparkles className="absolute -bottom-2 -right-3 sm:-right-6 md:-right-10 w-6 h-6 text-[#ffdab9]/80 animate-pulse-soft" />

        <div className="flex flex-col items-center">
          <span className="font-serif-display italic font-normal text-2xl sm:text-4xl md:text-5xl text-[#ffdab9] tracking-wide block mb-1">
            Happy Birthday,
          </span>
          <h1 className="font-script font-bold text-5xl sm:text-7xl md:text-9xl gold-foil-text drop-shadow-2xl tracking-tight leading-none py-2">
            {config.name}
          </h1>
        </div>
      </div>

      {/* Subtitle */}
      <p className="font-serif-display text-base sm:text-xl md:text-2xl text-[#f7e7ce]/90 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed font-light tracking-wide text-balance px-2">
        {config.subtitle}
      </p>

      {/* Friendship / Memories Horological Counter */}
      <div className="w-full max-w-2xl mb-8 sm:mb-12">
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-9 relative overflow-hidden border border-[#f7e7ce]/25 shadow-2xl">
          {/* Subtle light pool in corner */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#b76e79]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#ffdab9]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Unboxed Horological Header */}
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6 text-[#ffdab9] text-[10px] sm:text-xs font-serif-display uppercase tracking-[0.15em]">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ffdab9] shrink-0" />
            <span className="text-center leading-tight">Cherishing Every Moment Since {config.friendshipDate}</span>
          </div>

          {/* Horological Time Display Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            <div className="horological-card flex flex-col items-center justify-center p-2.5 sm:p-5 rounded-xl sm:rounded-2xl">
              <span className="font-serif-display text-xl sm:text-4xl md:text-5xl font-bold text-[#fffdf9] tabular-nums tracking-tight">
                {timePassed.days}
              </span>
              <span className="text-[9px] sm:text-xs font-sans text-[#e6e6fa]/70 uppercase tracking-widest mt-1 font-medium">Days</span>
            </div>
            <div className="horological-card flex flex-col items-center justify-center p-2.5 sm:p-5 rounded-xl sm:rounded-2xl">
              <span className="font-serif-display text-xl sm:text-4xl md:text-5xl font-bold text-[#fffdf9] tabular-nums tracking-tight">
                {String(timePassed.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-xs font-sans text-[#e6e6fa]/70 uppercase tracking-widest mt-1 font-medium">Hours</span>
            </div>
            <div className="horological-card flex flex-col items-center justify-center p-2.5 sm:p-5 rounded-xl sm:rounded-2xl">
              <span className="font-serif-display text-xl sm:text-4xl md:text-5xl font-bold text-[#fffdf9] tabular-nums tracking-tight">
                {String(timePassed.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-xs font-sans text-[#e6e6fa]/70 uppercase tracking-widest mt-1 font-medium">Mins</span>
            </div>
            <div className="horological-card flex flex-col items-center justify-center p-2.5 sm:p-5 rounded-xl sm:rounded-2xl">
              <span className="font-serif-display text-xl sm:text-4xl md:text-5xl font-bold text-[#ffdab9] tabular-nums tracking-tight">
                {String(timePassed.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-xs font-sans text-[#f7e7ce] uppercase tracking-widest mt-1 font-semibold">Secs</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#f5ecfc] font-serif-display mt-4 sm:mt-5 italic max-w-lg mx-auto leading-relaxed">
            "{config.birthdayMessage}"
          </p>
        </div>
      </div>

      {/* Primary Actions / Exploration Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 w-full px-2">
        <button
          type="button"
          onClick={() => {
            sound.playNavClick();
            onOpenSurprise();
          }}
          className="group px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-stone-950 font-serif-display font-bold text-sm tracking-wider uppercase shadow-2xl shadow-amber-400/30 transition-all duration-300 flex items-center gap-2.5 cursor-pointer active:scale-95 animate-pulse"
        >
          <span>Cut Birthday Cake 🎂</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playNavClick();
            onNavigateToMemories();
          }}
          className="group px-6 py-3.5 rounded-full bg-gradient-to-r from-[#b76e79] via-[#c47c87] to-[#8d3d4b] hover:from-[#c57984] hover:to-[#9b4957] text-[#fffdf9] text-sm font-serif-display font-medium tracking-wide shadow-xl shadow-[#b76e79]/35 border border-[#f7e7ce]/30 transition-all duration-300 flex items-center gap-2.5 cursor-pointer active:scale-95"
        >
          <Camera className="w-4 h-4 text-[#ffdab9] group-hover:scale-110 transition-transform" />
          <span>Best Photos & Milestones</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {onNavigateToGames && (
          <button
            type="button"
            onClick={() => {
              sound.playNavClick();
              onNavigateToGames();
            }}
            className="group px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-[#f7e7ce]/30 text-[#fffdf9] text-sm font-serif-display font-medium tracking-wide shadow-md transition-all duration-300 flex items-center gap-2.5 cursor-pointer active:scale-95"
          >
            <Gamepad2 className="w-4 h-4 text-[#ffdab9] group-hover:rotate-12 transition-transform" />
            <span>Play Birthday Games</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            sound.playNavClick();
            onNavigateToLetter();
          }}
          className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-[#f7e7ce]/30 text-[#fffdf9] text-sm font-serif-display font-medium tracking-wide backdrop-blur-md transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95 shadow-md"
        >
          <Gift className="w-4 h-4 text-[#ffdab9]" />
          <span>Read Doctor Paapa's Letter</span>
        </button>
      </div>
    </section>
  );
};
