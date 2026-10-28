import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Compass,
  FolderHeart,
  MapPin,
  Clock,
  Bell,
  User,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDemo } from '../../context/DemoContext';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface SidebarProps {
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ unreadCount = 0 }) => {
  const { currentUser } = useAuth();
  const { resetDemoData, isDemoMode } = useDemo();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Explore Memories', path: '/explore', icon: Compass },
    { name: 'My Spaces', path: '/my-spaces', icon: FolderHeart },
    { name: 'Campus Spots', path: '/spots', icon: MapPin },
    { name: 'Time Capsules', path: '/time-capsules', icon: Clock },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4 justify-between">
        <div className="space-y-6">
          {/* Main Navigation Links */}
          <nav className="space-y-1">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Demo Info Pill */}
          {isDemoMode && (
            <div className="p-3 bg-gradient-to-br from-indigo-50/70 to-purple-50/70 border border-indigo-100 rounded-2xl text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>DBMS Lab Project</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Netaji Subhas Univ of Tech
                <br />
                Guided by: <span className="font-semibold text-slate-900">Prof. Vivek Mehta</span>
              </p>
            </div>
          )}
        </div>

        {/* Bottom Section: Active Persona & Reset Button */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          {currentUser && (
            <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                {currentUser.full_name[0]}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="text-xs font-semibold text-slate-900 truncate">{currentUser.full_name}</div>
                <div className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider truncate">
                  {currentUser.user_type}
                  {currentUser.student && ` • ${currentUser.student.roll_number}`}
                </div>
              </div>
            </div>
          )}

          {/* Reset Demo Data Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition"
            title="Reset database to initial seeded state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Database Seeds</span>
          </button>
        </div>
      </aside>

      {/* Confirmation Dialog for Reset */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset Demo Database?"
        message="This will restore all tables (users, spaces, media, comments, reactions, and time capsules) back to the clean NSUT demo seed state."
        confirmLabel="Reset Everything"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          setShowResetConfirm(false);
          resetDemoData();
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </>
  );
};
