import React from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles } from 'lucide-react';
import { TELEGRAM_LINK } from './TelegramModal';

interface FloatingTelegramProps {
  onOpenModal: () => void;
}

export const FloatingTelegram: React.FC<FloatingTelegramProps> = ({ onOpenModal }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group">
      {/* Tooltip on hover */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onOpenModal}
        className="hidden md:flex items-center gap-2 py-2 px-3.5 rounded-full bg-[#0e1628]/90 border border-sky-500/40 text-sky-200 text-xs font-bold shadow-lg shadow-sky-950/50 backdrop-blur-md hover:border-sky-400 transition-all cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '4s' }} />
        <span>Join @NST_XY_09</span>
      </motion.button>

      {/* Main Telegram Orb Button */}
      <motion.a
        href={TELEGRAM_LINK}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#0088cc] via-[#29b6f6] to-[#64b5f6] p-[2px] shadow-xl shadow-sky-500/40 flex items-center justify-center cursor-pointer overflow-hidden"
        aria-label="Open Telegram Community"
      >
        {/* Pulsing halo */}
        <span className="absolute inset-0 rounded-full bg-sky-400 opacity-75 animate-ping pointer-events-none" style={{ animationDuration: '2.5s' }} />

        <div className="w-full h-full rounded-full bg-[#0a1224] flex items-center justify-center relative z-10 hover:bg-[#0c1833] transition-colors">
          <Send className="w-6 h-6 text-[#29b6f6] translate-x-[1px] translate-y-[-1px]" />
        </div>
      </motion.a>
    </div>
  );
};
