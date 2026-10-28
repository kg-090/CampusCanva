import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Heart,
  MessageCircle,
  Tag,
  Clock,
  Sparkles,
  ArrowRight,
  Inbox,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { NotificationItem } from '../types';

interface NotificationsPageProps {
  onRefreshNotifications?: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onRefreshNotifications }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    if (!currentUser) return;
    try {
      const data = await api.getNotifications(currentUser.user_id);
      setNotifications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, [currentUser]);

  const handleMarkAsRead = async (id: number) => {
    await api.markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n))
    );
    if (onRefreshNotifications) onRefreshNotifications();
  };

  const handleMarkAllRead = async () => {
    if (!currentUser) return;
    await api.markAllNotificationsAsRead(currentUser.user_id);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    showToast('All notifications marked as read', 'success');
    if (onRefreshNotifications) onRefreshNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'reaction':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-indigo-500" />;
      case 'tag':
        return <Tag className="w-4 h-4 text-purple-500" />;
      case 'capsule':
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time updates on reactions, comments, tags, and unlocked time capsules
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-slate-500" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-900 text-sm">No notifications yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            When friends tag you or react to your memories, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.notification_id}
              onClick={() => handleMarkAsRead(n.notification_id)}
              className={`p-4 rounded-2xl border transition flex items-start gap-3.5 cursor-pointer ${
                !n.is_read
                  ? 'bg-indigo-50/40 border-indigo-200 hover:bg-indigo-50/70 shadow-2xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <span className="text-[10px] text-slate-400">
                    {new Date(n.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>

                {n.target_url && (
                  <Link
                    to={n.target_url}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 mt-2"
                  >
                    <span>View in Space</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {!n.is_read && (
                <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-2"></span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
