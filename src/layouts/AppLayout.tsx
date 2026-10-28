import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Sidebar } from '../components/navigation/Sidebar';
import { CreateSpaceModal } from '../components/modals/CreateSpaceModal';
import { AddMemoryModal } from '../components/modals/AddMemoryModal';
import { MediaLightboxModal } from '../components/modals/MediaLightboxModal';
import { DBMSInspectorDrawer } from '../components/common/DBMSInspectorDrawer';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CampusSpot, MemorySpace, MediaItem } from '../types';

export const AppLayout: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [spots, setSpots] = useState<CampusSpot[]>([]);
  const [spaces, setSpaces] = useState<MemorySpace[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  // Modal States
  const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const [targetSpaceIdForMemory, setTargetSpaceIdForMemory] = useState<number | undefined>(undefined);
  const [activeLightboxMedia, setActiveLightboxMedia] = useState<MediaItem | null>(null);

  const refreshData = async () => {
    try {
      const [sp, st] = await Promise.all([api.getMemorySpaces(), api.getCampusSpots()]);
      setSpaces(sp);
      setSpots(st);

      if (currentUser) {
        const notifs = await api.getNotifications(currentUser.user_id);
        setUnreadNotifCount(notifs.filter((n) => !n.is_read).length);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  const handleOpenAddMemory = (spaceId?: number) => {
    setTargetSpaceIdForMemory(spaceId);
    setIsAddMemoryOpen(true);
  };

  const handleOpenLightbox = (media: MediaItem) => {
    setActiveLightboxMedia(media);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenCreateModal={() => setIsCreateSpaceOpen(true)}
        unreadCount={unreadNotifCount}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Desktop Sidebar */}
        <Sidebar unreadCount={unreadNotifCount} />

        {/* Main Routed Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-full overflow-x-hidden">
          <Outlet
            context={{
              onOpenCreateModal: () => setIsCreateSpaceOpen(true),
              onOpenAddMemory: handleOpenAddMemory,
              onOpenMediaLightbox: handleOpenLightbox,
              onRefreshNotifications: refreshData,
            }}
          />
        </main>
      </div>

      {/* Global Modals */}
      <CreateSpaceModal
        isOpen={isCreateSpaceOpen}
        onClose={() => setIsCreateSpaceOpen(false)}
        spots={spots}
        onSpaceCreated={(newSpace) => {
          setSpaces((prev) => [newSpace, ...prev]);
          refreshData();
          navigate(`/spaces/${newSpace.space_id}`);
        }}
      />

      <AddMemoryModal
        isOpen={isAddMemoryOpen}
        onClose={() => setIsAddMemoryOpen(false)}
        spaces={spaces}
        preselectedSpaceId={targetSpaceIdForMemory}
        onMemoryAdded={() => {
          refreshData();
          window.dispatchEvent(new Event('memory_added'));
        }}
      />

      <MediaLightboxModal
        media={activeLightboxMedia}
        onClose={() => setActiveLightboxMedia(null)}
        onDeleteMedia={(mediaId) => {
          refreshData();
          setActiveLightboxMedia(null);
        }}
      />

      {/* DBMS Schema Inspector Slide-Over */}
      <DBMSInspectorDrawer />
    </div>
  );
};
