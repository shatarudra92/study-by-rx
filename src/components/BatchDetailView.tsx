import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  PlayCircle,
  FileText,
  Clock,
  Radio,
  CheckCircle,
  CheckCircle2,
  Circle,
  Plus,
  Minus,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  EyeOff,
  Send,
  HelpCircle,
  Award,
  Video,
  Layers,
  FolderOpen,
  Tv,
  Copy,
  PenTool,
  BookmarkCheck,
  Check,
  Search,
  SlidersHorizontal,
  RotateCcw,
  List,
  LayoutGrid,
  Filter,
  X,
  FileCheck,
  Lightbulb,
  GraduationCap,
  RefreshCw
} from 'lucide-react';
import { BatchCourse, ClassTopic, ClassItem, PdfTopic, ActiveTab, ThemeMode } from '../types';
import { fetchBatchClasses, fetchBatchPdfs } from '../services/api';
import { generateCosmicThumbnail } from '../utils/security';
import { TELEGRAM_LINK } from './TelegramModal';
import { HandwrittenNotesPad } from './HandwrittenNotesPad';
import { SubjectVisibilityModal, SubjectItemMeta } from './SubjectVisibilityModal';
import { HANDWRITTEN_STICKERS } from '../data/stickers';

interface BatchDetailViewProps {
  batch: BatchCourse;
  isEnrolled: boolean;
  theme?: ThemeMode;
  pinnedStickerId?: string | null;
  onPinSticker?: (batchId: string, stickerId: string | null) => void;
  onBack: () => void;
  onToggleEnroll: (batch: BatchCourse) => void;
  onOpenVideo: (url: string, title: string, qualities?: any[]) => void;
  onOpenPdf: (url: string, title: string) => void;
  onTriggerToast: (msg: string, type: 'success' | 'warning' | 'error' | 'security') => void;
}

export const BatchDetailView: React.FC<BatchDetailViewProps> = ({
  batch,
  isEnrolled,
  theme = 'dark',
  pinnedStickerId,
  onPinSticker,
  onBack,
  onToggleEnroll,
  onOpenVideo,
  onOpenPdf,
  onTriggerToast
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [classes, setClasses] = useState<ClassTopic[]>([]);
  const [pdfs, setPdfs] = useState<PdfTopic[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showDetailStickerPicker, setShowDetailStickerPicker] = useState(false);

  const pinnedSticker = HANDWRITTEN_STICKERS.find((s) => s.id === pinnedStickerId);

  // Advanced Multi-Subject & Lecture Visibility State
  const [hiddenSubjects, setHiddenSubjects] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`nst_hidden_subjects_${batch.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [hiddenLectures, setHiddenLectures] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`nst_hidden_lectures_${batch.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedLectures, setCompletedLectures] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`nst_completed_lectures_${batch.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hideCompleted, setHideCompleted] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');
  const [isSubjectManagerOpen, setIsSubjectManagerOpen] = useState(false);

  const isDark = theme === 'dark' || theme === 'cosmic-dark';

  // Save visibility preferences
  useEffect(() => {
    try {
      localStorage.setItem(`nst_hidden_subjects_${batch.id}`, JSON.stringify(hiddenSubjects));
    } catch (e) {
      console.error(e);
    }
  }, [hiddenSubjects, batch.id]);

  useEffect(() => {
    try {
      localStorage.setItem(`nst_hidden_lectures_${batch.id}`, JSON.stringify(hiddenLectures));
    } catch (e) {
      console.error(e);
    }
  }, [hiddenLectures, batch.id]);

  useEffect(() => {
    try {
      localStorage.setItem(`nst_completed_lectures_${batch.id}`, JSON.stringify(completedLectures));
    } catch (e) {
      console.error(e);
    }
  }, [completedLectures, batch.id]);

  // Load classes and PDFs
  useEffect(() => {
    let isMounted = true;
    setLoadingContent(true);

    Promise.all([
      fetchBatchClasses(batch.id, batch),
      fetchBatchPdfs(batch.id, batch)
    ])
      .then(([classesData, pdfsData]) => {
        if (isMounted) {
          setClasses(classesData);
          setPdfs(pdfsData);

          // By default expand first 2 topics
          const initialExpanded: Record<string, boolean> = {};
          classesData.forEach((topic, idx) => {
            initialExpanded[topic.topicName] = idx < 2;
          });
          pdfsData.forEach((topic, idx) => {
            if (!(topic.topicName in initialExpanded)) {
              initialExpanded[topic.topicName] = idx < 2;
            }
          });
          setExpandedTopics(initialExpanded);
          setLoadingContent(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching batch modules:', err);
        if (isMounted) setLoadingContent(false);
      });

    return () => {
      isMounted = false;
    };
  }, [batch]);

  // Unique list of all subject names across classes & pdfs
  const allSubjectNames = useMemo(() => {
    const names = new Set<string>();
    classes.forEach((c) => names.add(c.topicName));
    pdfs.forEach((p) => names.add(p.topicName));
    return Array.from(names);
  }, [classes, pdfs]);

  // Subject Metadata for the Visibility Manager
  const subjectListMeta: SubjectItemMeta[] = useMemo(() => {
    return allSubjectNames.map((name) => {
      const clsTopic = classes.find((c) => c.topicName === name);
      const pdfTopic = pdfs.find((p) => p.topicName === name);
      return {
        name,
        lectureCount: clsTopic ? clsTopic.classes.length : 0,
        pdfCount: pdfTopic ? pdfTopic.pdfs.length : 0,
        isHidden: hiddenSubjects.includes(name)
      };
    });
  }, [allSubjectNames, classes, pdfs, hiddenSubjects]);

  // Toggle single subject visibility
  const handleToggleSubject = (subjectName: string) => {
    const isCurrentlyHidden = hiddenSubjects.includes(subjectName);
    if (isCurrentlyHidden) {
      setHiddenSubjects((prev) => prev.filter((s) => s !== subjectName));
      onTriggerToast(`Unhid subject: "${subjectName}" 👁️`, 'success');
    } else {
      setHiddenSubjects((prev) => [...prev, subjectName]);
      onTriggerToast(`Hidden subject: "${subjectName}". Manage from Top Bar anytime 🚫`, 'warning');
    }
  };

  // Show All Subjects
  const handleShowAllSubjects = () => {
    setHiddenSubjects([]);
    onTriggerToast('All subjects are now visible! 🌟', 'success');
  };

  // Hide All Subjects
  const handleHideAllSubjects = () => {
    setHiddenSubjects(allSubjectNames);
    onTriggerToast('All subjects hidden. Use Subject Manager to restore.', 'warning');
  };

  // Toggle Accordion Topic Open/Close
  const handleToggleTopicAccordion = (topicName: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicName]: !prev[topicName]
    }));
  };

  // Expand All Topics
  const handleExpandAll = () => {
    const allOpen: Record<string, boolean> = {};
    allSubjectNames.forEach((name) => {
      allOpen[name] = true;
    });
    setExpandedTopics(allOpen);
    onTriggerToast('Expanded all subjects & chapters 📂', 'success');
  };

  // Collapse All Topics
  const handleCollapseAll = () => {
    const allClosed: Record<string, boolean> = {};
    allSubjectNames.forEach((name) => {
      allClosed[name] = false;
    });
    setExpandedTopics(allClosed);
    onTriggerToast('Collapsed all subjects 📁', 'success');
  };

  // Toggle individual lecture hide
  const handleToggleLectureHide = (lectureId: string, title: string) => {
    const isCurrentlyHidden = hiddenLectures.includes(lectureId);
    if (isCurrentlyHidden) {
      setHiddenLectures((prev) => prev.filter((id) => id !== lectureId));
      onTriggerToast(`Restored lecture: "${title}"`, 'success');
    } else {
      setHiddenLectures((prev) => [...prev, lectureId]);
      onTriggerToast(`Hidden lecture: "${title}"`, 'warning');
    }
  };

  // Toggle lecture completed state
  const handleToggleLectureComplete = (lectureId: string, title: string) => {
    const isDone = completedLectures.includes(lectureId);
    if (isDone) {
      setCompletedLectures((prev) => prev.filter((id) => id !== lectureId));
    } else {
      setCompletedLectures((prev) => [...prev, lectureId]);
      onTriggerToast(`Marked completed: "${title}" 🏆`, 'success');
    }
  };

  // Filtered classes according to hidden subjects, search query, and completed filter
  const filteredClasses = useMemo(() => {
    return classes
      .filter((topic) => {
        // Filter by subject hidden
        if (hiddenSubjects.includes(topic.topicName)) return false;
        // Filter by selected chip tab
        if (selectedSubjectFilter !== 'all' && topic.topicName !== selectedSubjectFilter) {
          return false;
        }
        return true;
      })
      .map((topic) => {
        const matchingClasses = topic.classes.filter((cls) => {
          // Hide individual lecture
          if (hiddenLectures.includes(cls.id)) return false;
          // Hide completed if toggle on
          if (hideCompleted && completedLectures.includes(cls.id)) return false;
          // Search query
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchTitle = cls.title.toLowerCase().includes(q);
            const matchTeacher = cls.teacherName?.toLowerCase().includes(q);
            const matchTopic = topic.topicName.toLowerCase().includes(q);
            return matchTitle || matchTeacher || matchTopic;
          }
          return true;
        });

        return {
          ...topic,
          classes: matchingClasses
        };
      })
      .filter((topic) => topic.classes.length > 0 || !searchQuery.trim());
  }, [classes, hiddenSubjects, selectedSubjectFilter, hiddenLectures, hideCompleted, completedLectures, searchQuery]);

  // Filtered PDFs according to hidden subjects and search query
  const filteredPdfs = useMemo(() => {
    return pdfs
      .filter((topic) => {
        if (hiddenSubjects.includes(topic.topicName)) return false;
        if (selectedSubjectFilter !== 'all' && topic.topicName !== selectedSubjectFilter) {
          return false;
        }
        return true;
      })
      .map((topic) => {
        const matchingPdfs = topic.pdfs.filter((pdf) => {
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchTitle = pdf.title.toLowerCase().includes(q);
            const matchTeacher = pdf.teacherName?.toLowerCase().includes(q);
            const matchTopic = topic.topicName.toLowerCase().includes(q);
            return matchTitle || matchTeacher || matchTopic;
          }
          return true;
        });

        return {
          ...topic,
          pdfs: matchingPdfs
        };
      })
      .filter((topic) => topic.pdfs.length > 0 || !searchQuery.trim());
  }, [pdfs, hiddenSubjects, selectedSubjectFilter, searchQuery]);

  const totalVisibleLectures = useMemo(() => {
    return filteredClasses.reduce((acc, t) => acc + t.classes.length, 0);
  }, [filteredClasses]);

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

  const handleCopyLink = (url: string, title: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    onTriggerToast(`Copied stream URL for "${title}"! 📋`, 'success');
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div
      className={`w-full min-h-screen pb-24 transition-colors ${
        isDark
          ? 'bg-[#080c18] text-gray-100 paper-ruled-dark'
          : 'bg-[#fffdf9] text-slate-800 paper-ruled-light'
      }`}
    >
      {/* Subject Visibility Manager Modal */}
      <SubjectVisibilityModal
        isOpen={isSubjectManagerOpen}
        onClose={() => setIsSubjectManagerOpen(false)}
        subjects={subjectListMeta}
        onToggleSubject={handleToggleSubject}
        onShowAll={handleShowAllSubjects}
        onHideAll={handleHideAllSubjects}
        theme={theme}
      />

      {/* Top Header Sticky Bar */}
      <div
        className={`sticky top-0 z-30 w-full backdrop-blur-xl border-b px-4 sm:px-6 h-16 flex items-center justify-between gap-4 transition-colors ${
          isDark
            ? 'bg-[#090d1a]/90 border-amber-500/15'
            : 'bg-[#fffdf8]/90 border-amber-200 shadow-sm'
        }`}
      >
        <button
          onClick={onBack}
          className={`flex items-center gap-2 py-2 px-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            isDark
              ? 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200 hover:text-white'
              : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-slate-800'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Batches</span>
        </button>

        <div className="hidden sm:block text-xs font-bold font-handwriting truncate max-w-sm">
          {batch.title}
        </div>

        <div className="flex items-center gap-2">
          {/* Manage Subjects Quick Trigger */}
          <button
            onClick={() => setIsSubjectManagerOpen(true)}
            className={`py-1.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              hiddenSubjects.length > 0
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-500 animate-pulse'
                : isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200'
                : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-slate-700'
            }`}
            title="Hide or Unhide Subjects"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Manage Subjects</span>
            {hiddenSubjects.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                {hiddenSubjects.length} Hidden
              </span>
            )}
          </button>

          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-400 text-xs font-bold transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Join Telegram</span>
          </a>

          <button
            onClick={() => onToggleEnroll(batch)}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isEnrolled
                ? isDark
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
            }`}
          >
            {isEnrolled ? (
              <>
                <Minus className="w-3.5 h-3.5" /> Enrolled
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Enroll Batch
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Batch Hero Card with Notebook Binder Header */}
        <div
          className={`rounded-3xl border overflow-hidden shadow-xl relative ${
            isDark
              ? 'bg-[#0f1424] border-amber-500/20 text-white'
              : 'bg-[#fffef9] border-amber-300 text-slate-800'
          }`}
        >
          {/* Top Tape Sticker */}
          <div className="absolute top-0 left-12 w-28 h-4 bg-amber-400/30 -rotate-1 rounded-b pointer-events-none z-10" />

          {/* Pinned Handwritten Sticker Tag in Hero */}
          {pinnedSticker && (
            <div
              className={`absolute top-3 right-4 z-30 px-3 py-1.5 rounded-xl border font-handwriting font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg backdrop-blur-md transition-transform transform ${
                pinnedSticker.rotation
              } bg-gradient-to-r ${pinnedSticker.bgGradient} ${pinnedSticker.borderCol} ${pinnedSticker.textCol} cursor-pointer`}
              onClick={() => {
                if (onPinSticker) onPinSticker(batch.id, null);
              }}
              title="Click to remove sticker from this batch"
            >
              <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-2.5 ${pinnedSticker.tapeColor} rounded-xs shadow-xs -rotate-2`} />
              <span className="text-base">{pinnedSticker.emoji}</span>
              <span className="tracking-tight">{pinnedSticker.label}</span>
              <X className="w-3.5 h-3.5 opacity-60 hover:opacity-100 ml-1" />
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 p-6 sm:p-8">
            {/* Thumbnail */}
            <div className="w-full lg:w-96 aspect-video lg:aspect-auto rounded-2xl overflow-hidden bg-black/40 relative shrink-0 border border-current/10">
              <img
                src={thumbnailSrc}
                alt={batch.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = generateCosmicThumbnail(batch.title, batch.category);
                }}
              />
              <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/80 text-amber-300 text-[10px] font-black tracking-wider border border-white/20">
                ✍️ NST RUDRA PORTAL
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider">
                    {String(typeof batch.category === 'string' ? batch.category : (batch.category as any)?.name || 'GENERAL').toUpperCase()} BATCH
                  </span>
                  {batch.isLive && (
                    <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-black flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      LIVE ACTIVE
                    </span>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1 ${
                      isDark
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : 'bg-amber-100 border-amber-300 text-amber-800'
                    }`}
                  >
                    <PlayCircle className="w-3 h-3 text-amber-500" /> In-App HLS VOD Ready
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1 ${
                      isDark
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    }`}
                  >
                    <Layers className="w-3 h-3 text-emerald-500" /> Multi-Subject Hide/Unhide Ready
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black font-handwriting leading-tight">
                  {batch.title}
                </h1>

                {batch.short_description && (
                  <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                    {batch.short_description}
                  </p>
                )}

                {/* Pricing & Validity */}
                <div className="flex flex-wrap items-baseline gap-3 pt-1">
                  <span className="text-3xl sm:text-4xl font-black font-handwriting text-amber-600 dark:text-amber-300">
                    ₹{batch.discountPrice ?? 0}
                  </span>
                  {batch.price && batch.price > (batch.discountPrice ?? 0) && (
                    <>
                      <span className="text-sm line-through opacity-50">₹{batch.price}</span>
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                  {batch.validity && (
                    <span className="text-xs font-semibold opacity-75 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> Validity: {batch.validity}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-current/10 mt-4">
                <button
                  onClick={() => onToggleEnroll(batch)}
                  className={`py-3 px-6 rounded-2xl font-extrabold text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                    isEnrolled
                      ? isDark
                        ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                        : 'bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-amber-500/20 hover:scale-102'
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <Minus className="w-4 h-4" /> Unenroll Batch
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Enroll &amp; Unlock All Notes
                    </>
                  )}
                </button>

                {/* Pin Sticker in Detail Action Bar */}
                <div className="relative">
                  <button
                    onClick={() => setShowDetailStickerPicker(!showDetailStickerPicker)}
                    className={`py-3 px-5 rounded-2xl border text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      pinnedSticker
                        ? isDark
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : 'bg-amber-100 border-amber-300 text-amber-900'
                        : isDark
                        ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-50'
                    }`}
                  >
                    <span className="text-base">{pinnedSticker ? pinnedSticker.emoji : '📌'}</span>
                    <span>{pinnedSticker ? pinnedSticker.label : 'Pin Sticker'}</span>
                  </button>

                  <AnimatePresence>
                    {showDetailStickerPicker && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className={`absolute bottom-full left-0 mb-2 p-3 rounded-2xl border shadow-2xl z-40 w-72 ${
                          isDark
                            ? 'bg-[#121829] border-amber-500/30 text-white shadow-black/90'
                            : 'bg-white border-amber-200 text-slate-800 shadow-xl'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-current/10">
                          <div className="flex items-center gap-1.5 text-xs font-black font-handwriting text-amber-500">
                            <span>📌 Personalize Batch with Sticker:</span>
                          </div>
                          <button
                            onClick={() => setShowDetailStickerPicker(false)}
                            className="text-xs opacity-60 hover:opacity-100"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {HANDWRITTEN_STICKERS.map((stk) => {
                            const isChosen = pinnedStickerId === stk.id;
                            return (
                              <button
                                key={stk.id}
                                onClick={() => {
                                  if (onPinSticker) {
                                    onPinSticker(batch.id, isChosen ? null : stk.id);
                                  }
                                  setShowDetailStickerPicker(false);
                                }}
                                className={`p-2 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                                  isChosen
                                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-xs'
                                    : isDark
                                    ? 'bg-white/5 hover:bg-white/10 border-white/10'
                                    : 'bg-amber-50 hover:bg-amber-100 border-amber-200'
                                }`}
                              >
                                <span className="text-base">{stk.emoji}</span>
                                <span className="truncate">{stk.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        {pinnedSticker && (
                          <button
                            onClick={() => {
                              if (onPinSticker) onPinSticker(batch.id, null);
                              setShowDetailStickerPicker(false);
                            }}
                            className="w-full mt-2.5 pt-2 text-xs font-bold text-center text-rose-400 hover:underline border-t border-current/10 cursor-pointer"
                          >
                            Remove Pinned Sticker
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => setIsSubjectManagerOpen(true)}
                  className={`py-3 px-5 rounded-2xl border text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isDark
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                      : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                  <span>Customize Subjects ({subjectListMeta.length - hiddenSubjects.length}/{subjectListMeta.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('handwritten-notes')}
                  className={`py-3 px-5 rounded-2xl border text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-50'
                  }`}
                >
                  <PenTool className="w-4 h-4 text-amber-500" />
                  <span>My Handwritten Pad ✍️</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notebook Tabs Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'overview' as ActiveTab, label: '📑 Overview & Syllabus', icon: BookOpen },
            { id: 'videos' as ActiveTab, label: `🎬 Video Lectures (${totalVisibleLectures})`, icon: PlayCircle },
            { id: 'notes' as ActiveTab, label: '📄 Handwritten PDFs & DPPs', icon: FileText },
            { id: 'handwritten-notes' as ActiveTab, label: '✍️ My Rough Notes', icon: PenTool },
            { id: 'timetable' as ActiveTab, label: '⏰ Live Timetable', icon: Clock }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 sm:px-5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap border transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 scale-[1.02]'
                    : isDark
                    ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    : 'bg-amber-50 border-amber-200 text-slate-700 hover:bg-amber-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Highlights */}
            {batch.courseHighlights && batch.courseHighlights.length > 0 && (
              <div
                className={`p-6 sm:p-8 rounded-3xl border ${
                  isDark ? 'bg-[#0f1424] border-amber-500/20' : 'bg-[#fffef9] border-amber-200'
                }`}
              >
                <h3 className="text-lg font-black font-handwriting mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Batch Highlights &amp; Features</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {batch.courseHighlights.map((hl, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs sm:text-sm font-medium ${
                        isDark ? 'bg-white/5 border-white/5' : 'bg-amber-50/60 border-amber-200'
                      }`}
                    >
                      <span className="text-amber-500 font-bold">✓</span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description list */}
            {batch.description && batch.description.length > 0 && (
              <div
                className={`p-6 sm:p-8 rounded-3xl border space-y-3 ${
                  isDark ? 'bg-[#0f1424] border-white/10' : 'bg-[#fffef9] border-amber-200'
                }`}
              >
                <h3 className="text-lg font-black font-handwriting mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  <span>Course Details</span>
                </h3>
                {batch.description.map((desc, i) => (
                  <p key={i} className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                    {desc}
                  </p>
                ))}
              </div>
            )}

            {/* Faculty Bio */}
            {batch.facultyDetails && (
              <div
                className={`p-6 sm:p-8 rounded-3xl border flex flex-col sm:flex-row items-center gap-6 ${
                  isDark ? 'bg-[#0f1424] border-amber-500/20' : 'bg-[#fffef9] border-amber-200'
                }`}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 p-1 shrink-0">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl font-black text-amber-400">
                    👨‍🏫
                  </div>
                </div>
                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="text-xs font-black uppercase text-amber-500 tracking-wider">
                    Lead Educator &amp; Mentor
                  </span>
                  <h4 className="text-xl font-black font-handwriting">
                    {batch.facultyDetails.name}
                  </h4>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                    {batch.facultyDetails.bio || `${batch.facultyDetails.experience || '10+ Years'} of teaching experience for SSC & Railways.`}
                  </p>
                </div>
              </div>
            )}

            {/* FAQs */}
            {batch.faqs && batch.faqs.length > 0 && (
              <div
                className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
                  isDark ? 'bg-[#0f1424] border-white/10' : 'bg-[#fffef9] border-amber-200'
                }`}
              >
                <h3 className="text-lg font-black font-handwriting mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-500" />
                  <span>Frequently Asked Questions</span>
                </h3>
                <div className="space-y-3">
                  {batch.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className={`rounded-2xl border overflow-hidden ${
                        isDark ? 'bg-white/5 border-white/5' : 'bg-amber-50/60 border-amber-200'
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                        className="w-full p-4 text-left font-bold text-xs sm:text-sm flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-amber-500 transition-transform ${
                            openFaqIndex === idx ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openFaqIndex === idx && (
                        <div
                          className={`px-4 pb-4 text-xs sm:text-sm leading-relaxed border-t pt-3 ${
                            isDark
                              ? 'text-gray-300 border-white/10'
                              : 'text-slate-600 border-amber-200'
                          }`}
                        >
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Video Lectures & Multi-Subject Management */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            {/* Top Notification if any subjects are currently hidden */}
            <AnimatePresence>
              {hiddenSubjects.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isDark
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-amber-100 border-amber-300 text-amber-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <EyeOff className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold">
                      {hiddenSubjects.length} subject(s) hidden ({hiddenSubjects.join(', ')})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleShowAllSubjects}
                      className="py-1 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs cursor-pointer transition-all"
                    >
                      Unhide All
                    </button>
                    <button
                      onClick={() => setIsSubjectManagerOpen(true)}
                      className="py-1 px-3 rounded-xl border border-current/30 text-xs font-bold hover:bg-white/10 cursor-pointer"
                    >
                      Manage
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Master Control Bar: Search, Subject Filters, Expand/Collapse, View Modes */}
            <div
              className={`p-4 sm:p-5 rounded-3xl border space-y-4 shadow-sm ${
                isDark ? 'bg-[#0f1424] border-white/10' : 'bg-[#fffef9] border-amber-200'
              }`}
            >
              {/* Row 1: Search and Action Controls */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search lectures by topic, formula, or educator name..."
                    className={`w-full pl-10 pr-9 py-2.5 rounded-2xl border text-xs sm:text-sm font-medium outline-none transition-all ${
                      isDark
                        ? 'bg-black/30 border-white/10 text-white placeholder:text-gray-500 focus:border-amber-400'
                        : 'bg-amber-50/50 border-amber-200 text-slate-800 placeholder:text-slate-400 focus:border-amber-500'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Controls Group */}
                <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
                  {/* Subject Manager Trigger */}
                  <button
                    onClick={() => setIsSubjectManagerOpen(true)}
                    className={`py-2 px-3.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                      hiddenSubjects.length > 0
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-500 font-black'
                        : isDark
                        ? 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200'
                        : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-slate-700'
                    }`}
                    title="Manage Subject Visibility"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Hide/Unhide ({subjectListMeta.length - hiddenSubjects.length}/{subjectListMeta.length})</span>
                  </button>

                  {/* Expand / Collapse All */}
                  <button
                    onClick={handleExpandAll}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      isDark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-white hover:bg-amber-50 border-amber-200'
                    }`}
                    title="Expand All Chapters"
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">Expand All</span>
                  </button>

                  <button
                    onClick={handleCollapseAll}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      isDark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-white hover:bg-amber-50 border-amber-200'
                    }`}
                    title="Collapse All Chapters"
                  >
                    <ChevronUp className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">Collapse All</span>
                  </button>

                  {/* View Mode Toggle */}
                  <div
                    className={`p-1 rounded-xl border flex items-center gap-1 ${
                      isDark ? 'bg-black/40 border-white/10' : 'bg-amber-100/60 border-amber-200'
                    }`}
                  >
                    <button
                      onClick={() => setViewMode('detailed')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'detailed'
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      title="Detailed Card View"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode('compact')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'compact'
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      title="Compact List View"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: Subject Chips Tab Row */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-current/5">
                <span className="text-[11px] font-bold opacity-60 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3 text-amber-500" /> Filter:
                </span>

                <button
                  onClick={() => setSelectedSubjectFilter('all')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                    selectedSubjectFilter === 'all'
                      ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md font-black'
                      : isDark
                      ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      : 'bg-amber-50 border-amber-200 text-slate-700 hover:bg-amber-100'
                  }`}
                >
                  All Subjects ({classes.length - hiddenSubjects.length})
                </button>

                {classes.map((topic, tIdx) => {
                  const isHidden = hiddenSubjects.includes(topic.topicName);
                  if (isHidden) return null; // Don't show hidden subject in quick filter pills

                  const isSelected = selectedSubjectFilter === topic.topicName;
                  return (
                    <div key={tIdx} className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setSelectedSubjectFilter(topic.topicName)}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md font-black'
                            : isDark
                            ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                            : 'bg-amber-50 border-amber-200 text-slate-700 hover:bg-amber-100'
                        }`}
                      >
                        <span>{topic.topicName.split(':')[0] || topic.topicName}</span>
                        <span className="ml-1.5 opacity-70 text-[10px]">
                          ({topic.classes.length})
                        </span>
                      </button>

                      {/* Quick direct hide button */}
                      <button
                        onClick={() => handleToggleSubject(topic.topicName)}
                        className={`p-1.5 rounded-xl border opacity-50 hover:opacity-100 transition-opacity cursor-pointer ${
                          isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-white border-amber-200 text-slate-700'
                        }`}
                        title={`Hide ${topic.topicName}`}
                      >
                        <EyeOff className="w-3 h-3 text-rose-500" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {loadingContent ? (
              <div className="p-12 text-center text-amber-500 animate-pulse font-bold">
                Loading video modules...
              </div>
            ) : filteredClasses.length === 0 ? (
              <div className="p-12 text-center text-gray-400 border rounded-3xl space-y-3">
                <p className="font-bold text-sm">
                  {hiddenSubjects.length === classes.length
                    ? 'All subjects are currently hidden!'
                    : 'No lectures matched your search filter.'}
                </p>
                {hiddenSubjects.length > 0 && (
                  <button
                    onClick={handleShowAllSubjects}
                    className="py-2 px-4 rounded-xl bg-amber-500 text-slate-950 font-black text-xs cursor-pointer shadow-md"
                  >
                    Unhide All Subjects 👁️
                  </button>
                )}
              </div>
            ) : (
              /* Topics / Lectures Accordion List */
              <div className="space-y-4">
                {filteredClasses.map((topic, tIdx) => {
                  const isExpanded = expandedTopics[topic.topicName] ?? true;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                      key={topic.topicName}
                      className={`rounded-3xl border overflow-hidden transition-all ${
                        isDark ? 'bg-[#0f1424] border-white/10 shadow-lg' : 'bg-[#fffef9] border-amber-200 shadow-md'
                      }`}
                    >
                      {/* Topic Header with Direct Hide/Unhide Button */}
                      <div
                        className={`p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                          isDark ? 'bg-white/5 hover:bg-white/8' : 'bg-amber-50/80 hover:bg-amber-100/80'
                        }`}
                        onClick={() => handleToggleTopicAccordion(topic.topicName)}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                            <FolderOpen className="w-4 h-4" />
                          </div>

                          <div className="min-w-0">
                            <h4 className="font-bold text-sm sm:text-base font-handwriting truncate">
                              {topic.topicName}
                            </h4>
                            <div className="text-[11px] opacity-75 mt-0.5 flex items-center gap-2">
                              <span>
                                {topic.classes.length} {topic.classes.length === 1 ? 'Lecture' : 'Lectures'}
                              </span>
                              <span>• Click to {isExpanded ? 'Collapse' : 'Expand'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Subject Actions */}
                        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                          {/* Direct Hide Subject Button */}
                          <button
                            onClick={() => handleToggleSubject(topic.topicName)}
                            className={`py-1.5 px-3 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                              isDark
                                ? 'bg-rose-500/15 hover:bg-rose-500/25 border-rose-500/30 text-rose-300'
                                : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
                            }`}
                            title="Hide this entire subject"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Hide Subject</span>
                          </button>

                          {/* Accordion Chevron */}
                          <button
                            onClick={() => handleToggleTopicAccordion(topic.topicName)}
                            className={`p-2 rounded-xl border transition-transform cursor-pointer ${
                              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-amber-200'
                            }`}
                          >
                            <ChevronDown
                              className={`w-4 h-4 text-amber-500 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Accordion Content with Lecture Rows */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="divide-y divide-current/10 border-t border-current/10"
                          >
                            {topic.classes.map((cls, cIdx) => {
                              const isCompleted = completedLectures.includes(cls.id);
                              const lectureUrl =
                                cls.class_link ||
                                (cls.mp4Recordings && cls.mp4Recordings[0]?.url) ||
                                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

                              if (viewMode === 'compact') {
                                return (
                                  <div
                                    key={cls.id || cIdx}
                                    className={`p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
                                      isCompleted ? 'opacity-65' : ''
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                      <button
                                        onClick={() => handleToggleLectureComplete(cls.id, cls.title)}
                                        className="text-amber-500 hover:scale-110 transition-transform cursor-pointer shrink-0"
                                        title={isCompleted ? 'Mark Incomplete' : 'Mark Completed'}
                                      >
                                        {isCompleted ? (
                                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        ) : (
                                          <Circle className="w-4 h-4 opacity-40" />
                                        )}
                                      </button>

                                      <span
                                        className={`font-bold text-xs sm:text-sm font-handwriting truncate ${
                                          isCompleted ? 'line-through opacity-70' : ''
                                        }`}
                                      >
                                        {cls.title}
                                      </span>

                                      {cls.isLive && (
                                        <span className="px-2 py-0.2 rounded-full bg-red-500 text-white text-[9px] font-black shrink-0">
                                          LIVE
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <button
                                        onClick={() =>
                                          onOpenVideo(lectureUrl, cls.title, cls.mp4Recordings)
                                        }
                                        className="py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                                      >
                                        <PlayCircle className="w-3.5 h-3.5" />
                                        <span>Play</span>
                                      </button>

                                      <button
                                        onClick={() => handleToggleLectureHide(cls.id, cls.title)}
                                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-rose-400 cursor-pointer"
                                        title="Hide Lecture"
                                      >
                                        <EyeOff className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              }

                              // Detailed View
                              const hasAttachedDocs =
                                (cls.classPdf && cls.classPdf.length > 0) ||
                                (cls.dpp && cls.dpp.length > 0) ||
                                (cls.classNotes && cls.classNotes.length > 0) ||
                                (cls.shortNotes && cls.shortNotes.length > 0);

                              return (
                                <div
                                  key={cls.id || cIdx}
                                  className={`p-4 sm:p-5 flex flex-col gap-3.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
                                    isCompleted ? 'opacity-70 bg-emerald-500/5' : ''
                                  }`}
                                >
                                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-3 min-w-0 flex-1">
                                      <button
                                        onClick={() => handleToggleLectureComplete(cls.id, cls.title)}
                                        className="mt-1 text-amber-500 hover:scale-110 transition-transform cursor-pointer shrink-0"
                                        title={isCompleted ? 'Mark Incomplete' : 'Mark Completed'}
                                      >
                                        {isCompleted ? (
                                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                          <Circle className="w-5 h-5 opacity-40" />
                                        )}
                                      </button>

                                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                                        <PlayCircle className="w-4 h-4" />
                                      </div>

                                      <div>
                                        <div
                                          className={`font-bold text-xs sm:text-sm font-handwriting leading-snug ${
                                            isCompleted ? 'line-through opacity-70' : ''
                                          }`}
                                        >
                                          {cls.title}
                                        </div>
                                        <div className="text-[11px] opacity-75 flex items-center gap-2 mt-0.5 flex-wrap">
                                          {cls.teacherName && <span>Educator: {cls.teacherName}</span>}
                                          {cls.isLive && (
                                            <span className="text-red-500 font-bold">• LIVE SESSION</span>
                                          )}
                                          {isCompleted && (
                                            <span className="text-emerald-500 font-bold">• COMPLETED</span>
                                          )}
                                          {hasAttachedDocs && (
                                            <span className="text-amber-500 font-bold flex items-center gap-1">
                                              • 📎 Attached Material Available
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action Buttons for Video */}
                                    <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
                                      {/* In-App Player */}
                                      <button
                                        onClick={() =>
                                          onOpenVideo(lectureUrl, cls.title, cls.mp4Recordings)
                                        }
                                        className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                                      >
                                        <PlayCircle className="w-4 h-4" />
                                        <span>Watch Video</span>
                                      </button>

                                      {/* Copy Stream Link */}
                                      <button
                                        onClick={() => handleCopyLink(lectureUrl, cls.title)}
                                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-current/10 transition-colors cursor-pointer"
                                        title="Copy stream URL"
                                      >
                                        {copiedLink === lectureUrl ? (
                                          <Check className="w-4 h-4 text-emerald-500" />
                                        ) : (
                                          <Copy className="w-4 h-4" />
                                        )}
                                      </button>

                                      {/* Hide Lecture */}
                                      <button
                                        onClick={() => handleToggleLectureHide(cls.id, cls.title)}
                                        className="p-2 rounded-xl hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 border border-transparent transition-colors cursor-pointer"
                                        title="Hide this single lecture"
                                      >
                                        <EyeOff className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Dedicated Lecture Material Tray (PDFs, DPPs, Class Notes, Short Notes) directly beneath the lecture */}
                                  {hasAttachedDocs && (
                                    <div
                                      className={`mt-1 pt-3 border-t border-current/10 rounded-2xl p-3 sm:p-4 space-y-2.5 ${
                                        isDark ? 'bg-black/25' : 'bg-amber-50/50'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-amber-500">
                                        <FileCheck className="w-3.5 h-3.5" />
                                        <span>Lecture Study Material &amp; Practice Sheets:</span>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                                        {/* 1. Standard Class PDF Handouts */}
                                        {cls.classPdf &&
                                          cls.classPdf.map((pdf, pIdx) => (
                                            <button
                                              key={`pdf-${pIdx}`}
                                              onClick={() => onOpenPdf(pdf.url, `${cls.title} - ${pdf.name}`)}
                                              className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all group hover:scale-[1.01] cursor-pointer ${
                                                isDark
                                                  ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/25 text-rose-200'
                                                  : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-900'
                                              }`}
                                            >
                                              <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                                                <FileText className="w-3.5 h-3.5" />
                                              </div>
                                              <div className="min-w-0 flex-1">
                                                <div className="text-[10px] font-black uppercase tracking-wider text-rose-500 flex items-center justify-between">
                                                  <span>CLASS PDF</span>
                                                  {pdf.size && <span className="opacity-75">{pdf.size}</span>}
                                                </div>
                                                <div className="font-bold text-xs truncate mt-0.5" title={pdf.name}>
                                                  {pdf.name}
                                                </div>
                                              </div>
                                            </button>
                                          ))}

                                        {/* 2. DPP (Daily Practice Problems) */}
                                        {cls.dpp &&
                                          cls.dpp.map((dppItem, dIdx) => (
                                            <button
                                              key={`dpp-${dIdx}`}
                                              onClick={() => onOpenPdf(dppItem.url, `${cls.title} - ${dppItem.name}`)}
                                              className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all group hover:scale-[1.01] cursor-pointer ${
                                                isDark
                                                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/25 text-emerald-200'
                                                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-900'
                                              }`}
                                            >
                                              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                                                <FileCheck className="w-3.5 h-3.5" />
                                              </div>
                                              <div className="min-w-0 flex-1">
                                                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-500 flex items-center justify-between">
                                                  <span>DPP SHEET</span>
                                                  {dppItem.size && <span className="opacity-75">{dppItem.size}</span>}
                                                </div>
                                                <div className="font-bold text-xs truncate mt-0.5" title={dppItem.name}>
                                                  {dppItem.name}
                                                </div>
                                              </div>
                                            </button>
                                          ))}

                                        {/* 3. Class Notes (Handwritten Classroom Board Notes) */}
                                        {cls.classNotes &&
                                          cls.classNotes.map((cNote, cnIdx) => (
                                            <button
                                              key={`cn-${cnIdx}`}
                                              onClick={() => onOpenPdf(cNote.url, `${cls.title} - ${cNote.name}`)}
                                              className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all group hover:scale-[1.01] cursor-pointer ${
                                                isDark
                                                  ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/25 text-amber-200'
                                                  : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                                              }`}
                                            >
                                              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                                                <BookOpen className="w-3.5 h-3.5" />
                                              </div>
                                              <div className="min-w-0 flex-1">
                                                <div className="text-[10px] font-black uppercase tracking-wider text-amber-500 flex items-center justify-between">
                                                  <span>CLASS NOTES</span>
                                                  {cNote.size && <span className="opacity-75">{cNote.size}</span>}
                                                </div>
                                                <div className="font-bold text-xs truncate mt-0.5" title={cNote.name}>
                                                  {cNote.name}
                                                </div>
                                              </div>
                                            </button>
                                          ))}

                                        {/* 4. Short Notes (Formula / Rapid Revision) */}
                                        {cls.shortNotes &&
                                          cls.shortNotes.map((sNote, snIdx) => (
                                            <button
                                              key={`sn-${snIdx}`}
                                              onClick={() => onOpenPdf(sNote.url, `${cls.title} - ${sNote.name}`)}
                                              className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all group hover:scale-[1.01] cursor-pointer ${
                                                isDark
                                                  ? 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/25 text-cyan-200'
                                                  : 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200 text-cyan-900'
                                              }`}
                                            >
                                              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-500 flex items-center justify-center shrink-0 mt-0.5">
                                                <Lightbulb className="w-3.5 h-3.5" />
                                              </div>
                                              <div className="min-w-0 flex-1">
                                                <div className="text-[10px] font-black uppercase tracking-wider text-cyan-500 flex items-center justify-between">
                                                  <span>SHORT NOTES</span>
                                                  {sNote.size && <span className="opacity-75">{sNote.size}</span>}
                                                </div>
                                                <div className="font-bold text-xs truncate mt-0.5" title={sNote.name}>
                                                  {sNote.name}
                                                </div>
                                              </div>
                                            </button>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Handwritten PDFs & DPPs */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            {/* Top Control Bar for Notes */}
            <div
              className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
                isDark ? 'bg-[#0f1424] border-white/10' : 'bg-[#fffef9] border-amber-200'
              }`}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm font-handwriting">
                      Handwritten Study PDFs &amp; DPPs ({filteredPdfs.reduce((acc, t) => acc + t.pdfs.length, 0)} Total Documents)
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      ⚡ Live Sync
                    </span>
                  </div>
                  <p className="text-[11px] opacity-75">
                    Real-time class notes, practice problem sheets and rapid revision booklets
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Real-time Refresh Button */}
                <button
                  onClick={() => {
                    setLoadingContent(true);
                    fetchBatchPdfs(batch.id, batch)
                      .then((data) => {
                        setPdfs(data);
                        setLoadingContent(false);
                        onTriggerToast('PDF Notes synchronized with real-time backend!', 'success');
                      })
                      .catch(() => {
                        setLoadingContent(false);
                      });
                  }}
                  disabled={loadingContent}
                  className={`py-1.5 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    isDark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-amber-50 hover:bg-amber-100 border-amber-200'
                  }`}
                  title="Sync with real-time backend notes"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-amber-500 ${loadingContent ? 'animate-spin' : ''}`} />
                  <span>Live Sync</span>
                </button>

                <button
                  onClick={() => setIsSubjectManagerOpen(true)}
                  className={`py-1.5 px-3 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
                  <span>Subjects ({subjectListMeta.length - hiddenSubjects.length}/{subjectListMeta.length})</span>
                </button>
              </div>
            </div>

            {loadingContent ? (
              <div className="p-12 text-center text-amber-500 animate-pulse font-bold flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span>Synchronizing handwritten notes &amp; DPPs from real-time backend...</span>
              </div>
            ) : filteredPdfs.length === 0 ? (
              <div className="p-12 text-center text-gray-400 border rounded-3xl space-y-3">
                <p className="font-bold text-sm">No PDF materials found for visible subjects.</p>
                {hiddenSubjects.length > 0 && (
                  <button
                    onClick={handleShowAllSubjects}
                    className="py-2 px-4 rounded-xl bg-amber-500 text-slate-950 font-black text-xs cursor-pointer"
                  >
                    Unhide All Subjects
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPdfs.map((topic, tIdx) => {
                  const isExpanded = expandedTopics[topic.topicName] ?? true;

                  return (
                    <div
                      key={tIdx}
                      className={`rounded-3xl border overflow-hidden transition-all ${
                        isDark ? 'bg-[#0f1424] border-white/10' : 'bg-[#fffef9] border-amber-200 shadow-sm'
                      }`}
                    >
                      <div
                        className={`p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none ${
                          isDark ? 'bg-white/5 hover:bg-white/8' : 'bg-amber-50 hover:bg-amber-100'
                        }`}
                        onClick={() => handleToggleTopicAccordion(topic.topicName)}
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-amber-500" />
                          <h4 className="font-bold text-sm sm:text-base font-handwriting">
                            {topic.topicName}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <span className="text-xs font-semibold opacity-70">
                            {topic.pdfs.length} {topic.pdfs.length === 1 ? 'Document' : 'Documents'}
                          </span>

                          <button
                            onClick={() => handleToggleSubject(topic.topicName)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 cursor-pointer"
                            title="Hide Subject Notes"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="divide-y divide-current/10 border-t border-current/10">
                          {topic.pdfs.map((pdf, pIdx) => (
                            <div
                              key={pIdx}
                              className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-xs sm:text-sm font-handwriting leading-snug truncate">
                                    {pdf.title}
                                  </div>
                                  <div className="text-[11px] opacity-75 flex items-center gap-2 mt-0.5 flex-wrap">
                                    {pdf.teacherName && (
                                      <span>Educator: <strong className="text-amber-500 font-bold">{pdf.teacherName}</strong></span>
                                    )}
                                    {pdf.date && <span>• Uploaded: {pdf.date}</span>}
                                    <span className="text-emerald-500 font-bold">• 100% In-App Ready</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                                <button
                                  onClick={() => onOpenPdf(pdf.uploadPdf, pdf.title)}
                                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Read Notes</span>
                                </button>

                                <a
                                  href={pdf.uploadPdf}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-current/10 text-xs font-bold flex items-center gap-1 transition-colors"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span className="hidden xs:inline">Download</span>
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Student Rough Notes Pad */}
        {activeTab === 'handwritten-notes' && (
          <HandwrittenNotesPad
            batchTitle={batch.title}
            theme={theme}
            onToast={(msg, type) => onTriggerToast(msg, type)}
          />
        )}

        {/* Tab 5: Timetable */}
        {activeTab === 'timetable' && (
          <div
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark ? 'bg-[#0f1424] border-white/10' : 'bg-[#fffef9] border-amber-200'
            }`}
          >
            <h3 className="text-lg font-black font-handwriting mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>Daily Live Class Schedule</span>
            </h3>

            {batch.timeTable && batch.timeTable.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {batch.timeTable.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border ${
                      isDark ? 'bg-white/5 border-white/5' : 'bg-amber-50/60 border-amber-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-amber-500 mb-1">{item.time}</div>
                    <div className="font-black text-sm font-handwriting">{item.topic}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                No schedule uploaded yet for this batch.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
