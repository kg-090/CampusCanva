import React, { createContext, useContext, useState } from 'react';
import { DBMSInspectData } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';

interface DemoContextValue {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  inspectorData: DBMSInspectData | null;
  openInspector: (type: 'space' | 'media' | 'user' | 'comment', id: number) => void;
  closeInspector: () => void;
  resetDemoData: () => void;
}

const DemoContext = createContext<DemoContextValue | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true); // Default enabled for evaluation convenience
  const [inspectorData, setInspectorData] = useState<DBMSInspectData | null>(null);
  const { showToast } = useToast();

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev);
  };

  const openInspector = (type: 'space' | 'media' | 'user' | 'comment', id: number) => {
    try {
      const data = api.getDBMSMeta(type, id);
      // Ensure password_hash is scrubbed if present
      if (data.attributes && 'password_hash' in data.attributes) {
        delete (data.attributes as Record<string, unknown>).password_hash;
      }
      setInspectorData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const closeInspector = () => {
    setInspectorData(null);
  };

  const resetDemoData = () => {
    api.resetDemoDatabase();
    showToast('Database reset to initial NSUT seed state!', 'success');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        toggleDemoMode,
        inspectorData,
        openInspector,
        closeInspector,
        resetDemoData,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
};
