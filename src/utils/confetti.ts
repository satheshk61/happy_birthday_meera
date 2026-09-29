import confetti from 'canvas-confetti';

// Palette matching Meera's theme: lavender, blush, peach, champagne, rose gold, plum, white
const THEME_COLORS = ['#E6E6FA', '#FCE4EC', '#FFDAB9', '#F7E7CE', '#B76E79', '#4A0E4E', '#FFFFFF'];

export function triggerEnvelopeConfetti() {
  try {
    // Medium celebration burst from center
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.6, x: 0.5 },
      colors: THEME_COLORS,
      ticks: 200,
      gravity: 0.9,
      scalar: 1.1,
    });

    // Gentle side streamers
    setTimeout(() => {
      confetti({
        particleCount: 35,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.7 },
        colors: THEME_COLORS,
      });
      confetti({
        particleCount: 35,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.7 },
        colors: THEME_COLORS,
      });
    }, 250);
  } catch {}
}

export function triggerHeroConfetti() {
  try {
    // Small celebration
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.4, x: 0.5 },
      colors: THEME_COLORS,
      ticks: 150,
      scalar: 0.9,
    });
  } catch {}
}

export function triggerSurpriseConfetti() {
  try {
    // Grand celebration multi-stage explosion
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 120, zIndex: 9999, colors: THEME_COLORS };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    // Immediate blast
    confetti({
      ...defaults,
      particleCount: 100,
      origin: { y: 0.6, x: 0.5 },
      scalar: 1.25,
    });

    // Cascading fireworks
    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 40 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.15, 0.45), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.55, 0.85), y: Math.random() - 0.2 },
      });
    }, 280);
  } catch {}
}

export function triggerTapSparkle(x: number, y: number) {
  try {
    const normX = x / window.innerWidth;
    const normY = y / window.innerHeight;

    confetti({
      particleCount: 14,
      spread: 40,
      origin: { x: normX, y: normY },
      colors: ['#FFDAB9', '#F7E7CE', '#B76E79', '#E6E6FA'],
      ticks: 60,
      gravity: 0.6,
      scalar: 0.65,
      startVelocity: 15,
      disableForReducedMotion: true,
    });
  } catch {}
}
