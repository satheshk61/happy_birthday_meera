/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Cake, Sparkles, Disc3, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { birthdayConfig as initialConfig, BirthdayConfig } from './birthdayConfig';
import { DreamyBackground } from './components/DreamyBackground';
import { DigitalEnvelope } from './components/DigitalEnvelope';
import { NavigationDock, NavSection } from './components/NavigationDock';
import { HeroSection } from './components/HeroSection';
import { MemoriesSection } from './components/MemoriesSection';
import { MusicSection } from './components/MusicSection';
import { VideoSection } from './components/VideoSection';
import { LetterSection } from './components/LetterSection';
import { GamesSection } from './components/GamesSection';
import { SurpriseModal } from './components/SurpriseModal';
import { sound } from './utils/audio';

const SECTIONS: NavSection[] = ['home', 'memories', 'games', 'letter', 'soundtrack', 'video'];
const SECTION_NAMES: { [key in NavSection]: string } = {
  home: 'Home',
  memories: 'Best Photos',
  games: 'Arcade Games',
  letter: 'Letter & Timeline',
  soundtrack: 'Music Studio',
  video: 'Video Greeting',
};

export default function App() {
  const [config, setConfig] = useState<BirthdayConfig>(initialConfig);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [swipeNotice, setSwipeNotice] = useState<string | null>(null);

  // Initialize playlist in sound system
  useEffect(() => {
    if (config.soundtracks && config.soundtracks.length > 0) {
      sound.setPlaylist(config.soundtracks);
    }
  }, [config.soundtracks]);

  // Sync music state with the sound system
  useEffect(() => {
    const unsubscribe = sound.subscribeToMusic((playing) => {
      setIsMusicPlaying(playing);
    });
    return () => unsubscribe();
  }, []);

  const handleEnvelopeComplete = () => {
    setIsEnvelopeOpen(true);
    if (config.soundtracks && config.soundtracks.length > 0) {
      sound.setPlaylist(config.soundtracks);
      sound.playTrackByIndex(0);
    } else {
      sound.playSoundtrack(config.song.source);
    }
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleMusic = () => {
    sound.toggleSoundtrack();
  };

  // ==========================================
  // GLOBAL MOBILE SWIPE NAVIGATION
  // Listens on window for natural, effortless mobile swiping anywhere on screen
  // ==========================================
  useEffect(() => {
    let startX: number | null = null;
    let startY: number | null = null;
    let startTime: number = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const target = e.target as HTMLElement;

      // Do NOT trigger global page swipe when touching interactive controls:
      // - canvas (e.g. Starlight Catcher game)
      // - range slider inputs (glide bars or volume)
      // - elements marked with .no-swipe
      if (target.closest('canvas, input[type="range"], .no-swipe')) {
        return;
      }

      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (startX === null || startY === null) return;
      if (e.changedTouches.length !== 1) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = startX - endX;
      const deltaY = startY - endY;
      const deltaTime = Date.now() - startTime;

      startX = null;
      startY = null;

      // Natural swipe parameters:
      // Minimum 40px horizontal distance, horizontal movement dominant, quick flick (< 700ms)
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2 && deltaTime < 700) {
        if (deltaX > 0) {
          // Swiped LEFT -> Navigate to NEXT section
          setActiveSection((current) => {
            const idx = SECTIONS.indexOf(current);
            if (idx < SECTIONS.length - 1) {
              sound.playNavClick();
              if (typeof navigator !== 'undefined' && navigator.vibrate) {
                try { navigator.vibrate(15); } catch {}
              }
              const nextSec = SECTIONS[idx + 1];
              setSwipeNotice(`Swiped to ${SECTION_NAMES[nextSec]} →`);
              setTimeout(() => setSwipeNotice(null), 1800);
              return nextSec;
            }
            return current;
          });
        } else {
          // Swiped RIGHT -> Navigate to PREVIOUS section
          setActiveSection((current) => {
            const idx = SECTIONS.indexOf(current);
            if (idx > 0) {
              sound.playNavClick();
              if (typeof navigator !== 'undefined' && navigator.vibrate) {
                try { navigator.vibrate(15); } catch {}
              }
              const prevSec = SECTIONS[idx - 1];
              setSwipeNotice(`← Swiped to ${SECTION_NAMES[prevSec]}`);
              setTimeout(() => setSwipeNotice(null), 1800);
              return prevSec;
            }
            return current;
          });
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const activeIndex = SECTIONS.indexOf(activeSection);

  return (
    <div className="relative min-h-[100dvh] flex flex-col font-sans selection:bg-[#b76e79]/40 selection:text-white">
      {/* Dreamy Animated Background */}
      <DreamyBackground />

      {/* Opening Experience: Digital Envelope Modal */}
      {!isEnvelopeOpen && (
        <DigitalEnvelope
          recipientName={config.name}
          onOpenComplete={handleEnvelopeComplete}
        />
      )}

      {/* Main Experience Wrapper (Fades in when envelope opens) */}
      <div
        className={`relative z-10 flex-1 flex flex-col transition-opacity duration-1000 ${
          isEnvelopeOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top Minimal Bar */}
        <header className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-5 flex items-center justify-between border-b border-white/10 gap-2">
          {/* Zone 1: Single wordmark element */}
          <button
            type="button"
            onClick={() => {
              sound.playNavClick();
              setActiveSection('home');
            }}
            className="text-left cursor-pointer group shrink min-w-0"
          >
            <span className="font-script text-xl sm:text-2xl md:text-3xl gold-foil-text font-bold tracking-tight block truncate">
              Happy Birthday {config.name}
            </span>
          </button>

          {/* Zone 2: Desktop text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-serif-display font-medium tracking-wider uppercase">
            {SECTIONS.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => {
                  sound.playNavClick();
                  setActiveSection(sec);
                }}
                className={`hover:text-[#ffdab9] transition-colors cursor-pointer capitalize ${
                  activeSection === sec ? 'text-[#ffdab9] font-bold border-b border-[#ffdab9] pb-0.5' : 'text-[#f7e7ce]'
                }`}
              >
                {sec === 'memories' ? 'Photos' : sec === 'soundtrack' ? 'Music' : sec}
              </button>
            ))}
          </nav>

          {/* Zone 3: Quick Audio Controls on mobile + Primary Action (Cut Cake) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile Audio Controls */}
            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                handleToggleMusic();
              }}
              title={isMusicPlaying ? 'Pause Soundtrack' : 'Play Soundtrack'}
              className={`p-2 rounded-full border transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
                isMusicPlaying
                  ? 'bg-[#b76e79]/40 border-[#ffdab9]/50 text-[#ffdab9] shadow-sm'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <Disc3 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isMusicPlaying ? 'animate-spin-slow text-[#ffdab9]' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                handleToggleMute();
              }}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              className="p-2 rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white transition-all cursor-pointer active:scale-95 flex items-center justify-center"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-300" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                setIsSurpriseOpen(true);
              }}
              title="Cut Birthday Cake & Experience 3D Ceremony"
              className="min-h-[36px] sm:min-h-[38px] px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-[#b76e79] via-[#c97b87] to-[#8d3d4b] hover:from-[#c57984] hover:to-[#9b4957] border border-[#ffdab9]/50 text-[#fffdf9] text-xs font-serif-display font-semibold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer shadow-lg shadow-[#b76e79]/30 active:scale-95 animate-pulse-soft"
            >
              <Cake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffdab9] shrink-0" />
              <span className="tracking-wide text-xs">Cut Cake 🎂</span>
            </button>
          </div>
        </header>

        {/* Global Swipe Feedback Notification Toast */}
        {swipeNotice && (
          <div
            role="status"
            className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-[#350d3e]/95 border border-[#ffdab9]/50 text-[#ffdab9] font-serif-display text-xs shadow-2xl backdrop-blur-xl animate-fade-in flex items-center gap-1.5 pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{swipeNotice}</span>
          </div>
        )}

        {/* Content Section Container */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-4 pb-48 sm:pb-40 md:pb-32">
          {activeSection === 'home' && (
            <div className="animate-fade-in">
              <HeroSection
                config={config}
                onNavigateToMemories={() => setActiveSection('memories')}
                onNavigateToLetter={() => setActiveSection('letter')}
                onNavigateToGames={() => setActiveSection('games')}
                onOpenSurprise={() => setIsSurpriseOpen(true)}
              />
            </div>
          )}

          {activeSection === 'memories' && (
            <div className="animate-fade-in">
              <MemoriesSection
                memories={config.memories}
                timeline={config.timeline}
                onNavigateToGames={() => setActiveSection('games')}
              />
            </div>
          )}

          {activeSection === 'games' && (
            <div className="animate-fade-in">
              <GamesSection
                config={config}
                onOpenSurprise={() => setIsSurpriseOpen(true)}
                onNavigateToLetter={() => setActiveSection('letter')}
              />
            </div>
          )}

          {activeSection === 'soundtrack' && (
            <div className="animate-fade-in">
              <MusicSection
                config={config}
                isPlaying={isMusicPlaying}
                onTogglePlay={handleToggleMusic}
              />
            </div>
          )}

          {activeSection === 'video' && (
            <div className="animate-fade-in">
              <VideoSection config={config} />
            </div>
          )}

          {activeSection === 'letter' && (
            <div className="animate-fade-in">
              <LetterSection
                config={config}
                isActive={activeSection === 'letter'}
                onOpenSurprise={() => setIsSurpriseOpen(true)}
              />
            </div>
          )}
        </main>

        {/* Mobile Swipe Pagination Dots Indicator (Above Dock) */}
        <div className="fixed bottom-[64px] sm:bottom-[70px] left-0 right-0 z-30 flex flex-col items-center justify-center pointer-events-none pb-1 md:hidden">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-sm pointer-events-auto">
            <span className="text-[9px] font-mono text-[#ffdab9]/80 mr-1">
              Swipe ◀ ▶
            </span>
            {SECTIONS.map((sec, i) => (
              <button
                key={sec}
                type="button"
                onClick={() => {
                  sound.playNavClick();
                  setActiveSection(sec);
                }}
                aria-label={`Go to ${SECTION_NAMES[sec]}`}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeIndex
                    ? 'w-5 h-1.5 bg-[#ffdab9] shadow-sm'
                    : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Floating Glassmorphism Navigation Dock */}
        <NavigationDock
          activeSection={activeSection}
          onSelectSection={(section) => setActiveSection(section)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
        />
      </div>

      {/* Secret Surprise Modal */}
      <SurpriseModal
        isOpen={isSurpriseOpen}
        onClose={() => setIsSurpriseOpen(false)}
        config={config}
        onOpenGamesTab={() => setActiveSection('games')}
        onOpenLetterTab={() => setActiveSection('letter')}
      />
    </div>
  );
}
