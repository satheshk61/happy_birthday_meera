import React, { useState, useEffect, useRef } from 'react';
import { Mail, Gift, Sparkles, FastForward, RotateCcw } from 'lucide-react';
import { BirthdayConfig } from '../birthdayConfig';
import { sound } from '../utils/audio';

interface LetterSectionProps {
  config: BirthdayConfig;
  isActive: boolean;
  onOpenSurprise: () => void;
}

export const LetterSection: React.FC<LetterSectionProps> = ({
  config,
  isActive,
  onOpenSurprise,
}) => {
  const fullText = config.letterText;
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const typingTimerRef = useRef<any>(null);

  // Start typewriter effect when the section becomes active
  useEffect(() => {
    if (!isActive) return;

    if (displayedLength >= fullText.length) {
      setIsTypingComplete(true);
      return;
    }

    typingTimerRef.current = setInterval(() => {
      setDisplayedLength((prev) => {
        if (prev >= fullText.length) {
          clearInterval(typingTimerRef.current);
          setIsTypingComplete(true);
          return fullText.length;
        }

        // Play gentle typewriter audio every 4 characters
        if (prev % 4 === 0) {
          sound.playTypewriterTap();
        }

        return prev + 1;
      });
    }, 28);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [isActive, fullText.length]);

  const handleSkipToEnd = () => {
    sound.playNavClick();
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setDisplayedLength(fullText.length);
    setIsTypingComplete(true);
  };

  const handleRestart = () => {
    sound.playNavClick();
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setDisplayedLength(0);
    setIsTypingComplete(false);
  };

  return (
    <section className="relative py-12 md:py-20 px-4 max-w-3xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-10 md:mb-12">
        <span className="text-xs font-serif-display uppercase tracking-widest text-[#ffdab9] flex items-center justify-center gap-1.5 mb-2">
          <Mail className="w-3.5 h-3.5" />
          Words From The Heart
        </span>
        <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#fffdf9] via-[#ffdab9] to-[#f7e7ce] font-semibold py-1">
          A Letter For {config.name}
        </h2>
        <p className="font-serif-display text-sm sm:text-base text-[#e6e6fa]/70 max-w-lg mx-auto mt-2 italic">
          Written with genuine warmth and immense appreciation.
        </p>
      </div>

      {/* Parchment / Glass Hybrid Letter Card */}
      <div className="relative rounded-3xl p-7 sm:p-11 md:p-14 parchment-sheet text-[#2c0a32] overflow-hidden">
        {/* Subtle deckled border & gold foil inner hairline */}
        <div className="absolute inset-3 rounded-2xl border border-[#b76e79]/20 pointer-events-none" />

        {/* Vintage stationery watermark */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#b76e79]/10 via-[#ffdab9]/10 to-transparent pointer-events-none rounded-bl-full" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#ffdab9]/15 pointer-events-none rounded-tr-full" />

        {/* Letter Top Controls */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#2c0a32]/10 text-xs font-serif-display text-[#2c0a32]/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#b76e79]" />
            <span className="tracking-[0.2em] uppercase font-medium">Personal & Confidential · Birthday Note</span>
          </div>

          <div className="flex items-center gap-2">
            {!isTypingComplete ? (
              <button
                type="button"
                onClick={handleSkipToEnd}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2c0a32]/5 hover:bg-[#2c0a32]/10 text-[#2c0a32] font-serif-display text-xs transition-all cursor-pointer font-medium"
              >
                <FastForward className="w-3.5 h-3.5 text-[#b76e79]" />
                <span>Read Instantly</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2c0a32]/5 hover:bg-[#2c0a32]/10 text-[#2c0a32] font-serif-display text-xs transition-all cursor-pointer font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#b76e79]" />
                <span>Replay Typing</span>
              </button>
            )}
          </div>
        </div>

        {/* Letter Salutation */}
        <div className="mb-6">
          <h3 className="font-script text-4xl sm:text-5xl text-[#3d1145] font-bold tracking-wide">
            {config.letterGreeting}
          </h3>
        </div>

        {/* Typewritten Message Body with optimal measure and line-height */}
        <div className="font-serif-display text-base sm:text-lg md:text-xl leading-[1.85] text-[#2c0a32]/95 whitespace-pre-line tracking-normal min-h-[240px] font-normal">
          {fullText.slice(0, displayedLength)}
          {!isTypingComplete && (
            <span className="inline-block w-2.5 h-6 bg-[#b76e79] ml-1.5 animate-cursor align-middle" />
          )}
        </div>

        {/* Signoff with Monogram Wax Seal stamp */}
        {displayedLength > 200 && (
          <div className="mt-10 pt-6 border-t border-[#2c0a32]/10 flex items-center justify-between">
            {/* Monogram Seal Stamp */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#852a3a] to-[#4e111d] border border-[#ffdab9]/60 flex items-center justify-center text-white shadow-md">
                <span className="font-serif-display font-bold text-lg text-[#ffdab9]">M</span>
              </div>
              <div className="hidden sm:block text-[11px] font-serif-display italic text-[#2c0a32]/60">
                Sealed with immense love & joy
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="font-serif-display italic text-sm text-[#2c0a32]/70 font-light">
                {config.letterSignoff}
              </span>
              <span className="font-script text-3xl sm:text-4xl text-[#7c2838] mt-1 font-bold">
                With All My Heart ✨
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Secret Surprise Reveal Trigger (Unlocks once typewriter finishes or if completed) */}
      <div
        className={`mt-10 text-center transition-all duration-700 ${
          isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <p className="font-script text-2xl sm:text-3xl text-[#ffdab9] mb-3">
          There’s one more thing…
        </p>

        <button
          type="button"
          onClick={() => {
            sound.playNavClick();
            onOpenSurprise();
          }}
          className="relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#b76e79] via-[#c97b87] to-[#8d3d4b] hover:from-[#c47c87] hover:to-[#9b4957] text-[#fffdf9] font-serif-display text-base sm:text-lg font-semibold tracking-wider uppercase shadow-2xl shadow-[#b76e79]/50 border border-[#f7e7ce]/40 transition-all duration-300 transform hover:scale-105 active:scale-95 animate-pulse cursor-pointer"
        >
          <Gift className="w-5 h-5 text-[#ffdab9]" />
          <span>UNLOCK SURPRISE 🎁</span>
          <Sparkles className="w-5 h-5 text-[#ffdab9]" />
        </button>
      </div>
    </section>
  );
};
