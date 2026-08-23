import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Heart,
  Copy,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Award,
  Zap,
  Coffee,
  Download,
  Share2
} from 'lucide-react';
import { ThemeMode } from '../types';

export const UPI_ID = 'ushadevi221204@oksbi';
export const PAYEE_NAME = 'SHATARUDRA PRAKASH SINGH';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: ThemeMode;
  onToast?: (msg: string, type: 'success' | 'warning' | 'error' | 'security' | 'info') => void;
}

const PRESET_AMOUNTS = [
  { amount: 21, label: '₹21', sub: 'Shagun' },
  { amount: 51, label: '₹51', sub: 'Chai & Notes' },
  { amount: 101, label: '₹101', sub: 'Server Boost' },
  { amount: 251, label: '₹251', sub: 'Study Sponsor' },
  { amount: 501, label: '₹501', sub: 'Top Supporter' }
];

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark',
  onToast
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(51);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const isDark = theme === 'dark' || theme === 'cosmic-dark';

  const effectiveAmount = isCustom
    ? parseFloat(customAmount) || 0
    : selectedAmount || 0;

  // Build UPI deep link
  const upiPayUrl = React.useMemo(() => {
    let url = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
      PAYEE_NAME
    )}&cu=INR&tn=${encodeURIComponent('Support NST RUDRA Portal')}`;
    if (effectiveAmount > 0) {
      url += `&am=${effectiveAmount.toFixed(2)}`;
    }
    return url;
  }, [effectiveAmount]);

  const handleCopyUpi = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(UPI_ID);
      } else {
        const input = document.createElement('input');
        input.value = UPI_ID;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      if (onToast) {
        onToast(`UPI ID copied: ${UPI_ID} 📋`, 'success');
      }
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.error(e);
      if (onToast) onToast('Failed to copy. Please manually copy: ' + UPI_ID, 'warning');
    }
  };

  const handlePayViaApp = () => {
    try {
      window.location.href = upiPayUrl;
    } catch (e) {
      console.error(e);
    }
  };

  const handleClose = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem('nst_rudra_hide_donation_prompt', 'true');
      } catch (e) {
        console.error(e);
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden my-auto ${
            isDark
              ? 'bg-[#0e1322] border-amber-500/30 text-white shadow-amber-950/40'
              : 'bg-[#fffefb] border-amber-300 text-slate-800 shadow-amber-950/20'
          }`}
        >
          {/* Top Decorative Header */}
          <div className="relative p-5 sm:p-6 pb-4 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border-b border-current/10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-[2px] shadow-lg shadow-amber-500/30 shrink-0">
                  <div
                    className={`w-full h-full rounded-[14px] flex items-center justify-center text-xl ${
                      isDark ? 'bg-[#0c1020]' : 'bg-[#fffef7]'
                    }`}
                  >
                    ❤️
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-500 dark:text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Voluntary Support</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified UPI
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-handwriting mt-1 text-amber-500 dark:text-amber-400">
                    NST RUDRA Support &amp; Donation
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className={`p-2 rounded-2xl border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                    : 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900'
                }`}
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-xs mt-2.5 leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              🙏 प्यारे छात्रों, इस पोर्टल को तेज़, सुरक्षित, विज्ञापन-मुक्त और हमेशा सुलभ रखने के लिए
              अपनी स्वेच्छा से छोटा सा सहयोग जरूर करें।
            </p>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* QR Code Presentation Box */}
            <div
              className={`rounded-3xl p-4 sm:p-5 border text-center shadow-lg relative ${
                isDark
                  ? 'bg-[#151b2e] border-white/10 shadow-black/40'
                  : 'bg-white border-amber-200/80 shadow-amber-900/5'
              }`}
            >
              {/* Payee Name Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/10 dark:bg-white/10 text-xs font-black tracking-wide mb-3">
                <span>📖</span>
                <span className="uppercase">{PAYEE_NAME}</span>
              </div>

              {/* QR Code Render */}
              <div className="inline-block p-3.5 bg-white rounded-2xl border-2 border-amber-500/40 shadow-xl shadow-amber-500/10 mx-auto relative group">
                <QRCodeSVG
                  value={upiPayUrl}
                  size={190}
                  level="H"
                  includeMargin={true}
                  bgColor="#FFFFFF"
                  fgColor="#0a0e1a"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center p-1">
                    <span className="text-base font-black">GPay</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mt-2">
                Scan with GPay, PhonePe, Paytm, BHIM, Cred or any UPI App
              </p>

              {/* UPI ID Copy Bar */}
              <div
                onClick={handleCopyUpi}
                className={`mt-3.5 p-2.5 sm:p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                  isDark
                    ? 'bg-black/30 hover:bg-black/50 border-amber-500/30 text-amber-300'
                    : 'bg-amber-50/80 hover:bg-amber-100 border-amber-300 text-amber-950'
                }`}
                title="Click to copy UPI ID"
              >
                <div className="flex items-center gap-2 min-w-0 text-left">
                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500">
                    UPI ID
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-black truncate">{UPI_ID}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyUpi();
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all ${
                    copied
                      ? 'bg-emerald-500 text-white'
                      : isDark
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Amount Selectors */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2 text-amber-500 dark:text-amber-400">
                Choose Contribution Amount:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {PRESET_AMOUNTS.map((item) => (
                  <button
                    key={item.amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(item.amount);
                      setIsCustom(false);
                    }}
                    className={`py-2 px-2 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      !isCustom && selectedAmount === item.amount
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 font-black shadow-lg shadow-amber-500/30 scale-[1.02]'
                        : isDark
                        ? 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                        : 'bg-white hover:bg-amber-50 border-amber-200 text-slate-800'
                    }`}
                  >
                    <span className="text-sm font-black">{item.label}</span>
                    <span className="text-[9px] opacity-80 leading-tight">{item.sub}</span>
                  </button>
                ))}
              </div>

              {/* Custom Amount option */}
              <div className="mt-2.5 flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Custom Amount (₹)"
                  value={customAmount}
                  onFocus={() => setIsCustom(true)}
                  onChange={(e) => {
                    setIsCustom(true);
                    setCustomAmount(e.target.value);
                  }}
                  className={`flex-1 px-3.5 py-2 rounded-2xl border text-xs font-bold outline-none transition-all ${
                    isCustom
                      ? 'border-amber-500 ring-2 ring-amber-500/30'
                      : isDark
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-white border-amber-200 text-slate-800'
                  }`}
                />
                <button
                  type="button"
                  onClick={handlePayViaApp}
                  className="py-2 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Pay with App</span>
                </button>
              </div>
            </div>

            {/* Why Support Matters */}
            <div
              className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                isDark ? 'bg-white/[0.03] border-white/10 text-gray-300' : 'bg-amber-50/50 border-amber-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 font-black text-amber-500 text-[11px] uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" />
                <span>आपका सहयोग कहाँ इस्तेमाल होगा?</span>
              </div>
              <ul className="space-y-1.5 text-[11px] list-disc list-inside opacity-90 leading-relaxed">
                <li>हाई-स्पीड क्लाउड सर्वर और लाइव स्ट्रीम बैंडविड्थ का खर्च</li>
                <li>हस्तलिखित टॉपर्स नोट्स, फॉर्मूला शीट्स और टेस्ट सीरीज़ का निर्माण</li>
                <li>पोर्टल को 100% विज्ञापन-मुक्त (Ad-Free) और विद्यार्थियों के लिए सुगम बनाए रखना</li>
              </ul>
            </div>

            {/* Footer Action Controls */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-current/10">
              <label className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="rounded border-gray-400 text-amber-500 focus:ring-amber-500"
                />
                <span>Don&apos;t show again on next login</span>
              </label>

              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto py-2.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
              >
                आगे बढ़ें / Continue to Portal →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
