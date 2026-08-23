import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Radio,
  PlayCircle,
  FileText,
  Send,
  ArrowRight,
  PenTool,
  BookmarkCheck,
  CheckCircle2,
  Check
} from 'lucide-react';
import { TELEGRAM_LINK } from './TelegramModal';
import { ThemeMode } from '../types';

interface HeroBannerProps {
  totalBatches: number;
  liveCount: number;
  enrolledCount: number;
  theme: ThemeMode;
  onExploreClick: () => void;
  onOpenTelegramModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  totalBatches,
  liveCount,
  enrolledCount,
  theme,
  onExploreClick,
  onOpenTelegramModal
}) => {
  const isDark = theme === 'dark' || theme === 'cosmic-dark';

  return (
    <section
      className={`relative w-full overflow-hidden border-b py-8 sm:py-12 px-3.5 sm:px-6 transition-colors ${
        isDark
          ? 'bg-gradient-to-b from-[#0e1220] via-[#090d18] to-[#070a14] border-amber-500/15 text-white paper-ruled-dark'
          : 'bg-gradient-to-b from-[#fffcf7] via-[#faf6ec] to-[#f6f0e2] border-amber-200 text-slate-800 paper-ruled-light'
      }`}
    >
      {/* Background Soft Glows */}
      <div className="absolute -top-24 left-1/4 w-72 sm:w-80 h-72 sm:h-80 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 sm:w-80 h-72 sm:h-80 bg-orange-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Red vertical margin ruler line on left - positioned carefully so it doesn't overlap text on mobile */}
      <div
        className={`hidden sm:block absolute left-6 sm:left-12 top-0 bottom-0 w-[1.5px] pointer-events-none opacity-40 ${
          isDark ? 'bg-rose-500/40' : 'bg-rose-400/60'
        }`}
      />

      <div className="max-w-7xl mx-auto relative z-10 sm:pl-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10">
          {/* Left Column: Authentic Human-Written Notebook Layout */}
          <div className="flex-1 w-full text-center lg:text-left space-y-4 max-w-2xl">
            {/* Top Tape Pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-300"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <PenTool className="w-3.5 h-3.5" />
              <span className="font-handwriting text-xs sm:text-sm">NST RUDRA PORTAL ✍️</span>
            </motion.div>

            {/* Portal Heading with multi-pen accent styling */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-snug"
            >
              <span className={isDark ? 'pen-black-dark' : 'pen-black-light'}>
                NST RUDRA
              </span>{' '}
              <span className="block sm:inline font-handwriting text-amber-600 dark:text-amber-400">
                — Study Portal
              </span>
            </motion.h1>

            {/* Human Multi-Pen Notebook Demonstration Card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border shadow-md text-left text-xs sm:text-sm space-y-2.5 transition-colors relative ${
                isDark
                  ? 'bg-[#121626]/90 border-amber-500/25 shadow-black/60'
                  : 'bg-[#fffef9] border-amber-300 shadow-amber-950/5'
              }`}
            >
              {/* Paper Clip Top Indicator */}
              <div className="absolute -top-2.5 right-6 w-5 h-8 border-2 border-slate-400 dark:border-slate-500 rounded-full rotate-6 opacity-80 pointer-events-none" />

              {/* 🔴 Red Pen Line */}
              <div className="flex items-start gap-2">
                <span className="font-bold shrink-0 text-red-500 text-sm leading-none mt-0.5">🔴</span>
                <p className={`font-handwriting font-bold text-xs sm:text-sm leading-relaxed ${isDark ? 'text-rose-300' : 'text-red-600'}`}>
                  <span className="pen-underline-red">Important Formulas &amp; Exam Questions</span>{' '}
                  <span className={`text-[11px] font-normal ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                    marked clearly in red ink for instant revision.
                  </span>
                </p>
              </div>

              {/* 🔵 Blue Pen Line */}
              <div className="flex items-start gap-2">
                <span className="font-bold shrink-0 text-blue-500 text-sm leading-none mt-0.5">🔵</span>
                <p className={`font-notes text-xs sm:text-sm leading-relaxed ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                  <span className="font-bold">Concept Clarifications &amp; Lecture Summaries</span>{' '}
                  <span className={`text-[11px] ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                    written neatly in classic blue pen.
                  </span>
                </p>
              </div>

              {/* 🟢 Green Pen Line */}
              <div className="flex items-start gap-2">
                <span className="font-bold shrink-0 text-emerald-500 text-sm leading-none mt-0.5">🟢</span>
                <p className={`font-handwriting font-bold text-xs sm:text-sm leading-relaxed ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  <span className="pen-underline-green">Topper Short-Tricks &amp; Mnemonics</span>{' '}
                  <span className={`text-[11px] font-normal ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                    highlighted for fast recall during test series.
                  </span>
                </p>
              </div>

              {/* 🟡 Highlighted Tag Line */}
              <div className="pt-2 border-t border-current/10 flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs">
                <span className="font-bold opacity-75">Markers:</span>
                <span className={isDark ? 'hl-dark-yellow' : 'hl-yellow'}>Yellow Focus</span>
                <span className={isDark ? 'hl-dark-cyan' : 'hl-cyan'}>Cyan Concepts</span>
                <span className={isDark ? 'hl-dark-pink' : 'hl-pink'}>Pink Alerts</span>
                <span className={isDark ? 'hl-dark-green' : 'hl-green'}>Green Formulas</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-1"
            >
              <button
                onClick={onExploreClick}
                className="py-3 px-5 sm:px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse All Batches</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenTelegramModal}
                className={`py-3 px-5 sm:px-6 rounded-2xl border font-bold text-xs sm:text-sm shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isDark
                    ? 'bg-[#0088cc]/20 hover:bg-[#0088cc]/30 border-sky-400/40 text-sky-200'
                    : 'bg-sky-50 hover:bg-sky-100 border-sky-300 text-sky-800'
                }`}
              >
                <Send className="w-4 h-4 text-[#0088cc]" />
                <span>Join @NST_XY_09</span>
              </button>
            </motion.div>
          </div>

          {/* Right Column: Sticky HUD Card with Multi-Pen Revision Summary */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18 }}
            className="w-full lg:w-80 shrink-0"
          >
            <div
              className={`rounded-3xl p-4 sm:p-5 border shadow-xl backdrop-blur-xl relative overflow-hidden transition-colors ${
                isDark
                  ? 'bg-gradient-to-b from-[#141829]/95 to-[#0a0d18]/95 border-amber-500/20 text-white shadow-black/80'
                  : 'bg-[#fffef9] border-amber-300 text-slate-800 shadow-xl shadow-amber-950/10'
              }`}
            >
              {/* Sticky Tape graphic */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-20 h-3 bg-amber-400/30 rounded-b shadow-xs -rotate-1 pointer-events-none" />

              <div
                className={`flex items-center justify-between pb-3 border-b mb-3 ${
                  isDark ? 'border-white/10' : 'border-amber-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-base">📌</span>
                  <span className="text-xs font-black uppercase tracking-wider font-handwriting">
                    NST RUDRA Index
                  </span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>

              {/* Stats Tiles */}
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                <div
                  className={`p-3 rounded-2xl border ${
                    isDark ? 'bg-white/5 border-white/5' : 'bg-amber-50/70 border-amber-200/80'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-bold mb-0.5">
                    <FileText className="w-3 h-3" />
                    <span>Batches</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-handwriting">
                    {totalBatches}+
                  </div>
                  <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                    Available Now
                  </span>
                </div>

                <div
                  className={`p-3 rounded-2xl border ${
                    isDark ? 'bg-white/5 border-white/5' : 'bg-amber-50/70 border-amber-200/80'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px] text-rose-500 font-bold mb-0.5">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>Live Classes</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-handwriting">
                    {liveCount}
                  </div>
                  <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                    Daily Scheduled
                  </span>
                </div>
              </div>

              {/* Student Daily Tip Sticky Note */}
              <div
                className={`p-3 rounded-2xl border text-xs relative ${
                  isDark
                    ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                    : 'bg-[#fef9c3] border-[#fde047] text-slate-800'
                }`}
              >
                <div className="font-handwriting font-bold text-xs sm:text-sm text-red-600 dark:text-rose-300 mb-0.5">
                  ✍️ Topper's Golden Rule:
                </div>
                <div className="font-notes text-xs opacity-90 leading-snug">
                  "Revise class notes daily &amp; practice question sets without missing."
                </div>
                <div className="text-[10px] opacity-75 text-right mt-1 font-semibold">
                  — NST RUDRA Mentor
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

