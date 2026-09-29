import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Clock, Gift, ArrowRight } from 'lucide-react';
import { BirthdayConfig } from '../birthdayConfig';
import { triggerHeroConfetti } from '../utils/confetti';
import { sound } from '../utils/audio';

interface HeroSectionProps {
  config: BirthdayConfig;
  onNavigateToMemories: () => void;
  onNavigateToLetter: () => void;
  onOpenSurprise: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  onNavigateToMemories,
  onNavigateToLetter,
  onOpenSurprise,
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
    <section className="relative min-h-[calc(100dvh-5.5rem)] flex flex-col items-center justify-center px-4 py-10 md:py-16 text-center max-w-5xl mx-auto">
      {/* Decorative Editorial Kicker */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-[#f7e7ce]/20 backdrop-blur-md mb-6 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-[#ffdab9]" />
        <span className="font-serif-display text-[11px] sm:text-xs tracking-[0.2em] text-[#ffdab9] uppercase font-medium">
          A Celebration Dedicated to You · Edition 2026
        </span>
        <Sparkles className="w-3.5 h-3.5 text-[#ffdab9]" />
      </div>

      {/* Main Heading with High-Fashion Editorial Typography Lockup */}
      <div className="relative mb-6 max-w-3xl mx-auto">
        {/* Subtle decorative floating accents */}
        <Heart className="absolute -top-6 -left-3 sm:-left-8 md:-left-12 w-6 h-6 text-[#b76e79]/70 fill-[#b76e79]/30 animate-float" />
        <Sparkles className="absolute -bottom-2 -right-3 sm:-right-6 md:-right-10 w-6 h-6 text-[#ffdab9]/80 animate-pulse-soft" />

        <div className="flex flex-col items-center">
          <span className="font-serif-display italic font-normal text-3xl sm:text-4xl md:text-5xl text-[#ffdab9] tracking-wide block mb-1">
            Happy Birthday,
          </span>
          <h1 className="font-script font-bold text-6xl sm:text-7xl md:text-9xl gold-foil-text drop-shadow-2xl tracking-tight leading-none py-2">
            {config.name}
          </h1>
        </div>
      </div>

      {/* Subtitle with balanced wrap and elegant typography */}
      <p className="font-serif-display text-lg sm:text-xl md:text-2xl text-[#f7e7ce]/90 max-w-xl mx-auto mb-10 leading-relaxed font-light tracking-wide text-balance">
        {config.subtitle}
      </p>

      {/* Friendship / Memories Horological Counter */}
      <div className="w-full max-w-2xl mb-12">
        <div className="glass-panel rounded-3xl p-6 sm:p-9 relative overflow-hidden border border-[#f7e7ce]/25 shadow-2xl">
          {/* Subtle light pool in corner */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#b76e79]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#ffdab9]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Unboxed Horological Header */}
          <div className="flex items-center justify-center gap-2 mb-6 text-[#ffdab9] text-xs font-serif-display uppercase tracking-[0.18em]">
            <Clock className="w-3.5 h-3.5 text-[#ffdab9]" />
            <span>Cherishing Every Moment Since {config.friendshipDate}</span>
          </div>

          {/* Horological Time Display Grid */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
            <div className="horological-card flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl">
              <span className="font-serif-display text-2xl sm:text-4xl md:text-5xl font-bold text-[#fffdf9] tabular-nums tracking-tight">
                {timePassed.days}
              </span>
              <span className="text-[10px] sm:text-xs font-sans text-[#e6e6fa]/70 uppercase tracking-widest mt-1.5 font-medium">
                Days
              </span>
            </div>

            <div className="horological-card flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl">
              <span className="font-serif-display text-2xl sm:text-4xl md:text-5xl font-bold text-[#fffdf9] tabular-nums tracking-tight">
                {String(timePassed.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-sans text-[#e6e6fa]/70 uppercase tracking-widest mt-1.5 font-medium">
                Hours
              </span>
            </div>

            <div className="horological-card flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl">
              <span className="font-serif-display text-2xl sm:text-4xl md:text-5xl font-bold text-[#fffdf9] tabular-nums tracking-tight">
                {String(timePassed.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-sans text-[#e6e6fa]/70 uppercase tracking-widest mt-1.5 font-medium">
                Minutes
              </span>
            </div>

            <div className="horological-card flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl">
              <span className="font-serif-display text-2xl sm:text-4xl md:text-5xl font-bold text-[#ffdab9] tabular-nums tracking-tight">
                {String(timePassed.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-sans text-[#e6e6fa]/70 uppercase tracking-widest mt-1.5 font-medium">
                Seconds
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#e6e6fa]/70 font-serif-display mt-5 italic max-w-lg mx-auto">
            "{config.birthdayMessage}"
          </p>
        </div>
      </div>

      {/* Primary Actions / Exploration Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => {
            sound.playNavClick();
            onNavigateToMemories();
          }}
          className="group px-7 py-3.5 rounded-full bg-gradient-to-r from-[#b76e79] via-[#c47c87] to-[#8d3d4b] hover:from-[#c57984] hover:to-[#9b4957] text-[#fffdf9] text-sm font-serif-display font-medium tracking-wide shadow-xl shadow-[#b76e79]/35 border border-[#f7e7ce]/30 transition-all duration-300 flex items-center gap-2.5 cursor-pointer active:scale-95"
        >
          <span>Explore Our Memories</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          type="button"
          onClick={handleCelebrateClick}
          className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-[#f7e7ce]/30 text-[#f7e7ce] text-sm font-serif-display font-medium tracking-wide backdrop-blur-md transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95 shadow-md"
        >
          <Sparkles className="w-4 h-4 text-[#ffdab9]" />
          <span>Celebrate Meera</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playNavClick();
            onNavigateToLetter();
          }}
          className="px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-[#f7e7ce]/20 text-[#e6e6fa] text-sm font-serif-display font-medium tracking-wide backdrop-blur-md transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Gift className="w-4 h-4 text-[#ffdab9]" />
          <span>Read Your Letter</span>
        </button>
      </div>
    </section>
  );
};
