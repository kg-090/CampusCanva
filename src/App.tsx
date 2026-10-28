import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { DemoProvider } from './context/DemoContext';
import { AppLayout } from './layouts/AppLayout';
import { WelcomeLanding } from './pages/WelcomeLanding';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ExplorePage } from './pages/ExplorePage';
import { SpaceDetailPage } from './pages/SpaceDetailPage';
import { TimeCapsulesPage } from './pages/TimeCapsulesPage';
import { CampusSpotsPage } from './pages/CampusSpotsPage';
import { MySpacesPage } from './pages/MySpacesPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { MediaItem } from './types';

// Context interface from AppLayout
interface LayoutContextType {
  onOpenCreateModal: () => void;
  onOpenAddMemory: (spaceId?: number) => void;
  onOpenMediaLightbox: (media: MediaItem) => void;
  onRefreshNotifications: () => void;
}

// Wrapper Pages to bind outlet context
const DashboardRoute: React.FC = () => {
  const { onOpenCreateModal, onOpenMediaLightbox } = useOutletContext<LayoutContextType>();
  return (
    <DashboardPage
      onOpenCreateModal={onOpenCreateModal}
      onOpenMediaLightbox={onOpenMediaLightbox}
    />
  );
};

const ExploreRoute: React.FC = () => {
  const { onOpenMediaLightbox } = useOutletContext<LayoutContextType>();
  return <ExplorePage onOpenMediaLightbox={onOpenMediaLightbox} />;
};

const SpaceDetailRoute: React.FC = () => {
  const { onOpenAddMemory, onOpenMediaLightbox } = useOutletContext<LayoutContextType>();
  return (
    <SpaceDetailPage
      onOpenAddMemory={onOpenAddMemory}
      onOpenMediaLightbox={onOpenMediaLightbox}
    />
  );
};

const TimeCapsulesRoute: React.FC = () => {
  const { onOpenCreateModal } = useOutletContext<LayoutContextType>();
  return <TimeCapsulesPage onOpenCreateModal={onOpenCreateModal} />;
};

const MySpacesRoute: React.FC = () => {
  const { onOpenCreateModal } = useOutletContext<LayoutContextType>();
  return <MySpacesPage onOpenCreateModal={onOpenCreateModal} />;
};

const ProfileRoute: React.FC = () => {
  const { onOpenMediaLightbox } = useOutletContext<LayoutContextType>();
  return <ProfilePage onOpenMediaLightbox={onOpenMediaLightbox} />;
};

const NotificationsRoute: React.FC = () => {
  const { onRefreshNotifications } = useOutletContext<LayoutContextType>();
  return <NotificationsPage onRefreshNotifications={onRefreshNotifications} />;
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <DemoProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Landing & Authentication */}
              <Route path="/" element={<WelcomeLanding />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Main App Layout */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardRoute />} />
                <Route path="/explore" element={<ExploreRoute />} />
                <Route path="/spaces/:id" element={<SpaceDetailRoute />} />
                <Route path="/spots" element={<CampusSpotsPage />} />
                <Route path="/time-capsules" element={<TimeCapsulesRoute />} />
                <Route path="/my-spaces" element={<MySpacesRoute />} />
                <Route path="/profile" element={<ProfileRoute />} />
                <Route path="/notifications" element={<NotificationsRoute />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </DemoProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
