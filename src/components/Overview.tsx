import React from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import {
  FileText,
  Award,
  ListFilter,
  Image as ImageIcon,
  Edit3,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Lock,
  Unlock,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

interface OverviewProps {
  onOpenProfileEdit: () => void;
  onOpenGuide: () => void;
}

export const Overview: React.FC<OverviewProps> = ({ onOpenProfileEdit, onOpenGuide }) => {
  const { data, stats, setActiveTab, isAuthenticated, setIsPasswordModalOpen, requireAuth } =
    useEvaluation();

  return (
    <div className="space-y-6">
      {/* Welcome & Authentication Notice Banner */}
      <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
                พร้อมใช้งาน
              </span>
              <span className="text-xs text-slate-500 font-medium">
                รายงานผลการปฏิบัติงานตามแบบประเมินราชการ
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              ยินดีต้อนรับสู่ระบบจัดทำรายงานและประเมินผลการปฏิบัติงาน
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              เว็บไซต์นี้รวบรวมหัวข้อการประเมินทั้งหมด จัดหมวดหมู่ในรูปแบบ{' '}
              <strong>Dropdown ตามหัวข้อ</strong> อย่างสวยงามและเป็นระเบียบ
              ผู้เยี่ยมชมสามารถเข้ามาเปิดดูเนื้อหาและรูปภาพได้ตลอดเวลา
              สำหรับการแก้ไขข้อมูลและอัปโหลดรูปภาพมีระบบป้องกันด้วยรหัสผ่าน
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {isAuthenticated ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-300">
                <Unlock className="w-4 h-4 text-emerald-700" />
                <span>ปลดล็อกโหมดแก้ไขแล้ว</span>
              </span>
            ) : (
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>เข้าสู่ระบบแก้ไข (รหัสผ่าน)</span>
              </button>
            )}

            <button
              onClick={() => requireAuth(onOpenProfileEdit)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-medium shadow-2xs transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>แก้ไขหัวเว็บ & โปรไฟล์</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Feature Highlight: Topic Explorer with Dropdown */}
      <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500/30 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <ListFilter className="w-4 h-4" />
            <span>ฟีเจอร์หลัก</span>
          </div>
          <h4 className="text-lg font-bold text-slate-900">
            เมนูเลือกดูตามหัวข้อ (Dropdown Selector)
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            เลือกดูผลงานตามหมวดหลัก (ผลสัมฤทธิ์ / พฤติกรรม), เลือกตามด้านหรือสมรรถนะ,
            และกระโดดไปยังข้อย่อยที่ต้องการ พร้อมรูปภาพและคำบรรยายโดยไม่มีคะแนนหรือน้ำหนักมารบกวนสายตา
          </p>
        </div>

        <button
          onClick={() => setActiveTab('topics')}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <span>เปิดดูหัวข้อตาม Dropdown</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Form 1-1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                ๑
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ๔ ด้านหลัก
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">ผลสัมฤทธิ์ของงาน</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                ด้านปริมาณ, คุณภาพ, ความรวดเร็ว และการใช้ทรัพยากร
              </p>
            </div>
            <div className="space-y-1.5 pt-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">จำนวนหัวข้อ:</span>
                <span className="font-bold text-slate-800">{stats.form11Count} ตัวชี้วัด</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">สถานะ:</span>
                <span className="font-medium text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> พร้อมใส่รูปและเนื้อหา
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('form11')}
            className="mt-5 w-full py-2 bg-slate-50 hover:bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-slate-200 hover:border-emerald-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>ดูรายการผลสัมฤทธิ์ของงาน</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Form 1-2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                ๒
              </div>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                ๕ สมรรถนะ
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">พฤติกรรมการปฏิบัติงาน</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                มุ่งผลสัมฤทธิ์, บริการ, เชี่ยวชาญ, จริยธรรม, การทำงานเป็นทีม
              </p>
            </div>
            <div className="space-y-1.5 pt-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">จำนวนหัวข้อ:</span>
                <span className="font-bold text-slate-800">{stats.form12Count} หัวข้อย่อย</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">สถานะ:</span>
                <span className="font-medium text-teal-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> พร้อมใส่รูปและเนื้อหา
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('form12')}
            className="mt-5 w-full py-2 bg-slate-50 hover:bg-teal-50 text-teal-700 text-xs font-semibold rounded-lg border border-slate-200 hover:border-teal-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>ดูรายการพฤติกรรมการปฏิบัติงาน</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Evidence Gallery */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                คลังรูปภาพ
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">แกลเลอรีรูปภาพหลักฐาน</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                รวบรวมรูปภาพผลงานทั้งหมดในเล่มประเมิน
              </p>
            </div>
            <div className="space-y-1.5 pt-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">รูปภาพทั้งหมด:</span>
                <span className="font-bold text-blue-700">{stats.totalImages} รูป</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">หัวข้อที่มีผลงานแล้ว:</span>
                <span className="font-bold text-slate-800">
                  {stats.topicsWithContent} / {stats.totalTopics}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('gallery')}
            className="mt-5 w-full py-2 bg-slate-50 hover:bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-slate-200 hover:border-blue-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>เปิดดูแกลเลอรีรูปภาพ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Guide to Edit with Password */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              การเข้าถึงและการแก้ไขข้อมูล
            </h3>
          </div>
          <span className="text-xs text-slate-400">ปลอดภัยและใช้งานง่าย</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
              ๑
            </div>
            <h4 className="font-semibold text-slate-800 text-sm">ผู้เข้าชมทั่วไปเปิดดูได้ทันที</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              ผู้บริหาร กรรมการ หรือบุคคลอื่น สามารถเปิดดูหัวข้อ เนื้อหา
              และคลิกดูรูปภาพขยายใหญ่ได้ทันทีโดยไม่ต้องใส่รหัสผ่าน
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
              ๒
            </div>
            <h4 className="font-semibold text-slate-800 text-sm">การแก้ไขข้อมูลใส่รหัสผ่าน</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              เมื่อคุณกดปุ่มแก้ไขหัวเว็บ หรือแก้ไขข้อความ/เพิ่มรูปภาพในหัวข้อใดๆ
              ระบบจะถามรหัสผ่านผู้ดูแลระบบ (กรอกเพียงครั้งเดียวในรอบการใช้งาน)
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
              ๓
            </div>
            <h4 className="font-semibold text-slate-800 text-sm">สำรองข้อมูล & พิมพ์รายงาน</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              สามารถกดปุ่ม "จัดการข้อมูล" เพื่อ Export ไฟล์ JSON สำรองไว้
              หรือเลือกแท็บ "พิมพ์เอกสารสรุป" เพื่อสั่งพิมพ์หรือบันทึกเป็น PDF
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
