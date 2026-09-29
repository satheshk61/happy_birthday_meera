import React from 'react';
import { Sparkles, Camera, Gamepad2, Disc3, Video, Mail, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/audio';

export type NavSection = 'home' | 'memories' | 'games' | 'letter' | 'soundtrack' | 'video';

interface NavigationDockProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export const NavigationDock: React.FC<NavigationDockProps> = ({
  activeSection,
  onSelectSection,
  isMuted,
  onToggleMute,
  isMusicPlaying,
  onToggleMusic,
}) => {
  const navItems: { id: NavSection; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'memories', label: 'Photos', icon: Camera },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'letter', label: 'Letter', icon: Mail },
    { id: 'soundtrack', label: 'Music', icon: Disc3 },
    { id: 'video', label: 'Video', icon: Video },
  ];

  const handleNavClick = (id: NavSection) => {
    sound.playNavClick();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(15); } catch {}
    }
    onSelectSection(id);
  };

  return (
    <nav
      aria-label="Birthday experience navigation"
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-safe px-2 sm:px-3 pointer-events-none"
    >
      <div className="pointer-events-auto mb-2 sm:mb-3 md:mb-6 max-w-lg w-full glass-dock rounded-2xl md:rounded-full px-1 sm:px-2.5 py-1.5 flex items-center justify-between shadow-2xl transition-all border border-[#f7e7ce]/25">
        {/* Navigation Items - 100% full width touch-friendly targets on mobile */}
        <div className="flex items-center justify-around flex-1 gap-0.5 sm:gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative min-h-[44px] min-w-[44px] flex-1 flex flex-col items-center justify-center rounded-xl py-1 transition-all duration-200 cursor-pointer active:scale-95 touch-manipulation ${
                  isActive
                    ? 'text-[#fffdf9]'
                    : 'text-[#f7e7ce]/80 hover:text-[#fffdf9] hover:bg-white/10'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <span className="absolute inset-0 bg-gradient-to-r from-[#b76e79]/50 via-[#ffdab9]/30 to-[#b76e79]/50 rounded-xl border border-[#f7e7ce]/35 -z-10 shadow-sm" />
                )}
                <Icon
                  className={`w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 transition-transform ${
                    isActive ? 'scale-110 text-[#ffdab9]' : ''
                  }`}
                />
                <span className={`text-[10px] sm:text-[11px] font-serif-display mt-0.5 tracking-tight whitespace-nowrap transition-colors ${isActive ? 'text-[#ffdab9] font-bold' : 'text-[#e6e6fa]/70'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-[#ffdab9] shadow-xs mt-0.5 animate-pulse-soft" />
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop Audio Controls (also easily accessible in header on mobile) */}
        <div className="hidden md:flex items-center gap-1 pl-1 shrink-0 border-l border-[#f7e7ce]/20 ml-1">
          <button
            type="button"
            onClick={() => {
              sound.playNavClick();
              onToggleMusic();
            }}
            title={isMusicPlaying ? 'Pause Melody' : 'Play Melody'}
            className={`min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl transition-all cursor-pointer active:scale-95 ${
              isMusicPlaying
                ? 'text-[#ffdab9] bg-[#b76e79]/30 border border-[#ffdab9]/40'
                : 'text-[#e6e6fa]/50 hover:text-[#f7e7ce]'
            }`}
          >
            <Disc3 className={`w-4 h-4 ${isMusicPlaying ? 'animate-spin-slow' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playNavClick();
              onToggleMute();
            }}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl text-[#e6e6fa]/60 hover:text-[#f7e7ce] transition-all cursor-pointer active:scale-95"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </nav>
  );
};
