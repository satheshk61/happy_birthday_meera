import React, { useState, useEffect } from 'react';
import { Play, Pause, Disc3, Sparkles, Volume2, Music, SkipForward, SkipBack } from 'lucide-react';
import { BirthdayConfig } from '../birthdayConfig';
import { sound } from '../utils/audio';

interface MusicSectionProps {
  config: BirthdayConfig;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const MusicSection: React.FC<MusicSectionProps> = ({
  config,
  isPlaying,
  onTogglePlay,
}) => {
  const [progress, setProgress] = useState(24); // percentage
  const [currentTime, setCurrentTime] = useState(44); // seconds
  const totalDuration = config.song.duration || 184;

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = (prev + 1) % totalDuration;
          setProgress((next / totalDuration) * 100);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(e.target.value);
    setProgress(newProgress);
    setCurrentTime(Math.floor((newProgress / 100) * totalDuration));
  };

  return (
    <section className="relative py-12 md:py-20 px-4 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-10 md:mb-14">
        <span className="text-xs font-serif-display uppercase tracking-widest text-[#ffdab9] flex items-center justify-center gap-1.5 mb-2">
          <Music className="w-3.5 h-3.5" />
          Acoustic Melody
        </span>
        <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#fffdf9] via-[#ffdab9] to-[#f7e7ce] font-semibold py-1">
          Our Soundtrack
        </h2>
        <p className="font-serif-display text-sm sm:text-base text-[#e6e6fa]/70 max-w-lg mx-auto mt-2 italic">
          The melodies that echo our late-night conversations and brightest days.
        </p>
      </div>

      {/* Main Music Player Card */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#f7e7ce]/20 overflow-hidden">
        {/* Ambient glowing radial behind vinyl */}
        <div
          className={`absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
            isPlaying ? 'bg-[#b76e79]/35 opacity-100' : 'bg-[#b76e79]/15 opacity-40'
          }`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Vinyl Record Display */}
          <div className="relative flex justify-center items-center py-4">
            {/* Soft halo glow when playing */}
            <div
              className={`absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-[#b76e79]/40 via-[#ffdab9]/30 to-[#e6e6fa]/30 blur-xl transition-all duration-700 ${
                isPlaying ? 'scale-110 opacity-80 animate-pulse-soft' : 'scale-90 opacity-20'
              }`}
            />

            {/* Tonearm needle */}
            <div
              className={`absolute top-0 right-4 sm:right-10 z-20 transition-transform duration-700 origin-top-right ${
                isPlaying ? 'rotate-12 translate-x-1' : '-rotate-12 translate-x-4'
              }`}
            >
              <div className="w-3 h-10 bg-gradient-to-b from-stone-400 to-stone-600 rounded-sm shadow-md" />
              <div className="w-1.5 h-16 bg-stone-300 mx-auto" />
              <div className="w-4 h-3 bg-[#b76e79] rounded shadow" />
            </div>

            {/* The Vinyl Disc */}
            <div
              className={`relative w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-[#110515] p-2 shadow-2xl border-4 border-[#240a2c] flex items-center justify-center transition-all ${
                isPlaying ? 'animate-spin-slow' : 'animate-spin-paused'
              }`}
            >
              {/* Vinyl Grooves concentric rings */}
              <div className="absolute inset-4 rounded-full border border-stone-800/80 pointer-events-none" />
              <div className="absolute inset-8 rounded-full border border-stone-800/80 pointer-events-none" />
              <div className="absolute inset-12 rounded-full border border-stone-800/70 pointer-events-none" />
              <div className="absolute inset-16 rounded-full border border-stone-800/60 pointer-events-none" />
              <div className="absolute inset-20 rounded-full border border-stone-800/50 pointer-events-none" />

              {/* Light reflection sheen across vinyl */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

              {/* Center Vinyl Label */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#914d57] via-[#c47c87] to-[#e4a4ad] p-[2px] shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#300c37] flex flex-col items-center justify-center text-center p-1 border border-[#ffdab9]/30">
                  <Sparkles className="w-3 h-3 text-[#ffdab9] mb-0.5" />
                  <span className="font-script text-xs sm:text-sm text-[#fffdf9] font-bold leading-none">
                    Meera
                  </span>
                  <span className="text-[7px] text-[#ffdab9]/80 font-mono tracking-tighter mt-0.5">
                    VOL. 01
                  </span>
                  {/* Spindle hole */}
                  <div className="w-2.5 h-2.5 rounded-full bg-[#110515] border border-stone-600 mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Player Controls & Equalizer */}
          <div className="flex flex-col justify-center space-y-5 text-left">
            {/* Song Meta */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] text-[#ffdab9] font-serif-display uppercase tracking-[0.2em] font-semibold">
                  Audio Dedication
                </span>
                <span aria-hidden="true" className="text-white/30">·</span>
                {isPlaying ? (
                  <span className="flex items-center gap-1.5 text-xs text-[#ffdab9] font-serif-display">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Now Playing Live</span>
                  </span>
                ) : (
                  <span className="text-xs text-[#e6e6fa]/60 font-serif-display italic">
                    Ready to Play
                  </span>
                )}
              </div>

              <h3 className="font-serif-display text-2xl sm:text-3xl text-[#fffdf9] font-bold tracking-tight text-balance leading-snug">
                {config.song.title}
              </h3>

              <p className="font-serif-display text-xs sm:text-sm text-[#ffdab9]/80 mt-1 italic font-light">
                {config.song.artist}
              </p>
            </div>

            {/* Equalizer Waveform Visualization */}
            <div className="flex items-end gap-1.5 h-10 py-1 px-3 rounded-xl bg-black/25 border border-white/5">
              {[45, 80, 60, 95, 65, 90, 50, 100, 75, 55, 85, 70, 95, 50, 75, 90].map(
                (baseHeight, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full bg-gradient-to-t from-[#b76e79] via-[#ffdab9] to-[#ffffff] transition-all duration-300 ${
                      isPlaying ? 'opacity-95 shadow-sm shadow-[#ffdab9]/40' : 'opacity-20'
                    }`}
                    style={{
                      height: isPlaying
                        ? `${Math.max(18, (baseHeight * ((i % 3) + 1)) % 100)}%`
                        : '20%',
                      animation: isPlaying
                        ? `pulse-soft ${0.35 + (i % 5) * 0.12}s ease-in-out infinite alternate`
                        : 'none',
                    }}
                  />
                )
              )}
            </div>

            {/* Progress Slider */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#b76e79]"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#e6e6fa]/60">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(totalDuration)}</span>
              </div>
            </div>

            {/* Playback Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sound.playNavClick();
                    setCurrentTime(0);
                    setProgress(0);
                  }}
                  title="Restart"
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-[#f7e7ce] transition-all cursor-pointer"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playNavClick();
                    onTogglePlay();
                  }}
                  className="p-4 rounded-full bg-gradient-to-r from-[#b76e79] to-[#914d57] hover:from-[#c47c87] hover:to-[#a4535e] text-[#fffdf9] shadow-lg shadow-[#b76e79]/40 border border-[#f7e7ce]/30 transition-all duration-300 transform active:scale-95 cursor-pointer"
                  aria-label={isPlaying ? 'Pause soundtrack' : 'Play soundtrack'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playNavClick();
                    setCurrentTime(Math.min(totalDuration, currentTime + 15));
                  }}
                  title="Forward 15s"
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-[#f7e7ce] transition-all cursor-pointer"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#e6e6fa]/60">
                <Volume2 className="w-4 h-4 text-[#ffdab9]" />
                <span className="font-sans">Acoustic Synth Mode</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
