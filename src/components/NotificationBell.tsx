import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Check,
  CheckCheck,
  Radio,
  BookOpen,
  FileText,
  Sparkles,
  Trash2,
  X,
  Clock
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationBellProps {
  theme: string;
  onOpenNotes?: () => void;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '🔴 Live Class Alert: GS & Science',
    message: 'General Science & Current Affairs rapid revision class is scheduled live today.',
    type: 'live',
    timestamp: '10 min ago',
    read: false,
    tag: 'Live Alert',
    linkText: 'Join Live'
  },
  {
    id: 'notif-2',
    title: '📚 New Study Material Uploaded',
    message: 'Maths Formula Sheets, Static GK PDF & Chapter-wise DPPs have been added.',
    type: 'material',
    timestamp: '1 hour ago',
    read: false,
    tag: 'Notes & DPP',
    linkText: 'Open Notes'
  },
  {
    id: 'notif-3',
    title: '📝 Test Series: Full Mock Test Live',
    message: 'SSC & Railway Full Length 100-Question Simulated Mock Test with detailed solutions is now active.',
    type: 'test',
    timestamp: '3 hours ago',
    read: false,
    tag: 'Mock Test',
    linkText: 'Attempt Test'
  },
  {
    id: 'notif-4',
    title: '🚀 High-Speed Video Player Updated',
    message: '1080p, 720p, 480p multi-quality video lectures with instant speed controls (0.5x to 2x) are available.',
    type: 'system',
    timestamp: 'Yesterday',
    read: true,
    tag: 'Batch Update'
  }
];

export const NotificationBell: React.FC<NotificationBellProps> = ({
  theme,
  onOpenNotes
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('nst_study_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse notifications', e);
      }
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark' || theme === 'cosmic-dark';

  useEffect(() => {
    localStorage.setItem('nst_study_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const restoreDefaults = () => {
    setNotifications(DEFAULT_NOTIFICATIONS);
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'live':
        return <Radio className="w-4 h-4 text-red-500 animate-pulse" />;
      case 'material':
        return <BookOpen className="w-4 h-4 text-emerald-500" />;
      case 'test':
        return <FileText className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Study Alerts and Notifications"
        title="Study Alerts & Notifications"
        className={`relative p-2 sm:p-2.5 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-center ${
          isOpen
            ? isDark
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
            : isDark
            ? 'bg-white/[0.05] text-slate-300 hover:text-white hover:bg-white/[0.1] border border-white/10 shadow-xs'
            : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-amber-50/50 border border-amber-200/80 shadow-xs'
        }`}
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5 transition-transform hover:scale-105" />

        {/* Unread Badge & Animated Ping */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 text-white text-[10px] font-bold items-center justify-center shadow-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={`absolute right-0 mt-2.5 w-[310px] sm:w-[370px] rounded-2xl shadow-2xl border z-50 overflow-hidden ${
              isDark
                ? 'bg-[#0d1224]/95 backdrop-blur-xl border-white/15 text-slate-100 shadow-black/80'
                : 'bg-white/95 backdrop-blur-xl border-amber-200 text-slate-900 shadow-amber-950/10'
            }`}
          >
            {/* Header */}
            <div
              className={`p-3.5 px-4 flex items-center justify-between border-b ${
                isDark ? 'border-white/10 bg-[#070a14]/60' : 'border-amber-100 bg-amber-50/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-tight">Study Notifications</h3>
                  <p className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All alerts read'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    title="Mark all as read"
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                      isDark
                        ? 'bg-white/10 hover:bg-white/20 text-slate-300'
                        : 'bg-amber-100/70 hover:bg-amber-200/80 text-amber-900'
                    }`}
                  >
                    <CheckCheck className="w-3 h-3 text-amber-500" />
                    <span>Read all</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-current/10 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-10 px-4 text-center">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-2.5">
                    <Check className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold">No new notifications</p>
                  <p className={`text-[11px] mt-1 max-w-[220px] mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    You're all caught up with your study schedules and materials.
                  </p>
                  <button
                    onClick={restoreDefaults}
                    className="mt-3 text-[11px] font-semibold text-amber-500 hover:underline cursor-pointer"
                  >
                    Reset study alerts
                  </button>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 transition-colors relative group flex gap-3 items-start ${
                      !item.read
                        ? isDark
                          ? 'bg-amber-500/10 hover:bg-amber-500/15'
                          : 'bg-amber-50/70 hover:bg-amber-50'
                        : isDark
                        ? 'hover:bg-white/[0.04]'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Unread indicator */}
                    {!item.read && (
                      <span className="absolute left-1.5 top-5 w-1.5 h-1.5 rounded-full bg-amber-500" />
                    )}

                    {/* Icon */}
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isDark ? 'bg-[#070a14] border border-white/10' : 'bg-white shadow-xs border border-amber-200'
                      }`}
                    >
                      {getIcon(item.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span className="text-xs font-bold line-clamp-1 leading-snug">
                          {item.title}
                        </span>
                        {item.tag && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                              item.type === 'live'
                                ? 'bg-red-500/10 text-red-500'
                                : item.type === 'material'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {item.tag}
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-[11px] leading-relaxed line-clamp-2 ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {item.message}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-0.5">
                        <span className={`text-[10px] flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          <Clock className="w-3 h-3" />
                          {item.timestamp}
                        </span>

                        {item.linkText && item.type === 'material' && onOpenNotes && (
                          <button
                            onClick={() => {
                              setIsOpen(false);
                              onOpenNotes();
                            }}
                            className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                          >
                            {item.linkText} →
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Quick action buttons */}
                    <div className="absolute right-2 top-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => toggleRead(item.id, e)}
                        title={item.read ? 'Mark as unread' : 'Mark as read'}
                        className={`p-1 rounded-md transition-colors cursor-pointer ${
                          isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-amber-100 text-slate-500'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => deleteNotification(item.id, e)}
                        title="Dismiss"
                        className={`p-1 rounded-md transition-colors cursor-pointer ${
                          isDark ? 'hover:bg-white/10 text-red-400' : 'hover:bg-amber-100 text-red-500'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div
                className={`p-2.5 px-4 flex items-center justify-between border-t text-[11px] ${
                  isDark ? 'border-white/10 bg-[#070a14]/60 text-slate-400' : 'border-amber-100 bg-amber-50/60 text-slate-500'
                }`}
              >
                <span>Live alerts &amp; Study feeds</span>
                <button
                  onClick={clearAll}
                  className="text-red-500 hover:text-red-600 font-semibold cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
