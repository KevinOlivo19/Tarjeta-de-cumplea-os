import { useEffect, useRef, useState, useCallback } from 'react';

export function useAudioController() {
  const mainAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<number>(0);

  // Initialize main audio element exclusively for Car's Outside
  useEffect(() => {
    const audio = new Audio('/audio/birthday.mp3');
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = 0.10;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    mainAudioRef.current = audio;

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
    };
  }, []);

  // First user interaction listener to resume if browser autoplay policy paused it
  useEffect(() => {
    const handleFirstGesture = () => {
      if (mainAudioRef.current && mainAudioRef.current.paused && currentLevel > 0) {
        mainAudioRef.current.play().catch(() => { });
      }
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, [currentLevel]);

  // Update volume based on box click stage (0 = none, 1 = ambient soft 0.08, 2 = ambient medium 0.14, 3 = ambient background 0.20)
  const setStageVolume = useCallback((stage: number) => {
    setCurrentLevel(stage);
    let vol = 0.10;
    if (stage === 1) vol = 0.08;
    else if (stage === 2) vol = 0.14;
    else if (stage >= 3) vol = 0.20;

    if (mainAudioRef.current) {
      if (stage === 0) {
        mainAudioRef.current.pause();
        mainAudioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        mainAudioRef.current.volume = isMuted ? 0 : vol;
        if (mainAudioRef.current.paused) {
          mainAudioRef.current.play().catch(() => { });
        }
      }
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const nextMuted = !prev;
      if (mainAudioRef.current) {
        mainAudioRef.current.muted = nextMuted;
        if (!nextMuted && mainAudioRef.current.paused && currentLevel > 0) {
          mainAudioRef.current.play().catch(() => { });
        }
      }
      return nextMuted;
    });
  }, [currentLevel]);

  const startSecretAudio = useCallback(() => {
    // Keep Car's Outside playing smoothly without interruptions
    if (mainAudioRef.current && mainAudioRef.current.paused) {
      mainAudioRef.current.play().catch(() => { });
    }
  }, []);

  return {
    isPlaying,
    isMuted,
    currentLevel,
    setStageVolume,
    toggleMute,
    startSecretAudio
  };
}

