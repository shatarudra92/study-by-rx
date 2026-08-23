import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Hls from 'hls.js';
import {
  X,
  Play,
  Pause,
  Settings,
  ExternalLink,
  Send,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  RotateCcw,
  RotateCw,
  PictureInPicture2,
  RefreshCw,
  WifiOff,
  PenTool
} from 'lucide-react';
import { Mp4Recording, ThemeMode } from '../types';
import { TELEGRAM_LINK } from './TelegramModal';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  qualities?: Mp4Recording[];
  theme?: ThemeMode;
  onToast?: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

/**
 * Returns a proxied URL for external streams to bypass CORS restrictions
 */
function getPlayableProxyUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('/api/') || url.includes('youtube.com') || url.includes('youtu.be')) {
    return url;
  }
  return `/api/stream-proxy?url=${encodeURIComponent(url)}`;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  title,
  qualities,
  theme = 'dark',
  onToast
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [currentUrl, setCurrentUrl] = useState(videoUrl);
  const [selectedQuality, setSelectedQuality] = useState<string>('720p');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoadingStream, setIsLoadingStream] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [hlsLevels, setHlsLevels] = useState<Mp4Recording[]>([]);
  const [isOffline, setIsOffline] = useState(() => (typeof navigator !== 'undefined' ? !navigator.onLine : false));

  const isDark = theme === 'dark' || theme === 'cosmic-dark';

  // Listen to network status changes while player is active
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setStreamError(null);
      handleRetry();
    };
    const handleOffline = () => {
      setIsOffline(true);
      setIsLoadingStream(false);
      setStreamError('Internet connection lost. Live stream playback is paused.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentUrl]);

  // Default fallback qualities if none are provided
  const effectiveQualities: Mp4Recording[] = React.useMemo(() => {
    if (qualities && qualities.length > 0) {
      return qualities;
    }
    if (hlsLevels.length > 0) {
      return hlsLevels;
    }
    // Default standard resolution ladder with estimated sizes for m3u8
    return [
      { quality: '720p', url: currentUrl, size: 482.37 },
      { quality: '480p', url: currentUrl, size: 332.55 },
      { quality: '360p', url: currentUrl, size: 238.36 },
      { quality: '240p', url: currentUrl, size: 177.25 }
    ];
  }, [qualities, hlsLevels, currentUrl]);

  // Sync props when videoUrl or qualities change
  useEffect(() => {
    setCurrentUrl(videoUrl);
    setStreamError(null);
    if (qualities && qualities.length > 0) {
      setSelectedQuality(qualities[0].quality.split(' ')[0]);
    } else {
      setSelectedQuality('720p');
    }
  }, [videoUrl, qualities]);

  // Handle HLS stream mounting and video element binding
  useEffect(() => {
    if (!isOpen || !videoRef.current || !currentUrl) return;

    const video = videoRef.current;
    setIsLoadingStream(true);
    setStreamError(null);

    const isM3U8 =
      currentUrl.includes('.m3u8') ||
      currentUrl.includes('playlist') ||
      currentUrl.includes('application/x-mpegURL');

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const streamSourceToLoad = getPlayableProxyUrl(currentUrl);

    if (isM3U8) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 60,
          maxMaxBufferLength: 600,
          autoStartLoad: true
        });

        hlsRef.current = hls;
        hls.loadSource(streamSourceToLoad);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
          setIsLoadingStream(false);
          video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {
              // Autoplay policy prevented unmuted playback, wait for user tap
              setIsPlaying(false);
            });

          // If no custom qualities were passed, extract from manifest
          if (!qualities || qualities.length === 0) {
            if (data.levels && data.levels.length > 0) {
              const extracted: Mp4Recording[] = data.levels.map((lvl, index) => {
                const height = lvl.height || (index === 0 ? 720 : index === 1 ? 480 : index === 2 ? 360 : 240);
                const estSize = lvl.bitrate
                  ? Math.round(((lvl.bitrate * 60 * 50) / (8 * 1024 * 1024)) * 100) / 100
                  : undefined;
                return {
                  quality: `${height}p`,
                  url: currentUrl,
                  size: estSize
                };
              });
              // Sort highest to lowest
              extracted.sort((a, b) => {
                const hA = parseInt(a.quality) || 0;
                const hB = parseInt(b.quality) || 0;
                return hB - hA;
              });
              setHlsLevels(extracted);
            }
          }
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                setStreamError('Unable to load stream. Click retry below.');
                setIsLoadingStream(false);
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native Safari / iOS HLS engine
        video.src = streamSourceToLoad;
        video.addEventListener('loadedmetadata', () => {
          setIsLoadingStream(false);
          video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        });
      } else {
        video.src = streamSourceToLoad;
      }
    } else if (!currentUrl.includes('youtube.com') && !currentUrl.includes('youtu.be')) {
      video.src = streamSourceToLoad;
      video.onloadeddata = () => {
        setIsLoadingStream(false);
        video
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      };
      video.onerror = () => {
        setIsLoadingStream(false);
        setStreamError('Failed to load video file.');
      };
    } else {
      setIsLoadingStream(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentUrl, isOpen]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleSkip(-10);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleSkip(10);
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPlaying, duration]);

  // Time update listener
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = target;
      setCurrentTime(target);
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + seconds)
      );
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    if (onToast) onToast(`Playback speed set to ${speed}x ⚡`, 'success');
  };

  const toggleFullscreen = () => {
    const container = document.getElementById('in-app-video-stage');
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const togglePictureInPicture = async () => {
    if (videoRef.current) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (err) {
        console.error('PiP Error:', err);
      }
    }
  };

  // Quality resolution switcher
  const handleSelectQuality = (rec: Mp4Recording) => {
    const prevTime = videoRef.current ? videoRef.current.currentTime : 0;
    setSelectedQuality(rec.quality.split(' ')[0]);

    if (hlsRef.current && hlsRef.current.levels.length > 0) {
      // Find matching HLS level
      const targetHeight = parseInt(rec.quality) || 720;
      const levelIdx = hlsRef.current.levels.findIndex((lvl) => lvl.height === targetHeight);
      if (levelIdx !== -1) {
        hlsRef.current.currentLevel = levelIdx;
        if (onToast) onToast(`Switched resolution to ${rec.quality} 🎬`, 'success');
        return;
      }
    }

    // Switch URL if different quality URL provided
    if (rec.url && rec.url !== currentUrl) {
      setCurrentUrl(rec.url);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = prevTime;
          videoRef.current.play().catch(() => {});
        }
      }, 300);
    }

    if (onToast) onToast(`Switched resolution to ${rec.quality} (${rec.size ? rec.size + ' MB' : 'HD'}) 🎬`, 'success');
  };

  const handleCopyStreamUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    if (onToast) onToast('📋 Stream link copied to clipboard!', 'success');
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleRetry = () => {
    setStreamError(null);
    setIsLoadingStream(true);
    if (videoRef.current) {
      const source = getPlayableProxyUrl(currentUrl);
      if (hlsRef.current) {
        hlsRef.current.loadSource(source);
      } else {
        videoRef.current.src = source;
        videoRef.current.load();
      }
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const s = Math.floor(secs);
    const m = Math.floor(s / 60);
    const remainder = s % 60;
    const h = Math.floor(m / 60);
    const remM = m % 60;

    if (h > 0) {
      return `${h}:${remM < 10 ? '0' : ''}${remM}:${remainder < 10 ? '0' : ''}${remainder}`;
    }
    return `${m}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            className={`relative w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col z-10 my-auto ${
              isDark
                ? 'bg-[#090d18] border-amber-500/25 text-white shadow-black/90'
                : 'bg-[#fffefb] border-amber-300 text-slate-800 shadow-2xl shadow-amber-950/20'
            }`}
          >
            {/* Modal Header */}
            <div
              className={`flex items-center justify-between p-3.5 sm:p-4 border-b transition-colors ${
                isDark ? 'bg-[#0e1322] border-white/10' : 'bg-[#fcf8f0] border-amber-200'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-500 shrink-0">
                  <Play className="w-4 h-4 fill-amber-500" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300">
                      NST RUDRA IN-APP VOD
                    </span>
                    <span className="text-xs text-gray-400 hidden sm:inline">• Live HLS Player</span>
                  </div>
                  <div className="truncate font-extrabold text-sm sm:text-base font-handwriting">
                    {title || 'Lecture Stream'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-400 text-xs font-bold hover:bg-sky-500/25 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>@NST_XY_09</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer transition-all"
                  aria-label="Close Player"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Stage with Custom In-App Overlay Controls */}
            <div
              id="in-app-video-stage"
              className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group"
            >
              {!currentUrl ? (
                <div className="text-amber-500 font-bold text-sm animate-pulse">
                  Preparing stream source...
                </div>
              ) : currentUrl.includes('youtube.com') || currentUrl.includes('youtu.be') ? (
                <iframe
                  src={
                    currentUrl.includes('embed')
                      ? currentUrl
                      : currentUrl.replace('watch?v=', 'embed/')
                  }
                  title={title || 'Video Player'}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    onTimeUpdate={handleTimeUpdate}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    onClick={togglePlay}
                    playsInline
                    className="w-full h-full object-contain cursor-pointer"
                  />

                  {/* Watermark in corner */}
                  <div className="absolute top-3 left-3 pointer-events-none z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black text-amber-300 border border-white/15 shadow-sm">
                    ✍️ NST RUDRA • In-App Player
                  </div>

                  {/* Centered Big Play Button when paused & not loading */}
                  {!isPlaying && !isLoadingStream && !streamError && (
                    <button
                      onClick={togglePlay}
                      className="absolute z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/90 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 hover:scale-110 active:scale-95 transition-all cursor-pointer ring-4 ring-white/20"
                      aria-label="Play Video"
                    >
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
                    </button>
                  )}

                  {/* Loading Spinner */}
                  {isLoadingStream && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-xs pointer-events-none z-20">
                      <div className="w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
                      <span className="text-xs font-bold text-amber-300">Loading Stream...</span>
                    </div>
                  )}

                  {/* Error & Offline Notification */}
                  {(streamError || isOffline) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/85 p-4 z-20 backdrop-blur-sm">
                      <div className="bg-[#121629]/95 border border-amber-500/40 text-amber-200 text-xs sm:text-sm p-6 rounded-3xl max-w-md text-center shadow-2xl">
                        {isOffline ? (
                          <>
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto mb-3 flex items-center justify-center border border-amber-500/30">
                              <WifiOff className="w-6 h-6" />
                            </div>
                            <h4 className="text-base font-extrabold text-white mb-1">
                              Offline Mode Active
                            </h4>
                            <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                              Live video stream playback requires an active internet connection. When your connection is restored, the stream will resume automatically.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-2">
                              <button
                                onClick={handleRetry}
                                className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs cursor-pointer inline-flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Check Connection &amp; Retry</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="font-bold mb-3 text-red-300">{streamError}</p>
                            <button
                              onClick={handleRetry}
                              className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Retry Playback</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Overlay Controls (Auto fade out on hover) */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 sm:p-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-2 z-20">
                    {/* Scrub Bar */}
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-white/20 accent-amber-500 rounded-lg cursor-pointer hover:h-2 transition-all"
                      />
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between gap-2 text-white">
                      {/* Left: Play/Pause, Rewind, FastForward, Time */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={togglePlay}
                          className="p-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
                          aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current" />
                          )}
                        </button>

                        <button
                          onClick={() => handleSkip(-10)}
                          className="p-1.5 rounded-lg hover:bg-white/20 text-gray-200 cursor-pointer"
                          title="Rewind 10s"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleSkip(10)}
                          className="p-1.5 rounded-lg hover:bg-white/20 text-gray-200 cursor-pointer"
                          title="Forward 10s"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>

                        <div className="text-[11px] sm:text-xs font-mono font-semibold text-gray-300">
                          <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
                        </div>
                      </div>

                      {/* Right: Speed, Volume, PiP, Fullscreen */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        {/* Speed Toggle */}
                        <div className="flex items-center gap-1 bg-black/40 rounded-xl p-1 border border-white/10 text-[11px] font-bold">
                          {[1, 1.25, 1.5, 1.75, 2].map((s) => (
                            <button
                              key={s}
                              onClick={() => handleSpeedChange(s)}
                              className={`px-1.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                                playbackSpeed === s
                                  ? 'bg-amber-500 text-slate-950 font-black'
                                  : 'text-gray-300 hover:text-white'
                              }`}
                            >
                              {s}x
                            </button>
                          ))}
                        </div>

                        {/* Volume Control */}
                        <div className="hidden sm:flex items-center gap-1.5">
                          <button
                            onClick={toggleMute}
                            className="p-1.5 rounded-lg hover:bg-white/20 text-gray-200 cursor-pointer"
                          >
                            {isMuted || volume === 0 ? (
                              <VolumeX className="w-4 h-4 text-rose-400" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </button>
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-16 h-1 bg-white/30 accent-amber-500 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* PiP */}
                        <button
                          onClick={togglePictureInPicture}
                          className="p-1.5 rounded-lg hover:bg-white/20 text-gray-200 cursor-pointer"
                          title="Picture in Picture"
                        >
                          <PictureInPicture2 className="w-4 h-4" />
                        </button>

                        {/* Fullscreen */}
                        <button
                          onClick={toggleFullscreen}
                          className="p-1.5 rounded-lg hover:bg-white/20 text-gray-200 cursor-pointer"
                          title="Fullscreen"
                        >
                          {isFullscreen ? (
                            <Minimize2 className="w-4 h-4" />
                          ) : (
                            <Maximize2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Bar: Exact Resolution Switcher matching user's design & In-App Actions */}
            <div
              className={`p-3.5 sm:p-4 border-t flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs transition-colors ${
                isDark ? 'bg-[#0e1322] border-white/10' : 'bg-[#fcf8f0] border-amber-200'
              }`}
            >
              {/* Resolution Switcher */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-amber-500 dark:text-amber-400 font-bold flex items-center gap-1.5 text-xs sm:text-sm mr-1">
                  <Settings className="w-4 h-4 text-amber-500" />
                  <span>Resolution:</span>
                </span>

                {effectiveQualities.map((q, idx) => {
                  const qKey = q.quality.split(' ')[0];
                  const isSelected = selectedQuality.startsWith(qKey) || (idx === 0 && !selectedQuality);

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuality(q)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400/50 scale-102'
                          : isDark
                          ? 'bg-[#181e30] hover:bg-[#222a42] text-gray-200 border border-white/10'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300'
                      }`}
                    >
                      <span>{q.quality}</span>
                      {q.size ? (
                        <span className="ml-1 opacity-90 font-medium">({q.size} MB)</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons: Copy Link and Open Tab */}
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {/* Copy Link Button */}
                <button
                  onClick={handleCopyStreamUrl}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isDark
                      ? 'bg-white/10 hover:bg-white/20 border-white/15 text-gray-200'
                      : 'bg-white hover:bg-amber-50 border-amber-300 text-slate-800 shadow-sm'
                  }`}
                  title="Copy direct stream link"
                >
                  {copiedUrl ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedUrl ? 'Copied URL!' : 'Copy Link'}</span>
                </button>

                {/* Open Tab Button */}
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 hover:scale-102 transition-all cursor-pointer"
                  title="Open video stream in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Tab</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
