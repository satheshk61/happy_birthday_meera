import React, { useState, useEffect } from 'react';
import { Play, Pause, Disc3, Sparkles, Volume2, Music, SkipForward, SkipBack, Heart, Radio, ListMusic, Waves } from 'lucide-react';
import { BirthdayConfig, AudioTrackItem } from '../birthdayConfig';
import { sound } from '../utils/audio';

interface MusicSectionProps {
  config: BirthdayConfig;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const MusicSection: React.FC<MusicSectionProps> = ({
  config,
  isPlaying,
}) => {
  const tracks: AudioTrackItem[] = config.soundtracks || [];
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const currentTrack = tracks[currentTrackIndex] || tracks[0] || {
    id: 'default',
    title: config.song.title,
    artist: config.song.artist,
    section: "Brother's Promise",
    synthType: 'celebration' as const,
    duration: config.song.duration || 268,
    source: config.song.source,
    mood: 'Unconditional Bond & Protection',
    description: 'Dedicated to Doctor Paapa.',
  };

  const totalDuration = sound.getDuration() || currentTrack.duration || 268;

  // Subscribe to track changes (auto-advance to next song)
  useEffect(() => {
    if (tracks && tracks.length > 0) {
      sound.setPlaylist(tracks);
    }
    const unsubTrack = sound.subscribeToTrackChange((idx) => {
      setCurrentTrackIndex(idx);
      setCurrentTime(0);
      setProgress(0);
    });
    return () => unsubTrack();
  }, [tracks]);

  // Real-time audio subscription for MP3 track progress
  useEffect(() => {
    const unsubTime = sound.subscribeToTime((curr, dur) => {
      setCurrentTime(curr);
      const effectiveDur = dur > 0 ? dur : totalDuration;
      if (effectiveDur > 0) {
        setProgress((curr / effectiveDur) * 100);
      }
    });

    return () => {
      unsubTime();
    };
  }, [totalDuration]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(e.target.value);
    setProgress(newProgress);
    const dur = sound.getDuration() || totalDuration;
    const seekSecs = (newProgress / 100) * dur;
    setCurrentTime(seekSecs);
    sound.seek(seekSecs);
  };

  const handleTogglePlayTrack = () => {
    sound.playNavClick();
    if (isPlaying) {
      sound.pauseSoundtrack();
    } else {
      sound.playTrackByIndex(currentTrackIndex);
    }
  };

  const handleSelectTrack = (index: number) => {
    sound.playNavClick();
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setProgress(0);
    sound.playTrackByIndex(index);
  };

  const handleNextTrack = () => {
    sound.playNavClick();
    sound.playNextTrack();
  };

  const handlePrevTrack = () => {
    sound.playNavClick();
    sound.playPrevTrack();
  };

  // Filtered tracks based on audio section
  const availableSections = ['all', ...Array.from(new Set(tracks.map((t) => t.section)))];
  const displayedTracks = selectedSection === 'all'
    ? tracks
    : tracks.filter((t) => t.section === selectedSection);

  return (
    <section className="relative py-8 sm:py-16 md:py-20 px-3 sm:px-4 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-10 md:mb-14">
        <span className="text-[10px] sm:text-xs font-serif-display uppercase tracking-widest text-[#ffdab9] flex items-center justify-center gap-1.5 mb-1.5 sm:mb-2">
          <Music className="w-3.5 h-3.5 text-[#ffdab9]" />
          Soundtracks For Doctor Paapa
        </span>
        <h2 className="font-script text-3xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#fffdf9] via-[#ffdab9] to-[#f7e7ce] font-semibold py-1">
          Songs Dedicated to Her
        </h2>
        <p className="font-serif-display text-sm sm:text-base text-[#e6e6fa]/85 max-w-lg mx-auto mt-1.5 italic px-2">
          Curated Tamil brother-sister anthems and soulful melodies honoring our journey from childhood school days to today.
        </p>
      </div>

      {/* Main Music Player Card */}
      <div className="relative glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 shadow-2xl border border-[#f7e7ce]/20 overflow-hidden mb-8 sm:mb-10">
        {/* Ambient glowing radial behind vinyl */}
        <div
          className={`absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
            isPlaying ? 'bg-[#b76e79]/35 opacity-100' : 'bg-[#b76e79]/15 opacity-40'
          }`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          {/* Vinyl Record Display */}
          <div className="relative flex justify-center items-center py-2 sm:py-4">
            {/* Soft halo glow when playing */}
            <div
              className={`absolute w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full bg-gradient-to-tr from-[#b76e79]/40 via-[#ffdab9]/30 to-[#e6e6fa]/30 blur-xl transition-all duration-700 ${
                isPlaying ? 'scale-110 opacity-80 animate-pulse-soft' : 'scale-90 opacity-20'
              }`}
            />

            {/* Tonearm needle */}
            <div
              className={`absolute top-0 right-6 sm:right-10 z-20 transition-transform duration-700 origin-top-right ${
                isPlaying ? 'rotate-12 translate-x-1' : '-rotate-12 translate-x-4'
              }`}
            >
              <div className="w-2.5 sm:w-3 h-8 sm:h-10 bg-gradient-to-b from-stone-400 to-stone-600 rounded-sm shadow-md" />
              <div className="w-1 sm:w-1.5 h-12 sm:h-16 bg-stone-300 mx-auto" />
              <div className="w-3.5 sm:w-4 h-2.5 sm:h-3 bg-[#b76e79] rounded shadow" />
            </div>

            {/* The Vinyl Disc */}
            <div
              className={`relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full bg-[#110515] p-2 shadow-2xl border-4 border-[#240a2c] flex items-center justify-center transition-all ${
                isPlaying ? 'animate-spin-slow' : 'animate-spin-paused'
              }`}
            >
              {/* Vinyl Grooves concentric rings */}
              <div className="absolute inset-3 sm:inset-4 rounded-full border border-stone-800/80 pointer-events-none" />
              <div className="absolute inset-6 sm:inset-8 rounded-full border border-stone-800/80 pointer-events-none" />
              <div className="absolute inset-9 sm:inset-12 rounded-full border border-stone-800/70 pointer-events-none" />
              <div className="absolute inset-12 sm:inset-16 rounded-full border border-stone-800/60 pointer-events-none" />
              <div className="absolute inset-15 sm:inset-20 rounded-full border border-stone-800/50 pointer-events-none" />

              {/* Light reflection sheen across vinyl */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

              {/* Center Vinyl Label */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-[#914d57] via-[#c47c87] to-[#e4a4ad] p-[2px] shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#300c37] flex flex-col items-center justify-center text-center p-1 border border-[#ffdab9]/30">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#ffdab9] mb-0.5" />
                  <span className="font-script text-[11px] sm:text-xs md:text-sm text-[#fffdf9] font-bold leading-none">
                    Meera
                  </span>
                  <span className="text-[6px] sm:text-[7px] text-[#ffdab9]/80 font-mono tracking-tighter mt-0.5 uppercase">
                    TRACK 0{currentTrackIndex + 1}
                  </span>
                  {/* Spindle hole */}
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#110515] border border-stone-600 mt-0.5 sm:mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Player Controls & Equalizer */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-5 text-left">
            {/* Song Meta */}
            <div>
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <span className="px-2 py-0.5 rounded-full bg-[#b76e79]/30 border border-[#ffdab9]/30 text-[9px] sm:text-[10px] text-[#ffdab9] font-serif-display uppercase tracking-widest font-semibold">
                  {currentTrack.section}
                </span>
                <span aria-hidden="true" className="text-white/30">·</span>
                {isPlaying ? (
                  <span className="flex items-center gap-1.5 text-xs text-[#ffdab9] font-serif-display">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Now Playing</span>
                  </span>
                ) : (
                  <span className="text-xs text-[#e6e6fa]/60 font-serif-display italic">
                    Ready to Play
                  </span>
                )}
              </div>

              <h3 className="font-serif-display text-xl sm:text-2xl md:text-3xl text-[#fffdf9] font-bold tracking-tight text-balance leading-snug">
                {currentTrack.title}
              </h3>

              <p className="font-serif-display text-xs sm:text-sm text-[#ffdab9]/80 mt-0.5 sm:mt-1 italic font-light">
                {currentTrack.artist}
              </p>

              <div className="mt-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-sm sm:text-base text-[#f7e7ce] font-serif-display leading-relaxed">
                  {currentTrack.description}
                </p>
              </div>
            </div>

            {/* Equalizer Waveform Visualization */}
            <div className="flex items-end gap-1 sm:gap-1.5 h-8 sm:h-10 py-1 px-2.5 sm:px-3 rounded-xl bg-black/25 border border-white/5">
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
              <div className="flex justify-between text-[10px] sm:text-[11px] font-mono text-[#e6e6fa]/60">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(totalDuration)}</span>
              </div>
            </div>

            {/* Playback Action Buttons */}
            <div className="flex items-center justify-between pt-1 sm:pt-2">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={handlePrevTrack}
                  title="Previous track"
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-[#f7e7ce] transition-all cursor-pointer active:scale-95"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleTogglePlayTrack}
                  className="min-h-[48px] min-w-[48px] p-3.5 sm:p-4 rounded-full bg-gradient-to-r from-[#b76e79] to-[#914d57] hover:from-[#c47c87] hover:to-[#a4535e] text-[#fffdf9] shadow-lg shadow-[#b76e79]/40 border border-[#f7e7ce]/30 transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center justify-center"
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
                  onClick={handleNextTrack}
                  title="Next track"
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-[#f7e7ce] transition-all cursor-pointer active:scale-95"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#e6e6fa]/60">
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffdab9]" />
                <span className="font-sans capitalize">Original Master Audio</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Sections & Curated Soundscapes Suite */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <ListMusic className="w-4 h-4 text-[#ffdab9]" />
            <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-[#fffdf9]">
              Curated Audio Tracks
            </h3>
          </div>

          {/* Section Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {availableSections.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => {
                  sound.playNavClick();
                  setSelectedSection(sec);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-serif-display whitespace-nowrap transition-all cursor-pointer ${
                  selectedSection === sec
                    ? 'bg-gradient-to-r from-[#b76e79] to-[#914d57] text-[#fffdf9] shadow-sm font-semibold border border-[#f7e7ce]/30'
                    : 'bg-white/5 hover:bg-white/10 text-[#e6e6fa]/70'
                }`}
              >
                <span>{sec === 'all' ? 'All Sections' : sec}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayedTracks.map((track) => {
            const actualIndex = tracks.findIndex((t) => t.id === track.id);
            const isThisTrackActive = actualIndex === currentTrackIndex;

            return (
              <div
                key={track.id}
                onClick={() => handleSelectTrack(actualIndex)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer select-none relative overflow-hidden group ${
                  isThisTrackActive
                    ? 'bg-gradient-to-r from-[#330c3d]/90 via-[#27092e]/95 to-[#190420]/95 border-[#ffdab9]/50 shadow-xl shadow-[#b76e79]/20'
                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isThisTrackActive && isPlaying
                          ? 'bg-[#b76e79] text-[#fffdf9] shadow-md shadow-[#b76e79]/50'
                          : 'bg-white/10 text-[#f7e7ce] group-hover:bg-[#b76e79]/40'
                      }`}
                    >
                      {isThisTrackActive && isPlaying ? (
                        <Waves className="w-4 h-4 animate-pulse" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                      )}
                    </button>
                    <div>
                      <span className="text-[10px] font-serif-display uppercase tracking-widest text-[#ffdab9] font-medium block">
                        {track.section}
                      </span>
                      <h4 className="font-serif-display text-sm sm:text-base font-bold text-[#fffdf9]">
                        {track.title}
                      </h4>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-[#e6e6fa]/60">
                    {formatTime(track.duration)}
                  </span>
                </div>

                <p className="text-sm text-[#f7e7ce]/95 font-serif-display italic my-2.5 leading-relaxed">
                  "{track.description}"
                </p>

                <div className="flex items-center justify-between text-[11px] font-serif-display text-[#ffdab9]/80 border-t border-white/5 pt-2">
                  <span>{track.artist}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-[#f7e7ce]/80">
                    {track.mood}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
