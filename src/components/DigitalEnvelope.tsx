import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { sound } from '../utils/audio';
import { triggerEnvelopeConfetti } from '../utils/confetti';

interface DigitalEnvelopeProps {
  onOpenComplete: () => void;
  recipientName: string;
}

export const DigitalEnvelope: React.FC<DigitalEnvelopeProps> = ({
  onOpenComplete,
  recipientName,
}) => {
  const [openingState, setOpeningState] = useState<'idle' | 'opening' | 'opened'>('idle');

  const handleOpen = () => {
    if (openingState !== 'idle') return;

    // Step 1: Play sound
    sound.playEnvelopeOpen();
    setOpeningState('opening');

    // Step 2 & 3: Confetti burst
    setTimeout(() => {
      triggerEnvelopeConfetti();
    }, 450);

    // Step 4: Complete transition and fade out
    setTimeout(() => {
      setOpeningState('opened');
      setTimeout(() => {
        onOpenComplete();
      }, 700);
    }, 1100);
  };

  if (openingState === 'opened') {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-700 ${
        openingState === 'opening'
          ? 'bg-black/20 backdrop-blur-sm'
          : 'bg-[#15051a]/95 backdrop-blur-xl'
      }`}
    >
      {/* Light burst effect during opening */}
      {openingState === 'opening' && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[120vw] h-[120vw] rounded-full bg-radial from-[#ffd4a3]/40 via-[#b76e79]/30 to-transparent blur-3xl animate-ping opacity-80" />
        </div>
      )}

      {/* Floating Envelope Container */}
      <div
        className={`relative w-full max-w-md cursor-pointer select-none transition-all duration-700 transform ${
          openingState === 'opening'
            ? 'scale-110 opacity-0 translate-y-[-20px]'
            : 'animate-float hover:scale-[1.02]'
        }`}
        onClick={handleOpen}
      >
        {/* Soft background glow */}
        <div className="absolute -inset-2 bg-gradient-to-r from-[#b76e79]/40 via-[#f7e7ce]/30 to-[#e6e6fa]/30 rounded-3xl blur-xl opacity-75" />

        {/* Outer Envelope Body with Satin Ribbon and Beveled Borders */}
        <div className="relative rounded-3xl p-8 md:p-11 border border-[#f7e7ce]/35 bg-gradient-to-b from-[#330c3d]/90 via-[#27092e]/95 to-[#190420]/95 backdrop-blur-2xl shadow-2xl shadow-[#100314]/95 overflow-hidden">
          {/* Subtle Satin Ribbon Lines (Horizontal & Vertical cross) */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-transparent via-[#b76e79]/15 to-transparent pointer-events-none" />
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 bg-gradient-to-b from-transparent via-[#ffdab9]/10 to-transparent pointer-events-none" />

          {/* Decorative Corner Filigree Stamps */}
          <div className="absolute top-4 left-5 flex items-center gap-1.5 text-[#ffdab9]/50 font-serif-display text-[11px] tracking-[0.2em] uppercase">
            <Sparkles className="w-3 h-3 text-[#ffdab9]" />
            <span>Private & Confidential</span>
          </div>

          <div className="absolute top-4 right-5 text-[#f7e7ce]/40 font-mono text-[10px] tracking-wider">
            NO. 0929 · GIFT
          </div>

          {/* Golden Wax Seal Simulation with Monogram 'M' */}
          <div className="flex justify-center mt-4 mb-7 relative z-10">
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#914d57] via-[#d48995] to-[#f4becc] p-[2.5px] shadow-2xl shadow-[#b76e79]/60 flex items-center justify-center transform group-hover:rotate-6 transition-transform">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#772836] via-[#5c1a26] to-[#400e18] flex flex-col items-center justify-center border border-[#f7e7ce]/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-radial from-white/20 to-transparent pointer-events-none" />
                <span className="font-serif-display font-bold text-2xl text-[#f7e7ce] drop-shadow tracking-tight">
                  M
                </span>
                <span className="text-[7px] text-[#ffdab9]/80 font-mono tracking-widest uppercase">
                  MEERA
                </span>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="text-center space-y-2 relative z-10">
            <p className="font-serif-display italic text-[#e6e6fa]/80 text-xs sm:text-sm tracking-widest uppercase">
              An Intimate Birthday Delivery
            </p>

            <h1 className="font-script text-5xl sm:text-6xl md:text-7xl gold-foil-text font-bold tracking-tight py-1 drop-shadow-md">
              For {recipientName}
            </h1>

            <p className="font-serif-display text-base sm:text-lg text-[#f7e7ce]/95 tracking-wide pt-1 italic font-light">
              “A little something prepared with all my heart…”
            </p>
          </div>

          {/* Tap to open button affordance */}
          <div className="mt-8 pt-2 flex flex-col items-center justify-center relative z-10">
            <button
              type="button"
              className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-[#b76e79] via-[#c97b87] to-[#8d3d4b] hover:from-[#c57984] hover:to-[#9b4957] border border-[#f7e7ce]/40 text-[#fffdf9] text-xs sm:text-sm font-serif-display font-semibold tracking-[0.15em] uppercase shadow-xl shadow-[#b76e79]/30 transition-all duration-300 flex items-center gap-2.5 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#ffdab9] animate-pulse" />
              <span>Tap to Open Letter</span>
              <Sparkles className="w-4 h-4 text-[#ffdab9] animate-pulse" />
            </button>

            <span className="text-[11px] text-[#e6e6fa]/60 mt-3 font-sans">
              (Sound on recommended ♫)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
