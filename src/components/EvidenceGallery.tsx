import React, { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import { EvidenceImage, IndicatorItem } from '../types/evaluation';
import { EditIndicatorModal } from './EditIndicatorModal';
import {
  Image as ImageIcon,
  Plus,
  Filter,
  Eye,
  Calendar,
  FileText,
  AlertCircle,
  Lock,
} from 'lucide-react';

interface EvidenceGalleryProps {
  onSelectImagePreview: (url: string, caption: string) => void;
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({ onSelectImagePreview }) => {
  const { data, isAuthenticated, requireAuth } = useEvaluation();
  const [filterType, setFilterType] = useState<'all' | 'form11' | 'form12' | 'missing'>('all');
  const [editingTarget, setEditingTarget] = useState<{
    item: IndicatorItem;
    dimensionId: string;
    dimensionTitle: string;
    formType: 'form11' | 'form12';
  } | null>(null);

  // Collect all items with their dimension and form info
  const allItems: {
    item: IndicatorItem;
    dimensionId: string;
    dimensionTitle: string;
    formType: 'form11' | 'form12';
    formLabel: string;
  }[] = [];

  data.form11.dimensions.forEach((dim) => {
    dim.items.forEach((item) => {
      allItems.push({
        item,
        dimensionId: dim.id,
        dimensionTitle: dim.title,
        formType: 'form11',
        formLabel: 'ผลสัมฤทธิ์ของงาน',
      });
    });
  });

  data.form12.competencies.forEach((dim) => {
    dim.items.forEach((item) => {
      allItems.push({
        item,
        dimensionId: dim.id,
        dimensionTitle: dim.title,
        formType: 'form12',
        formLabel: 'พฤติกรรมการปฏิบัติงาน',
      });
    });
  });

  // Flat list of all images with context
  const allImages: {
    image: EvidenceImage;
    item: IndicatorItem;
    dimensionId: string;
    dimensionTitle: string;
    formType: 'form11' | 'form12';
    formLabel: string;
  }[] = [];

  allItems.forEach((entry) => {
    entry.item.evidenceImages?.forEach((img) => {
      allImages.push({
        image: img,
        item: entry.item,
        dimensionId: entry.dimensionId,
        dimensionTitle: entry.dimensionTitle,
        formType: entry.formType,
        formLabel: entry.formLabel,
      });
    });
  });

  const missingItems = allItems.filter(
    (entry) => !entry.item.evidenceImages || entry.item.evidenceImages.length === 0
  );

  const handleEditItem = (entry: {
    item: IndicatorItem;
    dimensionId: string;
    dimensionTitle: string;
    formType: 'form11' | 'form12';
  }) => {
    requireAuth(() => {
      setEditingTarget(entry);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-bold">
              คลังรูปภาพและหลักฐาน
            </span>
            <span className="text-xs text-slate-500 font-medium">รวมรูปภาพทุกตัวชี้วัด</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            แกลเลอรีภาพถ่ายหลักฐานประกอบการปฏิบัติงาน
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            รวบรวมภาพถ่ายทั้งหมด {allImages.length} รูป จาก {allItems.length} หัวข้อ
            สามารถคลิกเพื่อดูรูปขยาย หรือใส่รหัสผ่านเพื่อเพิ่มรูปภาพ
          </p>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            รูปภาพทั้งหมด ({allImages.length})
          </button>
          <button
            onClick={() => setFilterType('form11')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filterType === 'form11'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            เฉพาะผลสัมฤทธิ์
          </button>
          <button
            onClick={() => setFilterType('form12')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filterType === 'form12'
                ? 'bg-teal-600 text-white'
                : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
            }`}
          >
            เฉพาะพฤติกรรม
          </button>
          <button
            onClick={() => setFilterType('missing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filterType === 'missing'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            หัวข้อที่ยังไม่มีรูป ({missingItems.length})
          </button>
        </div>
      </div>

      {/* View Mode: Missing items */}
      {filterType === 'missing' ? (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span>หัวข้อที่ยังรอการใส่รูปภาพหลักฐาน ({missingItems.length} รายการ)</span>
          </div>
          <p className="text-xs text-slate-500">
            คุณสามารถคลิกปุ่ม "+ เพิ่มรูปภาพและเนื้อหา" ในหัวข้อด้านล่างนี้ เพื่ออัปโหลดรูปถ่ายประกอบ
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {missingItems.map((entry) => (
              <div
                key={entry.item.id}
                className="p-4 rounded-xl border border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                    <span className="font-semibold text-emerald-700">{entry.formLabel}</span>
                    <span>•</span>
                    <span>{entry.dimensionTitle}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                    ข้อ {entry.item.code} {entry.item.title}
                  </h4>
                </div>

                <button
                  onClick={() => handleEditItem(entry)}
                  className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ อัปโหลดรูปภาพและเนื้อหาในข้อนี้</span>
                  {!isAuthenticated && <Lock className="w-3 h-3 text-slate-400" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Image Grid */
        <div>
          {allImages.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-xs text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">ยังไม่มีรูปภาพหลักฐานในระบบ</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                คุณสามารถเริ่มใส่รูปภาพได้โดยคลิกปุ่มด้านล่างเพื่อเลือกดูหัวข้อที่รอใส่รูปภาพ
              </p>
              <button
                onClick={() => setFilterType('missing')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>ดูหัวข้อที่รอใส่รูปภาพ</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allImages
                .filter((imgEntry) => {
                  if (filterType === 'form11') return imgEntry.formType === 'form11';
                  if (filterType === 'form12') return imgEntry.formType === 'form12';
                  return true;
                })
                .map((imgEntry) => (
                  <div
                    key={imgEntry.image.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    <div
                      onClick={() =>
                        onSelectImagePreview(imgEntry.image.url, imgEntry.image.caption)
                      }
                      className="h-44 bg-slate-100 relative overflow-hidden cursor-pointer"
                    >
                      <img
                        src={imgEntry.image.url}
                        alt={imgEntry.image.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Eye className="w-6 h-6" />
                      </div>
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium">
                        ข้อ {imgEntry.item.code}
                      </span>
                    </div>

                    <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {imgEntry.dimensionTitle}
                        </div>
                        <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 mt-0.5">
                          {imgEntry.image.caption || `ภาพหลักฐานข้อ ${imgEntry.item.code}`}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{imgEntry.image.date || 'ภาพผลงาน'}</span>
                        <button
                          onClick={() => handleEditItem(imgEntry)}
                          className="text-emerald-700 hover:underline font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <span>แก้ไขข้อนี้</span>
                          {!isAuthenticated && <Lock className="w-2.5 h-2.5 text-slate-400" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Edit modal if triggered from gallery */}
      {editingTarget && (
        <EditIndicatorModal
          isOpen={!!editingTarget}
          onClose={() => setEditingTarget(null)}
          formType={editingTarget.formType}
          dimensionId={editingTarget.dimensionId}
          dimensionTitle={editingTarget.dimensionTitle}
          item={editingTarget.item}
        />
      )}
    </div>
  );
};
