/**
 * Web Audio API Synthesizer & Sound FX System
 * 
 * Provides pristine, zero-dependency procedural audio for:
 * - Envelope opening chime
 * - Navigation & button clicks
 * - Surprise celebration fanfare
 * - Typewriter sound bites
 * - Ambient acoustic piano / music box arpeggios
 * 
 * Completely robust against browser autoplay blocks and requires no external MP3 hosting.
 */

export interface PlaylistItem {
  id?: string;
  source: string;
  synthType?: 'piano' | 'musicbox' | 'lofi' | 'celebration';
  title?: string;
  artist?: string;
  duration?: number;
  section?: string;
  description?: string;
  mood?: string;
}

class SoundSystem {
  private playlist: PlaylistItem[] = [];
  private currentTrackIndex: number = 0;
  private trackChangeListeners: ((index: number, track: PlaylistItem | null) => void)[] = [];
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private musicGain: GainNode | null = null;
  private isMusicPlaying: boolean = false;
  private musicInterval: any = null;
  private musicStep: number = 0;
  private customAudio: HTMLAudioElement | null = null;
  private musicListeners: ((isPlaying: boolean) => void)[] = [];
  private tabId: string = Math.random().toString(36).substring(2);
  private broadcastChannel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('meera_audio_channel');
        this.broadcastChannel.onmessage = (event) => {
          if (event.data?.type === 'PLAY' && event.data?.tabId !== this.tabId) {
            this.pauseSoundtrack();
          }
        };
      } catch {}
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.musicGain && this.ctx) {
        this.musicGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      if (this.customAudio) {
        this.customAudio.muted = true;
      }
    } else {
      if (this.musicGain && this.ctx) {
        this.musicGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      }
      if (this.customAudio) {
        this.customAudio.muted = false;
      }
    }
    return this.isMuted;
  }

  public playEnvelopeOpen() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      // Magical pentatonic celesta chord sweep: C5, E5, G5, B5, D6, G6
      const freqs = [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98];
      const now = ctx.currentTime;

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.3);
      });
    } catch {
      // Graceful fail
    }
  }

  public playNavClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  public playCameraShutter() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Click 1: Shutter open
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1400, now);
      osc1.frequency.exponentialRampToValueAtTime(300, now + 0.03);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.035);

      // Click 2: Shutter close (60ms later)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(900, now + 0.06);
      osc2.frequency.exponentialRampToValueAtTime(180, now + 0.1);
      gain2.gain.setValueAtTime(0.09, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.12);
    } catch {}
  }

  public playTypewriterTap() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soft high pitch keyclick
      const randomPitch = 1200 + Math.random() * 400;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(randomPitch, now);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  public playSurpriseReveal() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Radiant fanfare chord: F#4, A#4, C#5, F#5, G#5, C#6
      const chord = [369.99, 466.16, 554.37, 739.99, 830.61, 1108.73];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.06 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 2.0);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 2.1);
      });
    } catch {}
  }

  public playBlowCandle() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Soft gentle breath / whoosh filter
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.4);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.4);

      // Followed by twinkling fairy chime
      setTimeout(() => {
        this.playEnvelopeOpen();
      }, 350);
    } catch {}
  }

  public playBalloonPop() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Realistic pop sound: high punch followed by snappy burst
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(3, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      // Low thump for acoustic fullness
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.06);
      oscGain.gain.setValueAtTime(0.2, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.08);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  public playCardFlip() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    } catch {}
  }

  public playMatchSuccess() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Sparkling chime chord: C6, E6, G6, C7
      const notes = [1046.50, 1318.51, 1567.98, 2093.00];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.65);
      });
    } catch {}
  }

  public playMatchMismatch() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(200, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  public playStarCatch(multiplier: number = 1) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Celestial music box bell pitch scaled by multiplier
      const baseFreqs = [587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
      const freq = baseFreqs[Math.min(baseFreqs.length - 1, multiplier - 1)] || 880.00;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch {}
  }

  public playCakeSlice() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Sweet culinary glide whoosh
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);

      // Followed by celebratory chime
      setTimeout(() => {
        this.playEnvelopeOpen();
      }, 150);
    } catch {}
  }

  public playBladeDraw() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Resonant metallic blade shimmer (high steel harmonics)
      const freqs = [1864.66, 2349.32, 3135.96, 4698.63];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.02);
        gain.gain.setValueAtTime(0, now + idx * 0.02);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.02 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.02 + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.02);
        osc.stop(now + idx * 0.02 + 0.85);
      });
    } catch {}
  }

  public playMatchLight() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Quick friction strike scratch
      const bufferSize = ctx.sampleRate * 0.06;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(3000, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.06);
    } catch {}
  }

  public playForkBite() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Soft cute bell chime with ascending resonance
      const notes = [659.25, 880.00, 1174.66];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.05 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.4);
      });
    } catch {}
  }

  private currentTrackType: 'piano' | 'musicbox' | 'lofi' | 'celebration' = 'piano';

  // --- Multi-Section Ambient Music & Custom Audio Player ---
  private activeSourceUrl: string | undefined = undefined;
  private timeListeners: ((current: number, duration: number) => void)[] = [];
  private lastPlaybackPosition: number = 0;

  public getAudioElement(): HTMLAudioElement | null {
    return this.customAudio;
  }

  public getCurrentTime(): number {
    return this.customAudio && !isNaN(this.customAudio.currentTime)
      ? this.customAudio.currentTime
      : this.lastPlaybackPosition;
  }

  public getDuration(): number {
    return this.customAudio && !isNaN(this.customAudio.duration) ? this.customAudio.duration : 0;
  }

  public seek(seconds: number) {
    if (!isNaN(seconds)) {
      this.lastPlaybackPosition = seconds;
      if (this.customAudio) {
        try {
          this.customAudio.currentTime = seconds;
        } catch {}
      }
      this.notifyTimeListeners(seconds, this.getDuration());
    }
  }

  public subscribeToTime(listener: (current: number, duration: number) => void) {
    this.timeListeners.push(listener);
    return () => {
      this.timeListeners = this.timeListeners.filter((l) => l !== listener);
    };
  }

  private notifyTimeListeners(current: number, duration: number) {
    this.timeListeners.forEach((fn) => fn(current, duration));
  }

  // Robust URL / source comparator handling URL encoding, query strings, and base names
  private isSameSource(srcA: string | undefined, srcB: string | undefined): boolean {
    if (!srcA || !srcB) return false;
    if (srcA === srcB) return true;
    try {
      const cleanA = decodeURIComponent(srcA).split('?')[0].split('#')[0].trim();
      const cleanB = decodeURIComponent(srcB).split('?')[0].split('#')[0].trim();
      if (cleanA === cleanB) return true;
      if (cleanA.endsWith(cleanB) || cleanB.endsWith(cleanA)) return true;
      const fileA = cleanA.substring(cleanA.lastIndexOf('/') + 1);
      const fileB = cleanB.substring(cleanB.lastIndexOf('/') + 1);
      if (fileA && fileB && fileA === fileB) return true;
    } catch {
      if (srcA.endsWith(srcB) || srcB.endsWith(srcA)) return true;
    }
    return false;
  }

  /**
   * Toggle music soundtrack playback.
   * If playing -> Pauses audio and preserves the exact playback timestamp.
   * If paused -> Resumes audio seamlessly from the exact stopped timestamp.
   */
  public toggleSoundtrack(sourceUrl?: string): boolean {
    if (this.isMusicPlaying) {
      this.pauseSoundtrack();
      return false;
    } else {
      if (sourceUrl && sourceUrl.trim() !== '' && !this.isSameSource(sourceUrl, this.activeSourceUrl)) {
        this.playSoundtrack(sourceUrl, true);
      } else {
        this.resumeSoundtrack();
      }
      return true;
    }
  }

  /**
   * Resume soundtrack from the exact position it was stopped/paused.
   */
  public resumeSoundtrack(sourceUrl?: string): boolean {
    const cur = this.playlist[this.currentTrackIndex] || this.playlist[0];
    const targetUrl = sourceUrl || cur?.source || this.activeSourceUrl;
    if (!targetUrl) return false;

    // If audio element already exists and matches current track, resume directly!
    if (this.customAudio && this.isSameSource(this.customAudio.src, targetUrl)) {
      this.customAudio.muted = this.isMuted;

      // Ensure the timestamp is preserved if browser momentarily reset it
      if (this.lastPlaybackPosition > 0 && this.customAudio.currentTime < 0.1) {
        try {
          this.customAudio.currentTime = this.lastPlaybackPosition;
        } catch {}
      }

      this.customAudio
        .play()
        .then(() => {
          this.isMusicPlaying = true;
          this.notifyMusicListeners(true);
        })
        .catch((err) => {
          console.warn('Audio resume waiting for user interaction:', err);
        });
      return true;
    }

    // Otherwise load track fresh
    this.playSoundtrack(targetUrl, false);
    return true;
  }

  public setPlaylist(items: PlaylistItem[], startIndex = 0) {
    this.playlist = items;
    if (startIndex >= 0 && startIndex < items.length) {
      this.currentTrackIndex = startIndex;
    }
  }

  public getPlaylist(): PlaylistItem[] {
    return this.playlist;
  }

  public getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
  }

  public subscribeToTrackChange(listener: (index: number, track: PlaylistItem | null) => void) {
    this.trackChangeListeners.push(listener);
    return () => {
      this.trackChangeListeners = this.trackChangeListeners.filter((l) => l !== listener);
    };
  }

  private notifyTrackChange() {
    const cur = this.playlist[this.currentTrackIndex] || null;
    this.trackChangeListeners.forEach((fn) => fn(this.currentTrackIndex, cur));
  }

  public playNextTrack() {
    if (!this.playlist || this.playlist.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    this.lastPlaybackPosition = 0;
    const nextItem = this.playlist[this.currentTrackIndex];
    this.notifyTrackChange();
    this.playSoundtrack(nextItem.source, true);
  }

  public playPrevTrack() {
    if (!this.playlist || this.playlist.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    this.lastPlaybackPosition = 0;
    const prevItem = this.playlist[this.currentTrackIndex];
    this.notifyTrackChange();
    this.playSoundtrack(prevItem.source, true);
  }

  public playTrackByIndex(index: number, forceRestart = false) {
    if (!this.playlist || this.playlist.length === 0) return;
    if (index >= 0 && index < this.playlist.length) {
      const isSwitchingTrack = this.currentTrackIndex !== index;
      this.currentTrackIndex = index;
      if (isSwitchingTrack || forceRestart) {
        this.lastPlaybackPosition = 0;
      }
      const track = this.playlist[index];
      this.notifyTrackChange();
      this.playSoundtrack(track.source, isSwitchingTrack || forceRestart);
    }
  }

  public getIsPlaying(): boolean {
    return this.isMusicPlaying;
  }

  public getActiveTrackType(): 'piano' | 'musicbox' | 'lofi' | 'celebration' {
    return this.currentTrackType;
  }

  public playTrack(_trackType?: string, sourceUrl?: string) {
    if (this.isMusicPlaying) {
      this.pauseSoundtrack();
    }
    this.playSoundtrack(sourceUrl);
  }

  public playSoundtrack(sourceUrl?: string, forceRestart = false) {
    const effectiveUrl = sourceUrl || (this.playlist[this.currentTrackIndex]?.source) || this.activeSourceUrl;
    if (!effectiveUrl || effectiveUrl.trim() === '') return;

    // Strict multi-song prevention: pause any other audio elements in window or DOM
    if (typeof window !== 'undefined') {
      const win = window as any;
      if (win.__meera_active_audio__ && win.__meera_active_audio__ !== this.customAudio) {
        try {
          win.__meera_active_audio__.pause();
          win.__meera_active_audio__.src = '';
        } catch {}
      }
      try {
        document.querySelectorAll('audio').forEach((el) => {
          if (el !== this.customAudio && !el.paused) {
            el.pause();
          }
        });
      } catch {}
    }

    const isSameTrack = this.customAudio && this.isSameSource(this.customAudio.src, effectiveUrl);

    // If it's already the active track and we are not forcing a restart from 0:
    if (this.customAudio && isSameTrack && !forceRestart) {
      this.resumeSoundtrack(effectiveUrl);
      return;
    }

    // Always pause the current audio before switching tracks to avoid audio overlap
    if (this.customAudio) {
      try {
        this.customAudio.pause();
      } catch {}
    }

    this.activeSourceUrl = effectiveUrl;
    this.lastPlaybackPosition = 0;

    try {
      if (!this.customAudio) {
        this.customAudio = new Audio(effectiveUrl);
        this.customAudio.loop = false; // NEVER repeat one song — loop to next song in playlist!
        this.customAudio.preload = 'auto';

        this.customAudio.addEventListener('timeupdate', () => {
          if (this.customAudio && !isNaN(this.customAudio.currentTime)) {
            this.lastPlaybackPosition = this.customAudio.currentTime;
            this.notifyTimeListeners(this.customAudio.currentTime, this.customAudio.duration || 0);
          }
        });

        // CONTINUOUS PLAYLIST LOOP: When song completes, advance to next song!
        this.customAudio.addEventListener('ended', () => {
          this.playNextTrack();
        });
      } else {
        this.customAudio.loop = false;
        if (!isSameTrack) {
          this.customAudio.src = effectiveUrl;
        }
        this.customAudio.currentTime = 0;
      }

      if (typeof window !== 'undefined') {
        (window as any).__meera_active_audio__ = this.customAudio;
      }

      this.customAudio.muted = this.isMuted;
      this.customAudio.play().then(() => {
        this.isMusicPlaying = true;
        this.notifyMusicListeners(true);
        if (this.broadcastChannel) {
          try {
            this.broadcastChannel.postMessage({ type: 'PLAY', tabId: this.tabId });
          } catch {}
        }
      }).catch((err) => {
        // Autoplay policy or user interaction pending — wait for user click without playing any fake synth
        console.warn('Audio waiting for user gesture:', err);
      });
    } catch (err) {
      console.warn('Audio play error:', err);
    }
  }

  public pauseSoundtrack() {
    this.isMusicPlaying = false;
    this.notifyMusicListeners(false);

    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }

    if (this.customAudio) {
      if (!isNaN(this.customAudio.currentTime)) {
        this.lastPlaybackPosition = this.customAudio.currentTime;
      }
      this.customAudio.pause();
    }
  }

  public subscribeToMusic(listener: (isPlaying: boolean) => void) {
    this.musicListeners.push(listener);
    return () => {
      this.musicListeners = this.musicListeners.filter((l) => l !== listener);
    };
  }

  private notifyMusicListeners(isPlaying: boolean) {
    this.musicListeners.forEach((fn) => fn(isPlaying));
  }
}

// Global singleton pattern to prevent duplicate audio systems on Vite HMR
const existingInstance = typeof window !== 'undefined' ? (window as any).__meera_sound_system__ : null;
export const sound: SoundSystem = existingInstance || new SoundSystem();
if (typeof window !== 'undefined') {
  (window as any).__meera_sound_system__ = sound;
}
