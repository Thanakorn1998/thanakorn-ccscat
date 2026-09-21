import React from 'react';
import { X, BookOpen, Edit3, Download, KeyRound, ListFilter } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="font-semibold text-base sm:text-lg">คำแนะนำการใช้งานและแก้ไขข้อมูล</h2>
              <p className="text-xs text-slate-400">วิธีเลือกดูตามหัวข้อ และขั้นตอนใส่รหัสผ่านเพื่อแก้ไข</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Section 1: Public View & Password Protection */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 text-emerald-700">
              <KeyRound className="w-4 h-4" />
              <span>การเข้าชมและรหัสผ่านสำหรับแก้ไขข้อมูล</span>
            </h3>
            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-2">
              <p>
                <strong>สำหรับบุคคลทั่วไป:</strong> สามารถเปิดดูหัวข้อตามแบบประเมิน อ่านเนื้อหาผลงาน และกดดูรูปภาพขยายใหญ่ได้ทันทีโดยไม่ต้องใส่รหัสผ่าน
              </p>
              <p>
                <strong>สำหรับเจ้าของข้อมูล (แก้ไขข้อมูล):</strong> เมื่อกดปุ่มแก้ไขหัวเว็บ หรือแก้ไขเนื้อหา/เพิ่มรูปภาพในแต่ละหัวข้อ ระบบจะถามรหัสผ่าน:
              </p>
              <div className="inline-block px-3 py-1.5 bg-white font-mono font-bold text-sm text-emerald-900 rounded-lg border border-emerald-300">
                ccscat12345@
              </div>
              <p className="text-[11px] text-slate-500">
                เมื่อยืนยันถูกต้อง ระบบจะปลดล็อกให้แก้ไขได้ตลอดการใช้งานในหน้านี้
              </p>
            </div>
          </div>

          {/* Section 2: Dropdown Navigation */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 text-teal-700">
              <ListFilter className="w-4 h-4" />
              <span>การเลือกดูตามหัวข้อ (Dropdown Selector)</span>
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <p>
                เข้าไปที่แท็บ <strong>"หัวข้อตามประเมิน (Dropdown)"</strong> จะมี Dropdown ให้เลือกอย่างสะดวก:
              </p>
              <ul className="list-disc list-inside ml-2 text-slate-600 space-y-1 text-xs">
                <li><strong>หมวดหลัก:</strong> ผลสัมฤทธิ์ของงาน (๔ ด้าน) หรือ พฤติกรรมการปฏิบัติงาน (๕ สมรรถนะ)</li>
                <li><strong>ด้าน / สมรรถนะ:</strong> เลือกเฉพาะด้านที่ต้องการ เช่น ด้านปริมาณ, คุณภาพ, หรือการทำงานเป็นทีม</li>
                <li><strong>เจาะจงข้อย่อย:</strong> สามารถเลือกดูข้อย่อยเฉพาะข้อนั้นๆ ได้ทันที</li>
              </ul>
            </div>
          </div>

          {/* Section 3: Adding Content & Photos */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 text-blue-700">
              <Edit3 className="w-4 h-4" />
              <span>การใส่เนื้อหาและอัปโหลดรูปภาพ</span>
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <p>
                ๑. คลิกปุ่ม <strong>"แก้ไขเนื้อหา & รูปภาพ"</strong> ในหัวข้อที่ต้องการ
              </p>
              <p>
                ๒. พิมพ์รายละเอียดผลการปฏิบัติงานจริงในกล่องข้อความ
              </p>
              <p>
                ๓. อัปโหลดรูปภาพหลักฐานจากคอมพิวเตอร์หรือโทรศัพท์ พร้อมพิมพ์คำบรรยายใต้ภาพ
              </p>
              <p>
                ๔. กด <strong>"บันทึกการแก้ไข"</strong> ข้อมูลจะถูกบันทึกในเบราว์เซอร์ทันที
              </p>
            </div>
          </div>

          {/* Section 4: Export & Backup */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 text-purple-700">
              <Download className="w-4 h-4" />
              <span>การสำรองข้อมูล (Export JSON)</span>
            </h3>
            <p className="text-slate-600 text-xs">
              แนะนำให้กดเมนู <strong>"จัดการข้อมูล &gt; สำรองข้อมูล (Export JSON)"</strong>{' '}
              เพื่อบันทึกไฟล์ผลงานเก็บไว้ และสามารถนำเข้าไฟล์เดิมกลับมาเมื่อย้ายเครื่องคอมพิวเตอร์ได้เสมอ
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            เข้าใจแล้ว ปิดหน้าต่างนี้
          </button>
        </div>
      </div>
    </div>
  );
};
