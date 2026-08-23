import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, PlayCircle, Sparkles, Link as LinkIcon, Check, WifiOff, AlertTriangle } from 'lucide-react';
import { ThemeMode } from '../types';

interface StreamUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayStream: (url: string, title?: string) => void;
  theme?: ThemeMode;
}

export const StreamUrlModal: React.FC<StreamUrlModalProps> = ({
  isOpen,
  onClose,
  onPlayStream,
  theme = 'dark'
}) => {
  const [streamUrl, setStreamUrl] = useState(
    'https://selectionwaylive.hranker.com/561/6a83bace873324752d90fa46/playlist-mpl-vod.m3u8'
  );
  const [streamTitle, setStreamTitle] = useState('HLS Master Lecture Stream');
  const isOffline = typeof navigator !== 'undefined' ? !navigator.onLine : false;

  const isDark = theme === 'dark' || theme === 'cosmic-dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamUrl.trim()) return;
    onPlayStream(streamUrl.trim(), streamTitle.trim() || 'HLS Live Stream');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden z-10 p-5 sm:p-6 transition-colors ${
              isDark
                ? 'bg-[#0b0f1d] border-amber-500/30 text-white shadow-black/80'
                : 'bg-[#fffdf9] border-amber-300 text-slate-800 shadow-xl'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-400/40">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base font-handwriting">
                    In-App Stream Player (.m3u8)
                  </h3>
                  <p className="text-[11px] opacity-75">
                    Stream directly inside our site with multi-resolution switching
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Stream URL (.m3u8 or Video Link):
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none" />
                  <input
                    type="text"
                    value={streamUrl}
                    onChange={(e) => setStreamUrl(e.target.value)}
                    placeholder="https://.../playlist.m3u8"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs sm:text-sm border font-mono outline-none transition-all ${
                      isDark
                        ? 'bg-black/40 border-white/15 focus:border-amber-400 text-amber-200'
                        : 'bg-white border-amber-200 focus:border-amber-500 text-slate-800'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Lecture / Stream Title (Optional):
                </label>
                <input
                  type="text"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="e.g. Maths Lecture 01"
                  className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm border outline-none transition-all ${
                    isDark
                      ? 'bg-black/40 border-white/15 focus:border-amber-400 text-white'
                      : 'bg-white border-amber-200 focus:border-amber-500 text-slate-800'
                  }`}
                />
              </div>

              {/* Quick Sample Button */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between gap-2">
                <span className="text-[11px] text-amber-600 dark:text-amber-300 font-semibold truncate">
                  ⚡ Selection Way Live HLS Stream
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setStreamUrl(
                      'https://selectionwaylive.hranker.com/561/6a83bace873324752d90fa46/playlist-mpl-vod.m3u8'
                    )
                  }
                  className="text-[11px] font-bold px-2 py-1 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer shrink-0"
                >
                  Use URL
                </button>
              </div>

              {/* Offline notice if disconnected */}
              {isOffline && (
                <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs flex items-start gap-2">
                  <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Offline Warning:</strong> Live HLS streams require active internet. Connect to WiFi or mobile data to stream smoothly.
                  </span>
                </div>
              )}

              {/* Play Button */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer hover:scale-102 transition-all"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Play In-App Video</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
