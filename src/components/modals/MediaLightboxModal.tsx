import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  ThumbsUp,
  Smile,
  CloudMoon,
  MessageCircle,
  Tag,
  Send,
  Trash2,
  Database,
  Calendar,
  User as UserIcon,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useDemo } from '../../context/DemoContext';
import { api } from '../../services/api';
import { MediaItem, Reaction, Comment, FullUserProfile, ReactionType } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface MediaLightboxModalProps {
  media: MediaItem | null;
  onClose: () => void;
  onDeleteMedia?: (mediaId: number) => void;
}

export const MediaLightboxModal: React.FC<MediaLightboxModalProps> = ({
  media,
  onClose,
  onDeleteMedia,
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const { openInspector, isDemoMode } = useDemo();

  const [uploader, setUploader] = useState<FullUserProfile | null>(null);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [comments, setComments] = useState<(Comment & { user: FullUserProfile })[]>([]);
  const [taggedUsers, setTaggedUsers] = useState<FullUserProfile[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (!media) return;

    // Load related relational data
    const loadMediaDetails = async () => {
      try {
        const u = await api.getUserProfile(media.uploader_id);
        setUploader(u);

        const r = await api.getMediaReactions(media.media_id);
        setReactions(r);

        const c = await api.getMediaComments(media.media_id);
        setComments(c);

        const t = await api.getMediaTags(media.media_id);
        setTaggedUsers(t.map((tag) => tag.user));
      } catch (e) {
        console.error(e);
      }
    };

    loadMediaDetails();
  }, [media]);

  if (!media) return null;

  // Reaction counts & states
  const reactionTypes: { type: ReactionType; label: string; icon: string }[] = [
    { type: 'Heart', label: 'Heart', icon: '❤️' },
    { type: 'Like', label: 'Like', icon: '👍' },
    { type: 'Nostalgic', label: 'Nostalgic', icon: '💭' },
    { type: 'Laugh', label: 'Laugh', icon: '😂' },
  ];

  const handleToggleReaction = async (type: ReactionType) => {
    if (!currentUser) {
      showToast('Please sign in to react', 'error');
      return;
    }
    try {
      const res = await api.toggleReaction(media.media_id, currentUser.user_id, type);
      if (res.added && res.reaction) {
        setReactions((prev) => [...prev, res.reaction!]);
      } else {
        setReactions((prev) =>
          prev.filter(
            (r) => !(r.media_id === media.media_id && r.user_id === currentUser.user_id && r.reaction_type === type)
          )
        );
      }
    } catch (e) {
      showToast('Could not update reaction', 'error');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please sign in to comment', 'error');
      return;
    }
    if (!newCommentText.trim()) return;

    setSubmittingComment(true);
    try {
      const created = await api.addComment(media.media_id, currentUser.user_id, newCommentText.trim());
      setComments((prev) => [...prev, created]);
      setNewCommentText('');
      showToast('Comment posted! (Weak entity key assigned)', 'success');
    } catch (e) {
      showToast('Failed to post comment', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentNo: number) => {
    try {
      await api.deleteComment(media.media_id, commentNo);
      setComments((prev) => prev.filter((c) => c.comment_no !== commentNo));
      showToast('Comment deleted', 'info');
    } catch (e) {
      showToast('Failed to delete comment', 'error');
    }
  };

  const canDeleteMedia = currentUser?.user_id === media.uploader_id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-800 flex flex-col md:flex-row">
        {/* Left: Media Viewport */}
        <div className="md:w-3/5 bg-slate-950 flex flex-col items-center justify-center relative min-h-[300px] md:min-h-[560px]">
          {media.media_type === 'PHOTO' ? (
            <ImageWithFallback
              src={media.media_url}
              alt={media.caption}
              className="w-full h-full max-h-[70vh] object-contain"
            />
          ) : (
            <video
              src={media.media_url}
              controls
              autoPlay
              className="w-full h-full max-h-[70vh] object-contain"
            />
          )}

          {/* DBMS Inspector Quick Pill */}
          {isDemoMode && (
            <button
              onClick={() => openInspector('media', media.media_id)}
              className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-indigo-300 border border-indigo-500/30 text-xs backdrop-blur-md transition"
              title="Inspect MEDIA_ITEM relation"
            >
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>Inspect SQL Tuple</span>
            </button>
          )}
        </div>

        {/* Right: Sidebar / Comments / Metadata */}
        <div className="md:w-2/5 flex flex-col justify-between bg-white border-t md:border-t-0 md:border-l border-slate-100 max-h-[50vh] md:max-h-[92vh] overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={uploader?.avatar_url}
                alt={uploader?.full_name || 'Uploader'}
                className="w-10 h-10 rounded-full ring-1 ring-slate-200"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  {uploader?.full_name || 'Campus Student'}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="font-semibold text-indigo-600 text-[10px] uppercase">
                    {uploader?.user_type}
                  </span>
                  <span>•</span>
                  <span>{new Date(media.uploaded_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {canDeleteMedia && onDeleteMedia && (
                <button
                  onClick={() => {
                    if (confirm('Delete this memory?')) {
                      onDeleteMedia(media.media_id);
                      onClose();
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                  title="Delete media item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Center: Caption, Tags, Comments */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Caption */}
            {media.caption && (
              <div className="text-sm text-slate-800 leading-relaxed font-normal bg-slate-50 p-3 rounded-2xl border border-slate-100">
                {media.caption}
              </div>
            )}

            {/* Tagged People (media_tag table) */}
            {taggedUsers.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-indigo-600" />
                  <span>Tagged In Memory</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {taggedUsers.map((tu) => (
                    <span
                      key={tu.user_id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                    >
                      @{tu.full_name.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Thread (Weak Entity Section) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Comments ({comments.length})</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Weak Entity: (media_id, comment_no)
                </span>
              </div>

              {comments.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No comments yet. Share your campus thoughts!
                </div>
              ) : (
                <div className="space-y-3">
                  {comments.map((c) => (
                    <div
                      key={c.comment_no}
                      className="group flex items-start gap-2.5 text-xs bg-slate-50/70 p-2.5 rounded-xl border border-slate-100/80"
                    >
                      <ImageWithFallback
                        src={c.user?.avatar_url}
                        alt={c.user?.full_name}
                        className="w-7 h-7 rounded-full shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{c.user?.full_name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">#{c.comment_no}</span>
                        </div>
                        <p className="text-slate-700 mt-0.5 leading-snug break-words">{c.comment_text}</p>
                      </div>

                      {currentUser?.user_id === c.user_id && (
                        <button
                          onClick={() => handleDeleteComment(c.comment_no)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition"
                          title="Delete comment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer: Reactions Bar & Comment Input */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
            {/* Reaction Pills */}
            <div className="flex items-center justify-between gap-1">
              {reactionTypes.map((rt) => {
                const count = reactions.filter((r) => r.reaction_type === rt.type).length;
                const hasReacted = reactions.some(
                  (r) => r.reaction_type === rt.type && r.user_id === currentUser?.user_id
                );

                return (
                  <button
                    key={rt.type}
                    onClick={() => handleToggleReaction(rt.type)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                      hasReacted
                        ? 'bg-indigo-100/70 border-indigo-300 text-indigo-900 scale-105'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{rt.icon}</span>
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Post Comment Input */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 transition"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim() || submittingComment}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
