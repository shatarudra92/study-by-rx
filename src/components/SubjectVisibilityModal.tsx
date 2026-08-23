import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Layers,
  Check,
  RotateCcw,
  SlidersHorizontal,
  BookmarkCheck,
  HelpCircle
} from 'lucide-react';
import { ThemeMode } from '../types';

export interface SubjectItemMeta {
  name: string;
  lectureCount: number;
  pdfCount?: number;
  isHidden: boolean;
}

interface SubjectVisibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: SubjectItemMeta[];
  onToggleSubject: (subjectName: string) => void;
  onShowAll: () => void;
  onHideAll: () => void;
  theme?: ThemeMode;
}

export const SubjectVisibilityModal: React.FC<SubjectVisibilityModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onToggleSubject,
  onShowAll,
  onHideAll,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark' || theme === 'cosmic-dark';

  if (!isOpen) return null;

  const hiddenCount = subjects.filter((s) => s.isHidden).length;
  const visibleCount = subjects.length - hiddenCount;

  return (
    <AnimatePresence>
      <div
        id="subject-visibility-modal"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isDark
              ? 'bg-[#0f1424] border-amber-500/25 text-white'
              : 'bg-[#fffef9] border-amber-300 text-slate-800'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`p-5 sm:p-6 border-b flex items-center justify-between ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-amber-50/80 border-amber-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black font-handwriting leading-tight flex items-center gap-2">
                  <span>Manage Subjects &amp; Lectures</span>
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30">
                    {visibleCount}/{subjects.length} Visible
                  </span>
                </h3>
                <p className="text-xs opacity-75 mt-0.5">
                  Hide or unhide any subject according to your study schedule
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                  : 'bg-white hover:bg-amber-100 border-amber-200 text-slate-700'
              }`}
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions Bar */}
          <div
            className={`px-5 py-3 border-b flex items-center justify-between gap-2 text-xs font-bold ${
              isDark ? 'bg-white/2 border-white/10' : 'bg-amber-50/40 border-amber-200'
            }`}
          >
            <span className="text-[11px] opacity-75">
              💡 {hiddenCount > 0 ? `${hiddenCount} subject(s) currently hidden` : 'All subjects are visible'}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={onShowAll}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                <span>Show All</span>
              </button>

              <button
                onClick={onHideAll}
                className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
              >
                <EyeOff className="w-3 h-3" />
                <span>Hide All</span>
              </button>
            </div>
          </div>

          {/* Subject List */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-3 divide-y divide-current/5">
            {subjects.map((sub, idx) => {
              return (
                <div
                  key={idx}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    sub.isHidden
                      ? isDark
                        ? 'bg-white/2 border-white/5 opacity-60'
                        : 'bg-slate-100/70 border-slate-200 opacity-60'
                      : isDark
                      ? 'bg-white/5 border-white/10 shadow-sm'
                      : 'bg-white border-amber-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        sub.isHidden
                          ? 'bg-rose-500/20 text-rose-500'
                          : 'bg-emerald-500/20 text-emerald-500'
                      }`}
                    >
                      {sub.isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <div
                        className={`font-bold text-xs sm:text-sm font-handwriting truncate ${
                          sub.isHidden ? 'line-through' : ''
                        }`}
                      >
                        {sub.name}
                      </div>
                      <div className="text-[11px] opacity-75 mt-0.5 flex items-center gap-2">
                        <span>
                          {sub.lectureCount} {sub.lectureCount === 1 ? 'Lecture' : 'Lectures'}
                        </span>
                        {sub.pdfCount !== undefined && sub.pdfCount > 0 && (
                          <span>• {sub.pdfCount} Notes</span>
                        )}
                        {sub.isHidden ? (
                          <span className="text-rose-500 font-bold">• Hidden</span>
                        ) : (
                          <span className="text-emerald-500 font-bold">• Active</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={() => onToggleSubject(sub.name)}
                    className={`py-1.5 px-3.5 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      sub.isHidden
                        ? isDark
                          ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/40 text-emerald-300'
                          : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-700'
                        : isDark
                        ? 'bg-rose-500/15 hover:bg-rose-500/25 border-rose-500/30 text-rose-300'
                        : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
                    }`}
                  >
                    {sub.isHidden ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Unhide</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div
            className={`p-4 border-t flex items-center justify-between gap-3 text-xs ${
              isDark ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-amber-50/50 border-amber-200 text-slate-600'
            }`}
          >
            <span className="text-[11px]">
              ✨ Settings saved automatically for this batch.
            </span>

            <button
              onClick={onClose}
              className="py-1.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-md cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
