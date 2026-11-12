// Web Audio API + HTML5 Audio fallback for 100% reliable, crisp sound playback

let audioCtx = null;
let chimeWavUrl = null;
let preloadedChimeAudio = null;

// Dynamically generate a pristine 44.1kHz 16-bit PCM WAV completion bell chime in memory
function getChimeWavUrl() {
  if (typeof window === 'undefined') return null;
  if (chimeWavUrl) return chimeWavUrl;

  try {
    const sampleRate = 44100;
    const duration = 0.58; // 580ms bell resonance
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    // Two-tone Microsoft To Do style bell chime:
    // Tone 1: G5 (784Hz) with crisp attack
    // Tone 2: C6 (1046.5Hz) + E6 (1318.5Hz) with sparkling overtones and crystal decay
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;

      // Note 1: 784Hz (G5)
      if (t < 0.22) {
        const env1 = Math.exp(-t * 18);
        sample += 0.40 * Math.sin(2 * Math.PI * 784 * t) * env1;
        sample += 0.18 * Math.sin(2 * Math.PI * 1568 * t) * env1;
      }

      // Note 2: 1046.5Hz (C6) + 1318.5Hz (E6) at t = 0.065
      if (t >= 0.065) {
        const t2 = t - 0.065;
        const env2 = Math.exp(-t2 * 6.2);
        sample += 0.55 * Math.sin(2 * Math.PI * 1046.5 * t2) * env2;
        sample += 0.42 * Math.sin(2 * Math.PI * 1318.5 * t2) * env2;
        sample += 0.24 * Math.sin(2 * Math.PI * 2093.0 * t2) * Math.exp(-t2 * 11);
        sample += 0.12 * Math.sin(2 * Math.PI * 3136.0 * t2) * Math.exp(-t2 * 17);
      }

      sample = Math.max(-1, Math.min(1, sample));
      view.setInt16(44 + i * 2, sample < 0 ? sample * 32768 : sample * 32767, true);
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    chimeWavUrl = URL.createObjectURL(blob);
    return chimeWavUrl;
  } catch {
    return null;
  }
}

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

// Pre-warm and unlock audio hardware on user gesture (click/tap)
export function warmupAudio() {
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  } catch {}

  // Pre-load HTML5 audio
  try {
    if (typeof window !== 'undefined' && !preloadedChimeAudio) {
      const url = getChimeWavUrl();
      if (url) {
        preloadedChimeAudio = new Audio(url);
        preloadedChimeAudio.volume = 1.0;
        preloadedChimeAudio.load();
      }
    }
  } catch {}
}

function playSynthesizedChime(ctx) {
  try {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    // 1. Crisp attack ping: C7 (2093Hz) - instant tactile feedback
    const oscAttack = ctx.createOscillator();
    const gainAttack = ctx.createGain();
    oscAttack.type = 'sine';
    oscAttack.frequency.setValueAtTime(2093.0, now);
    gainAttack.gain.setValueAtTime(0.45, now);
    gainAttack.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    oscAttack.connect(gainAttack);
    gainAttack.connect(ctx.destination);
    oscAttack.start(now);
    oscAttack.stop(now + 0.14);

    // 2. Initial bell note: G5 (784Hz) gliding to C6 (1046.5Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(784.0, now);
    osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.08);
    gain1.gain.setValueAtTime(0.70, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.45);

    // 3. Sparkling harmonic chord: E6 (1318.5Hz) gliding to G6 (1568Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1318.5, now + 0.06);
    osc2.frequency.exponentialRampToValueAtTime(1568.0, now + 0.14);
    gain2.gain.setValueAtTime(0.50, now + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.40);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.40);
  } catch {}
}

function playWavChime() {
  try {
    if (typeof window === 'undefined') return;
    const url = getChimeWavUrl();
    if (!url) return;
    const audio = new Audio(url);
    audio.volume = 1.0;
    audio.play().catch(() => {
      if (preloadedChimeAudio) {
        preloadedChimeAudio.currentTime = 0;
        preloadedChimeAudio.play().catch(() => {});
      }
    });
  } catch {}
}

export const playSound = (type = 'complete') => {
  if (type === 'complete') {
    // Play both Web Audio synthesized chime and HTML5 WAV fallback simultaneously
    // for 100% guarantee on mobile devices (iOS Safari, Android Chrome, Silent Mode)
    try {
      const ctx = getAudioContext();
      if (ctx) {
        playSynthesizedChime(ctx);
      }
    } catch {}

    playWavChime();
    return;
  }

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    if (type === 'add') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'delete') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.15);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch {}
};
