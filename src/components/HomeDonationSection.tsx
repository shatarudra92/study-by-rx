import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Heart,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Zap,
  Coffee,
  CheckCircle2
} from 'lucide-react';
import { ThemeMode } from '../types';
import { UPI_ID, PAYEE_NAME } from './DonationModal';

interface HomeDonationSectionProps {
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

export const HomeDonationSection: React.FC<HomeDonationSectionProps> = ({
  theme = 'dark',
  onToast
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(51);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);

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

  return (
    <section id="donation-section" className="max-w-7xl mx-auto px-4 sm:px-6">
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 border transition-all duration-300 ${
          isDark
            ? 'bg-gradient-to-br from-[#0c1228] via-[#101732] to-[#0a0f22] border-amber-500/25 shadow-2xl shadow-black/60 text-slate-100'
            : 'bg-gradient-to-br from-[#fffef7] via-[#fffbf0] to-[#fff6e6] border-amber-300 shadow-xl shadow-amber-900/5 text-slate-900'
        }`}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/15 via-rose-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/10 via-amber-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Context & UPI Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-500/20 via-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                <span>SUPPORT FREE EDUCATION • स्वेच्छा दान / सहयोग</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-handwriting leading-tight">
                Help Us Keep NST RUDRA Free &amp; Ad-Free for All Students ❤️
              </h2>

              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Aapke chhote se yogdan (₹21, ₹51, ₹101) se hamare high-speed video servers, 
                handwritten notes hosting aur study platform ki maintenance smooth chalti rehti hai. 
                GPay, PhonePe, Paytm ya kisi bhi UPI app se direct scan karke support kar sakte hain.
              </p>
            </div>

            {/* Quick Preset Amount Chips */}
            <div className="space-y-2.5">
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Choose Support Amount (राशि चुनें)
              </span>
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {PRESET_AMOUNTS.map((p) => {
                  const isSelected = !isCustom && selectedAmount === p.amount;
                  return (
                    <button
                      key={p.amount}
                      type="button"
                      onClick={() => {
                        setIsCustom(false);
                        setSelectedAmount(p.amount);
                      }}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/25 scale-[1.03]'
                          : isDark
                          ? 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
                          : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-50'
                      }`}
                    >
                      <span className="text-sm font-black">{p.label}</span>
                      <span className="text-[9px] opacity-80">{p.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payee Info Card & 1-Click Copy */}
            <div
              className={`p-4 rounded-2xl border space-y-3 ${
                isDark ? 'bg-[#060913]/70 border-white/10' : 'bg-white border-amber-200/80 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Official Verified Payee
                  </div>
                  <div className="text-sm font-black text-amber-400 flex items-center gap-1.5">
                    <span>{PAYEE_NAME}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Direct UPI App Support
                  </div>
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <span>GPay • PhonePe • Paytm • BHIM</span>
                  </div>
                </div>
              </div>

              {/* UPI ID Copy Field */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex-1 px-3 py-2 rounded-xl border font-mono text-xs select-all font-bold flex items-center justify-between ${
                    isDark ? 'bg-black/40 border-white/10 text-amber-300' : 'bg-amber-50/50 border-amber-200 text-amber-950'
                  }`}
                >
                  <span className="truncate">{UPI_ID}</span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-sm shrink-0 active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy UPI ID</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Instant App Pay button on Mobile */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePayViaApp}
                className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Smartphone className="w-4 h-4" />
                <span>Pay ₹{effectiveAmount > 0 ? effectiveAmount : 51} via UPI App (Direct)</span>
              </button>
            </div>
          </div>

          {/* Right Column: High Resolution Dynamic QR Code Box */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div
              className={`p-6 rounded-3xl border text-center shadow-2xl relative max-w-sm w-full transition-all ${
                isDark
                  ? 'bg-[#060913] border-amber-500/30 shadow-amber-500/5'
                  : 'bg-white border-amber-300 shadow-amber-900/10'
              }`}
            >
              {/* Header inside QR Card */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-lg">⚡</span>
                <span className="text-xs font-black tracking-wider uppercase text-amber-500">
                  Scan with any UPI App
                </span>
              </div>

              {/* QR Container */}
              <div className="p-4 rounded-2xl bg-white shadow-inner inline-block mx-auto border-2 border-amber-400/40">
                <QRCodeSVG
                  value={upiPayUrl}
                  size={190}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png',
                    x: undefined,
                    y: undefined,
                    height: 32,
                    width: 32,
                    excavate: true
                  }}
                />
              </div>

              {/* Scan Amount text */}
              <div className="mt-3.5 space-y-1">
                <div className="text-base font-black text-amber-500">
                  ₹{effectiveAmount > 0 ? effectiveAmount : 51} INR
                </div>
                <p className="text-[11px] text-slate-400">
                  PhonePe • Google Pay • Paytm • Amazon Pay • BHIM
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-center gap-2 text-[10px] text-emerald-500 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Direct &amp; Secure UPI Transfer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeDonationSection;
