/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Cake, Sparkles } from 'lucide-react';
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

export default function App() {
  const [config, setConfig] = useState<BirthdayConfig>(initialConfig);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Sync music state with the sound system
  useEffect(() => {
    const unsubscribe = sound.subscribeToMusic((playing) => {
      setIsMusicPlaying(playing);
    });
    return () => unsubscribe();
  }, []);

  const handleEnvelopeComplete = () => {
    setIsEnvelopeOpen(true);
    // Automatically start the gentle ambient piano melody upon envelope opening
    sound.playSoundtrack(config.song.source);
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleMusic = () => {
    sound.toggleSoundtrack(config.song.source);
  };

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
        {/* Top Minimal Bar adhering to 3-zone contract */}
        <header className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between border-b border-white/10">
          {/* Zone 1: Single wordmark element */}
          <button
            type="button"
            onClick={() => {
              sound.playNavClick();
              setActiveSection('home');
            }}
            className="text-left cursor-pointer group"
          >
            <span className="font-script text-2xl sm:text-3xl gold-foil-text font-bold tracking-tight">
              Happy Birthday {config.name}
            </span>
          </button>

          {/* Zone 2: Clean desktop text navigation links with high readability */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-serif-display font-medium tracking-wider uppercase">
            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                setActiveSection('home');
              }}
              className={`hover:text-[#ffdab9] transition-colors cursor-pointer ${
                activeSection === 'home' ? 'text-[#ffdab9] font-bold border-b border-[#ffdab9] pb-0.5' : 'text-[#f7e7ce]'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                setActiveSection('memories');
              }}
              className={`hover:text-[#ffdab9] transition-colors cursor-pointer ${
                activeSection === 'memories' ? 'text-[#ffdab9] font-bold border-b border-[#ffdab9] pb-0.5' : 'text-[#f7e7ce]'
              }`}
            >
              Best Photos
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                setActiveSection('games');
              }}
              className={`hover:text-[#ffdab9] transition-colors cursor-pointer ${
                activeSection === 'games' ? 'text-[#ffdab9] font-bold border-b border-[#ffdab9] pb-0.5' : 'text-[#f7e7ce]'
              }`}
            >
              Games
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                setActiveSection('letter');
              }}
              className={`hover:text-[#ffdab9] transition-colors cursor-pointer ${
                activeSection === 'letter' ? 'text-[#ffdab9] font-bold border-b border-[#ffdab9] pb-0.5' : 'text-[#f7e7ce]'
              }`}
            >
              Letter & Timeline
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                setActiveSection('soundtrack');
              }}
              className={`hover:text-[#ffdab9] transition-colors cursor-pointer ${
                activeSection === 'soundtrack' ? 'text-[#ffdab9] font-bold border-b border-[#ffdab9] pb-0.5' : 'text-[#f7e7ce]'
              }`}
            >
              Soundtrack
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                setActiveSection('video');
              }}
              className={`hover:text-[#ffdab9] transition-colors cursor-pointer ${
                activeSection === 'video' ? 'text-[#ffdab9] font-bold border-b border-[#ffdab9] pb-0.5' : 'text-[#f7e7ce]'
              }`}
            >
              Video
            </button>
          </nav>

          {/* Zone 3: Primary Action - Cut Birthday Cake */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                setIsSurpriseOpen(true);
              }}
              title="Cut Birthday Cake & Experience 3D Ceremony"
              className="min-h-[40px] px-4 py-1.5 rounded-full bg-gradient-to-r from-[#b76e79] via-[#c97b87] to-[#8d3d4b] hover:from-[#c57984] hover:to-[#9b4957] border border-[#ffdab9]/50 text-[#fffdf9] text-xs font-serif-display font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#b76e79]/30 active:scale-95 animate-pulse-soft"
            >
              <Cake className="w-4 h-4 text-[#ffdab9]" />
              <span className="tracking-wide">Cut Cake 🎂</span>
            </button>
          </div>
        </header>

        {/* Content Section Container */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 pb-28 md:pb-32">
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
