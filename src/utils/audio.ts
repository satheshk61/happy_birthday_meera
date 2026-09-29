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

class SoundSystem {
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

  // --- Ambient Music Synthesizer ---
  public toggleSoundtrack(sourceUrl?: string): boolean {
    if (this.isMusicPlaying) {
      this.pauseSoundtrack();
      return false;
    } else {
      this.playSoundtrack(sourceUrl);
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isMusicPlaying;
  }

  public playSoundtrack(sourceUrl?: string) {
    if (this.isMusicPlaying) return;

    if (sourceUrl && sourceUrl.trim() !== '') {
      try {
        if (!this.customAudio) {
          this.customAudio = new Audio(sourceUrl);
          this.customAudio.loop = true;
        } else {
          this.customAudio.src = sourceUrl;
        }
        this.customAudio.play().then(() => {
          this.isMusicPlaying = true;
          this.notifyMusicListeners(true);
        }).catch(() => {
          this.startSynthMelody();
        });
        return;
      } catch {
        this.startSynthMelody();
        return;
      }
    }

    this.startSynthMelody();
  }

  private startSynthMelody() {
    const ctx = this.getContext();
    if (!ctx) return;

    this.isMusicPlaying = true;
    this.notifyMusicListeners(true);

    if (!this.musicGain) {
      this.musicGain = ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.isMuted ? 0 : 0.2, ctx.currentTime);
      this.musicGain.connect(ctx.destination);
    }

    // A dreamy nostalgic acoustic arpeggio pattern (Key of D major / B minor)
    // Notes: D4, F#4, A4, B4, C#5, D5, E5, F#5
    const melodyScale = [
      293.66, 369.99, 440.00, 493.88, 554.37, 587.33, 659.25, 739.99
    ];

    const sequence = [
      0, 2, 4, 5, 2, 4, 3, 1,
      0, 3, 5, 7, 4, 2, 1, 0,
      1, 3, 5, 6, 3, 5, 4, 2,
      0, 2, 4, 7, 5, 3, 2, 0
    ];

    const bassNotes = [146.83, 196.00, 220.00, 164.81];

    if (this.musicInterval) clearInterval(this.musicInterval);

    this.musicInterval = setInterval(() => {
      if (!this.isMusicPlaying || !this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const noteIndex = sequence[this.musicStep % sequence.length];
      const freq = melodyScale[noteIndex];

      // Play treble bell/piano note
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(0.08, now + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

      osc.connect(noteGain);
      if (this.musicGain) noteGain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 1.2);

      // Play deep warm bass note every 8 steps
      if (this.musicStep % 8 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        const bassFreq = bassNotes[(Math.floor(this.musicStep / 8)) % bassNotes.length];

        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGain.gain.setValueAtTime(0, now);
        bassGain.gain.linearRampToValueAtTime(0.12, now + 0.08);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        bassOsc.connect(bassGain);
        if (this.musicGain) bassGain.connect(this.musicGain);

        bassOsc.start(now);
        bassOsc.stop(now + 2.5);
      }

      this.musicStep++;
    }, 450);
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
