import React, { useState, useRef } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import { IndicatorItem, EvidenceImage } from '../types/evaluation';
import {
  X,
  Check,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface EditIndicatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType: 'form11' | 'form12';
  dimensionId: string;
  item: IndicatorItem;
  dimensionTitle: string;
}

export const EditIndicatorModal: React.FC<EditIndicatorModalProps> = ({
  isOpen,
  onClose,
  formType,
  dimensionId,
  item,
  dimensionTitle,
}) => {
  const { updateIndicator } = useEvaluation();

  const [title, setTitle] = useState(item.title);
  const [actualResultDescription, setActualResultDescription] = useState(
    item.actualResultDescription || ''
  );
  const [documentUrl, setDocumentUrl] = useState(item.documentUrl || '');
  const [documentTitle, setDocumentTitle] = useState(item.documentTitle || '');
  const [images, setImages] = useState<EvidenceImage[]>(item.evidenceImages || []);

  // For adding new image
  const [newImgUrl, setNewImgUrl] = useState('');
  const [newImgCaption, setNewImgCaption] = useState('');
  const [imgInputMode, setImgInputMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3.5 * 1024 * 1024) {
      alert('ขนาดไฟล์ภาพใหญ่เกิน 3.5MB กรุณาเลือกไฟล์ที่มีขนาดเล็กลง');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        const newImg: EvidenceImage = {
          id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          url: base64,
          caption: newImgCaption.trim() || `หลักฐานข้อ ${item.code} ภาพที่ ${images.length + 1}`,
          date: new Date().toLocaleDateString('th-TH'),
        };
        setImages((prev) => [...prev, newImg]);
        setNewImgCaption('');
      }
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  const handleAddUrlImage = () => {
    if (!newImgUrl.trim()) return;
    const newImg: EvidenceImage = {
      id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      url: newImgUrl.trim(),
      caption: newImgCaption.trim() || `หลักฐานข้อ ${item.code} ภาพที่ ${images.length + 1}`,
      date: new Date().toLocaleDateString('th-TH'),
    };
    setImages((prev) => [...prev, newImg]);
    setNewImgUrl('');
    setNewImgCaption('');
  };

  const handleRemoveImage = (imgId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imgId));
  };

  const handleUpdateImageCaption = (imgId: string, caption: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === imgId ? { ...img, caption } : img))
    );
  };

  const handleSave = () => {
    updateIndicator(formType, dimensionId, item.id, {
      title,
      actualResultDescription,
      documentUrl,
      documentTitle,
      evidenceImages: images,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span>{formType === 'form11' ? 'ผลสัมฤทธิ์ของงาน' : 'พฤติกรรมการปฏิบัติงาน'}</span>
              <span>•</span>
              <span>{dimensionTitle}</span>
            </div>
            <h2 className="font-semibold text-base sm:text-lg mt-0.5 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-700 text-white rounded text-xs font-bold">
                ข้อ {item.code}
              </span>
              <span>แก้ไขเนื้อหาและรูปภาพผลงาน</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Item Title */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              ชื่อหัวข้อ / ตัวชี้วัด
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm font-medium border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Actual Work Description (เนื้อหาผลงานที่ทำ) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>เนื้อหารายละเอียดผลงานจริง / กิจกรรมที่ได้ปฏิบัติ</span>
              </label>
              <span className="text-[11px] text-slate-400">ใส่ข้อความสรุปผลงานที่นี่ได้ทันที</span>
            </div>
            <textarea
              rows={5}
              value={actualResultDescription}
              onChange={(e) => setActualResultDescription(e.target.value)}
              placeholder="กรอกรายละเอียดผลงาน เช่น:
- ได้ดำเนินการจัดทำเอกสารและประสานงาน...
- ปฏิบัติภารกิจสำเร็จตามเป้าหมายจำนวน...
- ได้รับคำชื่นชมและผลสัมฤทธิ์เป็นที่น่าพอใจ..."
              className="w-full text-sm border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* Evidence Photos Management */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>รูปภาพหลักฐานประกอบผลงาน ({images.length} รูป)</span>
              </label>
            </div>

            {/* Existing Images Gallery with Caption Editor */}
            {images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex gap-3 items-start relative group"
                  >
                    <img
                      src={img.url}
                      alt={img.caption}
                      className="w-20 h-20 object-cover rounded-lg shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <input
                        type="text"
                        value={img.caption}
                        onChange={(e) => handleUpdateImageCaption(img.id, e.target.value)}
                        placeholder="คำบรรยายใต้ภาพ..."
                        className="text-xs w-full bg-white border border-slate-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden font-medium"
                      />
                      <div className="text-[10px] text-slate-400">
                        เพิ่มเมื่อ: {img.date || 'วันนี้'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                      title="ลบรูปภาพนี้"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Image Box */}
            <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-300 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">+ เพิ่มรูปภาพใหม่</span>
                <div className="flex rounded-md p-0.5 bg-slate-200">
                  <button
                    type="button"
                    onClick={() => setImgInputMode('upload')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      imgInputMode === 'upload' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    อัปโหลดไฟล์
                  </button>
                  <button
                    type="button"
                    onClick={() => setImgInputMode('url')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      imgInputMode === 'url' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    ใส่ Image URL
                  </button>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={newImgCaption}
                  onChange={(e) => setNewImgCaption(e.target.value)}
                  placeholder="พิมพ์คำบรรยายใต้ภาพ (เช่น ภาพการประชุมเชิงปฏิบัติการ...)"
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {imgInputMode === 'upload' ? (
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>เลือกรูปภาพจากเครื่องคอมพิวเตอร์ / โทรศัพท์</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <p className="text-[10px] text-slate-400 text-center mt-1">
                    รองรับ JPG, PNG, WEBP (แนะนำขนาดไม่เกิน 3MB ต่อรูป)
                  </p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImgUrl}
                    onChange={(e) => setNewImgUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrlImage}
                    disabled={!newImgUrl.trim()}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    เพิ่มรูป
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Optional Document Link */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-700 block">
              ลิงก์เอกสารอ้างอิงเพิ่มเติม (ถ้ามี เช่น Google Drive / PDF)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="ชื่อเอกสาร เช่น คำสั่งแต่งตั้ง หรือ รายงานฉบับสมบูรณ์"
                className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
              />
              <input
                type="url"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>บันทึกการแก้ไข</span>
          </button>
        </div>
      </div>
    </div>
  );
};
