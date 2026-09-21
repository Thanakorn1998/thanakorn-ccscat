import React, { useRef } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import {
  Building2,
  Calendar,
  Briefcase,
  Award,
  FileText,
  Camera,
  Edit2,
  SlidersHorizontal,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface ProfileHeroProps {
  onOpenEdit: () => void;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({ onOpenEdit }) => {
  const { data, updateProfile, isEditMode, stats, isAuthenticated, requireAuth } = useEvaluation();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarDirectUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3.5 * 1024 * 1024) {
      alert('ขนาดไฟล์ภาพใหญ่เกิน 3.5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        updateProfile({ avatarUrl: base64 });
      }
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  const handleTriggerAvatar = () => {
    requireAuth(() => {
      avatarInputRef.current?.click();
    });
  };

  return (
    <div className="relative mb-6 rounded-2xl overflow-hidden shadow-xs border border-slate-200 bg-white">
      {/* Top Banner with Customizable Gradient */}
      <div
        className={`relative h-44 sm:h-52 bg-linear-to-r ${data.profile.bannerBgColor || 'from-emerald-800 via-teal-800 to-slate-900'} p-6 sm:p-8 flex flex-col justify-between text-white`}
      >
        {/* Subtle patterned overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20px 20px, white 2px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Institution and Agency Header info */}
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-1 flex items-center justify-center shrink-0 shadow-md">
              {data.profile.logoUrl ? (
                <img
                  src={data.profile.logoUrl}
                  alt="Organization Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <Building2 className="w-7 h-7 text-emerald-300" />
              )}
            </div>
            <div>
              <div className="text-xs sm:text-sm font-medium tracking-wide text-emerald-200">
                {data.profile.agencyName}
              </div>
              <h1 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-xs">
                {data.profile.organizationName}
              </h1>
            </div>
          </div>

          {/* Quick Edit button in banner */}
          <button
            onClick={() => requireAuth(onOpenEdit)}
            id="btn-hero-edit-profile"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm text-xs font-medium border border-white/30 transition-all cursor-pointer shadow-xs shrink-0"
            title="แก้ไขข้อมูลส่วนหัว"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">แก้ไขข้อมูลส่วนหัว & ผู้รับการประเมิน</span>
            <span className="sm:hidden">แก้ไขหัวเว็บ</span>
            {!isAuthenticated && <Lock className="w-3 h-3 text-white/70" />}
          </button>
        </div>

        {/* Badge & Evaluation Round */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 text-xs">
          <span className="bg-emerald-500/30 backdrop-blur-sm border border-emerald-400/40 px-2.5 py-1 rounded-full text-emerald-100 font-medium">
            รายงานและประเมินผลการปฏิบัติงานพนักงานราชการทั่วไป
          </span>
          <span className="bg-white/15 backdrop-blur-sm border border-white/20 px-2.5 py-1 rounded-full text-white/90">
            {data.profile.evaluationRound}
          </span>
        </div>
      </div>

      {/* Main Profile & Portfolio Stats Bar */}
      <div className="px-6 sm:px-8 pb-6 pt-0 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-14 sm:-mt-16">
          {/* Avatar + Personal Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-5 text-center sm:text-left">
            {/* Avatar Slot with Direct Upload Trigger */}
            <div className="relative group shrink-0">
              <div className="w-28 h-32 sm:w-32 sm:h-38 rounded-xl bg-slate-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                {data.profile.avatarUrl ? (
                  <img
                    src={data.profile.avatarUrl}
                    alt={data.profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-3 text-slate-400">
                    <Building2 className="w-10 h-10 mx-auto text-slate-300" />
                    <span className="text-[11px] block mt-1 font-medium">รูปผู้รับการประเมิน</span>
                  </div>
                )}
              </div>

              {/* Direct image upload button over avatar */}
              <button
                type="button"
                onClick={handleTriggerAvatar}
                className="absolute bottom-1 right-1 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md transition-transform hover:scale-105 cursor-pointer"
                title="คลิกเพื่ออัปโหลดหรือเปลี่ยนรูปถ่าย"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarDirectUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Name, Position, Department */}
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {data.profile.fullName}
                </h2>
                {isEditMode && (
                  <button
                    onClick={() => requireAuth(onOpenEdit)}
                    className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                    title="แก้ไขชื่อ-นามสกุล"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-sm font-semibold text-emerald-700">
                {data.profile.position}
                {data.profile.workGroup && (
                  <span className="text-slate-500 font-normal"> • {data.profile.workGroup}</span>
                )}
              </p>
              <p className="text-xs text-slate-600">
                {data.profile.department} | {data.profile.affiliation}
              </p>
            </div>
          </div>

          {/* Portfolio Stats Card (Clean, no weights) */}
          <div className="flex items-center justify-center sm:justify-end gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-center px-3 border-r border-slate-200">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                หัวข้อประเมินทั้งหมด
              </div>
              <div className="text-lg font-bold text-slate-800">
                {stats.totalTopics}
                <span className="text-[11px] font-normal text-slate-400"> หัวข้อ</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-medium">
                ผลสัมฤทธิ์ {stats.form11Count} + พฤติกรรม {stats.form12Count}
              </div>
            </div>

            <div className="text-center px-3 border-r border-slate-200">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                บันทึกผลงานแล้ว
              </div>
              <div className="text-lg font-bold text-emerald-700">
                {stats.topicsWithContent}
                <span className="text-[11px] font-normal text-slate-400"> / {stats.totalTopics}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {Math.round((stats.topicsWithContent / (stats.totalTopics || 1)) * 100)}% สมบูรณ์
              </div>
            </div>

            <div className="text-center px-3">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                รูปภาพหลักฐาน
              </div>
              <div className="text-xl font-extrabold text-blue-700">
                {stats.totalImages}
                <span className="text-xs font-normal text-slate-500"> รูป</span>
              </div>
              <span className="inline-block text-[10px] font-medium text-blue-600">
                ในคลังรูปภาพ
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Metadata Badges (Contract, Dates, Project) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100 text-xs">
          <div className="flex items-start gap-2 text-slate-600 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700 block">ช่วงเวลาการประเมิน:</span>
              <span>
                {data.profile.startDate} ถึง {data.profile.endDate}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-slate-600 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
            <Briefcase className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700 block">ระยะเวลาตามสัญญาจ้าง:</span>
              <span>
                {data.profile.contractStartDate} ถึง {data.profile.contractEndDate}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-slate-600 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
            <FileText className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="font-semibold text-slate-700 block">ชื่องาน / โครงการ:</span>
              <span className="truncate block" title={data.profile.projectName}>
                {data.profile.projectName || '- ไม่ได้ระบุ -'}
              </span>
            </div>
          </div>
        </div>

        {/* Bio summary */}
        {data.profile.bioSummary && (
          <div className="mt-4 p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100/80 text-xs sm:text-sm text-emerald-900 leading-relaxed">
            <span className="font-semibold text-emerald-950">สรุปภาพรวมการปฏิบัติงาน: </span>
            {data.profile.bioSummary}
          </div>
        )}
      </div>
    </div>
  );
};
