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

  public getAudioElement(): HTMLAudioElement | null {
    return this.customAudio;
  }

  public getCurrentTime(): number {
    return this.customAudio ? this.customAudio.currentTime : 0;
  }

  public getDuration(): number {
    return this.customAudio && !isNaN(this.customAudio.duration) ? this.customAudio.duration : 0;
  }

  public seek(seconds: number) {
    if (this.customAudio && !isNaN(seconds)) {
      this.customAudio.currentTime = seconds;
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

  public toggleSoundtrack(sourceUrl?: string, trackType?: 'piano' | 'musicbox' | 'lofi' | 'celebration'): boolean {
    if (this.isMusicPlaying) {
      this.pauseSoundtrack();
      return false;
    } else {
      if (this.playlist && this.playlist.length > 0 && (!sourceUrl || sourceUrl.trim() === '')) {
        const cur = this.playlist[this.currentTrackIndex] || this.playlist[0];
        this.playSoundtrack(cur.source, cur.synthType || 'piano');
      } else {
        this.playSoundtrack(sourceUrl || this.activeSourceUrl, trackType || this.currentTrackType);
      }
      return true;
    }
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
    const nextItem = this.playlist[this.currentTrackIndex];
    this.notifyTrackChange();
    this.playSoundtrack(nextItem.source, nextItem.synthType || 'piano');
  }

  public playPrevTrack() {
    if (!this.playlist || this.playlist.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    const prevItem = this.playlist[this.currentTrackIndex];
    this.notifyTrackChange();
    this.playSoundtrack(prevItem.source, prevItem.synthType || 'piano');
  }

  public playTrackByIndex(index: number) {
    if (!this.playlist || this.playlist.length === 0) return;
    if (index >= 0 && index < this.playlist.length) {
      this.currentTrackIndex = index;
      const track = this.playlist[index];
      this.notifyTrackChange();
      this.playSoundtrack(track.source, track.synthType || 'piano');
    }
  }

  public getIsPlaying(): boolean {
    return this.isMusicPlaying;
  }

  public getActiveTrackType(): 'piano' | 'musicbox' | 'lofi' | 'celebration' {
    return this.currentTrackType;
  }

  public playTrack(trackType: 'piano' | 'musicbox' | 'lofi' | 'celebration', sourceUrl?: string) {
    this.currentTrackType = trackType;
    this.activeSourceUrl = sourceUrl;
    if (this.isMusicPlaying) {
      this.pauseSoundtrack();
    }
    this.playSoundtrack(sourceUrl, trackType);
  }

  public playSoundtrack(sourceUrl?: string, trackType: 'piano' | 'musicbox' | 'lofi' | 'celebration' = 'piano') {
    this.currentTrackType = trackType;
    this.activeSourceUrl = sourceUrl;

    if (sourceUrl && sourceUrl.trim() !== '') {
      try {
        if (this.musicInterval) {
          clearInterval(this.musicInterval);
          this.musicInterval = null;
        }

        if (!this.customAudio) {
          this.customAudio = new Audio(sourceUrl);
          this.customAudio.loop = false; // NEVER LOOP SINGLE SONG! Auto-advances on completion
          this.customAudio.addEventListener('timeupdate', () => {
            if (this.customAudio) {
              this.notifyTimeListeners(this.customAudio.currentTime, this.customAudio.duration || 0);
            }
          });
          this.customAudio.addEventListener('ended', () => {
            // Auto advance to next song instead of repeating!
            if (this.playlist && this.playlist.length > 1) {
              this.playNextTrack();
            } else {
              this.isMusicPlaying = false;
              this.notifyMusicListeners(false);
            }
          });
        } else {
          this.customAudio.loop = false;
          // If the audio source has changed, point to the new track and reset time
          const currentSrc = this.customAudio.src;
          if (!currentSrc || (!currentSrc.endsWith(encodeURI(sourceUrl)) && currentSrc !== sourceUrl)) {
            this.customAudio.src = sourceUrl;
            this.customAudio.currentTime = 0;
          }
        }

        this.customAudio.muted = this.isMuted;
        this.customAudio.play().then(() => {
          this.isMusicPlaying = true;
          this.notifyMusicListeners(true);
        }).catch((err) => {
          console.warn('Audio play restricted or autoplay policy, falling back to synth:', err);
          this.startSynthMelody(trackType);
        });
        return;
      } catch (err) {
        console.warn('Audio play error, falling back to synth:', err);
        this.startSynthMelody(trackType);
        return;
      }
    }

    if (this.isMusicPlaying) return;
    this.startSynthMelody(trackType);
  }

  private startSynthMelody(trackType: 'piano' | 'musicbox' | 'lofi' | 'celebration' = 'piano') {
    const ctx = this.getContext();
    if (!ctx) return;

    this.isMusicPlaying = true;
    this.notifyMusicListeners(true);

    if (!this.musicGain) {
      this.musicGain = ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.isMuted ? 0 : 0.2, ctx.currentTime);
      this.musicGain.connect(ctx.destination);
    }

    if (this.musicInterval) clearInterval(this.musicInterval);

    // Track 1: 'piano' - Serene acoustic arpeggio pattern (Key of D major / B minor)
    const pianoScale = [293.66, 369.99, 440.00, 493.88, 554.37, 587.33, 659.25, 739.99];
    const pianoSequence = [
      0, 2, 4, 5, 2, 4, 3, 1,
      0, 3, 5, 7, 4, 2, 1, 0,
      1, 3, 5, 6, 3, 5, 4, 2,
      0, 2, 4, 7, 5, 3, 2, 0
    ];
    const pianoBass = [146.83, 196.00, 220.00, 164.81];

    // Track 2: 'musicbox' - Twinkling music box celesta pattern (Key of G major)
    const musicboxScale = [587.33, 659.25, 783.99, 880.00, 987.77, 1046.50, 1174.66, 1318.51];
    const musicboxSequence = [
      2, 4, 6, 5, 3, 5, 4, 2,
      1, 3, 5, 7, 5, 3, 2, 1,
      0, 2, 4, 6, 4, 2, 1, 0,
      3, 5, 7, 6, 4, 2, 1, 0
    ];
    const musicboxBass = [196.00, 246.94, 293.66, 220.00];

    // Track 3: 'lofi' - Warm cozy evening lofi chords (Key of F major 7 / D minor 9)
    const lofiScale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 523.25, 587.33];
    const lofiSequence = [
      0, 3, 2, 5, 1, 4, 3, 6,
      2, 5, 4, 7, 3, 6, 5, 4,
      1, 4, 3, 5, 0, 3, 2, 4,
      2, 4, 6, 5, 3, 1, 2, 0
    ];
    const lofiBass = [130.81, 146.83, 164.81, 174.61];

    // Track 4: 'celebration' - Radiant, celebratory festive tempo (Key of C major)
    const celebScale = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
    const celebSequence = [
      0, 2, 4, 7, 4, 5, 6, 7,
      5, 4, 2, 0, 3, 5, 7, 6,
      4, 6, 7, 5, 3, 5, 4, 2,
      0, 4, 7, 6, 5, 3, 2, 0
    ];
    const celebBass = [130.81, 174.61, 196.00, 220.00];

    let currentScale = pianoScale;
    let currentSequence = pianoSequence;
    let currentBass = pianoBass;
    let stepTempo = 450;
    let oscWave: OscillatorType = 'sine';

    if (trackType === 'musicbox') {
      currentScale = musicboxScale;
      currentSequence = musicboxSequence;
      currentBass = musicboxBass;
      stepTempo = 380;
      oscWave = 'triangle';
    } else if (trackType === 'lofi') {
      currentScale = lofiScale;
      currentSequence = lofiSequence;
      currentBass = lofiBass;
      stepTempo = 520;
      oscWave = 'sine';
    } else if (trackType === 'celebration') {
      currentScale = celebScale;
      currentSequence = celebSequence;
      currentBass = celebBass;
      stepTempo = 340;
      oscWave = 'triangle';
    }

    this.musicInterval = setInterval(() => {
      if (!this.isMusicPlaying || !this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const noteIndex = currentSequence[this.musicStep % currentSequence.length];
      const freq = currentScale[noteIndex];

      // Play melody note
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = oscWave;
      osc.frequency.setValueAtTime(freq, now);

      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(0.08, now + 0.03);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + (trackType === 'musicbox' ? 0.75 : 1.1));

      osc.connect(noteGain);
      if (this.musicGain) noteGain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 1.2);

      // Play warm bass note every 8 steps
      if (this.musicStep % 8 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        const bassFreq = currentBass[(Math.floor(this.musicStep / 8)) % currentBass.length];

        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGain.gain.setValueAtTime(0, now);
        bassGain.gain.linearRampToValueAtTime(0.12, now + 0.08);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

        bassOsc.connect(bassGain);
        if (this.musicGain) bassGain.connect(this.musicGain);

        bassOsc.start(now);
        bassOsc.stop(now + 2.3);
      }

      this.musicStep++;
    }, stepTempo);
  }

  public pauseSoundtrack() {
    this.isMusicPlaying = false;
    this.notifyMusicListeners(false);

    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }

    if (this.customAudio) {
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

export const sound = new SoundSystem();
