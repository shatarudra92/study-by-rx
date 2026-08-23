import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Check, Copy, ExternalLink, X, Shield, Bell, BookOpen } from 'lucide-react';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TELEGRAM_LINK = 'https://t.me/NST_XY_09';

export const TelegramModal: React.FC<TelegramModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(TELEGRAM_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = () => {
    window.open(TELEGRAM_LINK, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-lg bg-gradient-to-b from-[#161b33] via-[#0e1224] to-[#0a0d1a] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 overflow-hidden text-center"
          >
            {/* Ambient background glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer"
              aria-label="Close Telegram popup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Telegram Plane Icon */}
            <div className="relative mx-auto mb-5 w-24 h-24 rounded-full bg-gradient-to-tr from-[#0088cc] via-[#29b6f6] to-[#64b5f6] p-[2px] shadow-lg shadow-sky-500/30 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#0a1224] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-600/30 to-transparent" />
                <Send className="w-11 h-11 text-[#29b6f6] translate-x-[2px] translate-y-[-2px] animate-pulse" />
              </div>
            </div>

            {/* Title & Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Official Study Channel
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Join NST Telegram!
            </h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-md mx-auto leading-relaxed mb-6">
              Get instant live class alerts, direct notes PDFs, exam strategy sessions, and 24/7 student doubt support.
            </p>

            {/* Perks grid */}
            <div className="grid grid-cols-3 gap-2.5 mb-6 text-left">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <Bell className="w-4 h-4 text-amber-400 mb-1" />
                <div className="text-xs font-bold text-white">Live Alerts</div>
                <div className="text-[10px] text-gray-400">Never miss a class</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <BookOpen className="w-4 h-4 text-emerald-400 mb-1" />
                <div className="text-xs font-bold text-white">Direct Notes</div>
                <div className="text-[10px] text-gray-400">Instant PDF access</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <Shield className="w-4 h-4 text-sky-400 mb-1" />
                <div className="text-xs font-bold text-white">Backup Hub</div>
                <div className="text-[10px] text-gray-400">Zero downtime links</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleJoin}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0088cc] via-[#29b6f6] to-[#0288d1] text-white font-extrabold text-base sm:text-lg shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <Send className="w-5 h-5" />
                Join Telegram Channel
                <ExternalLink className="w-4 h-4 opacity-80" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link (t.me/NST_XY_09)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="py-2.5 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
