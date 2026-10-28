import React, { useState } from 'react';
import { X, UploadCloud, Film, Image as ImageIcon, Users, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { MemorySpace, MediaItem, User } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaces: MemorySpace[];
  preselectedSpaceId?: number;
  onMemoryAdded: (media: MediaItem) => void;
}

const PRESET_MEDIA = [
  { label: 'Campus Crowd', type: 'PHOTO', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Concert Stage', type: 'PHOTO', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Lab Sprints', type: 'PHOTO', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sunset Chai', type: 'PHOTO', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sample Video Clip', type: 'VIDEO', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
];

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  isOpen,
  onClose,
  spaces,
  preselectedSpaceId,
  onMemoryAdded,
}) => {
  const { currentUser, allUsers } = useAuth();
  const { showToast } = useToast();

  const [selectedSpaceId, setSelectedSpaceId] = useState<number>(
    preselectedSpaceId || (spaces.length > 0 ? spaces[0].space_id : 1)
  );
  const [mediaType, setMediaType] = useState<'PHOTO' | 'VIDEO'>('PHOTO');
  const [mediaUrl, setMediaUrl] = useState(PRESET_MEDIA[0].url);
  const [caption, setCaption] = useState('');
  const [taggedUserIds, setTaggedUserIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleTagUser = (userId: number) => {
    setTaggedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please sign in to upload memories', 'error');
      return;
    }
    if (!selectedSpaceId) {
      showToast('Please select a memory space', 'error');
      return;
    }
    if (!mediaUrl.trim()) {
      showToast('Media URL is required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const added = await api.addMediaItem(selectedSpaceId, currentUser.user_id, {
        media_url: mediaUrl.trim(),
        media_type: mediaType,
        caption: caption.trim(),
        tagged_user_ids: taggedUserIds,
        photo_meta: mediaType === 'PHOTO' ? { width: 1920, height: 1080 } : undefined,
        video_meta: mediaType === 'VIDEO' ? { duration_seconds: 30 } : undefined,
      });

      showToast('Memory added to space successfully!', 'success');
      onMemoryAdded(added);
      onClose();

      // Reset
      setCaption('');
      setTaggedUserIds([]);
    } catch (err) {
      showToast('Failed to add memory', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Add Campus Memory</h2>
              <p className="text-xs text-slate-500">Upload photos or video clips into a Memory Space</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Target Space */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Select Memory Space *
            </label>
            <select
              value={selectedSpaceId}
              onChange={(e) => setSelectedSpaceId(parseInt(e.target.value, 10))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-500 transition"
              required
            >
              {spaces.map((s) => (
                <option key={s.space_id} value={s.space_id}>
                  {s.title} ({s.space_type})
                </option>
              ))}
            </select>
          </div>

          {/* Media Type Switcher */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Media Specialization (ISA Hierarchy)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMediaType('PHOTO')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition ${
                  mediaType === 'PHOTO'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>PHOTO (Subtype)</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaType('VIDEO')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition ${
                  mediaType === 'VIDEO'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>VIDEO (Subtype)</span>
              </button>
            </div>
          </div>

          {/* Media URL with Preview */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Media File URL *
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-500 transition mb-2"
              required
            />
            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap mb-3">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Presets:</span>
              {PRESET_MEDIA.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setMediaUrl(preset.url);
                    setMediaType(preset.type as 'PHOTO' | 'VIDEO');
                  }}
                  className="text-[11px] px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Instant Preview Box */}
            <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
              {mediaType === 'PHOTO' ? (
                <ImageWithFallback src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <video src={mediaUrl} className="w-full h-full object-contain bg-black" controls />
              )}
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Memory Caption & Context
            </label>
            <textarea
              rows={2}
              placeholder="Who was there? What was the moment about?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-500 transition resize-none"
            />
          </div>

          {/* Tag Users (M:N Table media_tag) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Tag Campus Members (M:N Relation)</span>
              </label>
              <span className="text-[11px] text-slate-400">{taggedUserIds.length} selected</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 border border-slate-200 rounded-xl bg-slate-50">
              {allUsers.map((u) => {
                const isSelected = taggedUserIds.includes(u.user_id);
                return (
                  <button
                    type="button"
                    key={u.user_id}
                    onClick={() => toggleTagUser(u.user_id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{u.full_name}</span>
                    {isSelected && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-100 transition disabled:opacity-50"
            >
              {submitting ? 'Uploading...' : 'Add Memory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
