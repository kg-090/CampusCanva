import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid,
  Columns,
  MapPin,
  Sparkles,
  ArrowUpDown,
  Image as ImageIcon,
  Play,
  Heart,
  Inbox,
} from 'lucide-react';
import { api } from '../services/api';
import { MemorySpace, MediaItem, CampusSpot, User, SpaceType } from '../types';
import { SpaceCard } from '../components/cards/SpaceCard';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

interface ExplorePageProps {
  onOpenMediaLightbox: (media: MediaItem) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onOpenMediaLightbox }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialSpot = searchParams.get('spot') ? parseInt(searchParams.get('spot')!, 10) : null;

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(initialSpot);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [viewMode, setViewMode] = useState<'spaces' | 'media'>('spaces');

  const [spaces, setSpaces] = useState<MemorySpace[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [spots, setSpots] = useState<CampusSpot[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sp, me, st, us] = await Promise.all([
          api.getMemorySpaces(),
          api.getAllMedia(),
          api.getCampusSpots(),
          api.getAllUsers(),
        ]);
        setSpaces(sp);
        setMediaList(me);
        setSpots(st);
        setUsers(us);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Spaces
  const filteredSpaces = useMemo(() => {
    return spaces
      .filter((s) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = s.title.toLowerCase().includes(q);
          const matchesDesc = s.description.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc) return false;
        }

        // Spot filter
        if (selectedSpotId !== null && s.spot_id !== selectedSpotId) {
          return false;
        }

        // Space type filter
        if (selectedType !== 'ALL' && s.space_type !== selectedType) {
          return false;
        }

        // Creator filter
        if (selectedCreatorId !== 'ALL' && s.creator_id !== parseInt(selectedCreatorId, 10)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else if (sortBy === 'oldest') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        } else {
          // Most popular by media items
          const aCount = mediaList.filter((m) => m.space_id === a.space_id).length;
          const bCount = mediaList.filter((m) => m.space_id === b.space_id).length;
          return bCount - aCount;
        }
      });
  }, [spaces, mediaList, searchQuery, selectedSpotId, selectedType, selectedCreatorId, sortBy]);

  // Filter Media
  const filteredMedia = useMemo(() => {
    return mediaList
      .filter((m) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          if (!m.caption.toLowerCase().includes(q)) return false;
        }

        const space = spaces.find((s) => s.space_id === m.space_id);
        if (selectedSpotId !== null && space?.spot_id !== selectedSpotId) {
          return false;
        }

        if (selectedType !== 'ALL' && space?.space_type !== selectedType) {
          return false;
        }

        if (selectedCreatorId !== 'ALL' && m.uploader_id !== parseInt(selectedCreatorId, 10)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
        } else {
          return new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime();
        }
      });
  }, [mediaList, spaces, searchQuery, selectedSpotId, selectedType, selectedCreatorId, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpotId(null);
    setSelectedType('ALL');
    setSelectedCreatorId('ALL');
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedSpotId !== null ||
    selectedType !== 'ALL' ||
    selectedCreatorId !== 'ALL' ||
    sortBy !== 'newest';

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Campus Archives
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse through memories, fests, batches, and locations across NSUT
          </p>
        </div>

        {/* View Mode Toggle: Spaces vs Direct Media */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('spaces')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === 'spaces'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Memory Spaces ({filteredSpaces.length})</span>
          </button>
          <button
            onClick={() => setViewMode('media')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === 'media'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>All Media ({filteredMedia.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, description, or caption..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:border-indigo-500 transition"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'popular')}
              className="w-full md:w-auto px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:bg-white focus:border-indigo-500 transition"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="popular">Sort: Most Popular</option>
            </select>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Filter className="w-3 h-3 text-indigo-600" />
            <span>Filters:</span>
          </span>

          {/* Spot Filter */}
          <select
            value={selectedSpotId ?? ''}
            onChange={(e) => setSelectedSpotId(e.target.value ? parseInt(e.target.value, 10) : null)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="">All Campus Spots</option>
            {spots.map((s) => (
              <option key={s.spot_id} value={s.spot_id}>
                📍 {s.spot_name}
              </option>
            ))}
          </select>

          {/* Space Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="ALL">All Space Types</option>
            <option value="Event">Event</option>
            <option value="Batch">Batch</option>
            <option value="Club">Club</option>
            <option value="Trip">Trip</option>
            <option value="General">General</option>
          </select>

          {/* Creator Filter */}
          <select
            value={selectedCreatorId}
            onChange={(e) => setSelectedCreatorId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="ALL">All Creators</option>
            {users.map((u) => (
              <option key={u.user_id} value={u.user_id}>
                👤 {u.full_name} ({u.user_type})
              </option>
            ))}
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Gallery Render */}
      {viewMode === 'spaces' ? (
        filteredSpaces.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">No memory spaces match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query, spot selector, or resetting active filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl hover:bg-indigo-100 transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpaces.map((space) => {
              const spot = spots.find((s) => s.spot_id === space.spot_id);
              const count = mediaList.filter((m) => m.space_id === space.space_id).length;
              return (
                <SpaceCard
                  key={space.space_id}
                  space={space}
                  spot={spot}
                  mediaCount={count}
                  memberCount={4}
                />
              );
            })}
          </div>
        )
      ) : (
        /* Media Direct View */
        filteredMedia.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">No media items found</h3>
            <p className="text-xs text-slate-500 mt-1">Try another search keyword or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map((m) => (
              <div
                key={m.media_id}
                onClick={() => onOpenMediaLightbox(m)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-950 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <ImageWithFallback
                  src={m.media_url}
                  alt={m.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                  <p className="text-xs font-medium text-white line-clamp-2">{m.caption}</p>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-300">
                    <span className="uppercase font-bold text-indigo-300">{m.media_type}</span>
                    <span>{new Date(m.uploaded_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {m.media_type === 'VIDEO' && (
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900/70 text-white flex items-center justify-center backdrop-blur-xs">
                    <Play className="w-3.5 h-3.5 ml-0.5 fill-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
