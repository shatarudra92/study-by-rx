import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Check, Plus, Minus, Radio, PlayCircle, Clock, Sparkles, AlertCircle, FileText, Tv, Smile, X, Pin } from 'lucide-react';
import { BatchCourse, ThemeMode } from '../types';
import { generateCosmicThumbnail } from '../utils/security';
import { HANDWRITTEN_STICKERS, HandwrittenSticker } from '../data/stickers';

interface BatchCardProps {
  batch: BatchCourse;
  isEnrolled: boolean;
  theme?: ThemeMode;
  pinnedStickerId?: string | null;
  onPinSticker?: (batchId: string, stickerId: string | null) => void;
  onSelect: (batch: BatchCourse) => void;
  onToggleEnroll: (batch: BatchCourse) => void;
}

export const BatchCard: React.FC<BatchCardProps> = ({
  batch,
  isEnrolled,
  theme = 'dark',
  pinnedStickerId,
  onPinSticker,
  onSelect,
  onToggleEnroll
}) => {
  const isDark = theme === 'dark' || theme === 'cosmic-dark';
  const [showStickerPicker, setShowStickerPicker] = useState(false);

  const pinnedSticker = HANDWRITTEN_STICKERS.find((s) => s.id === pinnedStickerId);

  const discountPercent =
    batch.price && batch.discountPrice && batch.price > batch.discountPrice
      ? Math.round((1 - batch.discountPrice / batch.price) * 100)
      : 0;

  const thumbnailSrc =
    batch.banner && !batch.banner.endsWith('/white')
      ? batch.banner
      : batch.bannerSquare && !batch.bannerSquare.endsWith('/white')
      ? batch.bannerSquare
      : generateCosmicThumbnail(batch.title, batch.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(batch)}
      className={`group relative flex flex-col md:flex-row border rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer ${
        isDark
          ? 'bg-[#0f1424] border-amber-500/20 hover:border-amber-400/50 text-white shadow-black/50'
          : 'bg-[#fffdf9] border-amber-300 hover:border-amber-400 text-slate-800 shadow-amber-950/5'
      }`}
    >
      {/* Top Tape sticker for handwritten notebook feel */}
      <div className="absolute top-0 right-12 w-20 h-3 bg-amber-400/30 -rotate-2 rounded-b shadow-sm pointer-events-none z-20" />

      {/* Pinned Handwritten Sticker Tag if user chose one */}
      {pinnedSticker && (
        <div
          className={`absolute top-2 right-3 z-30 px-2.5 py-1 rounded-xl border font-handwriting font-bold text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-transform transform ${
            pinnedSticker.rotation
          } bg-gradient-to-r ${pinnedSticker.bgGradient} ${pinnedSticker.borderCol} ${pinnedSticker.textCol}`}
          onClick={(e) => {
            e.stopPropagation();
            if (onPinSticker) onPinSticker(batch.id, null);
          }}
          title="Click to remove sticker"
        >
          <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-2 ${pinnedSticker.tapeColor} rounded-xs shadow-xs -rotate-3`} />
          <span className="text-sm">{pinnedSticker.emoji}</span>
          <span className="tracking-tight">{pinnedSticker.label}</span>
          <X className="w-3 h-3 opacity-60 hover:opacity-100 ml-0.5" />
        </div>
      )}

      {/* Left / Top: Thumbnail Container */}
      <div className="relative w-full md:w-[320px] lg:w-[360px] aspect-video md:aspect-auto shrink-0 bg-black/40 overflow-hidden">
        <img
          src={thumbnailSrc}
          alt={batch.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = generateCosmicThumbnail(batch.title, batch.category);
          }}
        />

        {/* Watermark Tag */}
        <span className="absolute bottom-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full bg-black/80 border border-white/20 text-[11px] font-black tracking-wider text-amber-300 backdrop-blur-md shadow-md">
          ✍️ NST RUDRA
        </span>

        {/* Status Badges on Top */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <div>
            {batch.status === 'inactive' ? (
              <span className="px-2.5 py-1 rounded-full bg-gray-900/90 border border-gray-700 text-gray-300 text-[10px] font-extrabold backdrop-blur-md">
                Archived
              </span>
            ) : batch.isLive ? (
              <span className="px-2.5 py-1 rounded-full bg-red-600/95 border border-red-400 text-white text-[10px] font-black flex items-center gap-1.5 backdrop-blur-md shadow-md shadow-red-950/50">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                LIVE CLASS
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-blue-600/95 border border-blue-400 text-white text-[10px] font-bold flex items-center gap-1 backdrop-blur-md">
                <PlayCircle className="w-3 h-3" /> Recorded Notes
              </span>
            )}
          </div>

          {isEnrolled && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-600/95 border border-emerald-400 text-white text-[10px] font-extrabold flex items-center gap-1 backdrop-blur-md shadow-md shadow-emerald-950/50">
              <Check className="w-3 h-3" /> Enrolled
            </span>
          )}
        </div>
      </div>

      {/* Right / Body: Batch Info */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-base sm:text-lg group-hover:text-amber-500 dark:group-hover:text-amber-300 transition-colors leading-snug line-clamp-2 font-handwriting">
              {batch.title}
            </h3>
          </div>

          {batch.short_description && (
            <p
              className={`text-xs sm:text-sm line-clamp-2 leading-relaxed mb-3 ${
                isDark ? 'text-gray-400' : 'text-slate-600'
              }`}
            >
              {batch.short_description}
            </p>
          )}

          {/* Pricing Row */}
          <div className="flex items-baseline gap-2.5 mb-3">
            <span className="text-xl sm:text-2xl font-black font-handwriting text-amber-600 dark:text-amber-300 tracking-tight">
              ₹{batch.discountPrice ?? 0}
            </span>

            {batch.price && batch.price > (batch.discountPrice ?? 0) && (
              <>
                <span
                  className={`text-xs sm:text-sm line-through ${
                    isDark ? 'text-gray-500' : 'text-slate-400'
                  }`}
                >
                  ₹{batch.price}
                </span>
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border font-semibold text-[11px] ${
                isDark
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-amber-100 border-amber-300 text-amber-800'
              }`}
            >
              <PlayCircle className="w-3 h-3 text-amber-500" /> In-App VOD Stream
            </span>

            {batch.isLive && (
              <span className="inline-flex items-center gap-1 text-red-500 bg-red-500/10 px-2.5 py-1 rounded-xl border border-red-500/20 font-semibold text-[11px]">
                <Radio className="w-3 h-3" /> Live Sessions
              </span>
            )}
            {batch.isRecorded && (
              <span className="inline-flex items-center gap-1 text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20 font-semibold text-[11px]">
                <PlayCircle className="w-3 h-3" /> HD Lectures
              </span>
            )}
            {batch.validity && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-medium ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-gray-300'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <Clock className="w-3 h-3 text-amber-500" /> {batch.validity}
              </span>
            )}
          </div>
        </div>

        {/* Action Button Strip */}
        <div
          className={`pt-3.5 sm:pt-4 border-t flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 sm:gap-3 ${
            isDark ? 'border-white/10' : 'border-amber-200'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Full Course Notes
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end" onClick={(e) => e.stopPropagation()}>
            {/* Sticker Pin Button */}
            <div className="relative">
              <button
                onClick={() => setShowStickerPicker(!showStickerPicker)}
                className={`py-1.5 px-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                  pinnedSticker
                    ? isDark
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-amber-100 border-amber-300 text-amber-900'
                    : isDark
                    ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                title="Pin handwritten sticker to batch"
              >
                <Smile className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden xs:inline">{pinnedSticker ? pinnedSticker.emoji : 'Sticker'}</span>
              </button>

              {/* Sticker Dropdown Palette */}
              <AnimatePresence>
                {showStickerPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className={`absolute bottom-full right-0 mb-2 p-2.5 rounded-2xl border shadow-2xl z-40 w-64 ${
                      isDark
                        ? 'bg-[#121829] border-amber-500/30 text-white shadow-black/80'
                        : 'bg-white border-amber-200 text-slate-800 shadow-xl'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-current/10">
                      <div className="flex items-center gap-1.5 text-xs font-black font-handwriting text-amber-500">
                        <Pin className="w-3.5 h-3.5" />
                        <span>Pin Study Sticker:</span>
                      </div>
                      <button
                        onClick={() => setShowStickerPicker(false)}
                        className="text-xs opacity-60 hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {HANDWRITTEN_STICKERS.map((stk) => {
                        const isChosen = pinnedStickerId === stk.id;
                        return (
                          <button
                            key={stk.id}
                            onClick={() => {
                              if (onPinSticker) {
                                onPinSticker(batch.id, isChosen ? null : stk.id);
                              }
                              setShowStickerPicker(false);
                            }}
                            className={`p-1.5 rounded-xl border text-left text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isChosen
                                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-xs'
                                : isDark
                                ? 'bg-white/5 hover:bg-white/10 border-white/10'
                                : 'bg-amber-50/60 hover:bg-amber-100 border-amber-200'
                            }`}
                          >
                            <span className="text-sm">{stk.emoji}</span>
                            <span className="truncate">{stk.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {pinnedSticker && (
                      <button
                        onClick={() => {
                          if (onPinSticker) onPinSticker(batch.id, null);
                          setShowStickerPicker(false);
                        }}
                        className="w-full mt-2 pt-1.5 text-[11px] font-bold text-center text-rose-400 hover:underline border-t border-current/10 cursor-pointer"
                      >
                        Remove Pinned Sticker
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => onToggleEnroll(batch)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                isEnrolled
                  ? isDark
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                    : 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100'
                  : isDark
                  ? 'bg-white/10 border-white/15 text-white hover:bg-white/20'
                  : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
              }`}
            >
              {isEnrolled ? (
                <>
                  <Minus className="w-3.5 h-3.5" /> Unenroll
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" /> Save
                </>
              )}
            </button>

            <button
              onClick={() => onSelect(batch)}
              className="py-1.5 px-3.5 sm:px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25 flex items-center gap-1 cursor-pointer transition-all shrink-0"
            >
              <span>Open Batch</span>
              <BookOpen className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
