import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ShieldCheck,
  Send,
  Sun,
  Moon,
  Sparkles,
  Menu,
  X,
  BookOpen,
  Radio,
  CheckCircle,
  ExternalLink,
  PenTool,
  Bookmark,
  PlayCircle,
  LogOut,
  User as UserIcon,
  WifiOff,
  Heart
} from 'lucide-react';
import { ThemeMode } from '../types';
import { TELEGRAM_LINK } from './TelegramModal';
import { User } from '../lib/firebase';
import { NotificationBell } from './NotificationBell';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSecurityModal: () => void;
  onOpenTelegramModal: () => void;
  onOpenStreamModal?: () => void;
  onOpenDonationModal?: () => void;
  onOpenNotes?: () => void;
  onOpenLogin?: () => void;
  enrolledCount: number;
  onSelectFilter: (cat: string) => void;
  activeFilter: string;
  user?: User | null;
  onLogout?: () => void;
  isOnline?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  searchQuery,
  onSearchChange,
  onOpenSecurityModal,
  onOpenTelegramModal,
  onOpenStreamModal,
  onOpenDonationModal,
  onOpenNotes,
  onOpenLogin,
  enrolledCount,
  onSelectFilter,
  activeFilter,
  user,
  onLogout,
  isOnline = true
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isDark = theme === 'dark' || theme === 'cosmic-dark';

  return (
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors ${
        isDark
          ? 'bg-[#080c18]/90 border-amber-500/15 shadow-lg shadow-black/40 text-white'
          : 'bg-[#fffdfa]/90 border-amber-200 shadow-md shadow-amber-950/5 text-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Left: NST RUDRA Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 p-[2px] shadow-lg shadow-amber-500/25 flex items-center justify-center">
            <div
              className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                isDark ? 'bg-[#0d1222]' : 'bg-[#fffef7]'
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
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-500 dark:text-amber-300">
                NOTES &amp; VOD
              </span>
              {!isOnline && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-500 animate-pulse">
                  <WifiOff className="w-2.5 h-2.5" />
                  <span>OFFLINE</span>
                </span>
              )}
            </div>
            <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-500'} font-medium tracking-wide`}>
              Human Notes • Live Study Portal
            </p>
          </div>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <Search
            className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
              isDark ? 'text-amber-400' : 'text-amber-600'
            }`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search 30+ handwritten notes, SSC, Railway, Maths batches..."
            className={`w-full pl-10 pr-4 py-2 rounded-2xl text-xs sm:text-sm border outline-none transition-all ${
              isDark
                ? 'bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.1] border-amber-500/20 focus:border-amber-400 text-white placeholder:text-gray-400'
                : 'bg-amber-50/60 hover:bg-amber-50 focus:bg-white border-amber-200 focus:border-amber-500 text-slate-800 placeholder:text-slate-400 shadow-inner'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Voluntary Donation / Support CTA */}
          {onOpenDonationModal && (
            <button
              onClick={onOpenDonationModal}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ${
                isDark
                  ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-amber-500/40 text-amber-300 shadow-amber-950/20'
                  : 'bg-gradient-to-r from-amber-100 to-rose-100 hover:from-amber-200 hover:to-rose-200 border border-amber-300 text-amber-950 shadow-amber-950/5'
              }`}
              title="Support NST RUDRA Study Portal"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
              <span className="hidden sm:inline">Donate / सहयोग</span>
            </button>
          )}

          {/* Security Shield Indicator */}
          <button
            onClick={onOpenSecurityModal}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isDark
                ? 'bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
                : 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700'
            }`}
            title="View Security Protection Status"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Anti-Inspect Shield</span>
          </button>

          {/* Telegram Channel CTA */}
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 py-2 px-3.5 rounded-2xl bg-gradient-to-r from-[#0088cc] via-[#29b6f6] to-[#0288d1] hover:shadow-lg hover:shadow-sky-500/30 text-white text-xs font-extrabold transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>@NST_XY_09</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>

          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
              isDark
                ? 'bg-white/[0.06] hover:bg-white/[0.12] border-white/10 text-amber-300 shadow-inner'
                : 'bg-amber-100/70 hover:bg-amber-100 border-amber-300 text-amber-700 shadow-sm'
            }`}
            title={isDark ? 'Switch to Notebook Light Mode' : 'Switch to Slate Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 transition-transform -rotate-12 hover:rotate-0" />
            )}
          </button>

          {/* Study Material & Live Alerts Notification Bell */}
          <NotificationBell theme={theme} onOpenNotes={onOpenNotes} />

          {/* User Profile or Optional Login Button (Desktop) */}
          {user ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-2 py-1.5 px-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-white/[0.06] hover:bg-white/[0.12] border-amber-500/20 text-white'
                    : 'bg-white hover:bg-amber-50 border-amber-200 text-slate-800 shadow-sm'
                }`}
                title="Student Profile"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-6 h-6 rounded-full object-cover border border-amber-500/40"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-xs">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-bold max-w-[100px] truncate">
                  {user.displayName || user.email?.split('@')[0] || 'Student'}
                </span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 mt-2 w-60 rounded-2xl border shadow-2xl p-3 z-50 backdrop-blur-xl ${
                      isDark
                        ? 'bg-[#0d1224]/95 border-white/15 shadow-black/80 text-white'
                        : 'bg-white/95 border-amber-200 shadow-amber-950/10 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 pb-3 border-b border-current/10">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || 'User'}
                          className="w-9 h-9 rounded-full object-cover border border-amber-500/40"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-sm">
                          {(user.displayName || user.email || 'U')[0].toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black truncate">{user.displayName || 'Student'}</p>
                        <p className={`text-[11px] truncate ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 space-y-1">
                      {onOpenDonationModal && (
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onOpenDonationModal();
                          }}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                            isDark
                              ? 'text-amber-300 hover:bg-amber-500/10'
                              : 'text-amber-900 hover:bg-amber-100'
                          }`}
                        >
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                          <span>Donate / Support Portal ❤️</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          if (onLogout) onLogout();
                        }}
                        className="w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-2 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out (लॉग आउट)</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            onOpenLogin && (
              <button
                onClick={onOpenLogin}
                className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Student Login</span>
              </button>
            )
          )}

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden w-10 h-10 rounded-2xl bg-white/[0.05] border border-current/10 flex items-center justify-center opacity-80 hover:opacity-100"
            aria-label="Search Toggle"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-2xl bg-white/[0.05] border border-current/10 flex items-center justify-center opacity-80 hover:opacity-100 cursor-pointer"
            aria-label="Menu Toggle"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden px-4 pb-3 pt-1 border-t ${
              isDark ? 'border-white/10 bg-[#0c1020]' : 'border-amber-200 bg-[#fffef9]'
            }`}
          >
            <div className="relative">
              <Search className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search batches, teachers, topics..."
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border outline-none ${
                  isDark
                    ? 'bg-black/30 border-white/10 text-white placeholder:text-gray-500'
                    : 'bg-white border-amber-200 text-slate-800 placeholder:text-slate-400'
                }`}
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden px-4 py-4 border-t space-y-3 ${
              isDark ? 'border-white/10 bg-[#0a0e1c]' : 'border-amber-200 bg-[#fffdf7]'
            }`}
          >
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => {
                  onSelectFilter('all');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 rounded-xl text-left border ${
                  activeFilter === 'all'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-white/5 border-current/10'
                }`}
              >
                📚 All Batches
              </button>
              <button
                onClick={() => {
                  onSelectFilter('ssc');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 rounded-xl text-left border ${
                  activeFilter === 'ssc'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-white/5 border-current/10'
                }`}
              >
                🏛️ SSC CGL &amp; CHSL
              </button>
              <button
                onClick={() => {
                  onSelectFilter('railway');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 rounded-xl text-left border ${
                  activeFilter === 'railway'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-white/5 border-current/10'
                }`}
              >
                🚆 Railway NTPC/ALP
              </button>
              <button
                onClick={() => {
                  onSelectFilter('maths');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 rounded-xl text-left border ${
                  activeFilter === 'maths'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-white/5 border-current/10'
                }`}
              >
                📐 Maths Special
              </button>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-amber-100/50 border-amber-200'
                }`}>
                  <div className="flex items-center gap-2 min-w-0">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-7 h-7 rounded-full object-cover border border-amber-500/40 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-xs shrink-0">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-black truncate">{user.displayName || 'Student'}</p>
                      <p className={`text-[10px] truncate ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onLogout) onLogout();
                    }}
                    className="py-1 px-2.5 rounded-lg text-xs font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors shrink-0"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                onOpenLogin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Student Login / Account</span>
                  </button>
                )
              )}

              {onOpenDonationModal && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDonationModal();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-slate-950" />
                  <span>Support &amp; Donate / सहयोग (QR)</span>
                </button>
              )}

              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Join Official Telegram @NST_XY_09</span>
              </a>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  onClick={onToggleTheme}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-white/10 border border-current/10 font-semibold"
                >
                  {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{isDark ? 'Light Paper' : 'Dark Slate'}</span>
                </button>

                <button
                  onClick={() => {
                    onOpenSecurityModal();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 text-emerald-500 font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Security Status</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
