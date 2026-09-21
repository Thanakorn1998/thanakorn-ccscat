import React, { useState } from 'react';
import { EvaluationProvider, useEvaluation } from './context/EvaluationContext';
import { Header } from './components/Header';
import { ProfileHero } from './components/ProfileHero';
import { Overview } from './components/Overview';
import { TopicExplorer } from './components/TopicExplorer';
import { Form11WorkAchievements } from './components/Form11WorkAchievements';
import { Form12WorkBehaviors } from './components/Form12WorkBehaviors';
import { Form13Summary } from './components/Form13Summary';
import { EvidenceGallery } from './components/EvidenceGallery';
import { PrintView } from './components/PrintView';
import { EditProfileModal } from './components/EditProfileModal';
import { GuideModal } from './components/GuideModal';
import { ImagePreviewModal } from './components/ImagePreviewModal';
import { PasswordModal } from './components/PasswordModal';

function MainApp() {
  const { activeTab, requireAuth } = useEvaluation();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; caption: string } | null>(null);

  const handleOpenPreview = (url: string, caption: string) => {
    setPreviewImage({ url, caption });
  };

  const handleOpenProfileEdit = () => {
    requireAuth(() => {
      setIsProfileModalOpen(true);
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col selection:bg-emerald-200 selection:text-emerald-900">
      {/* Header Navigation Bar */}
      <Header
        onOpenProfileEdit={handleOpenProfileEdit}
        onOpenGuide={() => setIsGuideModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* If in print tab, show dedicated official printable view */}
        {activeTab === 'print' ? (
          <PrintView />
        ) : (
          <>
            {/* Top Profile Hero (Shown on all non-print views) */}
            <ProfileHero onOpenEdit={handleOpenProfileEdit} />

            {/* Tab Views */}
            {activeTab === 'topics' && (
              <TopicExplorer onSelectImagePreview={handleOpenPreview} />
            )}

            {activeTab === 'overview' && (
              <Overview
                onOpenProfileEdit={handleOpenProfileEdit}
                onOpenGuide={() => setIsGuideModalOpen(true)}
              />
            )}

            {activeTab === 'form11' && (
              <Form11WorkAchievements onSelectImagePreview={handleOpenPreview} />
            )}

            {activeTab === 'form12' && (
              <Form12WorkBehaviors onSelectImagePreview={handleOpenPreview} />
            )}

            {activeTab === 'form13' && <Form13Summary />}

            {activeTab === 'gallery' && (
              <EvidenceGallery onSelectImagePreview={handleOpenPreview} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left">
            <span className="font-semibold text-slate-700">
              รายงานและประเมินผลการปฏิบัติงานพนักงานราชการทั่วไป
            </span>
            <span className="block text-[11px] text-slate-400">
              จัดหมวดหมู่ตามหัวข้อตัวชี้วัดและสมรรถนะ พร้อมระบบจัดการรูปภาพและเนื้อหา
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="text-emerald-700 hover:underline font-medium cursor-pointer"
            >
              คำแนะนำการใส่รูปและเนื้อหา
            </button>
            <span>•</span>
            <button
              onClick={handleOpenProfileEdit}
              className="text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              แก้ไขหัวเว็บ & โปรไฟล์
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <PasswordModal />

      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {previewImage && (
        <ImagePreviewModal
          isOpen={!!previewImage}
          onClose={() => setPreviewImage(null)}
          imageUrl={previewImage.url}
          caption={previewImage.caption}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <EvaluationProvider>
      <MainApp />
    </EvaluationProvider>
  );
}
