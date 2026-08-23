import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'warning' | 'error' | 'security' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-md px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md w-full text-sm font-semibold ${
              t.type === 'security'
                ? 'bg-[#15102a]/95 border-purple-500/40 text-purple-200 shadow-purple-900/30'
                : t.type === 'success'
                ? 'bg-[#0f241a]/95 border-emerald-500/40 text-emerald-200 shadow-emerald-950/40'
                : t.type === 'warning'
                ? 'bg-[#291b0c]/95 border-amber-500/40 text-amber-200 shadow-amber-950/40'
                : t.type === 'info'
                ? 'bg-[#0a1b30]/95 border-sky-500/40 text-sky-200 shadow-sky-950/40'
                : 'bg-[#2a0e14]/95 border-rose-500/40 text-rose-200 shadow-rose-950/40'
            }`}
          >
            {t.type === 'security' && <ShieldAlert className="w-5 h-5 text-purple-400 shrink-0 animate-pulse" />}
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
            {t.type === 'error' && <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />}

            <span className="flex-1 leading-snug">{t.text}</span>

            <button
              onClick={() => onDismiss(t.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
