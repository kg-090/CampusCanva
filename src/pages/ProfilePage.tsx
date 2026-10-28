import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Briefcase,
  UserCheck,
  Edit3,
  Layers,
  Image as ImageIcon,
  Sparkles,
  X,
  Save,
  Database,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDemo } from '../context/DemoContext';
import { api } from '../services/api';
import { MemorySpace, MediaItem } from '../types';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

interface ProfilePageProps {
  onOpenMediaLightbox: (media: MediaItem) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onOpenMediaLightbox }) => {
  const { currentUser, updateProfile, switchUser, allUsers } = useAuth();
  const { showToast } = useToast();
  const { openInspector, isDemoMode } = useDemo();

  const [mySpaces, setMySpaces] = useState<MemorySpace[]>([]);
  const [myMedia, setMyMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    const loadProfileData = async () => {
      try {
        const [allSpaces, allMedia] = await Promise.all([
          api.getMemorySpaces(),
          api.getAllMedia(),
        ]);
        setMySpaces(allSpaces.filter((s) => s.creator_id === currentUser.user_id));
        setMyMedia(allMedia.filter((m) => m.uploader_id === currentUser.user_id));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, [currentUser]);

  if (!currentUser) return null;

  const handleOpenEdit = () => {
    setEditName(currentUser.full_name);
    setEditBio(currentUser.bio || '');
    setEditPhone(currentUser.phone || '');
    setEditAvatar(currentUser.avatar_url);
    setIsEditOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }
    await updateProfile({
      full_name: editName.trim(),
      bio: editBio.trim(),
      phone: editPhone.trim(),
      avatar_url: editAvatar.trim(),
    });
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="h-36 sm:h-48 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 relative">
          {isDemoMode && (
            <button
              onClick={() => openInspector('user', currentUser.user_id)}
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs backdrop-blur-md transition border border-white/20"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Inspect USERS ISA Schema</span>
            </button>
          )}
        </div>

        <div className="px-6 sm:px-10 pb-8 relative pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <ImageWithFallback
                src={currentUser.avatar_url}
                alt={currentUser.full_name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-white shadow-xl bg-white"
              />
              <div className="mt-2 sm:mt-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {currentUser.full_name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {currentUser.user_type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{currentUser.email}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenEdit}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition self-start sm:self-auto"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Bio */}
          {currentUser.bio && (
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {currentUser.bio}
            </p>
          )}

          {/* SPECIALIZATION (ISA) SUB-ENTITY ATTRIBUTES */}
          <div className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100/80 mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Generalization / Specialization Data (Subtype: {currentUser.user_type})</span>
            </div>

            {currentUser.student && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    Roll Number (Unique PK/FK)
                  </span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block font-mono">
                    {currentUser.student.roll_number}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    Department
                  </span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                    {currentUser.student.department}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    Batch Year
                  </span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                    {currentUser.student.batch_year}
                  </span>
                </div>
              </div>
            )}

            {currentUser.alumni && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    Graduation Year
                  </span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                    Class of {currentUser.alumni.graduation_year}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    Current Company / Organization
                  </span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                    {currentUser.alumni.current_company}
                  </span>
                </div>
              </div>
            )}

            {currentUser.faculty && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    Employee Number
                  </span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block font-mono">
                    {currentUser.faculty.employee_no}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    Designation
                  </span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                    {currentUser.faculty.designation}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    Department
                  </span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                    {currentUser.faculty.department}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 pt-4 border-t border-slate-100 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-semibold">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>{mySpaces.length} Spaces Created</span>
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>{myMedia.length} Memories Uploaded</span>
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Joined {new Date(currentUser.joined_at).toLocaleDateString()}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Uploaded Memories by this user */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Memories Uploaded by {currentUser.full_name}</h3>
        {myMedia.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 text-xs text-slate-500">
            No memories uploaded by this persona yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {myMedia.map((m) => (
              <div
                key={m.media_id}
                onClick={() => onOpenMediaLightbox(m)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-950 cursor-pointer shadow-xs hover:shadow-xl transition-all"
              >
                <ImageWithFallback src={m.media_url} alt={m.caption} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                  <p className="text-xs text-white line-clamp-1">{m.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Edit Profile Information</h3>
              <button onClick={() => setIsEditOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-600 mb-1">Bio / Status</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-600 mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
