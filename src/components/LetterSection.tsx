import React, { useState, useEffect, useRef } from 'react';
import { Mail, Gift, Sparkles, FastForward, RotateCcw, Clock, Copy, Check, ChevronRight, ChevronLeft, Heart, Award, Stethoscope, Cake, Compass, BookOpen } from 'lucide-react';
import { BirthdayConfig, TimelineItem } from '../birthdayConfig';
import { sound } from '../utils/audio';
import { triggerTapSparkle } from '../utils/confetti';

interface LetterSectionProps {
  config: BirthdayConfig;
  isActive: boolean;
  onOpenSurprise: () => void;
}

type LetterViewMode = 'letter' | 'timeline';

const getTimelineIcon = (iconName: string) => {
  switch (iconName) {
    case 'Compass':
      return Compass;
    case 'Sparkles':
      return Sparkles;
    case 'Award':
      return Award;
    case 'Heart':
      return Heart;
    case 'Stethoscope':
      return Stethoscope;
    case 'Cake':
      return Cake;
    default:
      return Sparkles;
  }
};

export const LetterSection: React.FC<LetterSectionProps> = ({
  config,
  isActive,
  onOpenSurprise,
}) => {
  const fullText = config.letterText;
  const [viewMode, setViewMode] = useState<LetterViewMode>('letter');
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(0);
  const typingTimerRef = useRef<any>(null);

  // Start typewriter effect when the section becomes active
  useEffect(() => {
    if (!isActive || viewMode !== 'letter') return;

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
  }, [isActive, viewMode, fullText.length]);

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

  const handleCopyLetter = () => {
    sound.playNavClick();
    const fullLetterContent = `${config.letterGreeting}\n\n${config.letterText}\n\n${config.letterSignoff}`;
    navigator.clipboard.writeText(fullLetterContent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2400);
    });
  };

  const handleSwitchMode = (mode: LetterViewMode) => {
    sound.playNavClick();
    setViewMode(mode);
  };

  const currentTimelineItem = config.timeline[selectedTimelineIndex] || config.timeline[0];

  return (
    <section className="relative py-6 sm:py-12 md:py-16 px-3 sm:px-4 max-w-4xl mx-auto animate-fade-in">
      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-8 md:mb-10">
        <span className="text-[10px] sm:text-xs font-serif-display uppercase tracking-widest text-[#ffdab9] flex items-center justify-center gap-1.5 mb-1.5 sm:mb-2">
          <Mail className="w-3.5 h-3.5 text-[#ffdab9]" />
          Words From The Heart & Memory Chronicles
        </span>
        <h2 className="font-script text-3xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#fffdf9] via-[#ffdab9] to-[#f7e7ce] font-semibold py-1">
          A Letter For {config.name}
        </h2>
        <p className="font-serif-display text-sm sm:text-base text-[#e6e6fa]/85 max-w-lg mx-auto mt-1.5 italic px-2">
          Dedicated to Doctor Paapa: our journey from quiet school childhood to today's sacred promise.
        </p>

        {/* View Mode Switcher Pills */}
        <div className="inline-flex items-center p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mt-4 sm:mt-6 shadow-md gap-1">
          <button
            type="button"
            onClick={() => handleSwitchMode('letter')}
            className={`flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-serif-display font-medium transition-all duration-300 cursor-pointer ${
              viewMode === 'letter'
                ? 'bg-gradient-to-r from-[#b76e79] to-[#8d3d4b] text-[#fffdf9] shadow-md border border-[#f7e7ce]/30 font-semibold'
                : 'text-[#e6e6fa]/70 hover:text-[#fffdf9]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Handwritten Letter</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode('timeline')}
            className={`flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-serif-display font-medium transition-all duration-300 cursor-pointer ${
              viewMode === 'timeline'
                ? 'bg-gradient-to-r from-[#b76e79] to-[#8d3d4b] text-[#fffdf9] shadow-md border border-[#f7e7ce]/30 font-semibold'
                : 'text-[#e6e6fa]/70 hover:text-[#fffdf9]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timeline Chapters</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODE 1: HANDWRITTEN LETTER PARCHMENT VIEW                */}
      {/* ======================================================== */}
      {viewMode === 'letter' && (
        <div className="animate-fade-in">
          {/* Parchment / Glass Hybrid Letter Card */}
          <div className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-9 md:p-14 parchment-sheet text-[#2c0a32] overflow-hidden shadow-2xl">
            {/* Subtle deckled border & gold foil inner hairline */}
            <div className="absolute inset-2 sm:inset-3 rounded-xl sm:rounded-2xl border border-[#b76e79]/20 pointer-events-none" />

            {/* Vintage stationery watermark */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#b76e79]/10 via-[#ffdab9]/10 to-transparent pointer-events-none rounded-bl-full" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#ffdab9]/15 pointer-events-none rounded-tr-full" />

            {/* Letter Top Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-[#2c0a32]/10 text-xs font-serif-display text-[#2c0a32]/75">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-2 h-2 rounded-full bg-[#b76e79] shrink-0" />
                <span className="tracking-[0.12em] sm:tracking-[0.2em] uppercase font-medium text-[10px] sm:text-xs">For Doctor Paapa</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyLetter}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#2c0a32]/5 hover:bg-[#2c0a32]/10 text-[#2c0a32] font-serif-display text-[11px] sm:text-xs transition-all cursor-pointer font-medium active:scale-95"
                  title="Copy letter to clipboard"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#b76e79]" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>

                {!isTypingComplete ? (
                  <button
                    type="button"
                    onClick={handleSkipToEnd}
                    className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#2c0a32]/5 hover:bg-[#2c0a32]/10 text-[#2c0a32] font-serif-display text-[11px] sm:text-xs transition-all cursor-pointer font-medium active:scale-95"
                  >
                    <FastForward className="w-3.5 h-3.5 text-[#b76e79]" />
                    <span>Read All</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#2c0a32]/5 hover:bg-[#2c0a32]/10 text-[#2c0a32] font-serif-display text-[11px] sm:text-xs transition-all cursor-pointer font-medium active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#b76e79]" />
                    <span>Replay</span>
                  </button>
                )}
              </div>
            </div>

            {/* Letter Salutation */}
            <div className="mb-4 sm:mb-6">
              <h3 className="font-script text-3xl sm:text-5xl text-[#3d1145] font-bold tracking-wide">
                {config.letterGreeting}
              </h3>
            </div>

            {/* Typewritten Message Body with optimal measure and line-height */}
            <div className="font-serif-display text-base sm:text-lg md:text-xl leading-[1.85] text-[#2c0a32]/95 whitespace-pre-line tracking-normal min-h-[200px] sm:min-h-[240px] font-normal">
              {fullText.slice(0, displayedLength)}
              {!isTypingComplete && (
                <span className="inline-block w-2 sm:w-2.5 h-5 sm:h-6 bg-[#b76e79] ml-1 sm:ml-1.5 animate-cursor align-middle" />
              )}
            </div>

            {/* Signoff with Monogram Wax Seal stamp */}
            {displayedLength > 150 && (
              <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-[#2c0a32]/10 flex flex-wrap items-center justify-between gap-3">
                {/* Monogram Seal Stamp */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#852a3a] to-[#4e111d] border border-[#ffdab9]/60 flex items-center justify-center text-white shadow-md shrink-0">
                    <span className="font-serif-display font-bold text-base sm:text-lg text-[#ffdab9]">M</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-serif-display italic text-[#2c0a32]/60">
                    Sealed with lifelong loyalty & respect
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end">
                  <span className="font-serif-display italic text-xs sm:text-sm text-[#2c0a32]/75 font-light">
                    {config.letterSignoff}
                  </span>
                  <span className="font-script text-2xl sm:text-4xl text-[#7c2838] mt-0.5 sm:mt-1 font-bold">
                    Your Brother & Friend Forever ✨
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Bridge to Extracted Milestones */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#ffdab9]/10 border border-[#ffdab9]/30 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffdab9]" />
              </div>
              <div className="text-left">
                <h4 className="font-serif-display text-xs sm:text-sm font-semibold text-[#fffdf9]">
                  Explore The 6 Extracted Journey Milestones
                </h4>
                <p className="text-[11px] sm:text-xs text-[#e6e6fa]/70">
                  Step through childhood, breaking shackles, school days, safe haven, and the sacred promise.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSwitchMode('timeline')}
              className="w-full sm:w-auto min-h-[40px] px-4 sm:px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-[#ffdab9] font-serif-display text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 border border-[#ffdab9]/30"
            >
              <span>View Story Timeline</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: EXTRACTED JOURNEY TIMELINE VIEW                  */}
      {/* ======================================================== */}
      {viewMode === 'timeline' && (
        <div className="animate-fade-in space-y-6">
          {/* Interactive Stepper Navigation Bar */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-serif-display uppercase tracking-widest text-[#ffdab9] font-medium">
                Chapter {selectedTimelineIndex + 1} of {config.timeline.length}:
              </span>
              <span className="font-serif-display text-xs text-[#fffdf9] font-semibold truncate max-w-[200px] sm:max-w-none">
                {currentTimelineItem.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playNavClick();
                  setSelectedTimelineIndex((prev) => (prev === 0 ? config.timeline.length - 1 : prev - 1));
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center text-[#fffdf9] transition-all cursor-pointer"
                title="Previous Chapter"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playNavClick();
                  setSelectedTimelineIndex((prev) => (prev === config.timeline.length - 1 ? 0 : prev + 1));
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center text-[#fffdf9] transition-all cursor-pointer"
                title="Next Chapter"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Milestone Pills Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {config.timeline.map((item, idx) => {
              const Icon = getTimelineIcon(item.iconName);
              const isSelected = idx === selectedTimelineIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    sound.playNavClick();
                    setSelectedTimelineIndex(idx);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#390d45] to-[#200627] border-[#ffdab9]/60 shadow-lg shadow-[#ffdab9]/10 ring-1 ring-[#ffdab9]/40'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono tracking-wider uppercase text-[#ffdab9]">
                      0{idx + 1}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#ffdab9]' : 'text-stone-400'}`} />
                  </div>
                  <h5 className="font-serif-display text-xs font-semibold text-[#fffdf9] truncate">
                    {item.title}
                  </h5>
                  <span className="text-[10px] text-[#e6e6fa]/70 truncate block mt-0.5">
                    {item.period}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Featured Milestone Spotlight Card */}
          <div className="p-7 sm:p-10 rounded-3xl bg-gradient-to-b from-[#320c3d]/90 via-[#220729]/95 to-[#15041a]/95 border border-[#ffdab9]/35 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Background ambient watermark */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#ffdab9]/10 via-transparent to-transparent pointer-events-none" />

            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-serif-display uppercase tracking-widest bg-[#ffdab9]/15 text-[#ffdab9] border border-[#ffdab9]/30 font-semibold">
                  {currentTimelineItem.phase} · {currentTimelineItem.period}
                </span>
                {currentTimelineItem.highlight && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-serif-display bg-amber-400/20 text-amber-200 border border-amber-300/40">
                    Birthday Milestone 🎂
                  </span>
                )}
              </div>

              {(() => {
                const Icon = getTimelineIcon(currentTimelineItem.iconName);
                return (
                  <div className="w-10 h-10 rounded-full bg-[#ffdab9]/10 border border-[#ffdab9]/30 flex items-center justify-center text-[#ffdab9]">
                    <Icon className="w-5 h-5" />
                  </div>
                );
              })()}
            </div>

            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#fffdf9] tracking-tight mb-4">
              {currentTimelineItem.title}
            </h3>

            {/* Letter Quote Excerpt Container */}
            <blockquote className="p-5 rounded-2xl bg-black/30 border border-[#ffdab9]/30 relative mb-4">
              <span className="font-serif text-3xl text-[#ffdab9]/40 absolute top-2 left-3 select-none leading-none">“</span>
              <p className="font-serif-display text-sm sm:text-base md:text-lg text-[#ffdab9] italic leading-relaxed pl-5 pr-2">
                {currentTimelineItem.quote}
              </p>
              <span className="font-serif text-3xl text-[#ffdab9]/40 absolute bottom-1 right-3 select-none leading-none">”</span>
            </blockquote>

            {/* Narrative Reflection */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#e6e6fa]/70 block mb-1">
                Brotherly Meaning & Reflection:
              </span>
              <p className="font-serif-display text-xs sm:text-sm text-[#e6e6fa]/95 leading-relaxed">
                {currentTimelineItem.description}
              </p>
            </div>
          </div>

          {/* Full Chronological Stream Toggle / Cards */}
          <div className="space-y-4 pt-4">
            <h4 className="font-serif-display text-sm uppercase tracking-widest text-[#ffdab9] font-medium text-center">
              Complete Timeline of Our Journey
            </h4>

            <div className="relative border-l-2 border-[#b76e79]/30 ml-4 sm:ml-8 md:ml-12 space-y-6">
              {config.timeline.map((item, idx) => {
                const Icon = getTimelineIcon(item.iconName);
                const isSelected = idx === selectedTimelineIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      sound.playNavClick();
                      setSelectedTimelineIndex(idx);
                    }}
                    className="relative pl-6 sm:pl-8 group cursor-pointer"
                  >
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-[9px] top-2.5 w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#b76e79] border-[#ffdab9] scale-125 shadow-md shadow-[#ffdab9]/50'
                          : 'bg-[#210729] border-[#f7e7ce]/40 group-hover:border-[#ffdab9]'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#fffdf9]" />
                    </div>

                    <div
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#3e0f4d]/90 to-[#220729]/90 border-[#ffdab9]/40 shadow-xl ring-1 ring-[#ffdab9]/30'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-serif-display text-[11px] font-bold text-[#ffdab9] uppercase tracking-wider">
                          Phase 0{idx + 1} · {item.period}
                        </span>
                        <Icon className="w-3.5 h-3.5 text-[#ffdab9]" />
                      </div>
                      <h5 className="font-serif-display text-base sm:text-lg font-semibold text-[#fffdf9] mb-1.5">
                        {item.title}
                      </h5>
                      <p className="font-serif-display text-xs sm:text-sm text-[#ffdab9]/90 italic mb-2 pl-2.5 border-l border-[#ffdab9]/40">
                        "{item.quote}"
                      </p>
                      <p className="text-xs text-[#e6e6fa]/80 leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Secret Surprise Reveal Trigger */}
      <div className="mt-8 sm:mt-12 text-center w-full max-w-md mx-auto px-2">
        <p className="font-script text-xl sm:text-3xl text-[#ffdab9] mb-2.5 sm:mb-3">
          And now, for your special moment…
        </p>

        <button
          type="button"
          onClick={() => {
            sound.playNavClick();
            onOpenSurprise();
          }}
          className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl sm:rounded-full bg-gradient-to-r from-[#b76e79] via-[#c97b87] to-[#8d3d4b] hover:from-[#c47c87] hover:to-[#9b4957] text-[#fffdf9] font-serif-display text-xs sm:text-base font-semibold tracking-wider uppercase shadow-2xl shadow-[#b76e79]/50 border border-[#f7e7ce]/40 transition-all duration-300 transform active:scale-95 animate-pulse cursor-pointer"
        >
          <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffdab9] shrink-0" />
          <span>UNLOCK SURPRISE & CAKE 🎂</span>
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffdab9] shrink-0" />
        </button>
      </div>
    </section>
  );
};
