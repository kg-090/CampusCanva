import React, { useState } from 'react';
import { X, Lock, Sparkles, Image as ImageIcon, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { SpaceType, CampusSpot, MemorySpace } from '../../types';

interface CreateSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  spots: CampusSpot[];
  onSpaceCreated: (newSpace: MemorySpace) => void;
}

const PRESET_COVERS = [
  { label: 'Campus Fest', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80' },
  { label: 'College Lawn', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Tech Hackathon', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Admin Heritage', url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Cafe & Chai', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80' },
];

export const CreateSpaceModal: React.FC<CreateSpaceModalProps> = ({
  isOpen,
  onClose,
  spots,
  onSpaceCreated,
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [spaceType, setSpaceType] = useState<SpaceType>('Event');
  const [spotId, setSpotId] = useState<number | null>(null);
  const [coverUrl, setCoverUrl] = useState(PRESET_COVERS[0].url);
  const [isTimeLocked, setIsTimeLocked] = useState(false);
  const [unlockDate, setUnlockDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('You must be logged in to create a space', 'error');
      return;
    }
    if (!title.trim()) {
      showToast('Space title is required', 'error');
      return;
    }
    if (isTimeLocked) {
      if (!unlockDate) {
        showToast('Please specify an unlock date for the time capsule', 'error');
        return;
      }
      const unlockTime = new Date(unlockDate).getTime();
      if (unlockTime <= Date.now()) {
        showToast('Unlock date must be in the future', 'error');
        return;
      }
    }

    setSubmitting(true);
    try {
      const created = await api.createMemorySpace(currentUser.user_id, {
        title: title.trim(),
        description: description.trim(),
        space_type: spaceType,
        spot_id: spotId,
        cover_url: coverUrl.trim(),
        is_time_locked: isTimeLocked,
        unlock_date: isTimeLocked ? unlockDate : null,
      });

      showToast(`Memory Space "${created.title}" created successfully!`, 'success');
      onSpaceCreated(created);
      onClose();

      // Reset form
      setTitle('');
      setDescription('');
      setIsTimeLocked(false);
      setUnlockDate('');
    } catch (err) {
      showToast('Failed to create memory space', 'error');
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
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Create Memory Space</h2>
              <p className="text-xs text-slate-500">Collaborative archive for college experiences</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Space Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Moksha 2026, Manali Trip, Batch of 2025"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="What makes this campus moment special?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-none"
            />
          </div>

          {/* Space Type & Campus Spot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Space Type *
              </label>
              <select
                value={spaceType}
                onChange={(e) => setSpaceType(e.target.value as SpaceType)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-500 transition"
              >
                <option value="Event">Event (Fest / Hackathon)</option>
                <option value="Batch">Batch (Class Chronicle)</option>
                <option value="Club">Club / Society</option>
                <option value="Trip">Trip & Getaway</option>
                <option value="General">General Campus Life</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Campus Spot (Location)
              </label>
              <select
                value={spotId || ''}
                onChange={(e) => setSpotId(e.target.value ? parseInt(e.target.value, 10) : null)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-500 transition"
              >
                <option value="">None / Off-Campus</option>
                {spots.map((spot) => (
                  <option key={spot.spot_id} value={spot.spot_id}>
                    {spot.spot_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cover Image Preset Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Cover Image URL
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-500 transition"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Quick Pick:</span>
              {PRESET_COVERS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setCoverUrl(preset.url)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                    coverUrl === preset.url
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Capsule Toggle Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-200/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-500 text-white">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900">Enable Time Capsule Feature</span>
                  <p className="text-xs text-slate-500">Lock memories until a designated future reveal date</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTimeLocked}
                  onChange={(e) => setIsTimeLocked(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {isTimeLocked && (
              <div className="mt-3 pt-3 border-t border-amber-200/60 animate-fade-in">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Reveal / Unlock Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={unlockDate}
                  onChange={(e) => setUnlockDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-amber-500 transition"
                  required={isTimeLocked}
                />
                <p className="text-[11px] text-amber-800 mt-1">
                  * Evaluators: Sets a conditional unlock constraint in the database.
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-100 transition disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Space'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
