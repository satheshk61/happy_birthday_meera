import React, { useEffect, useRef } from 'react';
import { triggerTapSparkle } from '../utils/confetti';

export const DreamyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Floating particles (dust, soft orbs, tiny stars)
    const particleCount = Math.min(width < 768 ? 32 : 55, 60);
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.8 + 0.8,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: -Math.random() * 0.4 - 0.1, // gently floating upward
      opacity: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      pulseVal: Math.random() * Math.PI,
      isStar: Math.random() > 0.65,
      color: ['#F7E7CE', '#FFDAB9', '#E6E6FA', '#B76E79'][Math.floor(Math.random() * 4)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulseVal += p.pulseSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulseVal));

        ctx.save();
        ctx.globalAlpha = Math.max(0.05, currentOpacity);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = p.color;

        if (p.isStar) {
          // Draw tiny 4-point sparkle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Soft glowing orb
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleGlobalClick = (e: React.MouseEvent) => {
    // Only trigger if clicking on empty background or non-button/non-input
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.tagName === 'INPUT' ||
      target.closest('button') ||
      target.closest('a') ||
      target.closest('.interactive-control')
    ) {
      return;
    }
    triggerTapSparkle(e.clientX, e.clientY);
  };

  return (
    <div
      onClick={handleGlobalClick}
      className="fixed inset-0 pointer-events-auto z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Multi-color ambient animated gradients */}
      <div className="absolute inset-0 bg-[#16061d]" />
      
      {/* Radial soft glowing light pools */}
      <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-[#4a0e4e]/40 via-[#b76e79]/20 to-transparent blur-3xl opacity-70 animate-pulse-soft" />
      <div className="absolute top-[35%] -right-[15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-bl from-[#ffdab9]/15 via-[#e6e6fa]/10 to-transparent blur-3xl opacity-60" />
      <div className="absolute -bottom-[10%] left-[20%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-t from-[#2d0a35]/60 via-[#b76e79]/15 to-transparent blur-3xl opacity-80" />

      {/* Canvas for floating stars and particles */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Subtle vignette border */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/10 to-black/50 pointer-events-none" />
    </div>
  );
};
