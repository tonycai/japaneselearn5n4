'use client';

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface AudioPlayerProps {
  audioFiles: string[];
  title?: string;
  onPlaybackUpdate?: (currentTrack: number, currentTime: number, duration: number, isPlaying: boolean) => void;
}

export interface AudioPlayerRef {
  seekToPosition: (track: number, time: number) => void;
}

const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(({ audioFiles, title, onPlaybackUpdate }, ref) => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const shouldAutoPlay = useRef(false);
  const lastUpdateTime = useRef(0);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    seekToPosition: (track: number, time: number) => {
      if (track >= 0 && track < audioFiles.length) {
        if (track !== currentTrack) {
          // Need to change track
          setCurrentTrack(track);
          shouldAutoPlay.current = true;
          // Time will be set after track loads
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.currentTime = time;
              audioRef.current.play().then(() => {
                setIsPlaying(true);
              }).catch(console.error);
            }
          }, 100);
        } else {
          // Same track, just seek
          if (audioRef.current) {
            audioRef.current.currentTime = time;
            if (!isPlaying) {
              audioRef.current.play().then(() => {
                setIsPlaying(true);
              }).catch(console.error);
            }
          }
        }
      }
    }
  }));

  // Handle track changes and auto-play
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Load the new track
    audio.load();

    // Auto-play if needed
    if (shouldAutoPlay.current) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Auto-play failed:', error);
            setIsPlaying(false);
            shouldAutoPlay.current = false;
          });
      }
    }
  }, [currentTrack]);

  // Update progress and time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  // Notify parent of playback updates (throttled to ~1 second intervals)
  useEffect(() => {
    if (!onPlaybackUpdate) return;

    const currentSecond = Math.floor(currentTime);
    if (isPlaying && currentSecond !== lastUpdateTime.current) {
      lastUpdateTime.current = currentSecond;
      onPlaybackUpdate(currentTrack, currentTime, duration, isPlaying);
    } else if (!isPlaying && lastUpdateTime.current !== -1) {
      lastUpdateTime.current = -1;
      onPlaybackUpdate(currentTrack, currentTime, duration, isPlaying);
    }
  }, [currentTrack, currentTime, duration, isPlaying, onPlaybackUpdate]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error('Playback failed:', error);
              setIsPlaying(false);
            });
        }
      }
    }
  };

  const handleNext = () => {
    if (currentTrack < audioFiles.length - 1) {
      shouldAutoPlay.current = isPlaying; // Continue playing if currently playing
      setCurrentTrack(currentTrack + 1);
    }
  };

  const handlePrevious = () => {
    if (currentTrack > 0) {
      shouldAutoPlay.current = isPlaying; // Continue playing if currently playing
      setCurrentTrack(currentTrack - 1);
    }
  };

  const handleEnded = () => {
    // Auto-play next track if available
    if (currentTrack < audioFiles.length - 1) {
      shouldAutoPlay.current = true;
      setCurrentTrack(currentTrack + 1);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title and track info */}
        <div className="flex-shrink-0">
          {title && (
            <h3 className="text-base font-semibold flex items-center mb-1">
              <span className="mr-2">🎵</span>
              {title}
            </h3>
          )}
          {audioFiles.length > 1 && (
            <div className="text-xs text-white/80">
              Part {currentTrack + 1} of {audioFiles.length}
            </div>
          )}
        </div>

        {/* Hidden audio element for programmatic control */}
        <audio
          ref={audioRef}
          src={audioFiles[currentTrack]}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="hidden"
        />

        {/* Controls */}
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={handlePrevious}
            disabled={currentTrack === 0}
            className="bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed rounded-full p-2 transition-colors"
            aria-label="Previous track"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button
            onClick={handlePlayPause}
            className="bg-white text-blue-600 hover:bg-white/90 rounded-full p-3 transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentTrack === audioFiles.length - 1}
            className="bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed rounded-full p-2 transition-colors"
            aria-label="Next track"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 18h2V6h-2zm-11-1l8.5-6L5 5z" />
            </svg>
          </button>
        </div>

        {/* Progress and time display */}
        <div className="flex-grow hidden lg:flex lg:items-center lg:gap-3">
          <div className="text-xs text-white/90 font-mono whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          <div className="flex-grow bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;
