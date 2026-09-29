import React from 'react';
import { Sparkles, Image as ImageIcon, Disc3, Video, Mail, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/audio';

export type NavSection = 'home' | 'memories' | 'soundtrack' | 'video' | 'letter';

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
    { id: 'memories', label: 'Memories', icon: ImageIcon },
    { id: 'soundtrack', label: 'Soundtrack', icon: Disc3 },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'letter', label: 'Letter', icon: Mail },
  ];

  const handleNavClick = (id: NavSection) => {
    sound.playNavClick();
    onSelectSection(id);
  };

  return (
    <nav
      aria-label="Birthday experience navigation"
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-safe px-3 pointer-events-none"
    >
      <div className="pointer-events-auto mb-3 md:mb-6 max-w-md w-full glass-dock rounded-2xl md:rounded-full px-2 py-1.5 flex items-center justify-between shadow-2xl transition-all">
        {/* Navigation Items */}
        <div className="flex items-center justify-around flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative min-h-[44px] min-w-[44px] flex flex-col items-center justify-center rounded-xl px-2 py-1 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-[#fffdf9]'
                    : 'text-[#e6e6fa]/60 hover:text-[#f7e7ce] hover:bg-white/5'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <span className="absolute inset-0 bg-gradient-to-r from-[#b76e79]/40 via-[#ffdab9]/30 to-[#b76e79]/40 rounded-xl border border-[#f7e7ce]/30 -z-10 shadow-sm" />
                )}
                <Icon
                  className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${
                    isActive ? 'scale-110 text-[#ffdab9]' : ''
                  }`}
                />
                <span className={`text-[10px] md:text-[11px] font-serif-display mt-0.5 tracking-tight whitespace-nowrap transition-colors ${isActive ? 'text-[#ffdab9] font-semibold' : 'text-[#e6e6fa]/70'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-[#ffdab9] shadow-xs mt-0.5 animate-pulse-soft" />
                )}
              </button>
            );
          })}
        </div>

        {/* Vertical divider */}
        <div className="w-[1px] h-6 bg-[#f7e7ce]/15 mx-1" />

        {/* Quick controls: Vinyl soundtrack toggle & Mute */}
        <div className="flex items-center gap-1 pl-1">
          <button
            type="button"
            onClick={() => {
              sound.playNavClick();
              onToggleMusic();
            }}
            title={isMusicPlaying ? 'Pause Melody' : 'Play Melody'}
            className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl transition-all cursor-pointer ${
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
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[#e6e6fa]/60 hover:text-[#f7e7ce] transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </nav>
  );
};
