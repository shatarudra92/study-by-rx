import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  WifiOff,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Video,
  FileText,
  Radio,
  BookOpen,
  PenTool,
  Bookmark,
  X
} from 'lucide-react';
import { ThemeMode } from '../types';

interface NetworkStatusIndicatorProps {
  theme?: ThemeMode;
  onToast?: (msg: string, type: 'success' | 'warning' | 'error' | 'info') => void;
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [wasOffline, setWasOffline] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setJustReconnected(true);
        const timer = setTimeout(() => {
          setJustReconnected(false);
          setWasOffline(false);
        }, 4000);
        return () => clearTimeout(timer);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setJustReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  const checkConnection = async (): Promise<boolean> => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOnline(false);
      setWasOffline(true);
      return false;
    }
    try {
      // Lightweight fetch test
      const res = await fetch('/api/health', { method: 'HEAD', cache: 'no-store' }).catch(() => null);
      const online = res !== null && res.status >= 200 && res.status < 400;
      setIsOnline(online);
      if (online && wasOffline) {
        setJustReconnected(true);
        setTimeout(() => {
          setJustReconnected(false);
          setWasOffline(false);
        }, 4000);
      }
      return online;
    } catch {
      setIsOnline(false);
      setWasOffline(true);
      return false;
    }
  };

  return { isOnline, justReconnected, checkConnection };
}

export const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({
  theme = 'dark',
  onToast
}) => {
  const { isOnline, justReconnected, checkConnection } = useNetworkStatus();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const isDark = theme === 'dark' || theme === 'cosmic-dark';

  // Reset dismissal if status transitions to offline again
  useEffect(() => {
    if (!isOnline) {
      setIsDismissed(false);
    }
  }, [isOnline]);

  const handleManualCheck = async () => {
    setIsChecking(true);
    const online = await checkConnection();
    setIsChecking(false);
    if (online) {
      if (onToast) onToast('Internet connection active & verified! ✨', 'success');
    } else {
      if (onToast) onToast('Still offline. Please check your WiFi or mobile data.', 'warning');
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none flex flex-col items-center px-3 pt-2">
      {/* 1. Back Online Subtle Banner */}
      <AnimatePresence>
        {justReconnected && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`pointer-events-auto mb-2 px-4 py-2 rounded-full border shadow-xl flex items-center gap-2.5 backdrop-blur-md text-xs font-black ${
              isDark
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300 shadow-emerald-950/50'
                : 'bg-emerald-50/95 border-emerald-400 text-emerald-800 shadow-emerald-900/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span>Back Online • All live streams and video classes restored</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Offline Mode Subtle Floating Indicator & Detail Drawer */}
      <AnimatePresence>
        {!isOnline && !isDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`pointer-events-auto w-full max-w-lg rounded-2xl sm:rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-xl transition-all ${
              isDark
                ? 'bg-[#121626]/95 border-amber-500/30 text-white shadow-black/80'
                : 'bg-[#fffcf5]/95 border-amber-400 text-slate-800 shadow-amber-950/15'
            }`}
          >
            {/* Top Bar Header */}
            <div className="p-3 sm:px-4 sm:py-3 flex items-center justify-between gap-3">
              <div
                className="flex items-center gap-2.5 min-w-0 cursor-pointer select-none"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/30 animate-pulse">
                  <WifiOff className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black tracking-tight text-amber-500 dark:text-amber-400">
                      You are Offline
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                      Offline Mode
                    </span>
                  </div>
                  <p className={`text-[11px] truncate ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                    Video streams &amp; live sync are paused. Click for details.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleManualCheck}
                  disabled={isChecking}
                  title="Check internet connection"
                  className={`p-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 active:scale-95'
                      : 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900 active:scale-95'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Retry</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                      : 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900'
                  }`}
                  aria-label={isExpanded ? 'Collapse info' : 'Expand info'}
                >
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsDismissed(true)}
                  className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                    isDark ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'
                  }`}
                  title="Minimize notification"
                  aria-label="Dismiss offline banner"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Expanded Detailed Breakdown of Feature Availability */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`border-t px-3.5 py-3 sm:px-4 sm:py-3.5 text-xs ${
                    isDark ? 'border-white/10 bg-black/20' : 'border-amber-200/80 bg-amber-50/50'
                  }`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Unavailable Features */}
                    <div
                      className={`p-2.5 rounded-2xl border ${
                        isDark
                          ? 'bg-red-950/20 border-red-500/20 text-red-300'
                          : 'bg-red-50/60 border-red-200 text-red-900'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-black text-[11px] uppercase tracking-wider mb-2 text-red-500 dark:text-red-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Unavailable Offline (इंटरनेट चाहिए)</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-center gap-2">
                          <Video className="w-3 h-3 text-red-400 shrink-0" />
                          <span>HLS Live Stream &amp; Video Player</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Radio className="w-3 h-3 text-red-400 shrink-0" />
                          <span>Custom m3u8 URL Stream Player</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <FileText className="w-3 h-3 text-red-400 shrink-0" />
                          <span>Fresh PDF Document Downloads</span>
                        </li>
                      </ul>
                    </div>

                    {/* Available Offline Features */}
                    <div
                      className={`p-2.5 rounded-2xl border ${
                        isDark
                          ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                          : 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-black text-[11px] uppercase tracking-wider mb-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Available Offline (ऑफ़लाइन चलेगा)</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-center gap-2">
                          <PenTool className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>Handwritten Notes Pad &amp; Export</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <BookOpen className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>Cached Batch Syllabus &amp; Topics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Bookmark className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>Pinned Stickers &amp; Saved Preferences</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] opacity-80 pt-2 border-t border-current/10">
                    <span>When your internet reconnects, all streams will resume automatically.</span>
                    <button
                      type="button"
                      onClick={handleManualCheck}
                      disabled={isChecking}
                      className="font-bold text-amber-500 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>Check now</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Minimized Floating Offline Badge (if dismissed) */}
      <AnimatePresence>
        {!isOnline && isDismissed && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsDismissed(false)}
            title="Click to view offline mode details"
            className={`pointer-events-auto px-3 py-1.5 rounded-full border shadow-lg flex items-center gap-2 backdrop-blur-md text-[11px] font-black cursor-pointer ${
              isDark
                ? 'bg-amber-950/90 border-amber-500/40 text-amber-300 shadow-amber-950/40'
                : 'bg-amber-50/95 border-amber-400 text-amber-800 shadow-amber-900/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Offline Mode • Streams Paused</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
