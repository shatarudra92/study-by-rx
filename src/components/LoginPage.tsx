import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Send,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  BookOpen,
  PlayCircle
} from 'lucide-react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from '../lib/firebase';
import { ThemeMode } from '../types';
import { TELEGRAM_LINK } from './TelegramModal';

interface LoginPageProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ theme, onToggleTheme }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isDark = theme === 'dark' || theme === 'cosmic-dark';

  const formatFirebaseError = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/unauthorized-domain':
        return `Domain Unauthorized: Yeh domain Firebase Console me authorized nahi hai. Firebase Console > Authentication > Settings > Authorized Domains me "${window.location.hostname}" add karein.`;
      case 'auth/invalid-email':
        return 'Kripya sahi email address daalein (Invalid email address).';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Galat email ya password. Kripya check karke dobara try karein.';
      case 'auth/email-already-in-use':
        return 'Yeh email pehle se registered hai. Kripya Sign In karein ya Forgot Password use karein.';
      case 'auth/weak-password':
        return 'Password kam se kam 6 characters ka hona chahiye.';
      case 'auth/popup-closed-by-user':
        return 'Google Sign-In popup band ho gaya. Kripya dobara click karein.';
      case 'auth/network-request-failed':
        return 'Internet connection check karein.';
      default:
        return err?.message || 'Authentication error. Kripya dobara try karein.';
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      setErrorMsg(formatFirebaseError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Kripya apna email address enter karein.');
      return;
    }

    if (mode === 'forgot') {
      setLoading(true);
      try {
        await sendPasswordResetEmail(auth, email.trim());
        setSuccessMsg(`Password reset link aapke email (${email}) par bhej diya gaya hai. Kripya inbox check karein.`);
      } catch (err: any) {
        setErrorMsg(formatFirebaseError(err));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password) {
      setErrorMsg('Kripya apna password enter karein.');
      return;
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setErrorMsg('Password kam se kam 6 characters ka hona chahiye.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords match nahi kar rahe hain. Kripya confirm karein.');
        return;
      }

      setLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (displayName.trim() && userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: displayName.trim()
          });
        }
      } catch (err: any) {
        setErrorMsg(formatFirebaseError(err));
      } finally {
        setLoading(false);
      }
    } else {
      // Sign in
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } catch (err: any) {
        setErrorMsg(formatFirebaseError(err));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors relative overflow-hidden ${
        isDark
          ? 'bg-[#060913] text-white selection:bg-amber-500/30'
          : 'bg-[#faf8f2] text-slate-800 selection:bg-amber-200'
      }`}
    >
      {/* Background Decorative Grid & Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-30 ${
            isDark ? 'bg-amber-600/30' : 'bg-amber-300/40'
          }`}
        />
        <div
          className={`absolute top-1/2 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            isDark ? 'bg-orange-600/30' : 'bg-orange-300/40'
          }`}
        />
        <div
          className={`absolute -bottom-20 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-25 ${
            isDark ? 'bg-amber-500/20' : 'bg-yellow-200/50'
          }`}
        />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Top Bar with Brand & Theme Toggle */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 p-[2px] shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div
              className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                isDark ? 'bg-[#0c1020]' : 'bg-[#fffef7]'
              }`}
            >
              <span className="text-xl">✍️</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg sm:text-xl tracking-tight font-handwriting">
                NST RUDRA
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-500 dark:text-amber-300">
                PORTAL
              </span>
            </div>
            <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-500'} font-medium`}>
              Official Handwritten Notes &amp; Video Classes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
              isDark
                ? 'bg-white/[0.06] hover:bg-white/[0.12] border-white/10 text-amber-300'
                : 'bg-amber-100/70 hover:bg-amber-100 border-amber-300 text-amber-700 shadow-sm'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </header>

      {/* Main Login Card Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`w-full max-w-md rounded-3xl border shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative ${
            isDark
              ? 'bg-[#0c1022]/90 border-amber-500/20 shadow-black/60'
              : 'bg-[#fffefb]/95 border-amber-200/90 shadow-amber-900/10'
          }`}
        >
          {/* Top Stamp / Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border border-amber-500/30 text-amber-500 dark:text-amber-300 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Authentication Gate</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-handwriting">
              {mode === 'signin' && 'Welcome to NST RUDRA'}
              {mode === 'signup' && 'Create Your Student Account'}
              {mode === 'forgot' && 'Reset Your Password'}
            </h1>
            <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              {mode === 'signin' && 'Sign in to access 30+ batches, handwritten notes & video classes.'}
              {mode === 'signup' && 'Register with your email to start studying with handwritten notes.'}
              {mode === 'forgot' && 'Enter your registered email to receive a password reset link.'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          {mode !== 'forgot' && (
            <div
              className={`grid grid-cols-2 p-1 rounded-2xl mb-6 border ${
                isDark ? 'bg-white/[0.04] border-white/10' : 'bg-amber-100/60 border-amber-200'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                    : isDark
                    ? 'text-gray-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In (लॉग इन)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                    : isDark
                    ? 'text-gray-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                New Account (रजिस्टर)
              </button>
            </div>
          )}

          {/* Error / Success Notifications */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{errorMsg}</span>
              </motion.div>
            )}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Sign-In Button */}
          {mode !== 'forgot' && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className={`w-full py-3 px-4 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm ${
                  isDark
                    ? 'bg-white/[0.06] hover:bg-white/[0.12] border-white/15 text-white active:scale-[0.99]'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 active:scale-[0.99]'
                }`}
                id="google-signin-btn"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Continue with Google (गूगल से लॉग इन)</span>
              </button>

              <div className="my-5 flex items-center gap-3">
                <div className={`flex-1 h-[1px] ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                  या Email से
                </span>
                <div className={`flex-1 h-[1px] ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                  Full Name (पूरा नाम)
                </label>
                <div className="relative">
                  <User className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm border outline-none transition-all ${
                      isDark
                        ? 'bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.1] border-white/10 focus:border-amber-400 text-white placeholder:text-gray-500'
                        : 'bg-white hover:bg-amber-50/40 focus:bg-white border-amber-200 focus:border-amber-500 text-slate-800 placeholder:text-slate-400 shadow-inner'
                    }`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                Email Address (ईमेल)
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-slate-400'}`} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@gmail.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm border outline-none transition-all ${
                    isDark
                      ? 'bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.1] border-white/10 focus:border-amber-400 text-white placeholder:text-gray-500'
                      : 'bg-white hover:bg-amber-50/40 focus:bg-white border-amber-200 focus:border-amber-500 text-slate-800 placeholder:text-slate-400 shadow-inner'
                  }`}
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                    Password (पासवर्ड)
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-[11px] font-bold text-amber-500 hover:text-amber-400 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-slate-400'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-2xl text-xs sm:text-sm border outline-none transition-all ${
                      isDark
                        ? 'bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.1] border-white/10 focus:border-amber-400 text-white placeholder:text-gray-500'
                        : 'bg-white hover:bg-amber-50/40 focus:bg-white border-amber-200 focus:border-amber-500 text-slate-800 placeholder:text-slate-400 shadow-inner'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                  Confirm Password (पासवर्ड कन्फर्म करें)
                </label>
                <div className="relative">
                  <KeyRound className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-slate-400'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm border outline-none transition-all ${
                      isDark
                        ? 'bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.1] border-white/10 focus:border-amber-400 text-white placeholder:text-gray-500'
                        : 'bg-white hover:bg-amber-50/40 focus:bg-white border-amber-200 focus:border-amber-500 text-slate-800 placeholder:text-slate-400 shadow-inner'
                    }`}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full mt-2 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50"
              id="submit-auth-btn"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'signin' && 'Sign In to Portal (पोर्टल खोलें)'}
                    {mode === 'signup' && 'Complete Registration (खाता बनाएं)'}
                    {mode === 'forgot' && 'Send Reset Email (लिंक भेजें)'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Forgot Password back link */}
          {mode === 'forgot' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-xs font-bold text-amber-500 hover:text-amber-400 hover:underline cursor-pointer"
              >
                ← Back to Sign In (लॉग इन पर वापस जाएं)
              </button>
            </div>
          )}

          {/* Feature Highlights beneath form */}
          <div className={`mt-6 pt-4 border-t ${isDark ? 'border-white/10' : 'border-amber-200/70'} grid grid-cols-2 gap-2 text-[11px]`}>
            <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Anti-Inspect Secured</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-500 font-bold">
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>30+ Human Batches</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-75">
        <p className="font-handwriting">NST RUDRA © 2026 • Live Classes &amp; Handwritten Notes</p>
        <a
          href={TELEGRAM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-bold"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Telegram: @NST_XY_09</span>
        </a>
      </footer>
    </div>
  );
};
