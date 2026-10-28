import React, { useState, useEffect } from 'react';
import { Clock, Lock, Unlock, Sparkles, PlusCircle } from 'lucide-react';
import { api } from '../services/api';
import { MemorySpace, CampusSpot, MediaItem } from '../types';
import { TimeCapsuleCard } from '../components/cards/TimeCapsuleCard';

interface TimeCapsulesPageProps {
  onOpenCreateModal: () => void;
}

export const TimeCapsulesPage: React.FC<TimeCapsulesPageProps> = ({ onOpenCreateModal }) => {
  const [spaces, setSpaces] = useState<MemorySpace[]>([]);
  const [spots, setSpots] = useState<CampusSpot[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'locked' | 'unlocked'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sp, st, me] = await Promise.all([
          api.getMemorySpaces(),
          api.getCampusSpots(),
          api.getAllMedia(),
        ]);
        setSpaces(sp.filter((s) => s.is_time_locked));
        setSpots(st);
        setMediaList(me);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const now = Date.now();
  const lockedCapsules = spaces.filter((s) => s.unlock_date && new Date(s.unlock_date).getTime() > now);
  const unlockedCapsules = spaces.filter((s) => s.unlock_date && new Date(s.unlock_date).getTime() <= now);

  const displayedCapsules =
    filter === 'locked' ? lockedCapsules : filter === 'unlocked' ? unlockedCapsules : spaces;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Time-Locked Relational Vaults</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Time Capsules
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Vault college moments, farewell predictions, and batch letters to be revealed automatically
            on future milestone dates.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Capsule</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl transition ${
            filter === 'all'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Capsules ({spaces.length})
        </button>
        <button
          onClick={() => setFilter('locked')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            filter === 'locked'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Locked ({lockedCapsules.length})</span>
        </button>
        <button
          onClick={() => setFilter('unlocked')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            filter === 'unlocked'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Unlock className="w-3.5 h-3.5" />
          <span>Unlocked ({unlockedCapsules.length})</span>
        </button>
      </div>

      {/* Capsules Grid */}
      {displayedCapsules.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-base">No capsules found</h3>
          <p className="text-xs text-slate-500 mt-1">Create a time capsule to preserve memories for the future!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCapsules.map((capsule) => {
            const spot = spots.find((s) => s.spot_id === capsule.spot_id);
            const count = mediaList.filter((m) => m.space_id === capsule.space_id).length;
            return <TimeCapsuleCard key={capsule.space_id} space={capsule} spot={spot} mediaCount={count} />;
          })}
        </div>
      )}
    </div>
  );
};
