/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Settings, Sparkles } from 'lucide-react';
import { birthdayConfig as initialConfig, BirthdayConfig } from './birthdayConfig';
import { DreamyBackground } from './components/DreamyBackground';
import { DigitalEnvelope } from './components/DigitalEnvelope';
import { NavigationDock, NavSection } from './components/NavigationDock';
import { HeroSection } from './components/HeroSection';
import { MemoriesSection } from './components/MemoriesSection';
import { MusicSection } from './components/MusicSection';
import { VideoSection } from './components/VideoSection';
import { LetterSection } from './components/LetterSection';
import { SurpriseModal } from './components/SurpriseModal';
import { ConfigModal } from './components/ConfigModal';
import { sound } from './utils/audio';

export default function App() {
  const [config, setConfig] = useState<BirthdayConfig>(initialConfig);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
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
        <header className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between border-b border-white/5">
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

          {/* Zone 2: Clean desktop text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-serif-display text-[#e6e6fa]/75">
            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                setActiveSection('home');
              }}
              className={`hover:text-[#ffdab9] transition-colors cursor-pointer tracking-wider uppercase ${
                activeSection === 'home' ? 'text-[#ffdab9] font-semibold border-b border-[#ffdab9]' : ''
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
              className={`hover:text-[#ffdab9] transition-colors cursor-pointer tracking-wider uppercase ${
                activeSection === 'memories' ? 'text-[#ffdab9] font-semibold border-b border-[#ffdab9]' : ''
              }`}
            >
              Memories
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                setActiveSection('soundtrack');
              }}
              className={`hover:text-[#ffdab9] transition-colors cursor-pointer tracking-wider uppercase ${
                activeSection === 'soundtrack' ? 'text-[#ffdab9] font-semibold border-b border-[#ffdab9]' : ''
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
              className={`hover:text-[#ffdab9] transition-colors cursor-pointer tracking-wider uppercase ${
                activeSection === 'video' ? 'text-[#ffdab9] font-semibold border-b border-[#ffdab9]' : ''
              }`}
            >
              Video
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                setActiveSection('letter');
              }}
              className={`hover:text-[#ffdab9] transition-colors cursor-pointer tracking-wider uppercase ${
                activeSection === 'letter' ? 'text-[#ffdab9] font-semibold border-b border-[#ffdab9]' : ''
              }`}
            >
              Letter
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                sound.playNavClick();
                setIsConfigOpen(true);
              }}
              title="Personalize details"
              className="min-h-[38px] px-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-[#f7e7ce]/25 text-[#f7e7ce] text-xs font-serif-display font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Settings className="w-3.5 h-3.5 text-[#ffdab9]" />
              <span className="hidden sm:inline">Personalize</span>
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
                onOpenSurprise={() => setIsSurpriseOpen(true)}
              />
            </div>
          )}

          {activeSection === 'memories' && (
            <div className="animate-fade-in">
              <MemoriesSection
                memories={config.memories}
                timeline={config.timeline}
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
      />

      {/* Personalization Studio Modal */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onSaveConfig={(updated) => setConfig(updated)}
      />
    </div>
  );
}
