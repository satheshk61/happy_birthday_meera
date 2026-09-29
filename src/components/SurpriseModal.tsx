import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Heart, X, Wind, PartyPopper, Flame, Utensils, RotateCcw, Award, Crown, CheckCircle2, Star, Zap, ChevronRight, Eye, Camera, Video, Compass, Volume2, ArrowRight } from 'lucide-react';
import { BirthdayConfig } from '../birthdayConfig';
import { sound } from '../utils/audio';
import { triggerSurpriseConfetti, triggerTapSparkle } from '../utils/confetti';
import { ThreeDCakeCanvas } from './ThreeDCakeCanvas';

interface SurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BirthdayConfig;
  onOpenGamesTab?: () => void;
  onOpenLetterTab?: () => void;
}

type CeremonyStep = 1 | 2 | 3 | 4 | 5;
type CutsceneStage = 'intact' | 'blade-drawn' | 'slicing' | 'sliced';
type CameraViewPreset = 'orbit' | 'front' | 'close' | 'top';

interface ToppingOption {
  id: string;
  name: string;
  emoji: string;
}

const AVAILABLE_TOPPINGS: ToppingOption[] = [
  { id: 'strawberry', name: 'Ruby Strawberry', emoji: '🍓' },
  { id: 'gold', name: '24K Gold Flake', emoji: '✨' },
  { id: 'choco', name: 'Belgian Truffle', emoji: '🍫' },
  { id: 'cherry', name: 'Wild Cherry', emoji: '🍒' },
];

export const SurpriseModal: React.FC<SurpriseModalProps> = ({
  isOpen,
  onClose,
  config,
  onOpenGamesTab,
  onOpenLetterTab,
}) => {
  // Step-by-Step Ceremony Sequence (1: Wish -> 2: Sparklers -> 3: Knife -> 4: Cut -> 5: Feed)
  const [ceremonyStep, setCeremonyStep] = useState<CeremonyStep>(1);

  // Candles & Cutscene State
  const [candles, setCandles] = useState<[boolean, boolean, boolean]>([true, true, true]);
  const [sparklersActive, setSparklersActive] = useState(false);
  const [stage, setStage] = useState<CutsceneStage>('intact');
  const [cameraPreset, setCameraPreset] = useState<CameraViewPreset>('orbit');
  const [sliceProgress, setSliceProgress] = useState(0);
  const [slicePrecision, setSlicePrecision] = useState(99);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [bitesTaken, setBitesTaken] = useState(0);
  const [fortuneOpened, setFortuneOpened] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const sliceTimerRef = useRef<any>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const allCandlesBlown = !candles[0] && !candles[1] && !candles[2];

  // Gamification XP calculation
  let celebrationPoints = 0;
  if (allCandlesBlown) celebrationPoints += 50;
  if (sparklersActive) celebrationPoints += 50;
  if (stage === 'blade-drawn') celebrationPoints += 50;
  if (stage === 'sliced') celebrationPoints += 100;
  celebrationPoints += Math.min(50, selectedToppings.length * 25);
  if (bitesTaken > 0) celebrationPoints += 50;
  if (fortuneOpened) celebrationPoints += 50;

  useEffect(() => {
    if (isOpen) {
      sound.playSurpriseReveal();
      triggerSurpriseConfetti();
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
      handleResetCeremony();
    }
  }, [isOpen]);

  const handleResetCeremony = () => {
    setCeremonyStep(1);
    setCandles([true, true, true]);
    setSparklersActive(false);
    setStage('intact');
    setSliceProgress(0);
    setSelectedToppings([]);
    setBitesTaken(0);
    setFortuneOpened(false);
    setCameraPreset('orbit');
    if (sliceTimerRef.current) clearInterval(sliceTimerRef.current);
  };

  // Scroll to top helper
  const scrollToTop = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Scroll to top whenever the step advances
  useEffect(() => {
    scrollToTop();
  }, [ceremonyStep, scrollToTop]);

  // Direct Step Jump (Human intuitive navigation)
  const goToStep = (step: CeremonyStep) => {
    sound.playNavClick();
    setCeremonyStep(step);
    if (step === 1) {
      setCandles([true, true, true]);
      setSparklersActive(false);
      setStage('intact');
    } else if (step === 2) {
      setCandles([false, false, false]);
      setSparklersActive(true);
      setStage('intact');
    } else if (step === 3) {
      setCandles([false, false, false]);
      setStage('blade-drawn');
      setCameraPreset('front');
    } else if (step === 4) {
      setCandles([false, false, false]);
      setStage('blade-drawn');
    } else if (step === 5) {
      setCandles([false, false, false]);
      setStage('sliced');
    }
  };

  // Sequential Click Progression (One click advances the entire ceremony effortlessly!)
  const handleSequentialClick = () => {
    if (ceremonyStep === 1) {
      // Step 1: Blow Candles & Make Wish
      sound.playBlowCandle();
      setCandles([false, false, false]);
      triggerSurpriseConfetti();
      setCeremonyStep(2);
    } else if (ceremonyStep === 2) {
      // Step 2: Light Sparklers
      sound.playMatchLight();
      setSparklersActive(true);
      triggerSurpriseConfetti();
      setCeremonyStep(3);
    } else if (ceremonyStep === 3) {
      // Step 3: Ready Knife
      sound.playBladeDraw();
      setStage('blade-drawn');
      setCameraPreset('front');
      setCeremonyStep(4);
    } else if (ceremonyStep === 4) {
      // Step 4: Cut the Cake in slow motion
      sound.playCakeSlice();
      setStage('slicing');
      setSliceProgress(10);
      setSlicePrecision(98 + Math.floor(Math.random() * 2));

      let prog = 10;
      if (sliceTimerRef.current) clearInterval(sliceTimerRef.current);
      sliceTimerRef.current = setInterval(() => {
        prog += 15;
        if (prog >= 100) {
          clearInterval(sliceTimerRef.current);
          setSliceProgress(100);
          setTimeout(() => {
            sound.playSurpriseReveal();
            triggerSurpriseConfetti();
            setStage('sliced');
            setCeremonyStep(5);
          }, 350);
        } else {
          setSliceProgress(prog);
        }
      }, 140);
    } else if (ceremonyStep === 5) {
      // Step 5: Feed bite
      sound.playForkBite();
      triggerTapSparkle(window.innerWidth / 2, window.innerHeight / 2);
      setBitesTaken((b) => Math.min(3, b + 1));
    }
  };

  const handleBlowSingleCandle = (index: number) => {
    if (!candles[index]) return;
    sound.playBlowCandle();
    const updated: [boolean, boolean, boolean] = [...candles];
    updated[index] = false;
    setCandles(updated);

    if (!updated[0] && !updated[1] && !updated[2]) {
      triggerSurpriseConfetti();
      setCeremonyStep(2);
    }
  };

  const handleToggleTopping = (toppingId: string, e: React.MouseEvent) => {
    sound.playNavClick();
    triggerTapSparkle(e.clientX, e.clientY);
    setSelectedToppings((prev) =>
      prev.includes(toppingId) ? prev.filter((id) => id !== toppingId) : [...prev, toppingId]
    );
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      ref={scrollContainerRef}
      className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl overflow-y-scroll animate-fade-in [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {/* Warm Ambient Volumetric Lighting Halo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-gradient-to-r from-[#b76e79]/35 via-[#ffdab9]/30 to-[#f7e7ce]/25 rounded-full blur-[120px] animate-pulse-soft" />
      </div>

      {/* Main Ceremony Card */}
      <div
        className={`relative w-full max-w-3xl my-3 sm:my-6 rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 md:p-9 border border-[#ffdab9]/50 bg-gradient-to-b from-[#2e0938]/95 via-[#1d0524]/98 to-[#110216] shadow-[0_30px_100px_rgba(0,0,0,0.95)] text-center transition-all duration-700 transform ${
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
          className="absolute top-3 right-3 sm:top-4 sm:right-4 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-[#f7e7ce] transition-all cursor-pointer z-40 border border-white/15 active:scale-95"
          aria-label="Close cake celebration window"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#fffdf9]" />
        </button>

        {/* Top Header Badge */}
        <div className="flex justify-center items-center gap-1.5 sm:gap-2 mb-1.5 px-8 sm:px-10">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ffdab9] animate-spin-slow shrink-0" />
          <span className="text-[10px] sm:text-xs font-serif-display uppercase tracking-wider text-[#ffdab9] font-semibold text-center leading-tight">
            Birthday Cinema · Doctor Paapa
          </span>
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ffdab9] animate-spin-slow shrink-0" />
        </div>

        <h2 className="font-script text-2xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#fffdf9] via-[#ffdab9] to-[#f7e7ce] font-bold py-0.5 sm:py-1 drop-shadow px-4 sm:px-6 leading-tight">
          Happy Birthday, Doctor Paapa! 🩺🎂
        </h2>

        <p className="font-serif-display text-[11px] sm:text-sm text-[#f5ecfc] max-w-lg mx-auto mt-0.5 mb-3 sm:mb-4 italic px-2 sm:px-3 leading-relaxed">
          "Seeing you smile today while cutting your cake filled my heart with so much joy."
        </p>

        {/* CEREMONY STEPPER */}
        <div className="w-full max-w-xl mx-auto mb-3 sm:mb-4 p-1 sm:p-2 rounded-xl sm:rounded-2xl bg-black/40 border border-white/10 shadow-inner">
          <div className="grid grid-cols-5 gap-1 py-0.5">
            {[
              { step: 1, label: 'Wish', emoji: '🕯️' },
              { step: 2, label: 'Sparks', emoji: '✨' },
              { step: 3, label: 'Knife', emoji: '🔪' },
              { step: 4, label: 'Cut', emoji: '🎂' },
              { step: 5, label: 'Feast', emoji: '🍰' },
            ].map((item) => {
              const isCurrent = ceremonyStep === item.step;
              const isPassed = ceremonyStep > item.step;
              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => goToStep(item.step as CeremonyStep)}
                  className={`min-h-[42px] sm:min-h-[48px] py-1 sm:py-1.5 px-0.5 sm:px-1 rounded-lg sm:rounded-xl font-serif-display text-[9px] sm:text-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 active:scale-95 ${
                    isCurrent
                      ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-400/30'
                      : isPassed
                      ? 'bg-emerald-950/70 border border-emerald-400/40 text-emerald-200'
                      : 'bg-white/5 border border-white/10 text-stone-400'
                  }`}
                >
                  <span className="text-sm sm:text-base leading-none">{item.emoji}</span>
                  <span className="leading-tight font-medium">{isPassed ? '✓' : item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3D UNREAL ENGINE WEBGL ARENA CONTAINER                   */}
        {/* ======================================================== */}
        <div className="relative my-2.5 sm:my-3 rounded-2xl sm:rounded-3xl bg-radial from-[#380e42]/60 via-[#18031e]/90 to-black border border-[#ffdab9]/40 p-2.5 sm:p-5 overflow-hidden shadow-2xl">
          {/* Camera View Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3 pb-2 border-b border-white/10">
            <div className="flex flex-wrap items-center gap-1">
              {(['orbit', 'front', 'close', 'top'] as CameraViewPreset[]).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => { sound.playNavClick(); setCameraPreset(preset); }}
                  className={`px-2 py-1 min-h-[32px] rounded-full text-[10px] sm:text-xs font-serif-display capitalize transition-all cursor-pointer ${
                    cameraPreset === preset
                      ? 'bg-[#ffdab9] text-stone-900 font-bold shadow'
                      : 'bg-white/10 hover:bg-white/20 text-[#f5ecfc] border border-white/10'
                  }`}
                >
                  {preset === 'orbit' ? '🔄 Orbit' : preset === 'front' ? '👁️ Front' : preset === 'close' ? '🔍 Close' : '🍰 Top'}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-[11px] sm:text-xs font-serif-display text-[#ffdab9] font-semibold">{celebrationPoints} / 350 XP</span>
            </div>
          </div>

          {/* Genuine 3D WebGL High-Quality Canvas */}
          <ThreeDCakeCanvas
            currentStep={ceremonyStep}
            candlesLit={!allCandlesBlown}
            sparklersActive={sparklersActive}
            isKnifeDrawn={stage === 'blade-drawn' || stage === 'slicing'}
            isCutsceneActive={stage === 'slicing'}
            isSliced={stage === 'sliced'}
            bitesTaken={bitesTaken}
            cameraPreset={cameraPreset}
            selectedToppings={selectedToppings}
            onSliceFinished={() => {
              sound.playSurpriseReveal();
              triggerSurpriseConfetti();
              setStage('sliced');
              setCeremonyStep(5);
            }}
            onCandleTapped={() => {
              sound.playBlowCandle();
              setCandles([false, false, false]);
              triggerSurpriseConfetti();
              setCeremonyStep(2);
            }}
          />

          {/* Slicing Cutscene Progress Indicator */}
          {stage === 'slicing' && (
            <div className="mt-3 w-full max-w-sm mx-auto animate-fade-in px-2">
              <div className="flex justify-between text-xs font-serif-display text-amber-200 mb-1 font-semibold">
                <span>Golden Blade Slicing...</span>
                <span>{sliceProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-amber-300/30">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-amber-200 to-white rounded-full transition-all duration-150"
                  style={{ width: `${sliceProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* PRIMARY ACTION BUTTONS */}
          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/10 flex flex-col items-center justify-center gap-2.5 sm:gap-3">
            {ceremonyStep === 1 && (
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 w-full">
                <button type="button" onClick={handleSequentialClick}
                  className="w-full px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-stone-950 font-serif-display font-bold text-sm sm:text-base shadow-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 animate-pulse min-h-[48px]">
                  <Wind className="w-4 h-4 sm:w-5 sm:h-5 text-stone-950 shrink-0" />
                  <span>Make a Wish &amp; Blow Candles 🕯️</span>
                </button>
                <p className="text-[11px] sm:text-sm font-serif-display text-[#f5ecfc]/80 italic text-center leading-relaxed">
                  Close your eyes and make a special birthday wish for Doctor Paapa.
                </p>
              </div>
            )}

            {ceremonyStep === 2 && (
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 w-full">
                <button type="button" onClick={handleSequentialClick}
                  className="w-full px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:brightness-110 text-stone-950 font-serif-display font-bold text-sm sm:text-base shadow-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 animate-bounce min-h-[48px]">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-900 shrink-0" />
                  <span>Light Golden Sparklers ✨</span>
                </button>
                <p className="text-[11px] sm:text-sm font-serif-display text-[#f5ecfc]/80 italic text-center leading-relaxed">
                  Illuminate the ceremony with festive sparkler fountains!
                </p>
              </div>
            )}

            {ceremonyStep === 3 && (
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 w-full">
                <button type="button" onClick={handleSequentialClick}
                  className="w-full px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-stone-950 font-serif-display font-bold text-sm sm:text-base shadow-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 animate-pulse min-h-[48px]">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-stone-950 shrink-0" />
                  <span>Ready the Birthday Knife 🔪</span>
                </button>
                <p className="text-[11px] sm:text-sm font-serif-display text-[#f5ecfc]/80 italic text-center leading-relaxed">
                  Draw the royal Damascus ceremonial blade into cutting stance.
                </p>
              </div>
            )}

            {ceremonyStep === 4 && (
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 w-full">
                <button type="button" onClick={handleSequentialClick} disabled={stage === 'slicing'}
                  className="w-full px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#b76e79] via-[#c97b87] to-[#8d3d4b] text-[#fffdf9] font-serif-display font-bold text-sm sm:text-base shadow-2xl transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 border border-[#ffdab9]/50 animate-bounce disabled:opacity-50 min-h-[48px]">
                  <span>🎂 Cut the Birthday Cake!</span>
                </button>
                <p className="text-[11px] sm:text-sm font-serif-display text-amber-200 italic text-center leading-relaxed">
                  Watch the cinematic slice and separate the first wedge!
                </p>
              </div>
            )}

            {ceremonyStep === 5 && (
              <div className="flex flex-col items-center gap-2.5 sm:gap-3 w-full">
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-emerald-950/80 border border-emerald-400/60 text-emerald-200 text-[11px] sm:text-sm font-serif-display shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                  <span>Royal Cut! Precision: {slicePrecision}% ⭐⭐⭐ (+100 XP)</span>
                </div>
                <button type="button" onClick={handleSequentialClick}
                  className="w-full px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#b76e79] to-[#8d3d4b] text-[#fffdf9] text-sm sm:text-base font-serif-display font-semibold shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all border border-[#ffdab9]/30 min-h-[48px]">
                  <span>🍴 Feed Doctor Paapa ({bitesTaken}/3 Bites)</span>
                </button>
                {bitesTaken > 0 && (
                  <p className="text-xs sm:text-sm text-rose-300 font-serif-display font-semibold italic text-center leading-relaxed">
                    💖 Delicious Red Velvet! Sweet memories created!
                  </p>
                )}
              </div>
            )}

            {/* Replay Option */}
            {ceremonyStep === 5 && (
              <button
                type="button"
                onClick={handleResetCeremony}
                className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-[#f5ecfc]/80 hover:text-[#fffdf9] underline flex items-center gap-1 cursor-pointer py-1 min-h-[36px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Replay Cake Ceremony from Step 1</span>
              </button>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* STEP 5 SUITE: DEDICATION LETTER, TOPPINGS & PROPHECY     */}
        {/* ======================================================== */}
        {ceremonyStep === 5 && (
          <div className="mt-4 sm:mt-5 p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/5 border border-amber-300/40 text-center animate-fade-in shadow-2xl">
            {/* Heartfelt Letter Dedication Message */}
            <blockquote className="mb-4 sm:mb-5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-black/50 border border-[#ffdab9]/40 text-left shadow-lg">
              <span className="text-[10px] font-mono tracking-widest text-[#ffdab9] uppercase block mb-1 font-semibold">
                A Message From Your Brother & Friend:
              </span>
              <p className="font-serif-display text-xs sm:text-sm md:text-base text-[#fffdf9] italic leading-relaxed">
                "Dear Doctor paapa, seeing you smile today while cutting your cake filled my heart with so much joy. May your days always be as sweet and bright as this moment. I swear that your hardwork and dedication will take you to great heights in your career and life. I will protect you as my eyes and remain just a call away!"
              </p>
            </blockquote>

            {/* Action 1: Interactive Toppings */}
            <div className="mb-3.5 sm:mb-4">
              <span className="text-[11px] sm:text-xs font-serif-display text-[#fffdf9] block mb-2 font-medium">
                Garnish her slice with luxury toppings (+25 XP each):
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                {AVAILABLE_TOPPINGS.map((topping) => {
                  const isSelected = selectedToppings.includes(topping.id);
                  return (
                    <button
                      key={topping.id}
                      type="button"
                      onClick={(e) => handleToggleTopping(topping.id, e)}
                      className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-serif-display border transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer active:scale-95 min-h-[36px] ${
                        isSelected
                          ? 'bg-amber-400/30 border-amber-300 text-[#fffdf9] shadow-md shadow-amber-400/20 font-bold'
                          : 'bg-white/5 hover:bg-white/10 border-white/20 text-[#f5ecfc]'
                      }`}
                    >
                      <span>{topping.emoji}</span>
                      <span>{topping.name}</span>
                      {isSelected && <span className="text-amber-300 text-[10px]">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action 2: Royal Year Prophecy Scroll */}
            <div className="pt-1 sm:pt-2">
              {!fortuneOpened ? (
                <button
                  type="button"
                  onClick={() => {
                    sound.playEnvelopeOpen();
                    setFortuneOpened(true);
                    triggerSurpriseConfetti();
                  }}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400/25 via-amber-300/35 to-amber-400/25 hover:from-amber-400/40 border border-amber-300/50 text-amber-100 text-xs font-serif-display font-semibold flex items-center justify-center gap-2 mx-auto cursor-pointer transition-all active:scale-95 shadow-md min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow shrink-0" />
                  <span>Unroll Doctor Paapa's Prophecy Scroll 📜 (+50 XP)</span>
                </button>
              ) : (
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-950/50 via-purple-950/60 to-black/70 border border-amber-300/50 animate-fade-in max-w-md mx-auto text-left shadow-xl">
                  <div className="flex items-center gap-2 text-xs font-serif-display text-amber-300 font-bold mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-300 shrink-0" />
                    <span>The Doctor's Prophecy for 2026 & Beyond:</span>
                  </div>
                  <p className="font-serif-display text-xs sm:text-sm text-[#fffdf9] italic leading-relaxed">
                    "Every stethoscope placed, every hand held, and every long hospital night will yield extraordinary blessings. You are destined to heal, inspire, and conquer great heights in your medical career. Always protected, always cherished!"
                  </p>
                </div>
              )}
            </div>

            {/* Navigation Bridge Out of Ceremony */}
            <div className="mt-5 pt-3 sm:pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3">
              {onOpenLetterTab && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playNavClick();
                    onClose();
                    onOpenLetterTab();
                  }}
                  className="w-full sm:w-auto px-4 sm:px-5 py-3 sm:py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 font-serif-display font-bold text-xs tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5"
                >
                  <span>Read The Full Letter & Timeline 💌</span>
                </button>
              )}
              {onOpenGamesTab && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playNavClick();
                    onClose();
                    onOpenGamesTab();
                  }}
                  className="w-full sm:w-auto px-4 sm:px-5 py-3 sm:py-2.5 rounded-xl sm:rounded-full bg-white/10 hover:bg-white/15 text-xs text-[#fffdf9] font-serif-display transition-all cursor-pointer border border-white/15 min-h-[44px] flex items-center justify-center gap-1.5"
                >
                  <span>Play Arcade Games 🎮</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
