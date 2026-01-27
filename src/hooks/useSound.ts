import { useCallback } from 'react';

const playBeep = (freq = 800, duration = 0.05, type: OscillatorType = 'square') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.error('Audio playback failed', e);
  }
};

export const useSound = () => {
  const playType = useCallback(() => {
    // Randomize pitch slightly for typing effect
    const freq = 600 + Math.random() * 200;
    playBeep(freq, 0.03, 'sine');
  }, []);

  const playEnter = useCallback(() => {
    playBeep(400, 0.1, 'square');
  }, []);

  const playHover = useCallback(() => {
    playBeep(1200, 0.01, 'sine');
  }, []);

  const playExpand = useCallback(() => {
    // Sliding pitch for expansion
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.2);
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
  }, []);

  return { playType, playEnter, playHover, playExpand };
};
