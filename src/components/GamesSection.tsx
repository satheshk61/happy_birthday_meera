import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Trophy, RotateCcw, PartyPopper, Heart, Gift, Music, Camera, Mail, Cake, Star, Wind, Volume2, Award, Zap, Compass, CheckCircle2, Stethoscope, Phone, Shield, ChevronRight , ArrowLeft, ArrowRight, Play, Pause } from 'lucide-react';
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


// Haptic feedback helper
const triggerHaptic = (pattern: number | number[] = 20) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {}
  }
};

export const GamesSection: React.FC<GamesSectionProps> = ({ config, onOpenSurprise, onNavigateToLetter }) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('balloons');

  // ------------------------------------------
  
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
    awardXP(25, "Balloon Popped! 🎈");
    setSelectedWish(target);

    // If all are now popped, trigger fanfare
    if (updated.every((b) => b.popped)) {
      setTimeout(() => {
        sound.playSurpriseReveal();
        triggerSurpriseConfetti();
        awardXP(100, "All Wishes Unlocked! 🏆");
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
          awardXP(35, "Milestone Matched! 🃏");
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
    // ==========================================
  // GAME 3 STATE: Starlight Wish Catcher (Advanced Physics & 3 Lives)
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
  const [catcherGameOver, setCatcherGameOver] = useState(false);
  const [lives, setLives] = useState(3);
  const [itemsCaughtCount, setItemsCaughtCount] = useState(0);
  const [combo, setCombo] = useState(1);
  const [catcherMilestone, setCatcherMilestone] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Physics State: Basket Spring & Momentum
  const basketXRef = useRef<number>(180);
  const targetBasketXRef = useRef<number>(180);
  const basketVxRef = useRef<number>(0);
  const basketTiltRef = useRef<number>(0);
  const basketRecoilYRef = useRef<number>(0);

  // Controls
  const isMovingLeftRef = useRef<boolean>(false);
  const isMovingRightRef = useRef<boolean>(false);

  const livesRef = useRef<number>(3);
  const itemsCaughtRef = useRef<number>(0);

  // Physics Interfaces
  interface FallingItem {
    id: number;
    baseX: number;
    x: number;
    y: number;
    prevY: number;
    vy: number;
    terminalVy: number;
    gravity: number;
    swayPhase: number;
    swaySpeed: number;
    swayAmp: number;
    angle: number;
    rotSpeed: number;
    size: number;
    type: 'star' | 'cupcake' | 'heart' | 'gift' | 'doctor';
    points: number;
    emoji: string;
  }

  interface CatchParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    gravity: number;
    color: string;
    size: number;
    life: number;
  }

  interface FloatingText {
    id: number;
    text: string;
    x: number;
    y: number;
    vy: number;
    alpha: number;
    color: string;
    size: number;
  }

  interface GroundRipple {
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    alpha: number;
    color: string;
  }

  const itemsRef = useRef<FallingItem[]>([]);
  const particlesRef = useRef<CatchParticle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const ripplesRef = useRef<GroundRipple[]>([]);

  const scoreRef = useRef(0);
  const comboRef = useRef(1);

  const startCatcherGame = () => {
    sound.playMatchLight();
    triggerHaptic([20, 30]);
    livesRef.current = 3;
    setLives(3);
    setCatcherGameOver(false);
    setCatcherActive(true);
    setCatcherScore(0);
    setCombo(1);
    setCatcherMilestone(null);
    scoreRef.current = 0;
    comboRef.current = 1;
    itemsRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];
    ripplesRef.current = [];
    itemsCaughtRef.current = 0;
    setItemsCaughtCount(0);
    basketXRef.current = 180;
    targetBasketXRef.current = 180;
    basketVxRef.current = 0;
    basketTiltRef.current = 0;
    basketRecoilYRef.current = 0;
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

  // Game Loop with Real-time Game Physics & Continuous Collision Detection
  useEffect(() => {
    if (!catcherActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = 360);

    basketXRef.current = width / 2;
    targetBasketXRef.current = width / 2;

    const itemTypes: { type: FallingItem['type']; emoji: string; points: number; weight: number }[] = [
      { type: 'star', emoji: '⭐', points: 10, weight: 50 },
      { type: 'cupcake', emoji: '🧁', points: 25, weight: 25 },
      { type: 'heart', emoji: '💖', points: 35, weight: 15 },
      { type: 'gift', emoji: '🎁', points: 50, weight: 8 },
      { type: 'doctor', emoji: '🩺', points: 100, weight: 2 },
    ];

    let spawnTimer = 0;

    const render = () => {
      // 1. BASKET INERTIA & SPRING PHYSICS
      const basketW = Math.min(92, width * 0.26);
      const basketH = 26;
      const minX = basketW / 2 + 8;
      const maxX = width - basketW / 2 - 8;

      if (isMovingLeftRef.current) {
        targetBasketXRef.current = Math.max(minX, targetBasketXRef.current - 8.5);
      }
      if (isMovingRightRef.current) {
        targetBasketXRef.current = Math.min(maxX, targetBasketXRef.current + 8.5);
      }

      targetBasketXRef.current = Math.max(minX, Math.min(maxX, targetBasketXRef.current));

      const deltaX = targetBasketXRef.current - basketXRef.current;
      basketVxRef.current = deltaX * 0.22;
      basketXRef.current += basketVxRef.current;

      const targetTilt = Math.max(-0.25, Math.min(0.25, basketVxRef.current * 0.024));
      basketTiltRef.current += (targetTilt - basketTiltRef.current) * 0.2;

      basketRecoilYRef.current += -basketRecoilYRef.current * 0.18;

      const bx = basketXRef.current;
      const basketY = height - 42 + basketRecoilYRef.current;

      ctx.clearRect(0, 0, width, height);

      // Starry Backdrop
      ctx.fillStyle = '#100315';
      ctx.fillRect(0, 0, width, height);

      for (let s = 0; s < 20; s++) {
        const sx = (s * 39 + (Date.now() / 45) * ((s % 3) + 1)) % width;
        const sy = (s * 41 + s * 13) % (height - 60);
        ctx.fillStyle = s % 2 === 0 ? 'rgba(255, 218, 185, 0.45)' : 'rgba(230, 230, 250, 0.35)';
        ctx.fillRect(sx, sy, 2, 2);
      }

      // Ground Line
      ctx.strokeStyle = 'rgba(255, 218, 185, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height - 12);
      ctx.lineTo(width, height - 12);
      ctx.stroke();

      // Ripples
      for (let r = ripplesRef.current.length - 1; r >= 0; r--) {
        const rip = ripplesRef.current[r];
        rip.radius += 1.8;
        rip.alpha -= 0.038;

        if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
          ripplesRef.current.splice(r, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, rip.alpha);
        ctx.strokeStyle = rip.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(rip.x, rip.y, rip.radius, rip.radius * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Basket with Tilt
      ctx.save();
      ctx.translate(bx, basketY + basketH / 2);
      ctx.rotate(basketTiltRef.current);
      ctx.translate(-bx, -(basketY + basketH / 2));

      const glowGrad = ctx.createRadialGradient(bx, basketY + 10, 5, bx, basketY + 10, basketW);
      glowGrad.addColorStop(0, comboRef.current >= 4 ? 'rgba(251, 191, 36, 0.5)' : 'rgba(183, 110, 121, 0.4)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(bx - basketW, basketY - 20, basketW * 2, 60);

      ctx.fillStyle = comboRef.current >= 4 ? '#d97706' : '#b76e79';
      ctx.beginPath();
      ctx.roundRect(bx - basketW / 2, basketY, basketW, basketH, [8, 8, 14, 14]);
      ctx.fill();
      ctx.strokeStyle = '#ffdab9';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#fffdf9';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(comboRef.current >= 4 ? '🔥 MAX FRENZY' : '🧺 Paapa Basket', bx, basketY + 17);
      ctx.restore();

      // Spawning
      spawnTimer++;
      const spawnInterval = Math.max(26, 40 - Math.floor(scoreRef.current / 150));
      if (spawnTimer % spawnInterval === 0) {
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

        const spawnBaseX = Math.random() * (width - 80) + 40;
        itemsRef.current.push({
          id: Date.now() + Math.random(),
          baseX: spawnBaseX,
          x: spawnBaseX,
          y: -25,
          prevY: -25,
          vy: 1.8 + Math.random() * 0.9,
          terminalVy: 4.8 + Math.min(2.0, scoreRef.current / 300),
          gravity: 0.038,
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: 0.04 + Math.random() * 0.03,
          swayAmp: chosen.type === 'heart' ? 22 : (chosen.type === 'star' ? 18 : 12),
          angle: 0,
          rotSpeed: (Math.random() - 0.5) * 0.05,
          size: chosen.type === 'doctor' ? 32 : (chosen.type === 'heart' ? 26 : 24),
          type: chosen.type,
          points: chosen.points,
          emoji: chosen.emoji,
        });
      }

      // Items loop
      for (let i = itemsRef.current.length - 1; i >= 0; i--) {
        const item = itemsRef.current[i];
        item.prevY = item.y;

        if (item.vy < item.terminalVy) {
          item.vy += item.gravity;
        }
        item.y += item.vy;

        item.swayPhase += item.swaySpeed;
        item.x = Math.max(15, Math.min(width - 15, item.baseX + Math.sin(item.swayPhase) * item.swayAmp));
        item.angle += item.rotSpeed;

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.angle + Math.sin(item.swayPhase) * 0.15);
        ctx.font = `${item.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.emoji, 0, 0);
        ctx.restore();

        const hitY = basketY + basketRecoilYRef.current;
        const hitW = basketW / 2 + 14;
        const isCrossingBasketY = item.y >= hitY - 14 && item.prevY <= hitY + basketH + 4;
        const isWithinBasketX = Math.abs(item.x - bx) < hitW;

        if (isCrossingBasketY && isWithinBasketX) {
          basketRecoilYRef.current = 6;
          triggerHaptic(20);
          sound.playStarCatch(comboRef.current);

          let lifeRestored = false;
          if (item.type === 'heart' && livesRef.current < 3) {
            livesRef.current = Math.min(3, livesRef.current + 1);
            setLives(livesRef.current);
            lifeRestored = true;
          }

          itemsCaughtRef.current += 1;
          setItemsCaughtCount(itemsCaughtRef.current);

          const gained = item.points * comboRef.current;
          scoreRef.current += gained;
          setCatcherScore(scoreRef.current);

          const particleColors = item.type === 'heart'
            ? ['#f43f5e', '#fb7185', '#fda4af', '#ffffff']
            : item.type === 'doctor'
            ? ['#38bdf8', '#7dd3fc', '#bae6fd', '#facc15']
            : ['#fbbf24', '#f59e0b', '#fde047', '#ffdab9', '#ffffff'];

          for (let p = 0; p < 14; p++) {
            const speed = 2 + Math.random() * 4.5;
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
            particlesRef.current.push({
              x: item.x,
              y: hitY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              gravity: 0.16,
              color: particleColors[Math.floor(Math.random() * particleColors.length)],
              size: 2.5 + Math.random() * 2.5,
              life: 1.0,
            });
          }

          floatingTextsRef.current.push({
            id: Date.now() + Math.random(),
            text: lifeRestored ? `+${gained}  ❤️ +1 Life!` : `+${gained}${comboRef.current > 1 ? ` (x${comboRef.current})` : ''}`,
            x: item.x,
            y: hitY - 12,
            vy: -2.0,
            alpha: 1.0,
            color: lifeRestored ? '#fda4af' : (comboRef.current >= 4 ? '#fbbf24' : '#fffdf9'),
            size: comboRef.current >= 4 ? 13 : 11,
          });

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

          if (scoreRef.current >= 150 && !catcherMilestone) {
            setCatcherMilestone('🌟 Starlight Champion reached! Outstanding reflexes, Doctor Paapa!');
            triggerSurpriseConfetti();
          }

          itemsRef.current.splice(i, 1);
          continue;
        }

        if (item.y > height + 20) {
          ripplesRef.current.push({
            x: Math.max(20, Math.min(width - 20, item.x)),
            y: height - 6,
            radius: 4,
            maxRadius: 32,
            alpha: 0.75,
            color: '#f43f5e',
          });

          itemsRef.current.splice(i, 1);
          comboRef.current = 1;
          setCombo(1);

          livesRef.current -= 1;
          setLives(livesRef.current);
          triggerHaptic([35, 65]);

          floatingTextsRef.current.push({
            id: Date.now() + Math.random(),
            text: '💔 Missed!',
            x: Math.max(30, Math.min(width - 30, item.x)),
            y: height - 25,
            vy: -1.2,
            alpha: 1.0,
            color: '#f43f5e',
            size: 11,
          });

          if (livesRef.current <= 0) {
            setCatcherActive(false);
            setCatcherGameOver(true);
            sound.playSurpriseReveal();
            awardXP(60, 'Starlight Catch Completed! 🌟');
            if (animationFrameIdRef.current) {
              cancelAnimationFrame(animationFrameIdRef.current);
              animationFrameIdRef.current = null;
            }
            return;
          }
        }
      }

      for (let p = particlesRef.current.length - 1; p >= 0; p--) {
        const pt = particlesRef.current[p];
        pt.x += pt.vx;
        pt.vy += pt.gravity;
        pt.y += pt.vy;
        pt.life -= 0.035;

        if (pt.life <= 0) {
          particlesRef.current.splice(p, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      for (let t = floatingTextsRef.current.length - 1; t >= 0; t--) {
        const ft = floatingTextsRef.current[t];
        ft.y += ft.vy;
        ft.vy *= 0.96;
        ft.alpha -= 0.024;

        if (ft.alpha <= 0) {
          floatingTextsRef.current.splice(t, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.font = `bold ${ft.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    animationFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [catcherActive, catcherHighScore, awardXP]);

  const handleTouchGlide = (clientX: number) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    targetBasketXRef.current = Math.max(30, Math.min(rect.width - 30, relativeX));
  };
  return (
    <section className="relative min-h-[calc(100dvh-5rem)] flex flex-col items-center justify-start px-2 sm:px-4 py-4 sm:py-8 max-w-5xl mx-auto w-full pb-20 sm:pb-12">
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
            <p className="text-[10px] text-[#e6e6fa]/70 font-mono">
              {playerXP} XP · Next at {levelInfo.nextThreshold} XP
            </p>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="flex-1 max-w-[130px] sm:max-w-[160px] flex flex-col gap-1">
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/10 p-[1px]">
            <div
              className="bg-gradient-to-r from-[#b76e79] via-[#c47c87] to-amber-300 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <span className="text-[9px] font-mono text-[#ffdab9]/80 text-right">
            {Math.round(levelProgress)}%
          </span>
        </div>
      </div>

      {/* Floating Milestone Celebration Toast */}
      {xpToast && (
        <div className="mb-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400/25 via-rose-500/25 to-purple-500/25 border border-amber-300/40 text-amber-200 text-xs font-serif-display flex items-center gap-1.5 animate-bounce shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>+{xpToast.amount} XP: {xpToast.text}</span>
        </div>
      )}

      {/* Game Mode Selector Tabs */}
      <div className="w-full max-w-xl flex items-center justify-center p-1 rounded-2xl bg-black/40 border border-[#f7e7ce]/20 backdrop-blur-md mb-4 shadow-xl">
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
            {poppedCount}/{balloons.length} Popped
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
              <p className="text-sm sm:text-base font-serif-display text-[#f7e7ce]/90 italic px-2">
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
          <div className="w-full p-3.5 sm:p-8 rounded-2xl sm:rounded-3xl bg-black/30 border border-[#f7e7ce]/20 backdrop-blur-xl relative overflow-hidden shadow-2xl mb-12 pb-10 sm:pb-8">
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
                      isShown ? 'scale-100 shadow-md' : 'hover:scale-105 active:scale-95'
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
      {/* GAME 3: STARLIGHT WISH CATCHER (With 3 Lives & Game End) */}
      {/* ======================================================== */}
      {activeGame === 'catcher' && (
        <div className="w-full max-w-3xl flex flex-col items-center animate-fade-in no-swipe">
          {/* Header Stats & Lives Display */}
          <div className="w-full flex items-center justify-between px-2 mb-3">
            <div className="flex items-center gap-2.5 sm:gap-4 text-xs font-serif-display text-[#e6e6fa]/80">
              <div>
                <span>Score: </span>
                <strong className="text-amber-300 font-sans text-sm">{catcherScore}</strong>
              </div>

              {/* LIVES INDICATOR */}
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                <span className="text-[10px] font-mono text-[#ffdab9] mr-0.5">Lives:</span>
                {[1, 2, 3].map((heartIndex) => (
                  <span
                    key={heartIndex}
                    className={`text-xs transition-transform duration-300 ${
                      heartIndex <= lives ? 'scale-110' : 'opacity-20 grayscale scale-90'
                    }`}
                  >
                    ❤️
                  </span>
                ))}
              </div>

              <div>
                <span>Best: </span>
                <strong className="text-[#ffdab9] font-sans text-sm">{catcherHighScore}</strong>
              </div>
              <div className="hidden sm:flex items-center gap-1">
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
                <span>{catcherGameOver ? 'Play Again 🔄' : 'Start Catching'}</span>
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

            {/* SCREEN 1: GAME OVER / VICTORY SUMMARY */}
            {catcherGameOver && !catcherActive && (
              <div className="py-6 sm:py-10 px-3 sm:px-6 flex flex-col items-center justify-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 mb-3 animate-bounce">
                  <Trophy className="w-9 h-9" />
                </div>

                <h3 className="font-serif-display text-xl sm:text-3xl font-bold text-amber-200 mb-1">
                  Starlight Journey Complete! 🌟
                </h3>

                <p className="font-serif-display text-xs sm:text-sm text-[#e6e6fa]/80 max-w-md mb-4 italic">
                  {catcherScore >= catcherHighScore && catcherScore > 0
                    ? '🎉 Incredible! You set a brand new Personal Best Record!'
                    : 'A spectacular starlight performance, Doctor Paapa!'}
                </p>

                {/* Score Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 w-full max-w-md mb-6">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] uppercase font-mono text-[#ffdab9] block">Final Score</span>
                    <strong className="text-xl sm:text-2xl font-bold text-amber-300 font-sans">{catcherScore}</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] uppercase font-mono text-[#ffdab9] block">Wishes Caught</span>
                    <strong className="text-xl sm:text-2xl font-bold text-[#fffdf9] font-sans">{itemsCaughtCount} ✨</strong>
                  </div>
                  <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] uppercase font-mono text-[#ffdab9] block">High Score</span>
                    <strong className="text-xl sm:text-2xl font-bold text-[#ffdab9] font-sans">{catcherHighScore}</strong>
                  </div>
                </div>

                {/* End Game Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-md">
                  <button
                    type="button"
                    onClick={startCatcherGame}
                    className="w-full sm:w-auto flex-1 min-h-[44px] px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 font-serif-display font-bold text-xs tracking-wider uppercase shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Play Again (3 Lives) 🔄</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenSurprise}
                    className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-[#ffdab9]/30 text-[#ffdab9] text-xs font-serif-display font-semibold transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Cake className="w-4 h-4" />
                    <span>Cut Cake 🎂</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 2: INITIAL INTRO */}
            {!catcherActive && !catcherGameOver && (
              <div className="py-8 sm:py-12 px-3 sm:px-4 flex flex-col items-center justify-center">
                <Star className="w-12 h-12 text-amber-300 animate-spin-slow mb-3" />
                <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-[#fffdf9] mb-1.5">
                  Starlight Wish Catcher
                </h3>
                <p className="font-serif-display text-xs sm:text-sm text-[#e6e6fa]/70 max-w-md mb-2 italic px-2">
                  Catch falling stars (⭐), cupcakes (🧁), and the Doctor Paapa emblem (🩺) for maximum points!
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-serif-display text-[#ffdab9] mb-5">
                  <span>You have 3 Lives:</span>
                  <span>❤️ ❤️ ❤️</span>
                  <span>— Don't let wishes fall!</span>
                </div>
                <button
                  type="button"
                  onClick={startCatcherGame}
                  className="w-full sm:w-auto min-h-[46px] px-8 py-3 rounded-full bg-gradient-to-r from-[#b76e79] via-[#c47c87] to-[#8d3d4b] text-[#fffdf9] font-serif-display font-semibold text-xs tracking-wider uppercase shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Begin Starlight Catch ✨</span>
                </button>
              </div>
            )}

            {/* SCREEN 3: ACTIVE GAMEPLAY CANVAS WITH ADVANCED PHYSICS */}
            {catcherActive && (
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
                          targetBasketXRef.current = (Number(e.target.value) / 100) * w;
                        }
                      }}
                      className="w-full h-2 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#b76e79]"
                    />
                  </div>

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

      {/* Guided Storybook Flow Banner */}
      {onNavigateToLetter && (
        <div className="mt-8 sm:mt-12 w-full text-center p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#2f0c39]/90 via-[#210729]/95 to-[#16041c]/90 border border-[#ffdab9]/35 shadow-2xl">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#ffdab9] font-semibold block mb-1">
            Next Chapter in Your Birthday Journey ✦
          </span>
          <h4 className="font-serif-display text-lg sm:text-2xl text-[#fffdf9] font-bold mb-1.5 sm:mb-2">
            Read The Complete Letter & 6-Phase Timeline
          </h4>
          <p className="text-sm sm:text-base text-[#f5ecfc] max-w-md mx-auto mb-4 sm:mb-5 leading-relaxed px-2">
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
