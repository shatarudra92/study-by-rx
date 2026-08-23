import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  PenTool,
  Plus,
  Trash2,
  Download,
  Copy,
  Check,
  Search,
  Pin,
  Tag,
  Highlighter,
  Sparkles,
  Edit3
} from 'lucide-react';
import { StudentStickyNote, ThemeMode } from '../types';

interface HandwrittenNotesPadProps {
  batchTitle?: string;
  theme: ThemeMode;
  onToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

const STORAGE_NOTES_KEY = 'nst_rudra_student_notes_v2';

const DEFAULT_CHEATSHEETS: StudentStickyNote[] = [
  {
    id: 'note-maths-tricks',
    title: '⚡ Speed Maths Short Tricks',
    content: `🔴 [Important Formula]:
Square of numbers ending in 5:
• 35² = (3 × 4) | 25 = 1225
• 75² = (7 × 8) | 25 = 5625

🟢 [Topper Short Trick]:
Multiply any 2-digit number by 11:
• 52 × 11 = 5 | (5+2) | 2 = 572
• 63 × 11 = 6 | (6+3) | 3 = 693

🔵 [Fraction Tables]:
• 16.66% = 1/6 | 14.28% = 1/7
• 12.50% = 1/8 | 11.11% = 1/9`,
    color: 'yellow',
    inkColor: 'blue',
    createdAt: 'Revision Note',
    tag: 'Maths'
  },
  {
    id: 'note-english-rules',
    title: '📝 English Golden Grammar Notes',
    content: `🔴 [Rule 1 - Subject Verb Agreement]:
"Neither / Either ... of" takes Singular Verb:
➜ Neither of the candidates was selected.

🟢 [Rule 2 - Conjunction Hack]:
"Scarcely / Hardly" is followed by "when":
➜ Hardly had the teacher entered when the bell rang.

🔵 [Rule 3 - Lest + Should]:
"Lest" always takes "should" (never "not"):
➜ Walk fast lest you should miss the train.`,
    color: 'cyan',
    inkColor: 'black',
    createdAt: 'Grammar Hack',
    tag: 'English'
  },
  {
    id: 'note-gs-mnemonics',
    title: '🏛️ GS History & Polity Tricks',
    content: `🟢 [Mnemonic Trick]: B-A-J-S-A-O
Babur (1526) ➜ Humayun ➜ Akbar ➜ Jahangir ➜ Shah Jahan ➜ Aurangzeb

🔴 [Constitution Must-Know Articles]:
• Article 14 to 18: Right to Equality
• Article 21: Right to Life & Personal Liberty
• Article 32: Heart & Soul of Constitution (Writs)`,
    color: 'pink',
    inkColor: 'red',
    createdAt: 'GS Booster',
    tag: 'GS & GK'
  }
];

export const HandwrittenNotesPad: React.FC<HandwrittenNotesPadProps> = ({
  batchTitle,
  theme,
  onToast
}) => {
  const [notes, setNotes] = useState<StudentStickyNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTES_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_CHEATSHEETS;
    } catch {
      return DEFAULT_CHEATSHEETS;
    }
  });

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newColor, setNewColor] = useState<StudentStickyNote['color']>('yellow');
  const [newInkColor, setNewInkColor] = useState<'red' | 'blue' | 'black' | 'green'>('blue');
  const [newTag, setNewTag] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isDark = theme === 'dark' || theme === 'cosmic-dark';

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes:', e);
    }
  }, [notes]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) {
      onToast('Please write your note content first!', 'warning');
      return;
    }

    const newNote: StudentStickyNote = {
      id: 'note-' + Date.now(),
      title: newTitle.trim() || (batchTitle ? `Notes: ${batchTitle}` : 'My Study Note ✍️'),
      content: newContent.trim(),
      color: newColor,
      inkColor: newInkColor,
      createdAt: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      tag: newTag.trim() || 'Study'
    };

    setNotes([newNote, ...notes]);
    setNewTitle('');
    setNewContent('');
    setNewTag('');
    setIsCreating(false);
    onToast('✍️ Handwritten note saved in your rough book!', 'success');
  };

  const insertSnippet = (snippet: string) => {
    setNewContent((prev) => (prev ? prev + '\n' + snippet : snippet));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    onToast('Note removed', 'warning');
  };

  const handleCopyNote = (note: StudentStickyNote) => {
    const text = `${note.title}\n\n${note.content}\n\n[Created via NST RUDRA Portal]`;
    navigator.clipboard.writeText(text);
    setCopiedId(note.id);
    onToast('Copied note text! 📋', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadAllNotes = () => {
    const fullText = notes
      .map(
        (n) =>
          `========================================\n📌 ${n.title || 'Untitled Note'} [${n.tag || 'Study'}] (${String(n.inkColor || 'BLUE').toUpperCase()} INK) - ${n.createdAt || ''}\n========================================\n${n.content || ''}\n\n`
      )
      .join('\n');

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NST_RUDRA_Handwritten_Study_Notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onToast('📥 Downloaded study notes as text file!', 'success');
  };

  const filteredNotes = notes.filter((n) => {
    const q = searchQuery.toLowerCase();
    const titleStr = typeof n.title === 'string' ? n.title.toLowerCase() : '';
    const contentStr = typeof n.content === 'string' ? n.content.toLowerCase() : '';
    const tagStr = typeof n.tag === 'string' ? n.tag.toLowerCase() : '';
    return (
      titleStr.includes(q) ||
      contentStr.includes(q) ||
      tagStr.includes(q)
    );
  });

  const getCardBackgroundStyle = (color: StudentStickyNote['color']) => {
    switch (color) {
      case 'yellow':
        return isDark
          ? 'bg-[#1e1b12] border-amber-500/40 text-amber-100 shadow-black/40'
          : 'bg-[#fef9c3] border-[#fde047] text-slate-800 shadow-amber-200/50';
      case 'cyan':
        return isDark
          ? 'bg-[#0f1d28] border-sky-500/40 text-sky-100 shadow-black/40'
          : 'bg-[#e0f2fe] border-[#7dd3fc] text-slate-800 shadow-sky-200/50';
      case 'pink':
        return isDark
          ? 'bg-[#25121c] border-rose-500/40 text-rose-100 shadow-black/40'
          : 'bg-[#ffe4e6] border-[#fda4af] text-slate-800 shadow-rose-200/50';
      case 'green':
        return isDark
          ? 'bg-[#102318] border-emerald-500/40 text-emerald-100 shadow-black/40'
          : 'bg-[#dcfce7] border-[#86efac] text-slate-800 shadow-emerald-200/50';
      case 'slate':
      default:
        return isDark
          ? 'bg-[#121624] border-slate-700 text-slate-200 shadow-black/40'
          : 'bg-[#f8fafc] border-slate-300 text-slate-800 shadow-slate-200/50';
    }
  };

  const getInkClass = (inkColor?: 'red' | 'blue' | 'black' | 'green') => {
    switch (inkColor) {
      case 'red':
        return isDark ? 'pen-red-dark' : 'pen-red-light';
      case 'green':
        return isDark ? 'pen-green-dark' : 'pen-green-light';
      case 'black':
        return isDark ? 'pen-black-dark' : 'pen-black-light';
      case 'blue':
      default:
        return isDark ? 'pen-blue-dark' : 'pen-blue-light';
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Banner / Notebook Header */}
      <div
        className={`p-4 sm:p-6 rounded-3xl border relative overflow-hidden transition-colors ${
          isDark
            ? 'bg-[#0f1422] border-amber-500/20 text-white'
            : 'bg-[#fffdf9] border-amber-200 text-slate-800 shadow-lg shadow-amber-950/5'
        }`}
      >
        {/* Notebook Tape graphic */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-3.5 bg-amber-400/30 -rotate-1 rounded-b shadow-xs pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">✍️</span>
              <h2 className="text-lg sm:text-2xl font-black font-handwriting tracking-tight">
                Rough Notes &amp; Revision Pad
              </h2>
            </div>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
              Write in Red, Blue, Black, Green pens with custom marker sticky notes.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
            <button
              onClick={() => setIsCreating(!isCreating)}
              className={`py-2 px-3.5 sm:px-4 rounded-xl sm:rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                isCreating
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 shadow-amber-500/20'
              }`}
            >
              <Plus className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isCreating ? 'rotate-45' : ''}`} />
              <span>{isCreating ? 'Close' : 'Write Note'}</span>
            </button>

            <button
              onClick={handleDownloadAllNotes}
              className={`py-2 px-3 sm:px-3.5 rounded-xl sm:rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isDark
                  ? 'bg-white/5 border-white/10 text-gray-300'
                  : 'bg-amber-50 border-amber-200 text-slate-700'
              }`}
              title="Download notes to .txt"
            >
              <Download className="w-3.5 h-3.5 text-amber-500" />
              <span>Export (.txt)</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-amber-500/15 flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 min-w-0">
            <Search
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-gray-500' : 'text-slate-400'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes (e.g. Maths, GS, Formula)..."
              className={`w-full pl-8 sm:pl-9 pr-3 py-1.5 rounded-xl text-xs sm:text-sm border outline-none transition-all ${
                isDark
                  ? 'bg-black/30 border-white/10 text-white placeholder:text-gray-500 focus:border-amber-400'
                  : 'bg-white border-amber-200 text-slate-800 placeholder:text-slate-400 focus:border-amber-500'
              }`}
            />
          </div>
          <span className={`text-[11px] sm:text-xs font-bold whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            {filteredNotes.length} {filteredNotes.length === 1 ? 'Note' : 'Notes'}
          </span>
        </div>
      </div>

      {/* Note Creation Form (Expandable) */}
      {isCreating && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          onSubmit={handleAddNote}
          className={`p-4 sm:p-6 rounded-3xl border-2 border-dashed relative ${
            isDark
              ? 'bg-[#121626] border-amber-500/30'
              : 'bg-[#fffef7] border-amber-300 shadow-md shadow-amber-900/5'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <PenTool className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-xs sm:text-base font-handwriting">
                Compose Human Study Note
              </h3>
            </div>

            {/* Quick Human-Notation Inserts */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs">
              <span className="text-[10px] opacity-70">Insert:</span>
              <button
                type="button"
                onClick={() => insertSnippet('🔴 [Important Formula]: ')}
                className="px-2 py-0.5 rounded-md bg-red-500/15 border border-red-500/30 text-red-500 text-[10px] font-bold"
              >
                🔴 Formula
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('🟢 [Short Trick]: ')}
                className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-[10px] font-bold"
              >
                🟢 Trick
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('🔵 [Concept Note]: ')}
                className="px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-500 text-[10px] font-bold"
              >
                🔵 Concept
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Note Title (e.g. Algebra Formulas, Grammar Rules)"
              className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm border outline-none font-semibold ${
                isDark
                  ? 'bg-black/40 border-white/10 text-white placeholder:text-gray-500'
                  : 'bg-white border-amber-200 text-slate-800 placeholder:text-slate-400'
              }`}
            />

            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Tag (e.g. Maths, GS, English, Reasoning)"
              className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm border outline-none ${
                isDark
                  ? 'bg-black/40 border-white/10 text-white placeholder:text-gray-500'
                  : 'bg-white border-amber-200 text-slate-800 placeholder:text-slate-400'
              }`}
            />
          </div>

          {/* Text Area with dynamic pen styling */}
          <textarea
            rows={4}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write your study notes, short tricks, or exam summary here..."
            className={`w-full p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm border outline-none mb-3 resize-y min-h-[110px] leading-relaxed ${getInkClass(
              newInkColor
            )} ${
              isDark
                ? 'bg-black/40 border-white/10 placeholder:text-gray-500'
                : 'bg-white border-amber-200 placeholder:text-slate-400'
            }`}
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Pen & Note Colors */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Pen Inks */}
              <div className="flex items-center gap-1.5">
                <span className={`text-[11px] font-bold ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                  Ink Pen:
                </span>
                {[
                  { id: 'blue', label: '🔵 Blue', bg: 'bg-blue-600' },
                  { id: 'red', label: '🔴 Red', bg: 'bg-red-600' },
                  { id: 'green', label: '🟢 Green', bg: 'bg-emerald-600' },
                  { id: 'black', label: '⚫ Black', bg: 'bg-slate-800' }
                ].map((pen) => (
                  <button
                    type="button"
                    key={pen.id}
                    onClick={() => setNewInkColor(pen.id as any)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold border transition-all cursor-pointer ${
                      newInkColor === pen.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                        : isDark
                        ? 'bg-white/5 border-white/10 text-gray-300'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    {pen.label}
                  </button>
                ))}
              </div>

              {/* Note Sticky Background */}
              <div className="flex items-center gap-1.5">
                <span className={`text-[11px] font-bold ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                  Paper:
                </span>
                {(['yellow', 'cyan', 'pink', 'green', 'slate'] as const).map((col) => (
                  <button
                    type="button"
                    key={col}
                    onClick={() => setNewColor(col)}
                    className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                      col === 'yellow'
                        ? 'bg-amber-300 border-amber-500'
                        : col === 'cyan'
                        ? 'bg-sky-300 border-sky-500'
                        : col === 'pink'
                        ? 'bg-rose-300 border-rose-500'
                        : col === 'green'
                        ? 'bg-emerald-300 border-emerald-500'
                        : 'bg-slate-300 border-slate-500'
                    } ${newColor === col ? 'scale-125 ring-2 ring-amber-400' : 'opacity-70'}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs sm:text-sm shadow-md shadow-amber-500/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Pin className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>
            </div>
          </div>
        </motion.form>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredNotes.map((note, index) => (
          <motion.div
            key={note.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.04 }}
            className={`p-4 sm:p-5 rounded-3xl border shadow-md relative group flex flex-col justify-between transition-all hover:shadow-xl ${getCardBackgroundStyle(
              note.color
            )}`}
          >
            {/* Top Tape pin */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-14 sm:w-16 h-2.5 bg-amber-300/40 rounded-xs shadow-xs -rotate-2 pointer-events-none" />

            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="font-black text-sm sm:text-base font-handwriting leading-snug line-clamp-2">
                  {note.title}
                </h4>

                {note.tag && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 shrink-0 border border-current/20">
                    {note.tag}
                  </span>
                )}
              </div>

              {/* Note Content with human pen style */}
              <div
                className={`text-xs sm:text-sm whitespace-pre-wrap leading-relaxed my-2 font-medium ${getInkClass(
                  note.inkColor
                )}`}
              >
                {note.content}
              </div>
            </div>

            {/* Note Footer with timestamp & actions */}
            <div className="pt-2.5 mt-2 border-t border-current/15 flex items-center justify-between text-xs opacity-80">
              <span className="text-[10px] sm:text-[11px] font-semibold">{note.createdAt}</span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopyNote(note)}
                  className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-pointer"
                  title="Copy note text"
                >
                  {copiedId === note.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-500 transition-colors cursor-pointer"
                  title="Delete note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

