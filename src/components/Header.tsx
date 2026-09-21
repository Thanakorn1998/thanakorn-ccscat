import React, { useRef, useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import { ActiveTab } from '../types/evaluation';
import {
  FileText,
  Award,
  Layers,
  Image as ImageIcon,
  Printer,
  Edit3,
  Eye,
  Download,
  Upload,
  RotateCcw,
  HelpCircle,
  SlidersHorizontal,
  Lock,
  Unlock,
  KeyRound,
  ListFilter,
  CheckCircle2,
} from 'lucide-react';

interface HeaderProps {
  onOpenProfileEdit: () => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProfileEdit, onOpenGuide }) => {
  const {
    data,
    isEditMode,
    setIsEditMode,
    activeTab,
    setActiveTab,
    lastSaved,
    exportJSON,
    importJSON,
    resetToDefault,
    isAuthenticated,
    setIsPasswordModalOpen,
    logoutAdmin,
    requireAuth,
    stats,
  } = useEvaluation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showToolsMenu, setShowToolsMenu] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importJSON(content);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const navTabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'topics',
      label: 'หัวข้อตามประเมิน (Dropdown)',
      icon: <ListFilter className="w-4 h-4 text-emerald-600" />,
      badge: `${stats.totalTopics} หัวข้อ`,
    },
    {
      id: 'overview',
      label: 'ภาพรวม & โปรไฟล์',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'form11',
      label: 'ผลสัมฤทธิ์ของงาน (๔ ด้าน)',
      icon: <FileText className="w-4 h-4" />,
      badge: `${stats.form11Count} ข้อ`,
    },
    {
      id: 'form12',
      label: 'พฤติกรรมการปฏิบัติงาน (๕ สมรรถนะ)',
      icon: <Award className="w-4 h-4" />,
      badge: `${stats.form12Count} ข้อ`,
    },
    {
      id: 'gallery',
      label: 'แกลเลอรีรูปภาพหลักฐาน',
      icon: <ImageIcon className="w-4 h-4" />,
      badge: `${stats.totalImages} รูป`,
    },
    {
      id: 'print',
      label: 'พิมพ์เอกสารสรุป',
      icon: <Printer className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      {/* Top utility strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 text-xs sm:text-sm">
        {/* Left: Organization & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold shrink-0 shadow-xs">
            ปผ
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold text-slate-800 truncate text-xs sm:text-sm leading-tight">
              {data.profile.organizationName || 'วิทยาลัยเกษตรและเทคโนโลยีฉะเชิงเทรา'}
            </h1>
            <p className="text-slate-500 text-[11px] truncate">
              {data.profile.agencyName} • รายงานและประเมินผลการปฏิบัติงานพนักงานราชการ
            </p>
          </div>
        </div>

        {/* Right: Authentication Status & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Last saved indicator */}
          {lastSaved && isAuthenticated && (
            <span className="hidden lg:inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              บันทึกแล้ว {lastSaved}
            </span>
          )}

          {/* Authentication Badge & Login/Logout Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                <span>ปลดล็อกโหมดแก้ไข</span>
              </span>
              <button
                onClick={logoutAdmin}
                className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                title="ล็อกระบบเพื่อกลับเป็นโหมดอ่านอย่างเดียว"
              >
                ล็อก / ออกจากระบบ
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-all shadow-2xs cursor-pointer"
              title="สำหรับเจ้าของข้อมูลกรอกรหัสผ่านเพื่อแก้ไข"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
              <span>เข้าสู่ระบบแก้ไข (ใส่รหัสผ่าน)</span>
            </button>
          )}

          {/* Quick Edit Profile / Header Button */}
          <button
            onClick={() => requireAuth(onOpenProfileEdit)}
            id="btn-edit-header"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="แก้ไขหัวเว็บไซต์ ชื่อ-นามสกุล ตำแหน่ง และข้อมูลหน่วยงาน"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">แก้ไขหัวเว็บ & ข้อมูล</span>
            <span className="sm:hidden">หัวเว็บ</span>
            {!isAuthenticated && <Lock className="w-3 h-3 text-slate-400" />}
          </button>

          {/* Data Tools dropdown trigger (requires auth for destructive actions) */}
          <div className="relative">
            <button
              onClick={() => setShowToolsMenu(!showToolsMenu)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
              title="เมนูนำเข้า/ส่งออกข้อมูล"
            >
              <span>จัดการข้อมูล</span>
              <span className="text-[10px]">▼</span>
            </button>

            {showToolsMenu && (
              <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs">
                <button
                  onClick={() => {
                    exportJSON();
                    setShowToolsMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-medium">สำรองข้อมูล (Export JSON)</div>
                    <div className="text-[10px] text-slate-400">บันทึกเป็นไฟล์ไว้ในเครื่อง</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    requireAuth(() => fileInputRef.current?.click());
                    setShowToolsMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium flex items-center gap-1">
                      <span>นำเข้าข้อมูล (Import JSON)</span>
                      {!isAuthenticated && <Lock className="w-3 h-3 text-slate-400" />}
                    </div>
                    <div className="text-[10px] text-slate-400">โหลดข้อมูลจากไฟล์ JSON</div>
                  </div>
                </button>

                <div className="h-px bg-slate-100 my-1"></div>

                <button
                  onClick={() => {
                    requireAuth(resetToDefault);
                    setShowToolsMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <div>
                    <div className="font-medium flex items-center gap-1">
                      <span>คืนค่าเริ่มต้น (Reset)</span>
                      {!isAuthenticated && <Lock className="w-3 h-3 text-slate-400" />}
                    </div>
                    <div className="text-[10px] text-rose-400">ล้างข้อมูลกลับเป็นค่าเริ่มต้น</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />

          {/* Quick Guide Button */}
          <button
            onClick={onOpenGuide}
            className="inline-flex items-center justify-center p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
            title="วิธีใส่รูปและเนื้อหา"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      isActive ? 'bg-emerald-700/80 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Security Info Banner when not authenticated */}
      {!isAuthenticated && (
        <div className="bg-slate-100 text-slate-600 px-4 py-1.5 text-xs text-center border-t border-slate-200 flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>บุคคลทั่วไปสามารถเข้ามาเปิดดูเนื้อหาและรูปภาพได้ตามปกติ</span>
          <span className="text-slate-400">•</span>
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="text-emerald-700 hover:underline font-semibold cursor-pointer"
          >
            คลิกที่นี่เพื่อใส่รหัสผ่านหากต้องการแก้ไขข้อมูล
          </button>
        </div>
      )}
    </header>
  );
};
