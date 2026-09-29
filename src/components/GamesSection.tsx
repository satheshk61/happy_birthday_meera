import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Trophy, RotateCcw, PartyPopper, Heart, Gift, Music, Camera, Mail, Cake, Star, Wind, Volume2, Award, Zap, Compass, CheckCircle2, Stethoscope, Phone, Shield, ChevronRight } from 'lucide-react';
import { BirthdayConfig } from '../birthdayConfig';
import { sound } from '../utils/audio';
import { triggerSurpriseConfetti, triggerTapSparkle } from '../utils/confetti';

interface GamesSectionProps {
  config: BirthdayConfig;
  onOpenSurprise: () => void;
  onNavigateToLetter?: () => void;
}

type ActiveGame = 'balloons' | 'memory' | 'catcher';

// ==========================================
// GAME 1: BALLOON POP DATA & CONSTANTS
// ==========================================
interface BalloonItem {
  id: number;
  color: string;
  borderColor: string;
  glowColor: string;
  textColor: string;
  wish: string;
  title: string;
  popped: boolean;
  delay: string;
}

const INITIAL_BALLOONS: Omit<BalloonItem, 'popped'>[] = [
  {
    id: 1,
    color: 'from-[#b76e79] to-[#8d3d4b]',
    borderColor: 'border-[#ffdab9]/50',
    glowColor: 'shadow-[#b76e79]/50',
    textColor: 'text-[#ffe4e9]',
    title: 'Note 01: That Radiant Cake Smile',
    wish: 'Seeing you smile today while cutting your cake filled my heart with so much joy. May your days always be as sweet and bright as this moment! 🎂✨',
    delay: 'animation-delay-0',
  },
  {
    id: 2,
    color: 'from-[#6b3574] to-[#421b4a]',
    borderColor: 'border-[#f7e7ce]/50',
    glowColor: 'shadow-[#6b3574]/50',
    textColor: 'text-[#f5e6fa]',
    title: 'Note 02: Childhood to Soul Connection',
    wish: 'From knowing your name as children to traveling together as years go by... once we got connected, I felt like I had known you for ages. Your warmth is truly inspiring. 🌸',
    delay: 'animation-delay-300',
  },
  {
    id: 3,
    color: 'from-[#d49b6a] to-[#99653a]',
    borderColor: 'border-[#fffdf9]/50',
    glowColor: 'shadow-[#d49b6a]/50',
    textColor: 'text-[#fff8f0]',
    title: 'Note 03: Throwing Off The Shackles',
    wish: 'Remember the moment we threw off the shackles? From then on, you held a special, irreplaceable place in my heart. 🕊️✨',
    delay: 'animation-delay-600',
  },
  {
    id: 4,
    color: 'from-[#994d66] to-[#6b253b]',
    borderColor: 'border-[#ffdab9]/50',
    glowColor: 'shadow-[#994d66]/50',
    textColor: 'text-[#ffeaf0]',
    title: 'Note 04: The Safe Haven Beyond Judgment',
    wish: 'You gave me a space to be myself that a girl who never spoke to boys in school would never give blindly. You healed me with your words and actions. Valued more than my self-respect. 💖',
    delay: 'animation-delay-900',
  },
  {
    id: 5,
    color: 'from-[#4e3b75] to-[#2e1d52]',
    borderColor: 'border-[#e6e6fa]/50',
    glowColor: 'shadow-[#4e3b75]/50',
    textColor: 'text-[#f1edfc]',
    title: 'Note 05: To Extraordinary Heights, Doctor Paapa!',
    wish: 'I swear that your hard work and dedication will take you to great heights in your medical career and life. Keep shining bright, Doctor Paapa! 🩺⭐',
    delay: 'animation-delay-1200',
  },
  {
    id: 6,
    color: 'from-[#a86579] to-[#753448]',
    borderColor: 'border-[#f7e7ce]/50',
    glowColor: 'shadow-[#a86579]/50',
    textColor: 'text-[#fff2f5]',
    title: 'Note 06: Protected As My Own Eyes',
    wish: 'I promise to stay connected beyond all restrictions, protect you as my own eyes, keep away difficulties, and always remain just a call away! 📞🛡️',
    delay: 'animation-delay-1500',
  },
];

// ==========================================
// GAME 2: MEMORY MATCH CARDS DATA
// ==========================================
interface MemoryCardItem {
  id: number;
  pairKey: string;
  name: string;
  iconName: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface MemoryPairDefinition {
  pairKey: string;
  name: string;
  phase: string;
  icon: any;
  color: string;
  storyQuote: string;
  reflection: string;
}

export const MEMORY_PAIR_DEFINITIONS: MemoryPairDefinition[] = [
  {
    pairKey: 'cake-smile',
    name: 'Cake Cutting Smile',
    phase: 'Today',
    icon: Cake,
    color: 'text-amber-300',
    storyQuote: 'Seeing you smile today while cutting your cake filled my heart with so much joy. May your days always be as sweet and bright as this moment!',
    reflection: 'The radiant smile that makes all of life brighter.',
  },
  {
    pairKey: 'shackles',
    name: 'Throwing Off Shackles',
    phase: 'Connection',
    icon: Sparkles,
    color: 'text-rose-300',
    storyQuote: 'Remember the moment that we throw off the shackles? From then you have a special place in my heart... once we got connected I feel like I have known you for ages.',
    reflection: 'The breakthrough moment when barriers dissolved into lifelong friendship.',
  },
  {
    pairKey: 'school-guide',
    name: 'Guiding Words',
    phase: 'School Days',
    icon: Award,
    color: 'text-amber-200',
    storyQuote: 'In school days we have a lot of restrictions. I tried my level best to follow your words... Now you are with me to guide me to be a better person.',
    reflection: 'A guiding light helping me grow and building mutual mental strength.',
  },
  {
    pairKey: 'safe-haven',
    name: 'Safe Haven & Healing',
    phase: 'Sacred Space',
    icon: Heart,
    color: 'text-pink-300',
    storyQuote: 'You have given me a space to be myself which a girl who never spoke to boys in school would never give blindly. You never judged me and healed me with your words and actions.',
    reflection: 'Valued more than self-respect: true acceptance and emotional healing.',
  },
  {
    pairKey: 'doctor-paapa',
    name: 'Doctor Paapa',
    phase: 'Dedication',
    icon: Stethoscope,
    color: 'text-emerald-300',
    storyQuote: 'I swear that your hardwork and dedication will take you to great heights in your career and life. Keep shining bright and never forget that you are deeply loved!',
    reflection: 'Boundless pride in your medical journey, healing touch, and future.',
  },
  {
    pairKey: 'sacred-promise',
    name: 'A Call Away Forever',
    phase: 'Promise',
    icon: Phone,
    color: 'text-purple-300',
    storyQuote: 'I promise to stay connected beyond restrictions, protect you as my eyes, keep difficulties away, and remain just a call away whatever happens.',
    reflection: 'A lifelong shield of protection and brotherhood without conditions.',
  },
];

function generateShuffledCards(): MemoryCardItem[] {
  const cards: MemoryCardItem[] = [];
  let id = 1;
  MEMORY_PAIR_DEFINITIONS.forEach((pair) => {
    cards.push({ id: id++, pairKey: pair.pairKey, name: pair.name, iconName: pair.pairKey, isFlipped: false, isMatched: false });
    cards.push({ id: id++, pairKey: pair.pairKey, name: pair.name, iconName: pair.pairKey, isFlipped: false, isMatched: false });
  });

  // Fisher-Yates Shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export const GamesSection: React.FC<GamesSectionProps> = ({ config, onOpenSurprise, onNavigateToLetter }) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('balloons');

  // ------------------------------------------
  // GAME 1 STATE: Balloon Pop
  // ------------------------------------------
  const [balloons, setBalloons] = useState<BalloonItem[]>(() =>
    INITIAL_BALLOONS.map((b) => ({ ...b, popped: false }))
  );
  const [selectedWish, setSelectedWish] = useState<BalloonItem | null>(null);

  const poppedCount = balloons.filter((b) => b.popped).length;
  const allBalloonsPopped = poppedCount === balloons.length;

  const handlePopBalloon = (id: number, e: React.MouseEvent) => {
    const target = balloons.find((b) => b.id === id);
    if (!target || target.popped) return;

    sound.playBalloonPop();
    triggerTapSparkle(e.clientX, e.clientY);

    const updated = balloons.map((b) => (b.id === id ? { ...b, popped: true } : b));
    setBalloons(updated);
    setSelectedWish(target);

    // If all are now popped, trigger fanfare
    if (updated.every((b) => b.popped)) {
      setTimeout(() => {
        sound.playSurpriseReveal();
        triggerSurpriseConfetti();
      }, 300);
    }
  };

  const handleResetBalloons = () => {
    sound.playNavClick();
    setBalloons(INITIAL_BALLOONS.map((b) => ({ ...b, popped: false })));
    setSelectedWish(null);
  };

  // ------------------------------------------
  // GAME 2 STATE: Memory Match
  // ------------------------------------------
  const [memoryCards, setMemoryCards] = useState<MemoryCardItem[]>(generateShuffledCards);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [memoryCompleted, setMemoryCompleted] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [latestMatchedStory, setLatestMatchedStory] = useState<MemoryPairDefinition | null>(null);
  const [unlockedPairs, setUnlockedPairs] = useState<string[]>([]);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && !memoryCompleted) {
      interval = setInterval(() => {
        setGameTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, memoryCompleted]);

  const handleCardClick = (index: number) => {
    if (isProcessing || memoryCards[index].isFlipped || memoryCards[index].isMatched) return;

    if (!timerActive) {
      setTimerActive(true);
    }

    sound.playCardFlip();
    const newCards = [...memoryCards];
    newCards[index].isFlipped = true;
    setMemoryCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsProcessing(true);
      const [firstIdx, secondIdx] = newFlipped;

      if (newCards[firstIdx].pairKey === newCards[secondIdx].pairKey) {
        // Matched!
        setTimeout(() => {
          sound.playMatchSuccess();
          triggerSurpriseConfetti();
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setMemoryCards([...newCards]);
          setFlippedIndices([]);
          setIsProcessing(false);
          const newMatches = matches + 1;
          setMatches(newMatches);

          const matchedDef = MEMORY_PAIR_DEFINITIONS.find((p) => p.pairKey === newCards[firstIdx].pairKey);
          if (matchedDef) {
            setLatestMatchedStory(matchedDef);
            setUnlockedPairs((prev) => Array.from(new Set([...prev, matchedDef.pairKey])));
          }

          if (newMatches === 6) {
            setMemoryCompleted(true);
            setTimerActive(false);
          }
        }, 500);
      } else {
        // Mismatch
        setTimeout(() => {
          sound.playMatchMismatch();
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setMemoryCards([...newCards]);
          setFlippedIndices([]);
          setIsProcessing(false);
        }, 850);
      }
    }
  };

  const handleResetMemory = () => {
    sound.playNavClick();
    setMemoryCards(generateShuffledCards());
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setIsProcessing(false);
    setMemoryCompleted(false);
    setGameTime(0);
    setTimerActive(false);
    setLatestMatchedStory(null);
    setUnlockedPairs([]);
  };

  // ------------------------------------------
  // GAME 3 STATE: Starlight Wish Catcher
  // ------------------------------------------
  const [catcherScore, setCatcherScore] = useState(0);
  const [catcherActive, setCatcherActive] = useState(false);
  const [combo, setCombo] = useState(1);
  const [catcherMilestone, setCatcherMilestone] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const basketXRef = useRef<number>(200);
  const animationFrameIdRef = useRef<number | null>(null);

  interface FallingItem {
    x: number;
    y: number;
    speed: number;
    size: number;
    type: 'star' | 'cupcake' | 'heart' | 'gift';
    points: number;
    emoji: string;
  }

  const itemsRef = useRef<FallingItem[]>([]);
  const scoreRef = useRef(0);
  const comboRef = useRef(1);

  const startCatcherGame = () => {
    sound.playMatchLight();
    setCatcherScore(0);
    scoreRef.current = 0;
    setCombo(1);
    comboRef.current = 1;
    setCatcherMilestone(null);
    setCatcherActive(true);
    itemsRef.current = [];
  };

  const stopCatcherGame = () => {
    setCatcherActive(false);
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
  };

  // Canvas loop
  useEffect(() => {
    if (!catcherActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = 360);
    basketXRef.current = width / 2;

    let lastSpawn = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background ambient stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (let i = 0; i < 20; i++) {
        const sx = (i * 37) % width;
        const sy = (i * 73) % height;
        ctx.fillRect(sx, sy, 2, 2);
      }

      // Spawn falling item periodically
      if (Date.now() - lastSpawn > 850) {
        lastSpawn = Date.now();
        const rand = Math.random();
        let type: FallingItem['type'] = 'star';
        let emoji = '⭐';
        let points = 10;
        let speed = 2.2 + Math.random() * 1.5;

        if (rand > 0.8) {
          type = 'gift';
          emoji = '🎁';
          points = 30;
          speed += 0.8;
        } else if (rand > 0.55) {
          type = 'cupcake';
          emoji = '🧁';
          points = 20;
        } else if (rand > 0.35) {
          type = 'heart';
          emoji = '💖';
          points = 15;
        }

        itemsRef.current.push({
          x: 20 + Math.random() * (width - 40),
          y: -20,
          speed,
          size: 26,
          type,
          points,
          emoji,
        });
      }

      // Draw Basket / Catcher
      const basketWidth = 70;
      const basketHeight = 16;
      const bx = Math.max(10, Math.min(width - basketWidth - 10, basketXRef.current - basketWidth / 2));
      const by = height - 36;

      // Glow behind catcher
      ctx.save();
      ctx.shadowColor = '#f7e7ce';
      ctx.shadowBlur = 14;
      const gradient = ctx.createLinearGradient(bx, by, bx + basketWidth, by);
      gradient.addColorStop(0, '#b76e79');
      gradient.addColorStop(0.5, '#f7e7ce');
      gradient.addColorStop(1, '#ffdab9');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(bx, by, basketWidth, basketHeight, [4, 4, 12, 12]);
      ctx.fill();

      // Monogram on Catcher
      ctx.fillStyle = '#1e0524';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`FOR MEERA`, bx + basketWidth / 2, by + 12);
      ctx.restore();

      // Update & Draw falling items
      for (let i = itemsRef.current.length - 1; i >= 0; i--) {
        const item = itemsRef.current[i];
        item.y += item.speed;

        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.emoji, item.x, item.y);

        // Collision Check with basket
        if (
          item.y >= by - 10 &&
          item.y <= by + basketHeight + 10 &&
          item.x >= bx - 8 &&
          item.x <= bx + basketWidth + 8
        ) {
          // Caught item!
          sound.playStarCatch(comboRef.current);
          scoreRef.current += item.points * comboRef.current;
          setCatcherScore(scoreRef.current);

          comboRef.current = Math.min(5, comboRef.current + 1);
          setCombo(comboRef.current);

          // Check milestones
          if (scoreRef.current >= 150 && !catcherMilestone) {
            setCatcherMilestone('🌟 Milestone: "Meera, your aura is pure sunshine!" (+Bonus Confetti)');
            triggerSurpriseConfetti();
          }

          itemsRef.current.splice(i, 1);
          continue;
        }

        // Offscreen item
        if (item.y > height + 20) {
          itemsRef.current.splice(i, 1);
          comboRef.current = 1;
          setCombo(1);
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    animationFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [catcherActive]);

  // Handle mouse / touch for basket
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    basketXRef.current = e.clientX - rect.left;
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches[0]) {
      basketXRef.current = e.touches[0].clientX - rect.left;
    }
  };

  return (
    <section className="relative min-h-[calc(100dvh-5rem)] flex flex-col items-center justify-start px-3 sm:px-4 py-6 sm:py-10 md:py-12 max-w-5xl mx-auto">
      {/* Top Banner / Editorial Header */}
      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 rounded-full bg-white/5 border border-[#f7e7ce]/20 backdrop-blur-md mb-3 sm:mb-4 shadow-sm">
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ffdab9] shrink-0" />
        <span className="font-serif-display text-[9px] sm:text-xs tracking-widest text-[#ffdab9] uppercase font-medium">
          The Celebration Arcade · Made for {config.name}
        </span>
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ffdab9] shrink-0" />
      </div>

      <h1 className="font-serif-display text-2xl sm:text-4xl md:text-5xl font-bold text-center text-[#fffdf9] tracking-tight mb-1.5 sm:mb-2 px-2">
        Play & Unlock <span className="gold-foil-text font-script text-3xl sm:text-5xl md:text-6xl">Birthday Magic</span>
      </h1>
      <p className="font-serif-display text-xs sm:text-sm text-[#e6e6fa]/75 text-center max-w-lg mb-5 sm:mb-8 italic px-2">
        A playful sanctuary designed to make you smile. Pop balloons for hidden notes, test your memory, or catch falling starlight wishes!
      </p>

      {/* Modern Game Navigation Pills */}
      <div className="w-full max-w-md flex items-center justify-between p-1 sm:p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 sm:mb-8 shadow-lg gap-1">
        <button
          type="button"
          onClick={() => {
            sound.playNavClick();
            setActiveGame('balloons');
          }}
          className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-full text-[11px] sm:text-xs font-serif-display font-medium transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer ${
            activeGame === 'balloons'
              ? 'bg-gradient-to-r from-[#b76e79] to-[#8d3d4b] text-[#fffdf9] shadow-md border border-[#f7e7ce]/30 font-semibold'
              : 'text-[#e6e6fa]/70 hover:text-[#fffdf9]'
          }`}
        >
          <span>🎈 Balloons</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playNavClick();
            setActiveGame('memory');
          }}
          className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-full text-[11px] sm:text-xs font-serif-display font-medium transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer ${
            activeGame === 'memory'
              ? 'bg-gradient-to-r from-[#b76e79] to-[#8d3d4b] text-[#fffdf9] shadow-md border border-[#f7e7ce]/30 font-semibold'
              : 'text-[#e6e6fa]/70 hover:text-[#fffdf9]'
          }`}
        >
          <span>🃏 Memory</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playNavClick();
            setActiveGame('catcher');
          }}
          className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-full text-[11px] sm:text-xs font-serif-display font-medium transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer ${
            activeGame === 'catcher'
              ? 'bg-gradient-to-r from-[#b76e79] to-[#8d3d4b] text-[#fffdf9] shadow-md border border-[#f7e7ce]/30 font-semibold'
              : 'text-[#e6e6fa]/70 hover:text-[#fffdf9]'
          }`}
        >
          <span>⭐ Catcher</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* GAME 1: BALLOON POP FIESTA                                */}
      {/* ======================================================== */}
      {activeGame === 'balloons' && (
        <div className="w-full max-w-4xl flex flex-col items-center animate-fade-in">
          {/* Header Stats */}
          <div className="w-full flex items-center justify-between px-1 sm:px-2 mb-4 sm:mb-6">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs font-serif-display uppercase tracking-widest text-[#ffdab9]">
                Wishes:
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#b76e79]/30 border border-[#ffdab9]/30 text-[11px] sm:text-xs font-bold text-[#fffdf9]">
                {poppedCount} / {balloons.length}
              </span>
            </div>

            <button
              type="button"
              onClick={handleResetBalloons}
              className="text-[11px] sm:text-xs font-serif-display text-[#e6e6fa]/70 hover:text-[#ffdab9] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Balloons</span>
            </button>
          </div>

          {/* Balloon Sky Container */}
          <div className="w-full p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-black/30 border border-[#f7e7ce]/20 backdrop-blur-xl relative overflow-hidden shadow-2xl mb-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#b76e79]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ffdab9]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Instruction Banner */}
            <div className="text-center mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm font-serif-display text-[#f7e7ce]/80 italic px-2">
                Tap each floating balloon to burst it and reveal the hidden secret wish prepared for you!
              </p>
            </div>

            {/* Balloons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 sm:gap-4 justify-items-center">
              {balloons.map((balloon) => (
                <div key={balloon.id} className="flex flex-col items-center">
                  {!balloon.popped ? (
                    <button
                      type="button"
                      onClick={(e) => handlePopBalloon(balloon.id, e)}
                      title={`Pop ${balloon.title}`}
                      className={`relative cursor-pointer group focus:outline-none transition-transform hover:scale-110 active:scale-90 animate-float ${balloon.delay}`}
                    >
                      {/* Realistic Balloon Shape */}
                      <div
                        className={`w-20 h-26 sm:w-22 sm:h-28 rounded-[50%_50%_50%_50%_/_45%_45%_55%_55%] bg-gradient-to-tr ${balloon.color} border ${balloon.borderColor} shadow-xl ${balloon.glowColor} relative overflow-hidden flex items-center justify-center`}
                      >
                        {/* Shimmer / Gloss Reflection */}
                        <div className="absolute top-2 left-3 w-4 h-7 rounded-full bg-white/35 -rotate-45 blur-[0.6px]" />
                        <span className="font-serif-display text-[10px] font-bold tracking-widest uppercase text-white/90 drop-shadow">
                          POP ME
                        </span>
                      </div>

                      {/* Balloon Knot */}
                      <div className="w-3 h-2 rounded-b-sm bg-gradient-to-b from-[#b76e79] to-[#591b2c] mx-auto -mt-0.5" />

                      {/* Dangling String */}
                      <div className="w-[1.5px] h-8 bg-gradient-to-b from-[#f7e7ce]/60 via-[#ffdab9]/30 to-transparent mx-auto" />
                    </button>
                  ) : (
                    /* Popped State Placeholder */
                    <button
                      type="button"
                      onClick={() => setSelectedWish(balloon)}
                      className="w-20 h-28 flex flex-col items-center justify-center p-2 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ffdab9]/40 transition-all cursor-pointer group"
                    >
                      <CheckCircle2 className="w-6 h-6 text-[#ffdab9] mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-serif-display text-[#e6e6fa]/80 tracking-tight text-center leading-tight">
                        Read Note #{balloon.id}
                      </span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Revealed Note Display Card */}
            {selectedWish && (
              <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#2e0b38]/90 via-[#210729]/95 to-[#16041c]/90 border border-[#f7e7ce]/35 shadow-xl text-center animate-fade-in relative">
                <div className="flex items-center justify-center gap-1.5 text-xs font-serif-display uppercase tracking-widest text-[#ffdab9] mb-2 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#ffdab9]" />
                  <span>{selectedWish.title}</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#ffdab9]" />
                </div>
                <p className="font-serif-display text-base sm:text-lg text-[#fffdf9] italic max-w-xl mx-auto leading-relaxed">
                  "{selectedWish.wish}"
                </p>
              </div>
            )}

            {/* All Popped Grand Trophy */}
            {allBalloonsPopped && (
              <div className="mt-8 p-6 rounded-3xl bg-gradient-to-b from-amber-950/40 via-purple-950/40 to-black/60 border border-amber-300/40 text-center animate-fade-in">
                <Trophy className="w-10 h-10 text-amber-300 mx-auto mb-2 animate-bounce" />
                <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-amber-200 mb-1">
                  All 6 Birthday Wishes Unlocked! 🏆
                </h3>
                <p className="text-xs sm:text-sm text-[#f7e7ce]/90 max-w-md mx-auto mb-4 font-light">
                  May each of these blessings follow you everywhere you walk this year, Meera!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={onOpenSurprise}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-900 font-serif-display font-semibold text-xs tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
                  >
                    <span>Blow Your Birthday Candles 🎂</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetBalloons}
                    className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-xs text-[#fffdf9] font-serif-display transition-all cursor-pointer"
                  >
                    <span>Play Again</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* GAME 2: MEMORY MATCH CHALLENGE                            */}
      {/* ======================================================== */}
      {activeGame === 'memory' && (
        <div className="w-full max-w-3xl flex flex-col items-center animate-fade-in">
          {/* Header Dashboard */}
          <div className="w-full flex items-center justify-between px-2 mb-6">
            <div className="flex items-center gap-4 text-xs font-serif-display text-[#e6e6fa]/80">
              <div>
                <span>Moves: </span>
                <strong className="text-[#ffdab9] font-sans">{moves}</strong>
              </div>
              <div>
                <span>Matches: </span>
                <strong className="text-[#ffdab9] font-sans">{matches} / 6</strong>
              </div>
              <div>
                <span>Time: </span>
                <strong className="text-[#ffdab9] font-sans">{gameTime}s</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetMemory}
              className="text-xs font-serif-display text-[#e6e6fa]/70 hover:text-[#ffdab9] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Shuffle & Restart</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="w-full p-3.5 sm:p-8 rounded-2xl sm:rounded-3xl bg-black/30 border border-[#f7e7ce]/20 backdrop-blur-xl relative overflow-hidden shadow-2xl mb-8">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3.5 max-w-xl mx-auto">
              {memoryCards.map((card, idx) => {
                const pairDef = MEMORY_PAIR_DEFINITIONS.find((p) => p.pairKey === card.pairKey);
                const IconComponent = pairDef?.icon || Cake;
                const isShown = card.isFlipped || card.isMatched;

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleCardClick(idx)}
                    disabled={isShown || isProcessing}
                    className={`aspect-square rounded-xl sm:rounded-2xl relative cursor-pointer select-none transition-all duration-300 transform perspective-1000 ${
                      isShown ? 'rotate-y-180' : 'hover:scale-105 active:scale-95'
                    }`}
                  >
                    {/* Card Front (Face-Up) */}
                    {isShown ? (
                      <div
                        className={`w-full h-full rounded-xl sm:rounded-2xl p-2 sm:p-3 flex flex-col items-center justify-center border shadow-xl transition-all ${
                          card.isMatched
                            ? 'bg-gradient-to-b from-[#2e0b38] to-[#1a0521] border-amber-300/60 shadow-amber-400/20'
                            : 'bg-gradient-to-b from-[#25092c] to-[#120317] border-[#f7e7ce]/40'
                        }`}
                      >
                        <IconComponent className={`w-5 h-5 sm:w-8 sm:h-8 mb-1 ${pairDef?.color}`} />
                        <span className="text-[9px] sm:text-xs font-serif-display text-[#fffdf9] font-medium text-center leading-tight">
                          {card.name}
                        </span>
                      </div>
                    ) : (
                      /* Card Back (Face-Down) with Gold Monogram */
                      <div className="w-full h-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#380e42] via-[#24082b] to-[#140319] border border-[#f7e7ce]/25 shadow-lg flex flex-col items-center justify-center p-1.5 sm:p-2 group hover:border-[#ffdab9]/50">
                        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full border border-[#f7e7ce]/30 flex items-center justify-center bg-white/5">
                          <span className="font-serif-display text-xs sm:text-base font-bold text-[#ffdab9]">
                            M
                          </span>
                        </div>
                        <span className="text-[7px] sm:text-[8px] font-mono tracking-widest text-[#e6e6fa]/50 uppercase mt-0.5 sm:mt-1">
                          CARD
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Latest Matched Story Banner */}
            {latestMatchedStory && !memoryCompleted && (
              <div className="mt-5 sm:mt-6 p-3.5 sm:p-5 rounded-2xl bg-gradient-to-r from-[#390d45]/90 via-[#270830]/95 to-[#190420]/90 border border-[#ffdab9]/40 shadow-xl text-left animate-fade-in relative">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-serif-display uppercase tracking-widest bg-[#ffdab9]/15 text-[#ffdab9] border border-[#ffdab9]/30 font-semibold">
                      Story Unlocked · {latestMatchedStory.phase}
                    </span>
                    <span className="font-serif-display text-[11px] sm:text-xs text-[#fffdf9] font-medium">
                      {latestMatchedStory.name}
                    </span>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-[#ffdab9] animate-spin-slow shrink-0" />
                </div>
                <blockquote className="font-serif-display text-xs sm:text-sm text-[#ffdab9] italic leading-relaxed pl-2 border-l-2 border-[#ffdab9]/50">
                  "{latestMatchedStory.storyQuote}"
                </blockquote>
                <p className="text-[10px] sm:text-[11px] font-sans text-[#e6e6fa]/75 mt-1 sm:mt-1.5 pl-2">
                  {latestMatchedStory.reflection}
                </p>
              </div>
            )}

            {/* Unlocked Story Chapters Shelf */}
            {unlockedPairs.length > 0 && !memoryCompleted && (
              <div className="mt-5 sm:mt-6 w-full pt-4 sm:pt-5 border-t border-white/10">
                <div className="flex flex-wrap items-center justify-between mb-2.5 sm:mb-3 text-xs font-serif-display text-[#e6e6fa]/85 gap-1">
                  <span className="uppercase tracking-widest text-[#ffdab9] font-medium flex items-center gap-1.5 text-[10px] sm:text-xs">
                    <Mail className="w-3.5 h-3.5 text-[#ffdab9]" />
                    Chapters Unlocked ({unlockedPairs.length} / 6)
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#ffdab9]/80 italic">
                    Milestones from the letter
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5">
                  {MEMORY_PAIR_DEFINITIONS.map((def) => {
                    const isUnlocked = unlockedPairs.includes(def.pairKey);
                    const Icon = def.icon;
                    return (
                      <div
                        key={def.pairKey}
                        className={`p-2.5 rounded-xl border text-left transition-all duration-300 ${
                          isUnlocked
                            ? 'bg-white/10 border-[#ffdab9]/45 text-[#fffdf9] shadow-sm'
                            : 'bg-white/5 border-white/5 opacity-40 text-stone-400'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className={`w-3.5 h-3.5 ${isUnlocked ? def.color : 'text-stone-500'} shrink-0`} />
                          <span className="text-[11px] font-serif-display font-medium truncate">
                            {def.name}
                          </span>
                        </div>
                        <p className="text-[10px] font-serif-display italic line-clamp-2 text-[#e6e6fa]/80">
                          {isUnlocked ? `"${def.storyQuote}"` : 'Match cards to reveal memory'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Modal / Celebration */}
            {memoryCompleted && (
              <div className="mt-6 sm:mt-8 p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-amber-950/40 via-purple-950/50 to-black/70 border border-amber-300/40 text-center animate-fade-in max-w-lg mx-auto shadow-2xl">
                <Award className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300 mx-auto mb-2 animate-bounce" />
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-serif-display uppercase tracking-widest bg-amber-400/20 text-amber-200 border border-amber-300/40 inline-block mb-1.5 sm:mb-2 font-semibold">
                  Entire Journey Reunited ✨
                </span>
                <h3 className="font-serif-display text-xl sm:text-3xl font-bold text-amber-200 mb-1">
                  Magnificent Memory, Doctor Paapa! 🩺✨
                </h3>
                <p className="text-xs sm:text-sm text-[#f7e7ce]/90 mb-3 sm:mb-4 max-w-md mx-auto">
                  You solved all 6 matching pairs in <strong>{moves} moves</strong> ({gameTime}s) and unlocked every milestone from childhood to today's sacred promise!
                </p>

                {/* Complete Story Recap Box */}
                <div className="bg-black/40 rounded-2xl p-3 sm:p-3.5 mb-4 sm:mb-5 border border-white/10 text-left space-y-2 max-h-52 overflow-y-auto pr-1">
                  {MEMORY_PAIR_DEFINITIONS.map((def, idx) => {
                    const Icon = def.icon;
                    return (
                      <div key={def.pairKey} className="flex items-start gap-1.5 sm:gap-2 text-xs">
                        <span className="text-amber-300 font-mono font-bold mt-0.5 shrink-0 text-[11px] sm:text-xs">0{idx + 1}.</span>
                        <Icon className={`w-3.5 h-3.5 mt-0.5 ${def.color} shrink-0`} />
                        <div>
                          <span className="font-semibold text-[#fffdf9]">{def.name}: </span>
                          <span className="text-[#ffdab9]/90 italic">"{def.storyQuote}"</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
                  {onNavigateToLetter && (
                    <button
                      type="button"
                      onClick={onNavigateToLetter}
                      className="w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-2.5 rounded-2xl sm:rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 font-serif-display font-semibold text-xs tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
                    >
                      <span>Read The Full Letter 💌</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onOpenSurprise}
                    className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-2xl sm:rounded-full bg-white/15 hover:bg-white/20 text-xs text-[#fffdf9] font-serif-display transition-all cursor-pointer border border-white/15"
                  >
                    <span>Cut Birthday Cake 🎂</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetMemory}
                    className="w-full sm:w-auto min-h-[40px] px-4 py-2 rounded-2xl sm:rounded-full bg-white/5 hover:bg-white/10 text-xs text-[#e6e6fa]/80 font-serif-display transition-all cursor-pointer"
                  >
                    <span>Play Again</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* GAME 3: STARLIGHT WISH CATCHER                           */}
      {/* ======================================================== */}
      {activeGame === 'catcher' && (
        <div className="w-full max-w-3xl flex flex-col items-center animate-fade-in">
          {/* Header Stats */}
          <div className="w-full flex items-center justify-between px-1 sm:px-2 mb-3 sm:mb-4">
            <div className="flex items-center gap-3 sm:gap-4 text-xs font-serif-display text-[#e6e6fa]/80">
              <div>
                <span>Score: </span>
                <strong className="text-amber-300 font-sans text-sm">{catcherScore}</strong>
              </div>
              <div>
                <span>Combo: </span>
                <strong className="text-[#ffdab9] font-sans text-sm">x{combo}</strong>
              </div>
            </div>

            {catcherActive ? (
              <button
                type="button"
                onClick={stopCatcherGame}
                className="text-xs font-serif-display text-[#e6e6fa]/70 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Pause Game</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={startCatcherGame}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#b76e79] to-[#8d3d4b] text-[#fffdf9] text-xs font-serif-display font-medium shadow-md cursor-pointer hover:brightness-110 active:scale-95"
              >
                <span>Start Catching</span>
              </button>
            )}
          </div>

          {/* Interactive Game Arena */}
          <div className="w-full rounded-2xl sm:rounded-3xl bg-black/40 border border-[#f7e7ce]/25 backdrop-blur-xl relative overflow-hidden shadow-2xl p-3.5 sm:p-6 mb-8 text-center">
            {catcherMilestone && (
              <div className="mb-3 p-2 rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-serif-display animate-pulse">
                {catcherMilestone}
              </div>
            )}

            {!catcherActive ? (
              <div className="py-8 sm:py-12 px-3 sm:px-4 flex flex-col items-center justify-center">
                <Star className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300 animate-spin-slow mb-3" />
                <h3 className="font-serif-display text-lg sm:text-2xl font-bold text-[#fffdf9] mb-1.5 sm:mb-2">
                  Starlight Wish Catcher
                </h3>
                <p className="font-serif-display text-xs sm:text-sm text-[#e6e6fa]/70 max-w-md mb-5 sm:mb-6 italic px-2">
                  Glide the basket across the night sky to catch falling stars, cakes, and golden gifts. Each catch chimes a serene note in harmony!
                </p>
                <button
                  type="button"
                  onClick={startCatcherGame}
                  className="w-full sm:w-auto min-h-[46px] px-6 sm:px-8 py-3 rounded-2xl sm:rounded-full bg-gradient-to-r from-[#b76e79] via-[#c47c87] to-[#8d3d4b] text-[#fffdf9] font-serif-display font-semibold text-xs tracking-wider uppercase shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Begin Starlight Catch ✨</span>
                </button>
              </div>
            ) : (
              <div>
                <canvas
                  ref={canvasRef}
                  onMouseMove={handleCanvasMouseMove}
                  onTouchMove={handleCanvasTouchMove}
                  className="w-full h-[280px] sm:h-[360px] rounded-2xl bg-gradient-to-b from-[#16041c] via-[#210729] to-[#0f0213] border border-white/10 touch-none cursor-ew-resize shadow-inner"
                />
                <span className="text-[10px] sm:text-[11px] text-[#e6e6fa]/60 font-sans mt-2 block">
                  Move mouse or slide finger left & right to control the basket
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Guided Storybook Flow Banner */}
      {onNavigateToLetter && (
        <div className="mt-8 sm:mt-12 w-full text-center p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#2f0c39]/90 via-[#210729]/95 to-[#16041c]/90 border border-[#ffdab9]/35 shadow-2xl">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#ffdab9] font-semibold block mb-1">
            Next Chapter in Your Birthday Journey ✦
          </span>
          <h4 className="font-serif-display text-lg sm:text-2xl text-[#fffdf9] font-bold mb-1.5 sm:mb-2">
            Read The Complete Letter & 6-Phase Timeline
          </h4>
          <p className="text-xs sm:text-sm text-[#f5ecfc] max-w-md mx-auto mb-4 sm:mb-5 leading-relaxed px-1">
            The personal handwritten letter from your brother and friend, along with the interactive chronological milestone chronicle.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                onNavigateToLetter();
              }}
              className="w-full sm:w-auto min-h-[46px] px-6 sm:px-7 py-3 rounded-2xl sm:rounded-full bg-gradient-to-r from-[#b76e79] via-[#c97b87] to-[#8d3d4b] hover:from-[#c57984] hover:to-[#9b4957] text-[#fffdf9] font-serif-display font-bold text-xs tracking-wider uppercase shadow-xl active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-2 border border-[#ffdab9]/40"
            >
              <span>Read Doctor Paapa's Letter 💌</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                onOpenSurprise();
              }}
              className="w-full sm:w-auto min-h-[46px] px-5 sm:px-6 py-3 rounded-2xl sm:rounded-full bg-white/10 hover:bg-white/15 border border-[#ffdab9]/30 text-[#ffdab9] text-xs font-serif-display font-semibold transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              <Cake className="w-4 h-4 text-[#ffdab9]" />
              <span>Cut 3D Birthday Cake 🎂</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
