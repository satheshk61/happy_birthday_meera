import React, { useState, useRef } from 'react';
import { Play, Pause, Video, Maximize, Upload, Sparkles, Film } from 'lucide-react';
import { BirthdayConfig } from '../birthdayConfig';
import { sound } from '../utils/audio';

interface VideoSectionProps {
  config: BirthdayConfig;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ config }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeVideoSrc = customVideoUrl || config.video.source;

  const handleTogglePlay = () => {
    sound.playNavClick();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setIsPlaying(false);
    }
  };

  return (
    <section className="relative py-12 md:py-20 px-4 max-w-4xl mx-auto text-center">
      {/* Section Header */}
      <div className="mb-10 md:mb-14">
        <span className="text-xs font-serif-display uppercase tracking-widest text-[#ffdab9] flex items-center justify-center gap-1.5 mb-2">
          <Video className="w-3.5 h-3.5" />
          Cinematic Greeting
        </span>
        <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#fffdf9] via-[#ffdab9] to-[#f7e7ce] font-semibold py-1">
          {config.video.title}
        </h2>
        <p className="font-serif-display text-sm sm:text-base text-[#e6e6fa]/70 max-w-lg mx-auto mt-2 italic">
          A personal video note captured just for your special day.
        </p>
      </div>

      {/* 9:16 Vertical Video Container */}
      <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px] aspect-[9/16] rounded-[24px] p-2 bg-gradient-to-b from-[#f7e7ce]/30 via-[#b76e79]/30 to-[#3b0f44]/40 shadow-2xl shadow-[#100314]/80">
        {/* Soft atmospheric glow */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-[#b76e79]/20 via-[#ffdab9]/20 to-transparent rounded-[32px] blur-2xl -z-10 pointer-events-none" />

        <div className="relative w-full h-full rounded-[20px] overflow-hidden bg-[#1e0725] border border-[#f7e7ce]/25 flex flex-col justify-between">
          {activeVideoSrc ? (
            /* Active HTML5 Video Player */
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={activeVideoSrc}
                playsInline
                className="w-full h-full object-cover"
                onEnded={() => setIsPlaying(false)}
              />

              {/* Play / Pause Overlay Button */}
              {!isPlaying && (
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#b76e79]/80 hover:bg-[#b76e79] text-[#fffdf9] flex items-center justify-center backdrop-blur-md border border-[#f7e7ce]/40 shadow-xl transition-all cursor-pointer"
                >
                  <Play className="w-7 h-7 fill-current translate-x-0.5" />
                </button>
              )}

              {/* Controls bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-[#fffdf9]">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="p-2 rounded-full hover:bg-white/20 transition-all cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  type="button"
                  onClick={handleFullscreen}
                  className="p-2 rounded-full hover:bg-white/20 transition-all cursor-pointer"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            /* Elegant Placeholder When No Video is Linked */
            <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-b from-[#310c3b] via-[#220729] to-[#16041c] text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#b76e79_1px,transparent_1px)] [background-size:18px_18px] opacity-15" />

              {/* Top Reel Tag */}
              <div className="relative z-10 flex items-center justify-between text-xs text-[#ffdab9]/80 font-mono">
                <span className="flex items-center gap-1">
                  <Film className="w-3.5 h-3.5" />
                  REEL #01
                </span>
                <span>FOR MEERA</span>
              </div>

              {/* Center Play Graphic */}
              <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#b76e79] to-[#d68a96] p-[2px] shadow-xl shadow-[#b76e79]/30 flex items-center justify-center mb-4 animate-pulse-soft">
                  <div className="w-full h-full rounded-full bg-[#27092e] flex items-center justify-center border border-[#ffdab9]/30">
                    <Sparkles className="w-8 h-8 text-[#ffdab9]" />
                  </div>
                </div>

                <h3 className="font-serif-display text-xl text-[#fffdf9] font-medium mb-1">
                  Meera's Birthday Reel
                </h3>

                <p className="font-sans text-xs text-[#e6e6fa]/70 max-w-xs leading-relaxed italic mb-4">
                  "{config.video.caption}"
                </p>

                {/* Upload or change video button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-full bg-[#b76e79]/30 hover:bg-[#b76e79]/50 border border-[#f7e7ce]/40 text-xs font-serif-display text-[#fffdf9] flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-md"
                >
                  <Upload className="w-3.5 h-3.5 text-[#ffdab9]" />
                  <span>Choose MP4 Video File</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Bottom Footer Note */}
              <div className="relative z-10 text-[10px] text-[#e6e6fa]/50 font-sans tracking-wide">
                Configurable via `birthdayConfig.video.source`
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
