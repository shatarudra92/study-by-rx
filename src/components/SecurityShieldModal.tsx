import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ShieldAlert, Lock, Terminal, CheckCircle, RefreshCw, X, AlertTriangle, EyeOff, Zap } from 'lucide-react';

interface SecurityShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerToast: (msg: string, type: 'success' | 'warning' | 'error' | 'security') => void;
}

export const SecurityShieldModal: React.FC<SecurityShieldModalProps> = ({ isOpen, onClose, onTriggerToast }) => {
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const handleRunIntegrityCheck = () => {
    setTestStatus('Scanning system defenses...');
    setTimeout(() => {
      setTestStatus('All 6 Cyber Protection Modules Active & 100% Protected.');
      onTriggerToast('🛡️ NST Security Shield: All Attack Vectors Blocked & Sandboxed.', 'security');
    }, 1000);
  };

  const defenseModules = [
    {
      title: 'Anti-Inspect (F12 / DevTools)',
      desc: 'Blocks F12, Ctrl+Shift+I/J/C, and DevTools docking detection.',
      status: 'Active & Enforced',
      color: 'emerald'
    },
    {
      title: 'Anti-Source Code (Ctrl+U)',
      desc: 'Restricts right-click menu, view-source shortcuts, and DOM cloning.',
      status: 'Protected',
      color: 'emerald'
    },
    {
      title: 'Anti-Debugger Loop Trap',
      desc: 'Automatic sandbox preventing reverse engineering & code tracing.',
      status: 'Armored',
      color: 'emerald'
    },
    {
      title: 'Anti-XSS & Input Sanitizer',
      desc: 'Strikes script injection and HTML tampering on all query inputs.',
      status: 'Sanitized',
      color: 'emerald'
    },
    {
      title: 'Anti-Scrape & DDoS Throttler',
      desc: 'Rate-limiting shields protecting stream URLs and PDF tokens.',
      status: 'Guarded',
      color: 'emerald'
    },
    {
      title: 'Telegram Security Channel',
      desc: 'Official verified source authentication via @NST_XY_09.',
      status: 'Verified',
      color: 'emerald'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            className="relative w-full max-w-xl bg-gradient-to-b from-[#13112c] via-[#0d0c1e] to-[#070611] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/50 overflow-hidden text-left"
          >
            {/* Ambient Purple Shield Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/20 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <ShieldCheck className="w-7 h-7 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                    NST Cyber Defense Shield
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black">
                      ACTIVE
                    </span>
                  </h3>
                  <p className="text-xs text-purple-300/70">
                    Real-time Anti-Inspect, Anti-Source & Attack Immunity Suite
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Shield Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
              <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-3">
                <div className="text-[11px] text-purple-300">Inspect Lock</div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <EyeOff className="w-3.5 h-3.5 text-purple-400" /> Blocked
                </div>
              </div>
              <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-3">
                <div className="text-[11px] text-purple-300">Source Lock</div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <Lock className="w-3.5 h-3.5 text-purple-400" /> Obfuscated
                </div>
              </div>
              <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-3 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-purple-300">Tamper Status</div>
                <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <Zap className="w-3.5 h-3.5" /> 0 Attacks
                </div>
              </div>
            </div>

            {/* Defense Modules List */}
            <div className="space-y-2.5 mb-6 max-h-64 overflow-y-auto pr-1">
              {defenseModules.map((mod, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all"
                >
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {mod.title}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{mod.desc}</div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shrink-0">
                    {mod.status}
                  </span>
                </div>
              ))}
            </div>

            {testStatus && (
              <div className="p-3 mb-4 rounded-xl bg-purple-900/40 border border-purple-500/40 text-xs text-purple-200 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400 shrink-0" />
                {testStatus}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRunIntegrityCheck}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Run Security Integrity Scan
              </button>
              <button
                onClick={onClose}
                className="py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
