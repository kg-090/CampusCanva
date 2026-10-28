import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderHeart, PlusCircle, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { MemorySpace, CampusSpot, MediaItem, MemberRole } from '../types';
import { SpaceCard } from '../components/cards/SpaceCard';

interface MySpacesPageProps {
  onOpenCreateModal: () => void;
}

export const MySpacesPage: React.FC<MySpacesPageProps> = ({ onOpenCreateModal }) => {
  const { currentUser } = useAuth();
  const [userSpaces, setUserSpaces] = useState<(MemorySpace & { user_role: MemberRole })[]>([]);
  const [spots, setSpots] = useState<CampusSpot[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const load = async () => {
      try {
        const [sp, st, me] = await Promise.all([
          api.getUserSpaces(currentUser.user_id),
          api.getCampusSpots(),
          api.getAllMedia(),
        ]);
        setUserSpaces(sp);
        setSpots(st);
        setMediaList(me);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <FolderHeart className="w-3.5 h-3.5" />
            <span>M:N Relation (space_member)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Memory Spaces
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Collaborative spaces where you are an Admin, Contributor, or Viewer.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Space</span>
        </button>
      </div>

      {userSpaces.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <FolderHeart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-base">You haven't joined any spaces yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Create your first memory space or browse explore page to join existing college spaces.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition"
          >
            Create Memory Space
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userSpaces.map((space) => {
            const spot = spots.find((s) => s.spot_id === space.spot_id);
            const count = mediaList.filter((m) => m.space_id === space.space_id).length;
            return (
              <div key={space.space_id} className="relative">
                <SpaceCard
                  space={space}
                  spot={spot}
                  mediaCount={count}
                  memberCount={4}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
