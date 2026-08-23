import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Download, ExternalLink, ShieldCheck, Send } from 'lucide-react';
import { TELEGRAM_LINK } from './TelegramModal';
import { ThemeMode } from '../types';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
  theme?: ThemeMode;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  title,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark' || theme === 'cosmic-dark';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`relative w-full max-w-4xl h-[85vh] rounded-3xl border shadow-2xl overflow-hidden flex flex-col z-10 ${
              isDark
                ? 'bg-[#090d18] border-amber-500/25 text-white shadow-black/80'
                : 'bg-[#fffdf8] border-amber-300 text-slate-800 shadow-2xl shadow-amber-950/10'
            }`}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between p-4 border-b transition-colors ${
                isDark ? 'bg-[#0e1322] border-white/10' : 'bg-[#fcf8f0] border-amber-200'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-4">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate font-extrabold text-sm sm:text-base font-handwriting">
                  {title}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {pdfUrl ? (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Download PDF</span>
                  </a>
                ) : null}

                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-400 text-xs font-bold"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>@NST_XY_09</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded PDF iframe / viewer */}
            <div className="flex-1 w-full bg-slate-900 relative">
              {pdfUrl ? (
                <iframe
                  src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`}
                  title={title || 'PDF Viewer'}
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-amber-500 font-bold text-sm">
                  Loading PDF Document...
                </div>
              )}
            </div>

            {/* Bottom Bar */}
            <div
              className={`p-3 px-4 border-t flex items-center justify-between text-xs transition-colors ${
                isDark ? 'bg-[#0e1322] border-white/10 text-gray-400' : 'bg-[#fcf8f0] border-amber-200 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Protected Handwritten Study Notes • NST RUDRA</span>
              </div>
              {pdfUrl ? (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-500 hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Direct Open</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
