import React, { useState, useRef } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import { EvaluationProfile } from '../types/evaluation';
import { X, Upload, Check, Image as ImageIcon, Building2, User, Calendar, FileText } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const bannerOptions = [
  { id: 'emerald', label: 'เขียวมรกต (มาตรฐาน)', value: 'from-emerald-800 via-teal-800 to-slate-900' },
  { id: 'blue', label: 'น้ำเงินกรมท่า', value: 'from-blue-900 via-indigo-900 to-slate-900' },
  { id: 'slate', label: 'เทาสงบสุขุม', value: 'from-slate-800 via-slate-900 to-zinc-950' },
  { id: 'amber', label: 'ทองอร่ามภูมิฐาน', value: 'from-amber-900 via-stone-900 to-zinc-950' },
  { id: 'purple', label: 'ม่วงเข้มวิชาการ', value: 'from-purple-900 via-slate-900 to-zinc-950' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { data, updateProfile } = useEvaluation();
  const [formData, setFormData] = useState<EvaluationProfile>({ ...data.profile });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleChange = (field: keyof EvaluationProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: 'avatarUrl' | 'logoUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (cap at ~3MB for localStorage safety)
    if (file.size > 3.5 * 1024 * 1024) {
      alert('ขนาดไฟล์ภาพใหญ่เกิน 3MB กรุณาเลือกไฟล์ที่มีขนาดเล็กลง หรือย่อขนาดภาพ');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setFormData((prev) => ({ ...prev, [targetField]: base64 }));
      }
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="font-semibold text-base sm:text-lg">แก้ไขหัวเว็บไซต์และข้อมูลผู้รับการประเมิน</h2>
              <p className="text-xs text-slate-400">ปรับเปลี่ยนตราสัญลักษณ์, ชื่อสถาบัน, รูปโปรไฟล์ และข้อมูลราชการ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Organization & Header Appearance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm pb-1 border-b border-slate-200">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>๑. ข้อมูลหัวเว็บไซต์และสังกัดหน่วยงาน</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  หน่วยงานต้นสังกัดระดับกรม/กระทรวง
                </label>
                <input
                  type="text"
                  value={formData.agencyName}
                  onChange={(e) => handleChange('agencyName', e.target.value)}
                  placeholder="เช่น สำนักงานคณะกรรมการการอาชีวศึกษา"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ชื่อสถานศึกษา / หน่วยงานที่สังกัด
                </label>
                <input
                  type="text"
                  value={formData.organizationName}
                  onChange={(e) => handleChange('organizationName', e.target.value)}
                  placeholder="เช่น วิทยาลัยเกษตรและเทคโนโลยีฉะเชิงเทรา"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Logo and Banner Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ตราสัญลักษณ์ / โลโก้สถานศึกษา
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                    ) : (
                      <Building2 className="w-7 h-7 text-slate-400" />
                    )}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>อัปโหลดรูปโลโก้</span>
                    </button>
                    {formData.logoUrl && (
                      <button
                        type="button"
                        onClick={() => handleChange('logoUrl', '')}
                        className="block text-[11px] text-rose-600 hover:underline"
                      >
                        ลบรูปโลโก้
                      </button>
                    )}
                    <input
                      type="file"
                      ref={logoInputRef}
                      onChange={(e) => handleImageUpload(e, 'logoUrl')}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  โทนสีพื้นหลังหัวเว็บไซต์ (Banner Style)
                </label>
                <select
                  value={formData.bannerBgColor}
                  onChange={(e) => handleChange('bannerBgColor', e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {bannerOptions.map((opt) => (
                    <option key={opt.id} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Personal Profile Details */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm pb-1 border-b border-slate-200">
              <User className="w-4 h-4 text-emerald-600" />
              <span>๒. ข้อมูลของผู้รับการประเมิน (ส่วนที่ ๑ ตามแบบ ปผ.พนร.๑)</span>
            </div>

            {/* Profile Avatar upload slot */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-24 rounded-lg bg-white border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2">
                    <User className="w-8 h-8 text-slate-400 mx-auto" />
                    <span className="text-[10px] text-slate-400 block mt-1">รูปถ่ายหน้าตรง</span>
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="text-xs font-semibold text-slate-800">รูปถ่ายผู้รับการประเมิน (ขนาด ๑ หรือ ๒ นิ้ว)</div>
                <p className="text-[11px] text-slate-500">
                  คุณสามารถอัปโหลดรูปถ่ายหน้าตรงจากเครื่องคอมพิวเตอร์หรือมือถือของคุณเพื่อนำไปแสดงบนหัวเว็บและรายงาน
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>เลือกรูปภาพจากเครื่อง</span>
                  </button>
                  {formData.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => handleChange('avatarUrl', '')}
                      className="px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      ลบรูปภาพ
                    </button>
                  )}
                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={(e) => handleImageUpload(e, 'avatarUrl')}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ชื่อ-นามสกุล ผู้รับการประเมิน <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="เช่น นายสมคิด สุขใจ"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ตำแหน่ง <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  placeholder="เช่น พนักงานบริหารทั่วไป"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">กลุ่มงาน</label>
                <input
                  type="text"
                  value={formData.workGroup}
                  onChange={(e) => handleChange('workGroup', e.target.value)}
                  placeholder="เช่น กลุ่มงานบริหารทั่วไป"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">ฝ่าย / แผนกงาน</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  placeholder="เช่น ฝ่ายบริหารทรัพยากร / แผนกงานสารบรรณ"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Evaluation Period & Contract */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm pb-1 border-b border-slate-200">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>๓. รอบการประเมินและสัญญาจ้าง</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">รอบการประเมิน</label>
                <input
                  type="text"
                  value={formData.evaluationRound}
                  onChange={(e) => handleChange('evaluationRound', e.target.value)}
                  placeholder="เช่น รอบการประเมิน ครั้งที่ ๑"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">ระหว่างวันที่</label>
                <input
                  type="text"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  placeholder="เช่น ๑ ตุลาคม ๒๕๖๘"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">ถึงวันที่</label>
                <input
                  type="text"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  placeholder="เช่น ๓๑ มีนาคม ๒๕๖๙"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">วันเริ่มสัญญาจ้าง</label>
                <input
                  type="text"
                  value={formData.contractStartDate}
                  onChange={(e) => handleChange('contractStartDate', e.target.value)}
                  placeholder="เช่น ๑ ตุลาคม ๒๕๖๗"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">วันสิ้นสุดสัญญาจ้าง</label>
                <input
                  type="text"
                  value={formData.contractEndDate}
                  onChange={(e) => handleChange('contractEndDate', e.target.value)}
                  placeholder="เช่น ๓๐ กันยายน ๒๕๗๑"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">ชื่องาน / โครงการที่รับผิดชอบ</label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => handleChange('projectName', e.target.value)}
                placeholder="เช่น โครงการส่งเสริมและพัฒนาระบบบริหารจัดการงานเอกสารดิจิทัล"
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                คำแนะนำตัว / สรุปภาพรวมการปฏิบัติงาน (Bio)
              </label>
              <textarea
                rows={3}
                value={formData.bioSummary || ''}
                onChange={(e) => handleChange('bioSummary', e.target.value)}
                placeholder="ระบุข้อความสรุปภาพรวมการทำงาน คติพจน์ หรือคำชี้แจงเบื้องต้น..."
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>บันทึกการแก้ไขข้อมูล</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
