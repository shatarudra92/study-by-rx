export interface HandwrittenSticker {
  id: string;
  emoji: string;
  label: string;
  bgGradient: string;
  borderCol: string;
  textCol: string;
  rotation: string;
  tapeColor: string;
}

export const HANDWRITTEN_STICKERS: HandwrittenSticker[] = [
  {
    id: 'top-priority',
    emoji: '🔥',
    label: 'Top Priority',
    bgGradient: 'from-amber-400/20 to-orange-500/20',
    borderCol: 'border-amber-400/40',
    textCol: 'text-amber-500 dark:text-amber-300',
    rotation: '-rotate-2',
    tapeColor: 'bg-amber-400/40'
  },
  {
    id: 'daily-target',
    emoji: '🎯',
    label: 'Daily Target',
    bgGradient: 'from-emerald-400/20 to-teal-500/20',
    borderCol: 'border-emerald-400/40',
    textCol: 'text-emerald-500 dark:text-emerald-300',
    rotation: 'rotate-1',
    tapeColor: 'bg-emerald-400/40'
  },
  {
    id: 'ssc-cgl',
    emoji: '⭐',
    label: 'Dream Post',
    bgGradient: 'from-yellow-400/20 to-amber-500/20',
    borderCol: 'border-yellow-400/40',
    textCol: 'text-yellow-600 dark:text-yellow-300',
    rotation: '-rotate-3',
    tapeColor: 'bg-yellow-400/40'
  },
  {
    id: 'mastery',
    emoji: '⚡',
    label: 'Speed Drill',
    bgGradient: 'from-cyan-400/20 to-blue-500/20',
    borderCol: 'border-cyan-400/40',
    textCol: 'text-cyan-600 dark:text-cyan-300',
    rotation: 'rotate-2',
    tapeColor: 'bg-cyan-400/40'
  },
  {
    id: 'revision',
    emoji: '📝',
    label: 'Revise 3X',
    bgGradient: 'from-purple-400/20 to-pink-500/20',
    borderCol: 'border-purple-400/40',
    textCol: 'text-purple-600 dark:text-purple-300',
    rotation: '-rotate-1',
    tapeColor: 'bg-purple-400/40'
  },
  {
    id: 'doubt-solve',
    emoji: '💡',
    label: 'Key Concepts',
    bgGradient: 'from-rose-400/20 to-pink-500/20',
    borderCol: 'border-rose-400/40',
    textCol: 'text-rose-600 dark:text-rose-300',
    rotation: 'rotate-3',
    tapeColor: 'bg-rose-400/40'
  },
  {
    id: 'exam-crack',
    emoji: '🏆',
    label: 'AIR 1 Rank',
    bgGradient: 'from-amber-300/30 to-yellow-500/30',
    borderCol: 'border-amber-400/50',
    textCol: 'text-amber-700 dark:text-amber-200',
    rotation: '-rotate-2',
    tapeColor: 'bg-amber-300/50'
  },
  {
    id: 'daily-streak',
    emoji: '☕',
    label: 'Daily Study',
    bgGradient: 'from-stone-400/20 to-amber-700/20',
    borderCol: 'border-amber-700/30',
    textCol: 'text-amber-800 dark:text-amber-200',
    rotation: 'rotate-1',
    tapeColor: 'bg-amber-600/30'
  }
];
