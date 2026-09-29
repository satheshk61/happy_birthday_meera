import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, X, Wind, PartyPopper } from 'lucide-react';
import { BirthdayConfig } from '../birthdayConfig';
import { sound } from '../utils/audio';
import { triggerSurpriseConfetti } from '../utils/confetti';

interface SurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BirthdayConfig;
}

export const SurpriseModal: React.FC<SurpriseModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [candleBlown, setCandleBlown] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      sound.playSurpriseReveal();
      triggerSurpriseConfetti();
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
      setCandleBlown(false);
    }
  }, [isOpen]);

  const handleBlowCandle = () => {
    if (candleBlown) return;
    sound.playBlowCandle();
    setCandleBlown(true);
    triggerSurpriseConfetti();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      {/* Floating golden and rose light particles in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-[#b76e79]/30 via-[#ffdab9]/30 to-[#f7e7ce]/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Modal Card */}
      <div
        className={`relative w-full max-w-xl my-8 rounded-3xl p-6 sm:p-10 border border-[#f7e7ce]/40 bg-gradient-to-b from-[#2e0b38] via-[#210729] to-[#16041c] shadow-2xl shadow-[#100314]/95 text-center transition-all duration-700 transform ${
          showContent ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-6'
        }`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sound.playNavClick();
            onClose();
          }}
          className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-[#f7e7ce] transition-all cursor-pointer"
          aria-label="Close surprise window"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Floating Heart / Sparkle Banner */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#ffdab9] animate-spin-slow" />
          <span className="text-xs font-serif-display uppercase tracking-widest text-[#ffdab9]">
            {config.surpriseTitle}
          </span>
          <Sparkles className="w-5 h-5 text-[#ffdab9] animate-spin-slow" />
        </div>

        {/* Recipient Special Title */}
        <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#fffdf9] via-[#ffdab9] to-[#f7e7ce] font-bold py-1">
          {config.surpriseMessage}
        </h2>

        {/* Heart icon separator */}
        <div className="flex items-center justify-center gap-3 my-6">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#b76e79]/60" />
          <Heart className="w-5 h-5 text-[#b76e79] fill-[#b76e79]/40" />
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#b76e79]/60" />
        </div>

        {/* Detailed heartfelt birthday wish */}
        <p className="font-serif-display text-base sm:text-lg md:text-xl text-[#f7e7ce]/95 leading-relaxed max-w-lg mx-auto mb-8 font-light italic">
          "{config.surpriseWish}"
        </p>

        {/* Interactive Birthday Cake & Candle */}
        <div className="my-6 p-6 sm:p-8 rounded-3xl bg-black/30 border border-[#ffdab9]/25 backdrop-blur-md relative overflow-hidden shadow-2xl">
          <div className="flex flex-col items-center justify-center">
            {/* Candle with Flickering Flame */}
            <div className="relative mb-2 flex flex-col items-center">
              {/* Flame or Smoke */}
              {!candleBlown ? (
                <div className="relative w-5 h-7 mb-1 flex items-center justify-center">
                  <div className="w-4 h-6 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 shadow-xl shadow-amber-400/90 animate-pulse-soft" />
                  <div className="absolute w-8 h-8 rounded-full bg-amber-400/40 blur-md pointer-events-none" />
                </div>
              ) : (
                /* Wisp of smoke after candle blown */
                <div className="h-7 flex items-center justify-center text-[#ffdab9] text-xs font-serif-display italic animate-fade-in">
                  <Wind className="w-4 h-4 mr-1 text-slate-300 animate-pulse" />
                  <span className="text-slate-300">Your wish is cast into the stars! ✨</span>
                </div>
              )}

              {/* Candle Body */}
              <div className="w-3.5 h-10 bg-gradient-to-b from-[#f7e7ce] via-[#ffdab9] to-[#e8b59e] rounded-sm border border-[#b76e79]/50 shadow-md" />
            </div>

            {/* Artisanal Cake Layers */}
            <div className="w-32 sm:w-40 h-7 rounded-t-2xl bg-gradient-to-r from-[#b76e79] via-[#d68593] to-[#b76e79] border-t-2 border-[#fffdf9]/50 shadow-inner flex items-center justify-around px-3">
              <span className="w-2 h-2 rounded-full bg-[#f7e7ce]/80 shadow-xs" />
              <span className="w-2 h-2 rounded-full bg-[#f7e7ce]/80 shadow-xs" />
              <span className="w-2 h-2 rounded-full bg-[#f7e7ce]/80 shadow-xs" />
            </div>
            <div className="w-40 sm:w-52 h-10 rounded-b-2xl bg-gradient-to-r from-[#591b2c] via-[#7d2c41] to-[#591b2c] shadow-lg flex items-center justify-center border-b border-[#f7e7ce]/20">
              <span className="font-script text-base text-[#fffdf9] font-bold tracking-wide">Happy Birthday Meera</span>
            </div>

            {/* Cake Plate with champagne trim */}
            <div className="w-52 sm:w-64 h-2.5 rounded-full bg-gradient-to-r from-[#f7e7ce]/20 via-[#ffdab9]/50 to-[#f7e7ce]/20 mt-1 shadow-md border-t border-white/20" />
          </div>

          {/* Blow candle button */}
          <div className="mt-6">
            {!candleBlown ? (
              <button
                type="button"
                onClick={handleBlowCandle}
                className="px-7 py-3 rounded-full bg-gradient-to-r from-[#b76e79] via-[#c47c87] to-[#8d3d4b] hover:from-[#c57984] hover:to-[#9b4957] text-[#fffdf9] text-xs sm:text-sm font-serif-display font-semibold tracking-wider shadow-xl shadow-[#b76e79]/40 border border-[#f7e7ce]/40 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 mx-auto"
              >
                <Wind className="w-4 h-4 text-[#ffdab9]" />
                <span>Make a Wish & Blow The Candle 🎂</span>
              </button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs sm:text-sm text-[#ffdab9] font-serif-display tracking-wide font-medium">
                  May every dream you hold come true! 🎉
                </span>
                <button
                  type="button"
                  onClick={handleBlowCandle}
                  className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs text-[#fffdf9] font-serif-display flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <PartyPopper className="w-3.5 h-3.5 text-[#ffdab9]" />
                  <span>Celebrate Again</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Back to celebration action */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              sound.playNavClick();
              onClose();
            }}
            className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-[#f7e7ce]/30 text-[#fffdf9] text-xs font-serif-display tracking-wider uppercase transition-all cursor-pointer"
          >
            Keep Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
