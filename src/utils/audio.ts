// Lightweight Web Audio API synthesizer for romantic card ambience & celebration chimes
// Uses native browser audio synthesis - 100% reliable, zero external network dependency

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Gentle romantic harp / music box arpeggio chords
let isPlayingMelody = false;
let melodyInterval: any = null;

export function playCelebrationChime() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.85);
    });
  } catch (e) {
    console.warn('Audio not allowed yet:', e);
  }
}

export function playRomanticBell(freq = 587.33) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.25);
  } catch (e) {
    console.warn('Bell audio error', e);
  }
}

export function startRomanticMelody(onStateChange?: (playing: boolean) => void) {
  if (isPlayingMelody) {
    stopRomanticMelody(onStateChange);
    return;
  }

  try {
    const ctx = getAudioContext();
    isPlayingMelody = true;
    if (onStateChange) onStateChange(true);

    const chords = [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7 (C4, E4, G4, B4)
      [220.0, 261.63, 329.63, 392.0],  // Am7 (A3, C4, E4, G4)
      [174.61, 220.0, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
      [196.0, 246.94, 293.66, 392.0],  // G (G3, B3, D4, G4)
    ];

    let chordIdx = 0;
    let noteIdx = 0;

    melodyInterval = setInterval(() => {
      if (!isPlayingMelody) return;
      const currentChord = chords[chordIdx];
      const freq = currentChord[noteIdx];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.95);

      noteIdx++;
      if (noteIdx >= currentChord.length) {
        noteIdx = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }
    }, 400);
  } catch (e) {
    console.warn('Melody start error:', e);
    isPlayingMelody = false;
    if (onStateChange) onStateChange(false);
  }
}

export function stopRomanticMelody(onStateChange?: (playing: boolean) => void) {
  isPlayingMelody = false;
  if (melodyInterval) {
    clearInterval(melodyInterval);
    melodyInterval = null;
  }
  if (onStateChange) onStateChange(false);
}
