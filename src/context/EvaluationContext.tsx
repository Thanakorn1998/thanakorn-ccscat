import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { EvaluationData, EvaluationProfile, IndicatorItem, EvidenceImage, EvaluationSummaryInfo, ActiveTab } from '../types/evaluation';
import { defaultEvaluationData } from '../data/defaultData';

const LOCAL_STORAGE_KEY = 'thai_civil_service_evaluation_data_v2';
const AUTH_SESSION_KEY = 'eval_admin_auth_v1';
export const ADMIN_PASSWORD = 'ccscat12345@';

interface EvaluationContextType {
  data: EvaluationData;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lastSaved: string | null;

  // Password & Authentication
  isAuthenticated: boolean;
  isPasswordModalOpen: boolean;
  setIsPasswordModalOpen: (val: boolean) => void;
  authenticate: (password: string) => boolean;
  logoutAdmin: () => void;
  requireAuth: (callback: () => void) => void;
  
  // Update handlers
  updateProfile: (profile: Partial<EvaluationProfile>) => void;
  updateIndicator: (
    formType: 'form11' | 'form12',
    dimensionId: string,
    itemId: string,
    updates: Partial<IndicatorItem>
  ) => void;
  addEvidenceImage: (
    formType: 'form11' | 'form12',
    dimensionId: string,
    itemId: string,
    image: Omit<EvidenceImage, 'id'>
  ) => void;
  removeEvidenceImage: (
    formType: 'form11' | 'form12',
    dimensionId: string,
    itemId: string,
    imageId: string
  ) => void;
  updateSummary: (summary: Partial<EvaluationSummaryInfo>) => void;
  resetToDefault: () => void;
  exportJSON: () => void;
  importJSON: (jsonString: string) => boolean;

  // Content Statistics (Clean, no weights)
  stats: {
    totalTopics: number;
    topicsWithContent: number;
    totalImages: number;
    form11Count: number;
    form12Count: number;
  };
}

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

export const EvaluationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<EvaluationData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved evaluation data', e);
    }
    return defaultEvaluationData;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      const now = new Date();
      setLastSaved(
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
      );
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }, [data]);

  // Auth functions
  const authenticate = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setIsEditMode(true);
      try {
        sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      } catch (e) {
        console.warn(e);
      }
      setIsPasswordModalOpen(false);

      // Execute pending action if any
      if (pendingCallback) {
        pendingCallback();
        setPendingCallback(null);
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAuthenticated(false);
    setIsEditMode(false);
    try {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  const requireAuth = (callback: () => void) => {
    if (isAuthenticated) {
      callback();
    } else {
      setPendingCallback(() => callback);
      setIsPasswordModalOpen(true);
    }
  };

  const updateProfile = (updates: Partial<EvaluationProfile>) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
  };

  const updateIndicator = (
    formType: 'form11' | 'form12',
    dimensionId: string,
    itemId: string,
    updates: Partial<IndicatorItem>
  ) => {
    setData((prev) => {
      if (formType === 'form11') {
        return {
          ...prev,
          form11: {
            ...prev.form11,
            dimensions: prev.form11.dimensions.map((dim) => {
              if (dim.id !== dimensionId) return dim;
              return {
                ...dim,
                items: dim.items.map((item) => {
                  if (item.id !== itemId) return item;
                  return { ...item, ...updates };
                }),
              };
            }),
          },
        };
      } else {
        return {
          ...prev,
          form12: {
            ...prev.form12,
            competencies: prev.form12.competencies.map((dim) => {
              if (dim.id !== dimensionId) return dim;
              return {
                ...dim,
                items: dim.items.map((item) => {
                  if (item.id !== itemId) return item;
                  return { ...item, ...updates };
                }),
              };
            }),
          },
        };
      }
    });
  };

  const addEvidenceImage = (
    formType: 'form11' | 'form12',
    dimensionId: string,
    itemId: string,
    image: Omit<EvidenceImage, 'id'>
  ) => {
    const newImage: EvidenceImage = {
      ...image,
      id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    };

    setData((prev) => {
      if (formType === 'form11') {
        return {
          ...prev,
          form11: {
            ...prev.form11,
            dimensions: prev.form11.dimensions.map((dim) => {
              if (dim.id !== dimensionId) return dim;
              return {
                ...dim,
                items: dim.items.map((item) => {
                  if (item.id !== itemId) return item;
                  return {
                    ...item,
                    evidenceImages: [...(item.evidenceImages || []), newImage],
                  };
                }),
              };
            }),
          },
        };
      } else {
        return {
          ...prev,
          form12: {
            ...prev.form12,
            competencies: prev.form12.competencies.map((dim) => {
              if (dim.id !== dimensionId) return dim;
              return {
                ...dim,
                items: dim.items.map((item) => {
                  if (item.id !== itemId) return item;
                  return {
                    ...item,
                    evidenceImages: [...(item.evidenceImages || []), newImage],
                  };
                }),
              };
            }),
          },
        };
      }
    });
  };

  const removeEvidenceImage = (
    formType: 'form11' | 'form12',
    dimensionId: string,
    itemId: string,
    imageId: string
  ) => {
    setData((prev) => {
      if (formType === 'form11') {
        return {
          ...prev,
          form11: {
            ...prev.form11,
            dimensions: prev.form11.dimensions.map((dim) => {
              if (dim.id !== dimensionId) return dim;
              return {
                ...dim,
                items: dim.items.map((item) => {
                  if (item.id !== itemId) return item;
                  return {
                    ...item,
                    evidenceImages: (item.evidenceImages || []).filter((img) => img.id !== imageId),
                  };
                }),
              };
            }),
          },
        };
      } else {
        return {
          ...prev,
          form12: {
            ...prev.form12,
            competencies: prev.form12.competencies.map((dim) => {
              if (dim.id !== dimensionId) return dim;
              return {
                ...dim,
                items: dim.items.map((item) => {
                  if (item.id !== itemId) return item;
                  return {
                    ...item,
                    evidenceImages: (item.evidenceImages || []).filter((img) => img.id !== imageId),
                  };
                }),
              };
            }),
          },
        };
      }
    });
  };

  const updateSummary = (summary: Partial<EvaluationSummaryInfo>) => {
    setData((prev) => ({
      ...prev,
      summary: { ...prev.summary, ...summary },
    }));
  };

  const resetToDefault = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นใช่หรือไม่?')) {
      setData(defaultEvaluationData);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const exportJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluation_portfolio_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile && parsed.form11 && parsed.form12) {
        setData(parsed);
        alert('นำเข้าข้อมูลสำเร็จเรียบร้อย');
        return true;
      } else {
        alert('โครงสร้างไฟล์ JSON ไม่ถูกต้อง');
        return false;
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON');
      return false;
    }
  };

  // Pure topic statistics without weights
  const stats = useMemo(() => {
    const form11Items = data.form11.dimensions.flatMap((d) => d.items);
    const form12Items = data.form12.competencies.flatMap((c) => c.items);
    const all = [...form11Items, ...form12Items];

    const totalTopics = all.length;
    const topicsWithContent = all.filter(
      (item) => (item.actualResultDescription && item.actualResultDescription.trim().length > 0) ||
                (item.evidenceImages && item.evidenceImages.length > 0)
    ).length;
    const totalImages = all.reduce((sum, item) => sum + (item.evidenceImages?.length || 0), 0);

    return {
      totalTopics,
      topicsWithContent,
      totalImages,
      form11Count: form11Items.length,
      form12Count: form12Items.length,
    };
  }, [data]);

  return (
    <EvaluationContext.Provider
      value={{
        data,
        isEditMode,
        setIsEditMode,
        activeTab,
        setActiveTab,
        lastSaved,
        isAuthenticated,
        isPasswordModalOpen,
        setIsPasswordModalOpen,
        authenticate,
        logoutAdmin,
        requireAuth,
        updateProfile,
        updateIndicator,
        addEvidenceImage,
        removeEvidenceImage,
        updateSummary,
        resetToDefault,
        exportJSON,
        importJSON,
        stats,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};

export const useEvaluation = () => {
  const context = useContext(EvaluationContext);
  if (!context) {
    throw new Error('useEvaluation must be used within an EvaluationProvider');
  }
  return context;
};
