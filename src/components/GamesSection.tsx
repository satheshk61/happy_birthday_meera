import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  Trophy, 
  RotateCcw, 
  PartyPopper, 
  Heart, 
  Gift, 
  Music, 
  Camera, 
  Mail, 
  Cake, 
  Star, 
  Wind, 
  Volume2, 
  Award, 
  Zap, 
  Compass, 
  CheckCircle2, 
  Stethoscope, 
  Phone, 
  Shield, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Flame, 
  Play, 
  Pause, 
  Crown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
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
// HAPTIC FEEDBACK HELPER
// ==========================================
const triggerHaptic = (pattern: number | number[] = 20) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {}
  }
};

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
    reflection: 'Watching you dedicate your brilliance and compasssion to healing lives.',
  },
  {
    pairKey: 'promise',
    name: 'Protected As My Eyes',
    phase: 'Forever',
    icon: Shield,
    color: 'text-blue-300',
    storyQuote: 'On this special day I promise you that I will stay connected beyond restrictions and whatever the situation is, and I will protect you as my eyes and keep away difficulties. Just a call away.',
    reflection: 'A sacred lifelong brotherly vow to protect you as my own eyes.',
  },
];

const generateShuffledCards = (): MemoryCardItem[] => {
  const cards: MemoryCardItem[] = [];
  let idCounter = 1;

  MEMORY_PAIR_DEFINITIONS.forEach((def) => {
    cards.push({
      id: idCounter++,
      pairKey: def.pairKey,
      name: def.name,
      iconName: def.pairKey,
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      id: idCounter++,
      pairKey: def.pairKey,
      name: def.name,
      iconName: def.pairKey,
      isFlipped: false,
      isMatched: false,
    });
  });

  return cards.sort(() => Math.random() - 0.5);
};

export const GamesSection: React.FC<GamesSectionProps> = ({
  config,
  onOpenSurprise,
  onNavigateToLetter,
}) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('balloons');

  // ==========================================
  // GLOBAL ARCADE GAMIFICATION & XP SYSTEM
  // ==========================================
  const [playerXP, setPlayerXP] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('doctor_paapa_arcade_xp');
      return saved ? parseInt(saved, 10) : 120;
    }
    return 120;
  });

  const [xpToast, setXpToast] = useState<{ amount: number; text: string } | null>(null);

  const awardXP = useCallback((amount: number, reason: string) => {
    setPlayerXP((prev) => {
      const next = prev + amount;
      if (typeof window !== 'undefined') {
        localStorage.setItem('doctor_paapa_arcade_xp', next.toString());
      }
      return next;
    });
    setXpToast({ amount, text: reason });
    setTimeout(() => setXpToast(null), 2500);
  }, []);

  // Compute Player Level
  const getLevelInfo = (xp: number) => {
    if (xp < 180) return { level: 1, title: 'Starlight Novice', nextThreshold: 180, icon: '⭐' };
    if (xp < 380) return { level: 2, title: 'Memory Weaver', nextThreshold: 380, icon: '🌸' };
    if (xp < 650) return { level: 3, title: 'Radiant Paapa', nextThreshold: 650, icon: '✨' };
    if (xp < 1000) return { level: 4, title: 'Cosmic Healer', nextThreshold: 1000, icon: '🩺' };
    return { level: 5, title: 'Doctor Paapa Legend', nextThreshold: 1500, icon: '👑' };
  };

  const levelInfo = getLevelInfo(playerXP);
  const prevThreshold = levelInfo.level === 1 ? 0 : levelInfo.level === 2 ? 180 : levelInfo.level === 3 ? 380 : levelInfo.level === 4 ? 650 : 1000;
  const levelProgress = Math.min(100, Math.max(5, ((playerXP - prevThreshold) / (levelInfo.nextThreshold - prevThreshold)) * 100));

  // ==========================================
  // GAME 1 STATE: Balloon Pop
  // ==========================================
  const [balloons, setBalloons] = useState<BalloonItem[]>(() =>
    INITIAL_BALLOONS.map((b) => ({ ...b, popped: false }))
  );
  const [selectedWish, setSelectedWish] = useState<BalloonItem | null>(null);
  const [balloonStreak, setBalloonStreak] = useState(0);
  const lastPopTimeRef = useRef<number>(0);

  const poppedCount = balloons.filter((b) => b.popped).length;
  const allBalloonsPopped = poppedCount === balloons.length;

  const handlePopBalloon = (id: number, e: React.MouseEvent | React.TouchEvent) => {
    const target = balloons.find((b) => b.id === id);
    if (!target || target.popped) return;

    triggerHaptic([25, 40]);
    sound.playBalloonPop();

    const clientX = 'clientX' in e ? e.clientX : e.touches?.[0]?.clientX || window.innerWidth / 2;
    const clientY = 'clientY' in e ? e.clientY : e.touches?.[0]?.clientY || window.innerHeight / 2;
    triggerTapSparkle(clientX, clientY);

    const now = Date.now();
    let newStreak = 1;
    if (now - lastPopTimeRef.current < 4500) {
      newStreak = balloonStreak + 1;
    }
    lastPopTimeRef.current = now;
    setBalloonStreak(newStreak);

    const updated = balloons.map((b) => (b.id === id ? { ...b, popped: true } : b));
    setBalloons(updated);
    setSelectedWish(target);

    // Award XP
    const xpBonus = newStreak > 1 ? 25 + newStreak * 10 : 25;
    awardXP(xpBonus, newStreak > 1 ? `Pop Streak x${newStreak}!` : 'Balloon Popped!');

    if (updated.every((b) => b.popped)) {
      setTimeout(() => {
        triggerHaptic([50, 100, 50, 100]);
        sound.playSurpriseReveal();
        triggerSurpriseConfetti();
        awardXP(100, 'All 6 Birthday Wishes Unlocked! 🏆');
      }, 400);
    }
  };

  const handleResetBalloons = () => {
    sound.playNavClick();
    triggerHaptic(15);
    setBalloons(INITIAL_BALLOONS.map((b) => ({ ...b, popped: false })));
    setSelectedWish(null);
    setBalloonStreak(0);
  };

  // ==========================================
  // GAME 2 STATE: Memory Match
  // ==========================================
  const [memoryCards, setMemoryCards] = useState<MemoryCardItem[]>(generateShuffledCards);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [memoryCombo, setMemoryCombo] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [memoryCompleted, setMemoryCompleted] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [latestMatchedStory, setLatestMatchedStory] = useState<MemoryPairDefinition | null>(null);

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

    triggerHaptic(15);
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
          triggerHaptic([30, 50, 40]);
          sound.playMatchSuccess();
          triggerSurpriseConfetti();
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setMemoryCards([...newCards]);
          setFlippedIndices([]);
          setIsProcessing(false);
          const newMatches = matches + 1;
          setMatches(newMatches);

          const newCombo = memoryCombo + 1;
          setMemoryCombo(newCombo);

          const matchedDef = MEMORY_PAIR_DEFINITIONS.find((p) => p.pairKey === newCards[firstIdx].pairKey);
          if (matchedDef) {
            setLatestMatchedStory(matchedDef);
          }

          awardXP(35 + (newCombo > 1 ? 20 : 0), newCombo > 1 ? `Combo x${newCombo} Match!` : 'Memory Milestone Matched!');

          if (newMatches === 6) {
            setMemoryCompleted(true);
            setTimerActive(false);
            awardXP(150, 'Memory Challenge Mastered! ★★★');
          }
        }, 450);
      } else {
        // Mismatch
        setMemoryCombo(0);
        setTimeout(() => {
          triggerHaptic(20);
          sound.playMatchMismatch();
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setMemoryCards([...newCards]);
          setFlippedIndices([]);
          setIsProcessing(false);
        }, 800);
      }
    }
  };

  const handleResetMemory = () => {
    sound.playNavClick();
    triggerHaptic(15);
    setMemoryCards(generateShuffledCards());
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setMemoryCombo(0);
    setIsProcessing(false);
    setMemoryCompleted(false);
    setGameTime(0);
    setTimerActive(false);
    setLatestMatchedStory(null);
  };

  // Calculate memory star rating
  const getMemoryStars = () => {
    if (moves <= 10) return 3;
    if (moves <= 16) return 2;
    return 1;
  };

  // ==========================================
  // GAME 3 STATE: Starlight Wish Catcher (Mobile-Engineered)
  // ==========================================
  const [catcherScore, setCatcherScore] = useState(0);
  const [catcherHighScore, setCatcherHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('doctor_paapa_catcher_highscore');
      return saved ? parseInt(saved, 10) : 180;
    }
    return 180;
  });
  const [catcherActive, setCatcherActive] = useState(false);
  const [combo, setCombo] = useState(1);
  const [catcherMilestone, setCatcherMilestone] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const basketXRef = useRef<number>(180);
  const animationFrameIdRef = useRef<number | null>(null);
  const isMovingLeftRef = useRef<boolean>(false);
  const isMovingRightRef = useRef<boolean>(false);

  interface FallingItem {
    x: number;
    y: number;
    speed: number;
    size: number;
    type: 'star' | 'cupcake' | 'heart' | 'gift' | 'doctor';
    points: number;
    emoji: string;
  }

  const itemsRef = useRef<FallingItem[]>([]);
  const scoreRef = useRef(0);
  const comboRef = useRef(1);

  const startCatcherGame = () => {
    sound.playMatchLight();
    triggerHaptic([20, 30]);
    setCatcherActive(true);
    setCatcherScore(0);
    setCombo(1);
    setCatcherMilestone(null);
    scoreRef.current = 0;
    comboRef.current = 1;
    itemsRef.current = [];
  };

  const stopCatcherGame = () => {
    sound.playNavClick();
    triggerHaptic(15);
    setCatcherActive(false);
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
  };

  // Game Loop
  useEffect(() => {
    if (!catcherActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = 360);

    basketXRef.current = width / 2;

    const itemTypes: { type: FallingItem['type']; emoji: string; points: number; weight: number }[] = [
      { type: 'star', emoji: '⭐', points: 10, weight: 50 },
      { type: 'cupcake', emoji: '🧁', points: 25, weight: 25 },
      { type: 'heart', emoji: '💖', points: 35, weight: 15 },
      { type: 'gift', emoji: '🎁', points: 50, weight: 8 },
      { type: 'doctor', emoji: '🩺', points: 100, weight: 2 },
    ];

    let spawnTimer = 0;

    const render = () => {
      // Handle button-driven left/right movement
      if (isMovingLeftRef.current) {
        basketXRef.current = Math.max(35, basketXRef.current - 7);
      }
      if (isMovingRightRef.current) {
        basketXRef.current = Math.min(width - 35, basketXRef.current + 7);
      }

      ctx.clearRect(0, 0, width, height);

      // Draw starry night backdrop
      ctx.fillStyle = '#100315';
      ctx.fillRect(0, 0, width, height);

      // Draw gentle starry twinkles
      for (let s = 0; s < 18; s++) {
        const sx = (s * 37 + (Date.now() / 40) * (s % 3 + 1)) % width;
        const sy = (s * 41 + s * 13) % (height - 60);
        ctx.fillStyle = s % 2 === 0 ? 'rgba(255, 218, 185, 0.4)' : 'rgba(230, 230, 250, 0.35)';
        ctx.fillRect(sx, sy, 2, 2);
      }

      // Draw Basket
      const basketW = Math.min(90, width * 0.26);
      const basketH = 26;
      const basketY = height - 42;
      const bx = Math.max(basketW / 2, Math.min(width - basketW / 2, basketXRef.current));

      // Basket Glow
      const glowGrad = ctx.createRadialGradient(bx, basketY + 10, 5, bx, basketY + 10, basketW);
      glowGrad.addColorStop(0, comboRef.current >= 4 ? 'rgba(251, 191, 36, 0.4)' : 'rgba(183, 110, 121, 0.35)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(bx - basketW, basketY - 20, basketW * 2, 60);

      // Basket Body
      ctx.fillStyle = comboRef.current >= 4 ? '#d97706' : '#b76e79';
      ctx.beginPath();
      ctx.roundRect(bx - basketW / 2, basketY, basketW, basketH, [6, 6, 14, 14]);
      ctx.fill();
      ctx.strokeStyle = '#ffdab9';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Basket label
      ctx.fillStyle = '#fffdf9';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(comboRef.current >= 4 ? '🔥 MAX FRENZY' : '🧺 Paapa Basket', bx, basketY + 16);

      // Spawn falling items
      spawnTimer++;
      if (spawnTimer % 42 === 0) {
        const rand = Math.random() * 100;
        let cumulative = 0;
        let chosen = itemTypes[0];
        for (const it of itemTypes) {
          cumulative += it.weight;
          if (rand <= cumulative) {
            chosen = it;
            break;
          }
        }

        itemsRef.current.push({
          x: Math.random() * (width - 60) + 30,
          y: -20,
          speed: 2.2 + Math.random() * 1.6 + Math.min(2.5, scoreRef.current / 150),
          size: chosen.type === 'doctor' ? 30 : 24,
          type: chosen.type,
          points: chosen.points,
          emoji: chosen.emoji,
        });
      }

      // Update & Draw Items
      for (let i = itemsRef.current.length - 1; i >= 0; i--) {
        const item = itemsRef.current[i];
        item.y += item.speed;

        ctx.font = `${item.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(item.emoji, item.x, item.y);

        // Check collision with basket
        if (
          item.y >= basketY - 12 &&
          item.y <= basketY + basketH &&
          Math.abs(item.x - bx) < basketW / 2 + 10
        ) {
          triggerHaptic(20);
          sound.playStarCatch(comboRef.current);

          const gained = item.points * comboRef.current;
          scoreRef.current += gained;
          setCatcherScore(scoreRef.current);

          // Update High Score
          if (scoreRef.current > catcherHighScore) {
            setCatcherHighScore(scoreRef.current);
            if (typeof window !== 'undefined') {
              localStorage.setItem('doctor_paapa_catcher_highscore', scoreRef.current.toString());
            }
          }

          awardXP(Math.round(gained / 2), `Caught ${item.emoji} (+${gained}pts)`);

          const nextCombo = Math.min(5, comboRef.current + 1);
          comboRef.current = nextCombo;
          setCombo(nextCombo);

          // Milestone alerts
          if (scoreRef.current >= 150 && !catcherMilestone) {
            setCatcherMilestone('🌟 Starlight Champion reached! Outstanding reflexes, Doctor Paapa!');
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
  }, [catcherActive, catcherHighScore, awardXP]);

  // Touch Drag for Basket
  const handleTouchGlide = (clientX: number) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    basketXRef.current = Math.max(30, Math.min(rect.width - 30, relativeX));
  };

  return (
    <section className="relative min-h-[calc(100dvh-5rem)] flex flex-col items-center justify-start px-2 sm:px-4 py-4 sm:py-8 max-w-5xl mx-auto w-full">
      {/* ======================================================== */}
      {/* ARCADE GAMIFICATION BAR: XP & PLAYER LEVEL               */}
      {/* ======================================================== */}
      <div className="w-full max-w-xl mx-auto mb-4 p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-[#f7e7ce]/25 backdrop-blur-md shadow-lg flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#b76e79] to-[#8d3d4b] border border-[#ffdab9]/40 flex items-center justify-center text-lg sm:text-xl shadow-md shrink-0">
            {levelInfo.icon}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#ffdab9] font-semibold">
                Level {levelInfo.level}
              </span>
              <span className="text-xs font-serif-display font-bold text-[#fffdf9]">
                {levelInfo.title}
              </span>
            </div>
            <div className="w-28 sm:w-40 h-1.5 bg-black/40 rounded-full overflow-hidden mt-1 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-[#b76e79] rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[10px] uppercase font-mono tracking-wider text-[#e6e6fa]/70">
            Arcade Score
          </div>
          <div className="text-sm sm:text-base font-bold text-amber-300 font-mono">
            {playerXP} XP
          </div>
        </div>
      </div>

      {/* Floating XP Gain Notification Toast */}
      {xpToast && (
        <div
          role="status"
          className="fixed top-18 z-50 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-[#b76e79] text-stone-950 font-serif-display font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 animate-bounce border border-[#fffdf9]/40"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>+{xpToast.amount} XP · {xpToast.text}</span>
        </div>
      )}

      {/* Top Header */}
      <h1 className="font-serif-display text-2xl sm:text-4xl md:text-5xl font-bold text-center text-[#fffdf9] tracking-tight mb-1 sm:mb-2 px-1">
        Play & Unlock <span className="gold-foil-text font-script text-3xl sm:text-5xl">Birthday Magic</span>
      </h1>
      <p className="font-serif-display text-xs sm:text-sm text-[#e6e6fa]/75 text-center max-w-lg mb-4 sm:mb-6 italic px-2">
        A playful, heartwarming arcade dedicated to Meera. Pop secret wish balloons, match memories, and catch cosmic starlight!
      </p>

      {/* ======================================================== */}
      {/* MOBILE IN-GAME NAVIGATION PILL DOCK                      */}
      {/* ======================================================== */}
      <div className="w-full max-w-md flex items-center justify-between p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-4 sm:mb-6 shadow-lg gap-1">
        <button
          type="button"
          onClick={() => {
            sound.playNavClick();
            triggerHaptic(15);
            setActiveGame('balloons');
          }}
          className={`flex-1 py-2 px-1.5 sm:px-3 rounded-xl text-xs font-serif-display font-medium transition-all duration-300 flex flex-col items-center justify-center cursor-pointer active:scale-95 ${
            activeGame === 'balloons'
              ? 'bg-gradient-to-r from-[#b76e79] to-[#8d3d4b] text-[#fffdf9] shadow-md border border-[#f7e7ce]/30 font-semibold'
              : 'text-[#e6e6fa]/70 hover:text-[#fffdf9]'
          }`}
        >
          <span className="text-xs sm:text-sm">🎈 Balloons</span>
          <span className="text-[9px] font-mono opacity-80 mt-0.5">
            {poppedCount}/6 Popped
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playNavClick();
            triggerHaptic(15);
            setActiveGame('memory');
          }}
          className={`flex-1 py-2 px-1.5 sm:px-3 rounded-xl text-xs font-serif-display font-medium transition-all duration-300 flex flex-col items-center justify-center cursor-pointer active:scale-95 ${
            activeGame === 'memory'
              ? 'bg-gradient-to-r from-[#b76e79] to-[#8d3d4b] text-[#fffdf9] shadow-md border border-[#f7e7ce]/30 font-semibold'
              : 'text-[#e6e6fa]/70 hover:text-[#fffdf9]'
          }`}
        >
          <span className="text-xs sm:text-sm">🃏 Memory</span>
          <span className="text-[9px] font-mono opacity-80 mt-0.5">
            {matches}/6 Pairs
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playNavClick();
            triggerHaptic(15);
            setActiveGame('catcher');
          }}
          className={`flex-1 py-2 px-1.5 sm:px-3 rounded-xl text-xs font-serif-display font-medium transition-all duration-300 flex flex-col items-center justify-center cursor-pointer active:scale-95 ${
            activeGame === 'catcher'
              ? 'bg-gradient-to-r from-[#b76e79] to-[#8d3d4b] text-[#fffdf9] shadow-md border border-[#f7e7ce]/30 font-semibold'
              : 'text-[#e6e6fa]/70 hover:text-[#fffdf9]'
          }`}
        >
          <span className="text-xs sm:text-sm">⭐ Catcher</span>
          <span className="text-[9px] font-mono opacity-80 mt-0.5">
            Best: {catcherHighScore}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* GAME 1: BALLOON POP FIESTA                                */}
      {/* ======================================================== */}
      {activeGame === 'balloons' && (
        <div className="w-full max-w-4xl flex flex-col items-center animate-fade-in">
          {/* Header Stats */}
          <div className="w-full flex items-center justify-between px-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-serif-display uppercase tracking-widest text-[#ffdab9]">
                Wishes:
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#b76e79]/30 border border-[#ffdab9]/30 text-xs font-bold text-[#fffdf9]">
                {poppedCount} / {balloons.length}
              </span>
              {balloonStreak > 1 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold text-[10px] animate-pulse">
                  🔥 Streak x{balloonStreak}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleResetBalloons}
              className="text-xs font-serif-display text-[#e6e6fa]/70 hover:text-[#ffdab9] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Balloons</span>
            </button>
          </div>

          {/* Balloon Sky Container */}
          <div className="w-full p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-black/35 border border-[#f7e7ce]/20 backdrop-blur-xl relative overflow-hidden shadow-2xl mb-6">
            <div className="text-center mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm font-serif-display text-[#f7e7ce]/80 italic px-2">
                Tap each floating balloon to burst it and reveal the heartfelt secret note prepared for you!
              </p>
            </div>

            {/* Balloons Touch Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5 sm:gap-4 justify-items-center">
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
                        className={`w-22 h-28 sm:w-24 sm:h-30 rounded-[50%_50%_50%_50%_/_45%_45%_55%_55%] bg-gradient-to-tr ${balloon.color} border ${balloon.borderColor} shadow-xl ${balloon.glowColor} relative overflow-hidden flex items-center justify-center`}
                      >
                        <div className="absolute top-3 left-3 w-5 h-7 rounded-[50%] bg-white/35 -rotate-30 blur-[1px]" />
                        <Sparkles className="w-6 h-6 text-white/90 drop-shadow-md" />
                      </div>
                      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-rose-400 mx-auto -mt-0.5" />
                      <div className="w-0.5 h-7 bg-white/30 mx-auto" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playNavClick();
                        triggerHaptic(15);
                        setSelectedWish(balloon);
                      }}
                      className="w-20 h-28 sm:w-22 sm:h-30 flex flex-col items-center justify-center p-2 rounded-2xl bg-white/5 border border-[#ffdab9]/30 hover:border-[#ffdab9]/60 transition-all cursor-pointer group shadow-inner"
                    >
                      <CheckCircle2 className="w-7 h-7 text-[#ffdab9] mb-1.5 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-serif-display text-[#fffdf9] font-semibold text-center leading-tight">
                        Read Note #{balloon.id}
                      </span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Revealed Note Modal Drawer (Pops up directly on screen for mobile accessibility) */}
            {selectedWish && (
              <div
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 animate-fade-in"
                onClick={() => setSelectedWish(null)}
              >
                <div
                  className="w-full max-w-lg p-5 sm:p-8 rounded-3xl bg-gradient-to-b from-[#380e42] via-[#24082b] to-[#140319] border border-[#ffdab9]/50 shadow-2xl text-center relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedWish(null)}
                    aria-label="Close wish note"
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#fffdf9] transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="w-12 h-12 rounded-full bg-[#b76e79]/30 border border-[#ffdab9]/40 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-[#ffdab9]" />
                  </div>

                  <span className="text-xs font-serif-display uppercase tracking-widest text-[#ffdab9] font-semibold block mb-1">
                    {selectedWish.title}
                  </span>

                  <p className="font-serif-display text-base sm:text-lg text-[#fffdf9] italic my-4 leading-relaxed px-2">
                    "{selectedWish.wish}"
                  </p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedWish(null)}
                      className="w-full py-3 rounded-full bg-gradient-to-r from-[#b76e79] to-[#8d3d4b] text-[#fffdf9] font-serif-display font-semibold text-xs tracking-wider uppercase shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <span>Keep Playing & Pop More 🎈</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Grand Trophy for All Balloons */}
            {allBalloonsPopped && (
              <div className="mt-8 p-6 rounded-3xl bg-gradient-to-b from-amber-950/40 via-purple-950/40 to-black/60 border border-amber-300/40 text-center animate-fade-in">
                <Trophy className="w-12 h-12 text-amber-300 mx-auto mb-2 animate-bounce" />
                <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-amber-200 mb-1">
                  All 6 Birthday Wishes Unlocked! 🏆
                </h3>
                <p className="text-xs sm:text-sm text-[#f7e7ce]/90 max-w-md mx-auto mb-4 font-light">
                  May each of these blessings follow you everywhere you walk this year, Meera!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playNavClick();
                      triggerHaptic(15);
                      setActiveGame('memory');
                    }}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-900 font-serif-display font-bold text-xs tracking-wider uppercase shadow-lg hover:brightness-110 transition-all cursor-pointer"
                  >
                    <span>Play Memory Match Next 🃏</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenSurprise}
                    className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-xs text-[#fffdf9] font-serif-display transition-all cursor-pointer"
                  >
                    <span>Cut Birthday Cake 🎂</span>
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
          <div className="w-full flex items-center justify-between px-2 mb-3">
            <div className="flex items-center gap-3 sm:gap-4 text-xs font-serif-display text-[#e6e6fa]/80">
              <div>
                <span>Moves: </span>
                <strong className="text-[#ffdab9] font-sans text-sm">{moves}</strong>
              </div>
              <div>
                <span>Matches: </span>
                <strong className="text-[#ffdab9] font-sans text-sm">{matches} / 6</strong>
              </div>
              <div>
                <span>Time: </span>
                <strong className="text-[#ffdab9] font-sans text-sm">{gameTime}s</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetMemory}
              className="text-xs font-serif-display text-[#e6e6fa]/70 hover:text-[#ffdab9] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>
          </div>

          {/* Cards Grid - 3 columns on mobile for large comfortable touch targets */}
          <div className="w-full p-3 sm:p-6 rounded-2xl sm:rounded-3xl bg-black/35 border border-[#f7e7ce]/20 backdrop-blur-xl relative overflow-hidden shadow-2xl mb-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3.5 max-w-lg mx-auto">
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
                    className={`aspect-square rounded-xl sm:rounded-2xl relative cursor-pointer select-none transition-all duration-300 transform perspective-1000 active:scale-95 touch-manipulation ${
                      isShown ? 'scale-100 ring-2 ring-amber-300/60 shadow-lg' : 'hover:scale-102 hover:border-[#ffdab9]/50'
                    }`}
                  >
                    {/* Card Front (Face-Up) */}
                    {isShown ? (
                      <div
                        className={`w-full h-full rounded-xl sm:rounded-2xl p-1.5 sm:p-3 flex flex-col items-center justify-center border shadow-xl transition-all ${
                          card.isMatched
                            ? 'bg-gradient-to-b from-[#380e42] to-[#1f0627] border-amber-300/70 shadow-amber-400/25'
                            : 'bg-gradient-to-b from-[#2a0933] to-[#15031b] border-[#f7e7ce]/40'
                        }`}
                      >
                        <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 mb-1 ${pairDef?.color}`} />
                        <span className="text-[10px] sm:text-xs font-serif-display text-[#fffdf9] font-medium text-center leading-tight">
                          {card.name}
                        </span>
                      </div>
                    ) : (
                      /* Card Back (Face-Down) with Gold Monogram */
                      <div className="w-full h-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#380e42] via-[#24082b] to-[#140319] border border-[#f7e7ce]/25 shadow-lg flex flex-col items-center justify-center p-1.5 group hover:border-[#ffdab9]/50">
                        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full border border-[#f7e7ce]/30 flex items-center justify-center bg-white/5">
                          <span className="font-serif-display text-xs sm:text-base font-bold text-[#ffdab9]">
                            M
                          </span>
                        </div>
                        <span className="text-[7px] sm:text-[8px] font-mono tracking-widest text-[#e6e6fa]/50 uppercase mt-0.5">
                          CARD
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Matched Milestone Story Drawer Pop-Up */}
            {latestMatchedStory && !memoryCompleted && (
              <div
                role="dialog"
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 animate-fade-in"
                onClick={() => setLatestMatchedStory(null)}
              >
                <div
                  className="w-full max-w-lg p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#380e42] via-[#24082b] to-[#140319] border border-[#ffdab9]/50 shadow-2xl text-center relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setLatestMatchedStory(null)}
                    aria-label="Close milestone"
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#fffdf9] transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="w-12 h-12 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center mx-auto mb-2 text-amber-300">
                    <Sparkles className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] font-serif-display uppercase tracking-widest text-[#ffdab9] font-semibold">
                    Milestone Unlocked · {latestMatchedStory.phase}
                  </span>

                  <h3 className="font-serif-display text-lg sm:text-xl font-bold text-[#fffdf9] mt-0.5 mb-2">
                    {latestMatchedStory.name}
                  </h3>

                  <blockquote className="my-3 p-3 rounded-2xl bg-white/5 border-l-2 border-[#ffdab9] italic text-xs sm:text-sm text-[#f7e7ce] leading-relaxed text-left">
                    "{latestMatchedStory.storyQuote}"
                  </blockquote>

                  <p className="text-xs text-[#ffdab9]/90 italic font-serif-display mb-4">
                    ✦ {latestMatchedStory.reflection}
                  </p>

                  <button
                    type="button"
                    onClick={() => setLatestMatchedStory(null)}
                    className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#b76e79] to-[#8d3d4b] text-[#fffdf9] font-serif-display font-semibold text-xs tracking-wider uppercase shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Awesome! Continue Matching 🃏</span>
                  </button>
                </div>
              </div>
            )}

            {/* Victory Celebration */}
            {memoryCompleted && (
              <div className="mt-6 p-6 rounded-3xl bg-gradient-to-b from-amber-950/40 via-purple-950/40 to-black/60 border border-amber-300/40 text-center animate-fade-in">
                <div className="flex justify-center gap-1 mb-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-8 h-8 ${
                        i < getMemoryStars()
                          ? 'text-amber-300 fill-amber-300 animate-bounce'
                          : 'text-stone-600'
                      }`}
                    />
                  ))}
                </div>
                <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-amber-200 mb-1">
                  Memory Challenge Mastered! 🌟
                </h3>
                <p className="text-xs sm:text-sm text-[#f7e7ce]/90 max-w-md mx-auto mb-4 font-light">
                  Completed in <strong className="text-white">{moves} moves</strong> and <strong className="text-white">{gameTime} seconds</strong>!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playNavClick();
                      triggerHaptic(15);
                      setActiveGame('catcher');
                    }}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-900 font-serif-display font-bold text-xs tracking-wider uppercase shadow-lg hover:brightness-110 transition-all cursor-pointer"
                  >
                    <span>Play Starlight Catcher Next ⭐</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetMemory}
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
      {/* GAME 3: STARLIGHT WISH CATCHER (Mobile Dual-Controls)    */}
      {/* ======================================================== */}
      {activeGame === 'catcher' && (
        <div className="w-full max-w-3xl flex flex-col items-center animate-fade-in no-swipe">
          {/* Header Stats */}
          <div className="w-full flex items-center justify-between px-2 mb-3">
            <div className="flex items-center gap-3 text-xs font-serif-display text-[#e6e6fa]/80">
              <div>
                <span>Score: </span>
                <strong className="text-amber-300 font-sans text-sm">{catcherScore}</strong>
              </div>
              <div>
                <span>Best: </span>
                <strong className="text-[#ffdab9] font-sans text-sm">{catcherHighScore}</strong>
              </div>
              <div className="flex items-center gap-1">
                <span>Combo: </span>
                <strong className={`font-sans text-sm ${combo >= 4 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                  x{combo}
                </strong>
              </div>
            </div>

            {catcherActive ? (
              <button
                type="button"
                onClick={stopCatcherGame}
                className="text-xs font-serif-display text-[#e6e6fa]/70 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
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
          <div className="w-full rounded-2xl sm:rounded-3xl bg-black/40 border border-[#f7e7ce]/25 backdrop-blur-xl relative overflow-hidden shadow-2xl p-2.5 sm:p-6 mb-4 text-center">
            {catcherMilestone && (
              <div className="mb-3 p-2 rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-serif-display animate-pulse">
                {catcherMilestone}
              </div>
            )}

            {!catcherActive ? (
              <div className="py-8 sm:py-12 px-3 sm:px-4 flex flex-col items-center justify-center">
                <Star className="w-12 h-12 text-amber-300 animate-spin-slow mb-3" />
                <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-[#fffdf9] mb-1.5">
                  Starlight Wish Catcher
                </h3>
                <p className="font-serif-display text-xs sm:text-sm text-[#e6e6fa]/70 max-w-md mb-5 italic px-2">
                  Catch falling stars (⭐), cupcakes (🧁), and the legendary Doctor Paapa emblem (🩺) for maximum points!
                </p>
                <button
                  type="button"
                  onClick={startCatcherGame}
                  className="w-full sm:w-auto min-h-[46px] px-8 py-3 rounded-full bg-gradient-to-r from-[#b76e79] via-[#c47c87] to-[#8d3d4b] text-[#fffdf9] font-serif-display font-semibold text-xs tracking-wider uppercase shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Begin Starlight Catch ✨</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <canvas
                  ref={canvasRef}
                  onTouchMove={(e) => {
                    if (e.touches[0]) handleTouchGlide(e.touches[0].clientX);
                  }}
                  onMouseMove={(e) => handleTouchGlide(e.clientX)}
                  className="w-full h-[280px] sm:h-[340px] rounded-2xl bg-gradient-to-b from-[#14031a] via-[#1f0627] to-[#0e0212] border border-white/10 touch-none shadow-inner"
                />

                {/* DUAL TOUCH MOBILE CONTROLS */}
                <div className="w-full mt-3 flex flex-col gap-2">
                  {/* Glide Slider Bar for single-thumb precision on mobile */}
                  <div className="w-full flex items-center gap-2 px-1">
                    <span className="text-[10px] font-mono text-[#ffdab9]">Slide Basket:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="50"
                      onChange={(e) => {
                        const canvas = canvasRef.current;
                        if (canvas) {
                          const w = canvas.width;
                          basketXRef.current = (Number(e.target.value) / 100) * w;
                        }
                      }}
                      className="w-full h-2 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#b76e79]"
                    />
                  </div>

                  {/* Left / Right Big Touch Buttons on Mobile */}
                  <div className="flex items-center justify-between gap-3 w-full">
                    <button
                      type="button"
                      onTouchStart={() => (isMovingLeftRef.current = true)}
                      onTouchEnd={() => (isMovingLeftRef.current = false)}
                      onMouseDown={() => (isMovingLeftRef.current = true)}
                      onMouseUp={() => (isMovingLeftRef.current = false)}
                      className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 active:bg-[#b76e79]/50 border border-white/20 text-[#fffdf9] font-serif-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>◀ Move Left</span>
                    </button>

                    <button
                      type="button"
                      onTouchStart={() => (isMovingRightRef.current = true)}
                      onTouchEnd={() => (isMovingRightRef.current = false)}
                      onMouseDown={() => (isMovingRightRef.current = true)}
                      onMouseUp={() => (isMovingRightRef.current = false)}
                      className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 active:bg-[#b76e79]/50 border border-white/20 text-[#fffdf9] font-serif-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none"
                    >
                      <span>Move Right ▶</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Guided Next Chapter Flow */}
      {onNavigateToLetter && (
        <div className="mt-6 sm:mt-10 w-full text-center p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#2f0c39]/90 via-[#210729]/95 to-[#16041c]/90 border border-[#ffdab9]/35 shadow-2xl">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#ffdab9] font-semibold block mb-1">
            Next Chapter in Your Birthday Journey ✦
          </span>
          <h4 className="font-serif-display text-lg sm:text-2xl text-[#fffdf9] font-bold mb-1">
            Read The Complete Letter & 6-Phase Timeline
          </h4>
          <p className="text-xs sm:text-sm text-[#f5ecfc] max-w-md mx-auto mb-4 italic px-1">
            The personal handwritten letter from your brother, along with the interactive chronological milestone chronicle.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                triggerHaptic(15);
                onNavigateToLetter();
              }}
              className="w-full sm:w-auto min-h-[46px] px-6 py-2.5 rounded-full bg-gradient-to-r from-[#b76e79] via-[#c97b87] to-[#8d3d4b] hover:from-[#c57984] hover:to-[#9b4957] text-[#fffdf9] font-serif-display font-bold text-xs tracking-wider uppercase shadow-xl active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-2 border border-[#ffdab9]/40"
            >
              <span>Read Doctor Paapa's Letter 💌</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                triggerHaptic(15);
                onOpenSurprise();
              }}
              className="w-full sm:w-auto min-h-[46px] px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-[#ffdab9]/30 text-[#ffdab9] text-xs font-serif-display font-semibold transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
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
