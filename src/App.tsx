import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Radio,
  PlayCircle,
  CheckCircle,
  Search,
  Send,
  ShieldCheck,
  Shield,
  Layers,
  ArrowUp,
  ExternalLink,
  BookOpen,
  Award,
  Lock,
  PenTool,
  Tv,
  FileText,
  BookmarkCheck,
  Sun,
  Moon
} from 'lucide-react';
import { BatchCourse, ThemeMode, Mp4Recording } from './types';
import { fetchAllCourses } from './services/api';
import { initSecurityProtection } from './utils/security';
import { auth, onAuthStateChanged, signOut, User } from './lib/firebase';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { BatchCard } from './components/BatchCard';
import { BatchDetailView } from './components/BatchDetailView';
import { TelegramModal, TELEGRAM_LINK } from './components/TelegramModal';
import { FloatingTelegram } from './components/FloatingTelegram';
import { SecurityShieldModal } from './components/SecurityShieldModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { HandwrittenNotesPad } from './components/HandwrittenNotesPad';
import { StreamUrlModal } from './components/StreamUrlModal';
import { DonationModal } from './components/DonationModal';
import { HomeDonationSection } from './components/HomeDonationSection';
import { ToastContainer, ToastMessage } from './components/Toast';
import { NetworkStatusIndicator, useNetworkStatus } from './components/NetworkStatusIndicator';

const ENROLLED_STORAGE_KEY = 'nst_rudra_enrolled_batches_v1';
const THEME_STORAGE_KEY = 'nst_rudra_theme_mode';
const STICKERS_STORAGE_KEY = 'nst_rudra_pinned_stickers_v1';

const CATEGORIES = [
  { id: 'all', label: 'All Batches', icon: '📚', count: 32 },
  { id: 'ssc', label: 'SSC CGL & CHSL', icon: '🏛️' },
  { id: 'railway', label: 'Railway NTPC/ALP', icon: '🚆' },
  { id: 'maths', label: 'Maths Special', icon: '📐' },
  { id: 'english', label: 'English Special', icon: '📝' },
  { id: 'reasoning', label: 'Reasoning Hub', icon: '🧠' },
  { id: 'gs', label: 'GS & Science', icon: '🔬' },
  { id: 'state', label: 'State & Police', icon: '🛡️' }
];

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Network Status
  const { isOnline } = useNetworkStatus();

  // State
  const [courses, setCourses] = useState<BatchCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<BatchCourse | null>(null);
  const [showNotesPad, setShowNotesPad] = useState(false);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      addToast('Aap successfully log out ho gaye hain. ✍️', 'warning');
    } catch (err) {
      console.error('Logout error:', err);
      addToast('Log out mein problem aayi.', 'error');
    }
  };

  const [enrolledIds, setEnrolledIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(ENROLLED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pinnedStickers, setPinnedStickers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STICKERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handlePinSticker = (batchId: string, stickerId: string | null) => {
    setPinnedStickers((prev) => {
      const updated = { ...prev };
      if (!stickerId) {
        delete updated[batchId];
        addToast('Sticker unpinned from batch', 'warning');
      } else {
        updated[batchId] = stickerId;
        addToast('Handwritten sticker pinned to batch! 📌', 'success');
      }
      try {
        localStorage.setItem(STICKERS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
      return saved === 'light' || saved === 'dark' ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  // Apply theme to document root
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.body.className = 'bg-[#fbf9f4] text-slate-800 antialiased selection:bg-amber-400 selection:text-slate-900 overflow-x-hidden min-h-screen';
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        document.body.className = 'bg-[#070a14] text-[#e8ebf8] antialiased selection:bg-amber-400 selection:text-slate-900 overflow-x-hidden min-h-screen';
      }
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' || prev === 'cosmic-dark' ? 'light' : 'dark'));
  };

  // Modals & Popups
  const [telegramModalOpen, setTelegramModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [streamUrlModalOpen, setStreamUrlModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<{ url: string; title: string; qualities?: Mp4Recording[] }>({
    url: '',
    title: ''
  });
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [currentPdf, setCurrentPdf] = useState<{ url: string; title: string }>({ url: '', title: '' });

  // Auto-show Donation QR Modal once after user logs in
  useEffect(() => {
    if (currentUser) {
      const hidePermanent = localStorage.getItem('nst_rudra_hide_donation_prompt');
      const shownThisSession = sessionStorage.getItem('nst_rudra_shown_donation_session');
      if (!hidePermanent && !shownThisSession) {
        const timer = setTimeout(() => {
          setDonationModalOpen(true);
          sessionStorage.setItem('nst_rudra_shown_donation_session', 'true');
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [currentUser]);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    text: string,
    type: ToastMessage['type'] = 'success'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Initialize Anti-Inspect and Security Protection
  useEffect(() => {
    const cleanupSecurity = initSecurityProtection((msg, type) => {
      addToast(msg, type === 'blocked' ? 'security' : 'warning');
    });

    return () => {
      cleanupSecurity();
    };
  }, []);

  // 2. Fetch courses on initial mount
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchAllCourses()
      .then((data) => {
        if (isMounted) {
          setCourses(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load courses:', err);
        if (isMounted) setLoading(false);
      });

    // Auto-show Telegram modal on first load after 2 seconds
    const hasSeenTelegram = sessionStorage.getItem('nst_rudra_seen_telegram');
    if (!hasSeenTelegram) {
      const timer = setTimeout(() => {
        setTelegramModalOpen(true);
        sessionStorage.setItem('nst_rudra_seen_telegram', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync enrolled IDs to LocalStorage
  const handleToggleEnroll = (batch: BatchCourse) => {
    const isAlready = enrolledIds.includes(batch.id);
    let updated: string[];
    if (isAlready) {
      updated = enrolledIds.filter((id) => id !== batch.id);
      addToast(`Unenrolled from "${batch.title}"`, 'warning');
    } else {
      updated = [...enrolledIds, batch.id];
      addToast(`Enrolled in "${batch.title}"! Study materials unlocked. ✍️`, 'success');
    }
    setEnrolledIds(updated);
    try {
      localStorage.setItem(ENROLLED_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save enrollment:', e);
    }
  };

  // Filtered & Searched courses
  const filteredCourses = useMemo(() => {
    let result = courses;

    if (activeFilter !== 'all') {
      if (activeFilter === 'enrolled') {
        result = result.filter((c) => enrolledIds.includes(c.id));
      } else if (activeFilter === 'stickers') {
        result = result.filter((c) => Boolean(pinnedStickers[c.id]));
      } else {
        result = result.filter((c) => {
          const categoryStr = typeof c.category === 'string' ? c.category : (c.category as any)?.name || '';
          if (categoryStr === activeFilter) return true;
          const title = String(c.title || '').toLowerCase();
          if (activeFilter === 'ssc' && (title.includes('ssc') || title.includes('cgl') || title.includes('chsl') || title.includes('cpo') || title.includes('mts'))) return true;
          if (activeFilter === 'railway' && (title.includes('railway') || title.includes('ntpc') || title.includes('alp') || title.includes('group d') || title.includes('technician'))) return true;
          if (activeFilter === 'maths' && (title.includes('math') || title.includes('arithmetic') || title.includes('advanced'))) return true;
          if (activeFilter === 'english' && (title.includes('english') || title.includes('grammar') || title.includes('vocab') || title.includes('comprehension'))) return true;
          if (activeFilter === 'reasoning' && (title.includes('reasoning') || title.includes('logical') || title.includes('verbal'))) return true;
          if (activeFilter === 'gs' && (title.includes('gs') || title.includes('science') || title.includes('gk') || title.includes('history') || title.includes('polity') || title.includes('geography'))) return true;
          if (activeFilter === 'state' && (title.includes('police') || title.includes('state') || title.includes('si') || title.includes('constable') || title.includes('patwari') || title.includes('rpf'))) return true;
          return false;
        });
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((c) => {
        const titleStr = String(c.title || '').toLowerCase();
        const descStr = String(c.short_description || '').toLowerCase();
        const teacherStr = String(c.facultyDetails?.name || '').toLowerCase();
        return (
          titleStr.includes(q) ||
          descStr.includes(q) ||
          teacherStr.includes(q)
        );
      });
    }

    return result;
  }, [courses, activeFilter, searchQuery, enrolledIds, pinnedStickers]);

  const liveCount = useMemo(() => courses.filter((c) => c.isLive).length, [courses]);
  const isDark = theme === 'dark' || theme === 'cosmic-dark';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark ? 'bg-[#070a14] text-[#e8ebf8]' : 'bg-[#fbf9f4] text-slate-800'
      }`}
    >
      {/* Network Status Indicator (Subtle offline banner & feature availability) */}
      <NetworkStatusIndicator theme={theme} onToast={addToast} />

      {/* 1. Global Navigation Bar */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSecurityModal={() => setSecurityModalOpen(true)}
        onOpenTelegramModal={() => setTelegramModalOpen(true)}
        onOpenStreamModal={() => setStreamUrlModalOpen(true)}
        onOpenDonationModal={() => setDonationModalOpen(true)}
        onOpenNotes={() => setShowNotesPad(true)}
        onOpenLogin={() => setLoginModalOpen(true)}
        enrolledCount={enrolledIds.length}
        onSelectFilter={setActiveFilter}
        activeFilter={activeFilter}
        user={currentUser}
        onLogout={handleLogout}
        isOnline={isOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {selectedBatch ? (
          /* 2. Detailed Single Batch View */
          <BatchDetailView
            batch={selectedBatch}
            isEnrolled={enrolledIds.includes(selectedBatch.id)}
            theme={theme}
            pinnedStickerId={pinnedStickers[selectedBatch.id]}
            onPinSticker={handlePinSticker}
            onBack={() => setSelectedBatch(null)}
            onToggleEnroll={handleToggleEnroll}
            onOpenVideo={(url, title, qualities) => {
              if (!isOnline) {
                addToast('⚡ Offline Mode: Video streams require internet. Connect to WiFi or data to play.', 'warning');
              }
              setCurrentVideo({ url, title, qualities });
              setVideoModalOpen(true);
            }}
            onOpenPdf={(url, title) => {
              if (!isOnline) {
                addToast('⚡ Offline Mode: Opening cached document preview.', 'info');
              }
              setCurrentPdf({ url, title });
              setPdfModalOpen(true);
            }}
            onTriggerToast={addToast}
          />
        ) : (
          /* 3. Home View: Hero, Category Filter, Batches Catalog */
          <div className="space-y-8 sm:space-y-10 pb-20">
            {/* Hero Section */}
            <HeroBanner
              totalBatches={courses.length || 32}
              liveCount={liveCount || 8}
              enrolledCount={enrolledIds.length}
              theme={theme}
              onExploreClick={() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenTelegramModal={() => setTelegramModalOpen(true)}
            />

            {/* Catalog & Filter Section */}
            <div id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
              {/* Category Pills Strip */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📚</span>
                    <h2 className="text-xl sm:text-2xl font-black font-handwriting">
                      Handwritten Study Batches &amp; Lectures
                    </h2>
                  </div>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    Select your exam goal or switch to your saved notes binder.
                  </p>
                </div>

                {/* Quick Toggle for Scratchpad and Enrolled */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setShowNotesPad(!showNotesPad)}
                    className={`py-2 px-3.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      showNotesPad
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : isDark
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                        : 'bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>{showNotesPad ? 'Hide Rough Book' : 'Open My Rough Book ✍️'}</span>
                  </button>

                  <button
                    onClick={() => setActiveFilter(activeFilter === 'enrolled' ? 'all' : 'enrolled')}
                    className={`py-2 px-3.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeFilter === 'enrolled'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                        : isDark
                        ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <BookmarkCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Enrolled ({enrolledIds.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveFilter(activeFilter === 'stickers' ? 'all' : 'stickers')}
                    className={`py-2 px-3.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeFilter === 'stickers'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : isDark
                        ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>📌</span>
                    <span>Pinned Stickers ({Object.keys(pinnedStickers).length})</span>
                  </button>
                </div>
              </div>

              {/* Expandable Rough Pad on Home Screen */}
              <AnimatePresence>
                {showNotesPad && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <HandwrittenNotesPad
                      theme={theme}
                      onToast={(msg, type) => addToast(msg, type)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Filter Categories Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {CATEGORIES.map((cat) => {
                  const isActive = activeFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveFilter(cat.id)}
                      className={`py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/25 scale-[1.02]'
                          : isDark
                          ? 'bg-[#0e1324] border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                          : 'bg-[#fffefb] border-amber-200 text-slate-700 hover:bg-amber-50'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Batches Grid / List */}
              {loading ? (
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className={`h-48 rounded-3xl border animate-pulse ${
                        isDark ? 'bg-white/5 border-white/10' : 'bg-slate-200 border-slate-300'
                      }`}
                    />
                  ))}
                </div>
              ) : filteredCourses.length === 0 ? (
                <div
                  className={`p-12 text-center rounded-3xl border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-white border-amber-200'
                  }`}
                >
                  <p className="text-base font-bold font-handwriting mb-2">
                    No batches matching "{searchQuery || activeFilter}".
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    Try another keyword or join our Telegram channel for requested batches.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFilter('all');
                    }}
                    className="py-2 px-4 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  {filteredCourses.map((batch) => (
                    <BatchCard
                      key={batch.id}
                      batch={batch}
                      isEnrolled={enrolledIds.includes(batch.id)}
                      theme={theme}
                      pinnedStickerId={pinnedStickers[batch.id]}
                      onPinSticker={handlePinSticker}
                      onSelect={(b) => setSelectedBatch(b)}
                      onToggleEnroll={handleToggleEnroll}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Direct Home Donation Section with Dynamic QR Code */}
            <HomeDonationSection theme={theme} onToast={addToast} />

            {/* Telegram Community Ribbon Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#0088cc] via-[#0288d1] to-[#01579b] text-white shadow-xl shadow-sky-950/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold backdrop-blur-md">
                    <span>📢 OFFICIAL TELEGRAM COMMUNITY</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-handwriting">
                    Join @NST_XY_09 For Daily Class Links &amp; Hand-Written Notes
                  </h3>
                  <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
                    Get instant batch schedules, handwritten notes PDF files, doubt solving, and video lecture updates.
                  </p>
                </div>

                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-6 rounded-2xl bg-white text-sky-900 hover:bg-sky-50 font-extrabold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#0088cc]" />
                  <span>Join @NST_XY_09 Now</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-8 px-4 sm:px-6 text-center text-xs transition-colors ${
          isDark
            ? 'bg-[#05070e] border-white/10 text-gray-400'
            : 'bg-[#faf6ec] border-amber-200 text-slate-600'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm font-handwriting text-amber-500">
              ✍️ NST RUDRA
            </span>
            <span>• Handwritten Notes &amp; Video Study Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-500 hover:underline font-bold flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
              <span>@NST_XY_09</span>
            </a>
            <span>•</span>
            <button
              onClick={() => setDonationModalOpen(true)}
              className="text-rose-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>❤️ Donate / Support (सहयोग)</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setSecurityModalOpen(true)}
              className="text-emerald-500 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Anti-Inspect Security Active</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Telegram Action Orb */}
      <FloatingTelegram onOpenModal={() => setTelegramModalOpen(true)} />

      {/* Modals */}
      <DonationModal
        isOpen={donationModalOpen}
        onClose={() => setDonationModalOpen(false)}
        theme={theme}
        onToast={addToast}
      />

      <TelegramModal
        isOpen={telegramModalOpen}
        onClose={() => setTelegramModalOpen(false)}
      />

      <SecurityShieldModal
        isOpen={securityModalOpen}
        onClose={() => setSecurityModalOpen(false)}
      />

      <VideoPlayerModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={currentVideo.url}
        title={currentVideo.title}
        qualities={currentVideo.qualities}
        theme={theme}
        onToast={addToast}
      />

      <StreamUrlModal
        isOpen={streamUrlModalOpen}
        onClose={() => setStreamUrlModalOpen(false)}
        theme={theme}
        onPlayStream={(url, title) => {
          const qualities =
            url.includes('selectionwaylive') || url.includes('playlist-mpl-vod')
              ? [
                  { quality: '720p', url, size: 482.37 },
                  { quality: '480p', url, size: 332.55 },
                  { quality: '360p', url, size: 238.36 },
                  { quality: '240p', url, size: 177.25 }
                ]
              : undefined;

          setCurrentVideo({
            url,
            title: title || 'Live Stream Lecture',
            qualities
          });
          setVideoModalOpen(true);
        }}
      />

      <PdfViewerModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        pdfUrl={currentPdf.url}
        title={currentPdf.title}
        theme={theme}
      />

      {/* Optional Student Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md">
          <LoginPage
            theme={theme}
            onToggleTheme={toggleTheme}
            onClose={() => setLoginModalOpen(false)}
          />
        </div>
      )}

      {/* Security & Notification Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
