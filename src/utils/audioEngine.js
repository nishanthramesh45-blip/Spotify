// Web Audio API Synthesizer & Playback Engine for authentic desktop audio playback

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.currentTrack = null;
    this.currentTime = 0;
    this.duration = 240;
    this.volume = 0.75;
    this.isMuted = false;
    this.timer = null;
    this.activeNodes = [];
    this.timeUpdateCallbacks = new Set();
    this.endedCallbacks = new Set();
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.35, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  onTimeUpdate(cb) {
    this.timeUpdateCallbacks.add(cb);
    return () => this.timeUpdateCallbacks.delete(cb);
  }

  onEnded(cb) {
    this.endedCallbacks.add(cb);
    return () => this.endedCallbacks.delete(cb);
  }

  notifyTimeUpdate() {
    this.timeUpdateCallbacks.forEach(cb => cb(this.currentTime, this.duration));
  }

  setVolume(level) {
    this.volume = Math.max(0, Math.min(1, level));
    if (this.ctx && this.masterGain) {
      const targetGain = this.isMuted ? 0 : this.volume * 0.35;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    this.setVolume(this.volume);
  }

  playTrack(track, startTime = 0) {
    this.initContext();
    this.stopAudioNodes();

    this.currentTrack = track;
    this.duration = track.durationSeconds || 215;
    this.currentTime = startTime;
    this.isPlaying = true;

    this.startSynthesizerLoop(track);
    this.startTimer();
    this.notifyTimeUpdate();
  }

  pause() {
    this.isPlaying = false;
    this.stopAudioNodes();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.notifyTimeUpdate();
  }

  resume() {
    if (!this.currentTrack) return;
    this.initContext();
    this.isPlaying = true;
    this.startSynthesizerLoop(this.currentTrack);
    this.startTimer();
    this.notifyTimeUpdate();
  }

  seek(seconds) {
    this.currentTime = Math.max(0, Math.min(this.duration, seconds));
    this.notifyTimeUpdate();
    if (this.isPlaying) {
      this.stopAudioNodes();
      this.startSynthesizerLoop(this.currentTrack);
    }
  }

  startTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.isPlaying) {
        this.currentTime += 0.25;
        if (this.currentTime >= this.duration) {
          this.currentTime = this.duration;
          this.notifyTimeUpdate();
          this.pause();
          this.endedCallbacks.forEach(cb => cb());
        } else {
          this.notifyTimeUpdate();
        }
      }
    }, 250);
  }

  stopAudioNodes() {
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch (e) {
        // Ignored if already stopped
      }
    });
    this.activeNodes = [];
  }

  startSynthesizerLoop(track) {
    if (!this.ctx || !this.masterGain) return;

    // Pick musical chords based on genre or mood
    const genre = (track.genre || 'electronic').toLowerCase();
    let baseFreqs = [130.81, 164.81, 196.0, 261.63]; // C minor / major chords
    if (genre.includes('synth') || genre.includes('electronic')) {
      baseFreqs = [110.0, 146.83, 164.81, 220.0]; // A minor moody
    } else if (genre.includes('chill') || genre.includes('lofi')) {
      baseFreqs = [174.61, 220.0, 261.63, 329.63]; // Fmaj7 warm
    } else if (genre.includes('rock') || genre.includes('indie')) {
      baseFreqs = [98.0, 123.47, 146.83, 196.0]; // G power chord
    }

    try {
      // 1. Lush Chord Pad
      const padGain = this.ctx.createGain();
      padGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      padGain.connect(this.masterGain);
      this.activeNodes.push(padGain);

      baseFreqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        // Gentle detune for chorus warmth
        osc.detune.setValueAtTime((idx - 1.5) * 6, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450 + (idx * 120), this.ctx.currentTime);

        osc.connect(filter);
        filter.connect(padGain);
        osc.start();
        this.activeNodes.push(osc, filter);
      });

      // 2. Rhythmic Sub Bass Pulse
      const bassOsc = this.ctx.createOscillator();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(baseFreqs[0] * 0.5, this.ctx.currentTime);

      const bassGain = this.ctx.createGain();
      bassGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      bassOsc.connect(bassGain);
      bassGain.connect(this.masterGain);
      bassOsc.start();
      this.activeNodes.push(bassOsc, bassGain);

      // Subtle LFO modulation for pulse movement
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(1.8, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      lfo.connect(bassGain.gain);
      lfo.start();
      this.activeNodes.push(lfo, lfoGain);

    } catch (err) {
      console.warn('Audio playback synthesis initialized with fallback.', err);
    }
  }
}

export const audioEngine = new AudioEngine();
