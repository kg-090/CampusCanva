import React, { createContext, useContext, useState, useEffect } from 'react';
import { FullUserProfile, User, Student, Alumni, Faculty } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextValue {
  currentUser: FullUserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  allUsers: User[];
  login: (email: string, passwordHash?: string) => Promise<void>;
  register: (
    userData: Omit<User, 'user_id' | 'joined_at'>,
    specialized: {
      student?: Omit<Student, 'user_id'>;
      alumni?: Omit<Alumni, 'user_id'>;
      faculty?: Omit<Faculty, 'user_id'>;
    }
  ) => Promise<void>;
  logout: () => void;
  switchUser: (userId: number) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_STORAGE_KEY = 'campuscanva_active_user_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FullUserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const refreshUsers = async () => {
    try {
      const users = await api.getAllUsers();
      setAllUsers(users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        await refreshUsers();
        const storedUserId = localStorage.getItem(AUTH_STORAGE_KEY);
        // Default to user_id: 1 (Kavya Gupta, Student Lead) for immediate seamless demo
        const targetId = storedUserId ? parseInt(storedUserId, 10) : 1;
        const profile = await api.getUserProfile(targetId);
        if (profile) {
          setCurrentUser(profile);
          localStorage.setItem(AUTH_STORAGE_KEY, profile.user_id.toString());
        }
      } catch (e) {
        console.error('Failed to initialize auth:', e);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, passwordHash = 'demo_pass') => {
    setIsLoading(true);
    try {
      const user = await api.login(email, passwordHash);
      setCurrentUser(user);
      localStorage.setItem(AUTH_STORAGE_KEY, user.user_id.toString());
      showToast(`Welcome back, ${user.full_name}!`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      showToast(msg, 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    userData: Omit<User, 'user_id' | 'joined_at'>,
    specialized: {
      student?: Omit<Student, 'user_id'>;
      alumni?: Omit<Alumni, 'user_id'>;
      faculty?: Omit<Faculty, 'user_id'>;
    }
  ) => {
    setIsLoading(true);
    try {
      const newUser = await api.register(userData, specialized);
      setCurrentUser(newUser);
      localStorage.setItem(AUTH_STORAGE_KEY, newUser.user_id.toString());
      await refreshUsers();
      showToast(`Account created successfully! Welcome to CampusCanva.`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      showToast(msg, 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    showToast('Logged out of demo session.', 'info');
  };

  const switchUser = async (userId: number) => {
    try {
      const user = await api.getUserProfile(userId);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem(AUTH_STORAGE_KEY, user.user_id.toString());
        showToast(`Switched active persona to ${user.full_name} (${user.user_type})`, 'info');
      }
    } catch (err) {
      showToast('Could not switch user', 'error');
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) return;
    try {
      const updated = await api.updateProfile(currentUser.user_id, updates);
      setCurrentUser(updated);
      await refreshUsers();
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update profile', 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        allUsers,
        login,
        register,
        logout,
        switchUser,
        updateProfile,
        refreshUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
