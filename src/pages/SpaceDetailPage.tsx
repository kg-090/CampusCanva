import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Users,
  Image as ImageIcon,
  Lock,
  Unlock,
  Shield,
  PlusCircle,
  Trash2,
  Edit,
  Database,
  ArrowLeft,
  Sparkles,
  Play,
  LogOut,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDemo } from '../context/DemoContext';
import { api } from '../services/api';
import {
  MemorySpace,
  MediaItem,
  SpaceMember,
  CampusSpot,
  FullUserProfile,
  MemberRole,
} from '../types';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

interface SpaceDetailPageProps {
  onOpenAddMemory: (spaceId: number) => void;
  onOpenMediaLightbox: (media: MediaItem) => void;
}

export const SpaceDetailPage: React.FC<SpaceDetailPageProps> = ({
  onOpenAddMemory,
  onOpenMediaLightbox,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, allUsers } = useAuth();
  const { showToast } = useToast();
  const { openInspector, isDemoMode } = useDemo();

  const spaceId = id ? parseInt(id, 10) : 0;

  const [space, setSpace] = useState<MemorySpace | null>(null);
  const [creator, setCreator] = useState<FullUserProfile | null>(null);
  const [spot, setSpot] = useState<CampusSpot | null>(null);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [members, setMembers] = useState<(SpaceMember & { user: FullUserProfile })[]>([]);
  const [activeTab, setActiveTab] = useState<'memories' | 'members' | 'about'>('memories');
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Time capsule ticker
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  const loadData = async () => {
    try {
      const sp = await api.getMemorySpaceById(spaceId);
      if (!sp) {
        showToast('Memory Space not found', 'error');
        navigate('/explore');
        return;
      }
      setSpace(sp);

      const [c, s, m, mem] = await Promise.all([
        api.getUserProfile(sp.creator_id),
        sp.spot_id ? api.getCampusSpotById(sp.spot_id) : Promise.resolve(null),
        api.getMediaBySpaceId(spaceId),
        api.getSpaceMembers(spaceId),
      ]);

      setCreator(c);
      setSpot(s);
      setMediaList(m);
      setMembers(mem);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (spaceId) loadData();
  }, [spaceId]);

  // Live countdown calculation for Time Capsule
  useEffect(() => {
    if (!space?.unlock_date) return;

    const tick = () => {
      const diff = new Date(space.unlock_date!).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isPast: false });
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [space?.unlock_date]);

  if (loading || !space) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-500">Loading memory space...</p>
      </div>
    );
  }

  // Determine current user membership & role
  const userMembership = members.find((m) => m.user_id === currentUser?.user_id);
  const userRole: MemberRole | null = userMembership ? userMembership.role_type : null;
  const isAdmin = userRole === 'Admin' || currentUser?.user_id === space.creator_id;
  const isContributor = isAdmin || userRole === 'Contributor';
  const isLocked = space.is_time_locked && !timeLeft.isPast;

  // Actions
  const handleJoinSpace = async (role: MemberRole = 'Contributor') => {
    if (!currentUser) {
      showToast('Please sign in to join this space', 'error');
      return;
    }
    try {
      await api.addSpaceMember(spaceId, currentUser.user_id, role);
      showToast(`Joined space as ${role}!`, 'success');
      loadData();
    } catch (e) {
      showToast('Could not join space', 'error');
    }
  };

  const handleLeaveSpace = async () => {
    if (!currentUser) return;
    try {
      await api.removeSpaceMember(spaceId, currentUser.user_id);
      showToast('Left memory space', 'info');
      loadData();
    } catch (e) {
      showToast('Could not leave space', 'error');
    }
  };

  const handleDeleteSpace = async () => {
    try {
      await api.deleteMemorySpace(spaceId);
      showToast('Memory Space deleted', 'info');
      navigate('/dashboard');
    } catch (e) {
      showToast('Failed to delete space', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Back link & Actions Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Spaces</span>
        </Link>

        {isDemoMode && (
          <button
            onClick={() => openInspector('space', space.space_id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold transition hover:bg-indigo-100"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Inspect MEMORY_SPACE Schema</span>
          </button>
        )}
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Cover Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <ImageWithFallback
            src={space.cover_url}
            alt={space.title}
            className={`w-full h-full object-cover ${isLocked ? 'filter blur-xs brightness-75' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/90 text-slate-900 backdrop-blur-md shadow-xs">
              {space.space_type}
            </span>

            {space.is_time_locked && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5 shadow-md ${
                  isLocked ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              >
                {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{isLocked ? 'Time-Locked' : 'Unlocked Vault'}</span>
              </span>
            )}
          </div>

          {/* Title & Metadata Bottom Overlay */}
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight drop-shadow-md">
              {space.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90 mt-2 font-medium">
              {spot && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-300" />
                  <span>{spot.spot_name}</span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-300" />
                <span>Created {new Date(space.created_at).toLocaleDateString()}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-300" />
                <span>{members.length} Members</span>
              </span>
            </div>
          </div>
        </div>

        {/* Space Action Toolbar */}
        <div className="p-5 sm:p-6 bg-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src={creator?.avatar_url}
              alt={creator?.full_name || 'Creator'}
              className="w-11 h-11 rounded-full ring-2 ring-indigo-100"
            />
            <div>
              <div className="text-xs text-slate-400 font-medium">Space Creator</div>
              <div className="text-sm font-bold text-slate-900">{creator?.full_name}</div>
            </div>

            {userRole && (
              <span className="ml-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                Your Role: {userRole}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!userMembership ? (
              <button
                onClick={() => handleJoinSpace('Contributor')}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>Join Space</span>
              </button>
            ) : (
              !isAdmin && (
                <button
                  onClick={handleLeaveSpace}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-xl text-xs font-bold transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Leave</span>
                </button>
              )
            )}

            {isContributor && (!isLocked || isAdmin) && (
              <button
                onClick={() => onOpenAddMemory(space.space_id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition border border-indigo-200"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Memory</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                title="Delete Space"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 flex items-center gap-8 border-b border-slate-100 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('memories')}
            className={`py-3.5 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'memories'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Memories ({mediaList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`py-3.5 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'members'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Members ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`py-3.5 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'about'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>About Space & Spot</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'memories' && (
        <div>
          {isLocked ? (
            /* Time Locked Vault Screen */
            <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-200 text-center shadow-xs max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                "This memory is waiting for its moment."
              </h2>
              <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                This memory space is locked as a future time capsule. All photos, clips, and messages
                will automatically unlock and reveal themselves when the countdown hits zero.
              </p>

              {/* Countdown Clock */}
              <div className="mt-8 grid grid-cols-4 gap-3 max-w-sm mx-auto">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-2xl font-black text-slate-900 font-mono">{timeLeft.days}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Days</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Hours</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Mins</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-2xl font-black text-amber-600 font-mono">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Secs</div>
                </div>
              </div>

              <div className="mt-6 text-[11px] text-slate-400">
                Unlock Target: {new Date(space.unlock_date!).toLocaleString()}
              </div>
            </div>
          ) : mediaList.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">No memories uploaded yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Be the first to add a photograph or video to this space!
              </p>
              {isContributor && (
                <button
                  onClick={() => onOpenAddMemory(space.space_id)}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition"
                >
                  Upload First Memory
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediaList.map((m) => (
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
          )}
        </div>
      )}

      {/* Tab: Members */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Space Community & Roles</h3>
              <p className="text-xs text-slate-500">M:N Relation resolved via space_member</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {members.map((m) => (
              <div
                key={m.user_id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <ImageWithFallback
                    src={m.user.avatar_url}
                    alt={m.user.full_name}
                    className="w-10 h-10 rounded-full shrink-0"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{m.user.full_name}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                      {m.user.user_type}
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    m.role_type === 'Admin'
                      ? 'bg-purple-100 text-purple-700'
                      : m.role_type === 'Contributor'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {m.role_type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: About */}
      {activeTab === 'about' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">About This Memory Space</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{space.description}</p>
          </div>

          {spot && (
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              <div className="flex items-center gap-2 mb-2 text-indigo-950 font-bold text-sm">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>Associated Campus Landmark: {spot.spot_name}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{spot.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block">Primary Key (PK)</span>
              <span className="font-mono text-slate-800 font-bold">space_id = {space.space_id}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Creator Foreign Key</span>
              <span className="font-mono text-slate-800 font-bold">creator_id = {space.creator_id}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Spot Foreign Key</span>
              <span className="font-mono text-slate-800 font-bold">spot_id = {space.spot_id || 'NULL'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Time Lock Constraint</span>
              <span className="font-mono text-slate-800 font-bold">
                {space.is_time_locked ? 'TRUE (CHECK chk_timelock)' : 'FALSE'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Space Deletion */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Memory Space?"
        message={`Are you sure you want to permanently delete "${space.title}" and its ${mediaList.length} media items? This action cannot be undone.`}
        confirmLabel="Delete Space"
        onConfirm={handleDeleteSpace}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};
