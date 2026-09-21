import React, { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import { IndicatorItem, DimensionGroup } from '../types/evaluation';
import { EditIndicatorModal } from './EditIndicatorModal';
import {
  FileText,
  Edit3,
  Plus,
  Image as ImageIcon,
  ChevronDown,
  Eye,
  Lock,
  Filter,
} from 'lucide-react';

interface Form11WorkAchievementsProps {
  onSelectImagePreview?: (url: string, caption: string) => void;
}

export const Form11WorkAchievements: React.FC<Form11WorkAchievementsProps> = ({
  onSelectImagePreview,
}) => {
  const { data, isAuthenticated, requireAuth } = useEvaluation();
  const [selectedDimension, setSelectedDimension] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<{
    item: IndicatorItem;
    dimensionId: string;
    dimensionTitle: string;
  } | null>(null);

  const handleEditClick = (dim: DimensionGroup, item: IndicatorItem) => {
    requireAuth(() => {
      setEditingItem({
        item,
        dimensionId: dim.id,
        dimensionTitle: dim.title,
      });
    });
  };

  const dimensions = data.form11.dimensions;
  const filteredDimensions =
    selectedDimension === 'all'
      ? dimensions
      : dimensions.filter((d) => d.id === selectedDimension);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
              หมวดที่ ๑
            </span>
            <span className="text-xs text-slate-500 font-medium">ผลสัมฤทธิ์ของงาน (๔ ด้าน)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            ผลสัมฤทธิ์ของงานตามภาระหน้าที่
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            ครอบคลุมด้านปริมาณ คุณภาพ ความรวดเร็ว และการใช้ทรัพยากรอย่างคุ้มค่า
          </p>
        </div>

        {/* Dropdown Filter by Dimension */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative min-w-56">
            <select
              value={selectedDimension}
              onChange={(e) => setSelectedDimension(e.target.value)}
              className="w-full appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl pl-3.5 pr-9 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">📂 แสดงครบทั้ง ๔ ด้าน</option>
              {dimensions.map((dim) => (
                <option key={dim.id} value={dim.id}>
                  {dim.code}. {dim.title} ({dim.items.length} หัวข้อย่อย)
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Dimensions List */}
      <div className="space-y-6">
        {filteredDimensions.map((dimension) => (
          <div
            key={dimension.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
          >
            {/* Dimension Title Bar */}
            <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center">
                  {dimension.code}
                </span>
                <h3 className="font-bold text-slate-800 text-base">{dimension.title}</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {dimension.items.length} ข้อย่อย
              </span>
            </div>

            {/* Subtopic Items */}
            <div className="divide-y divide-slate-100">
              {dimension.items.map((item) => {
                const hasImages = item.evidenceImages && item.evidenceImages.length > 0;
                const hasDescription =
                  item.actualResultDescription && item.actualResultDescription.trim().length > 0;

                return (
                  <div key={item.id} className="p-6 space-y-4 hover:bg-slate-50/40 transition-colors">
                    {/* Item Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                          <span className="text-emerald-700 font-extrabold">{item.code}</span>
                          <span>{item.title}</span>
                        </h4>
                        {item.description && (
                          <p className="text-xs text-slate-500">{item.description}</p>
                        )}
                      </div>

                      <button
                        onClick={() => handleEditClick(dimension, item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                          isAuthenticated
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>แก้ไขเนื้อหา & รูปภาพ</span>
                        {!isAuthenticated && <Lock className="w-3 h-3 text-slate-400" />}
                      </button>
                    </div>

                    {/* Actual Result Description */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ผลงานจริงที่ได้ปฏิบัติ:</span>
                      </div>
                      {hasDescription ? (
                        <div className="bg-slate-50/80 rounded-xl p-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line border border-slate-200/80">
                          {item.actualResultDescription}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic bg-slate-50/50 p-3 rounded-lg border border-dashed border-slate-200">
                          ยังไม่ได้กรอกเนื้อหาผลงานในข้อนี้ (กดปุ่ม "แก้ไขเนื้อหา & รูปภาพ" เพื่อใส่ข้อความ)
                        </div>
                      )}
                    </div>

                    {/* Evidence Images */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            รูปภาพหลักฐาน ({item.evidenceImages ? item.evidenceImages.length : 0} รูป)
                          </span>
                        </span>
                        <button
                          onClick={() => handleEditClick(dimension, item)}
                          className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                        >
                          + เพิ่มรูปภาพ
                        </button>
                      </div>

                      {hasImages ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {item.evidenceImages.map((img) => (
                            <div
                              key={img.id}
                              className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex flex-col justify-between hover:shadow-md transition-all"
                            >
                              <div
                                onClick={() =>
                                  onSelectImagePreview && onSelectImagePreview(img.url, img.caption)
                                }
                                className="h-28 w-full overflow-hidden relative cursor-pointer"
                              >
                                <img
                                  src={img.url}
                                  alt={img.caption}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                  <Eye className="w-5 h-5" />
                                </div>
                              </div>
                              {img.caption && (
                                <div className="p-2 bg-white text-[11px] text-slate-700 line-clamp-2 border-t border-slate-100 font-medium">
                                  {img.caption}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-slate-200 p-3 text-center bg-slate-50/40">
                          <p className="text-[11px] text-slate-400">ยังไม่มีรูปภาพหลักฐานในข้อนี้</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editingItem && (
        <EditIndicatorModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          formType="form11"
          dimensionId={editingItem.dimensionId}
          dimensionTitle={editingItem.dimensionTitle}
          item={editingItem.item}
        />
      )}
    </div>
  );
};
