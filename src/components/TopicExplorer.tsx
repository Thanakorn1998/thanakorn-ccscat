import React, { useState, useMemo } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import { IndicatorItem, DimensionGroup } from '../types/evaluation';
import { EditIndicatorModal } from './EditIndicatorModal';
import {
  ChevronDown,
  Search,
  Filter,
  Layers,
  Image as ImageIcon,
  Edit3,
  Plus,
  Eye,
  Calendar,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  FileText,
  Bookmark,
} from 'lucide-react';

interface TopicExplorerProps {
  onSelectImagePreview: (url: string, caption: string) => void;
}

export const TopicExplorer: React.FC<TopicExplorerProps> = ({ onSelectImagePreview }) => {
  const { data, isAuthenticated, requireAuth } = useEvaluation();

  // Dropdown States
  const [selectedMainCategory, setSelectedMainCategory] = useState<'all' | 'form11' | 'form12'>('all');
  const [selectedDimensionId, setSelectedDimensionId] = useState<string>('all');
  const [selectedItemId, setSelectedItemId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Editing state
  const [editingTarget, setEditingTarget] = useState<{
    item: IndicatorItem;
    dimensionId: string;
    dimensionTitle: string;
    formType: 'form11' | 'form12';
  } | null>(null);

  // Compile full flat list of topics with metadata
  const allTopicItems = useMemo(() => {
    const list: {
      item: IndicatorItem;
      dimensionId: string;
      dimensionCode: string;
      dimensionTitle: string;
      mainCategory: 'form11' | 'form12';
      mainCategoryTitle: string;
    }[] = [];

    // Form 1-1 (ผลสัมฤทธิ์ของงาน)
    data.form11.dimensions.forEach((dim) => {
      dim.items.forEach((item) => {
        list.push({
          item,
          dimensionId: dim.id,
          dimensionCode: dim.code,
          dimensionTitle: dim.title,
          mainCategory: 'form11',
          mainCategoryTitle: 'ผลสัมฤทธิ์ของงาน',
        });
      });
    });

    // Form 1-2 (พฤติกรรมการปฏิบัติงาน)
    data.form12.competencies.forEach((dim) => {
      dim.items.forEach((item) => {
        list.push({
          item,
          dimensionId: dim.id,
          dimensionCode: dim.code,
          dimensionTitle: dim.title,
          mainCategory: 'form12',
          mainCategoryTitle: 'พฤติกรรมการปฏิบัติงาน (สมรรถนะ)',
        });
      });
    });

    return list;
  }, [data]);

  // Available dimensions based on selected main category
  const availableDimensions: { id: string; code: string; title: string; mainCategory: 'form11' | 'form12' }[] = useMemo(() => {
    const dims: { id: string; code: string; title: string; mainCategory: 'form11' | 'form12' }[] = [];
    if (selectedMainCategory === 'all' || selectedMainCategory === 'form11') {
      data.form11.dimensions.forEach((d) =>
        dims.push({ id: d.id, code: d.code, title: d.title, mainCategory: 'form11' })
      );
    }
    if (selectedMainCategory === 'all' || selectedMainCategory === 'form12') {
      data.form12.competencies.forEach((d) =>
        dims.push({ id: d.id, code: d.code, title: d.title, mainCategory: 'form12' })
      );
    }
    return dims;
  }, [data, selectedMainCategory]);

  // Filtered topics
  const filteredTopics = useMemo(() => {
    return allTopicItems.filter((entry) => {
      // Main category filter
      if (selectedMainCategory !== 'all' && entry.mainCategory !== selectedMainCategory) {
        return false;
      }
      // Dimension filter
      if (selectedDimensionId !== 'all' && entry.dimensionId !== selectedDimensionId) {
        return false;
      }
      // Specific Item filter
      if (selectedItemId !== 'all' && entry.item.id !== selectedItemId) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = entry.item.title.toLowerCase().includes(q);
        const matchesCode = entry.item.code.toLowerCase().includes(q);
        const matchesDesc = (entry.item.actualResultDescription || '').toLowerCase().includes(q);
        const matchesDim = entry.dimensionTitle.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCode && !matchesDesc && !matchesDim) {
          return false;
        }
      }
      return true;
    });
  }, [allTopicItems, selectedMainCategory, selectedDimensionId, selectedItemId, searchQuery]);

  // Handler to open editor with password check
  const handleEditClick = (entry: {
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
      {/* Sleek Topic Dropdown Selector Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                เมนูเลือกหัวข้อ
              </span>
              <span className="text-xs text-slate-500">เลือกดูเนื้อหาและรูปภาพตามหัวข้อที่ต้องการ</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              หัวข้อการประเมินและผลการปฏิบัติงาน
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">พบทั้งหมด:</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
              {filteredTopics.length} หัวข้อ
            </span>
          </div>
        </div>

        {/* The 3 Cascading Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Dropdown 1: Main Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              ๑. เลือกหมวดการประเมินหลัก
            </label>
            <div className="relative">
              <select
                value={selectedMainCategory}
                onChange={(e) => {
                  setSelectedMainCategory(e.target.value as any);
                  setSelectedDimensionId('all');
                  setSelectedItemId('all');
                }}
                className="w-full appearance-none text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-xl pl-3.5 pr-9 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden transition-all cursor-pointer"
              >
                <option value="all">📂 ทุกหมวด (แสดงทั้งหมด)</option>
                <option value="form11">🏆 ผลสัมฤทธิ์ของงาน (๔ ด้าน)</option>
                <option value="form12">🌟 พฤติกรรมการปฏิบัติงาน (๕ สมรรถนะ)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Dropdown 2: Dimension / Competency */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              ๒. เลือกด้าน / สมรรถนะ
            </label>
            <div className="relative">
              <select
                value={selectedDimensionId}
                onChange={(e) => {
                  setSelectedDimensionId(e.target.value);
                  setSelectedItemId('all');
                }}
                className="w-full appearance-none text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-xl pl-3.5 pr-9 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden transition-all cursor-pointer"
              >
                <option value="all">📋 แสดงทุกด้านในหมวดนี้</option>
                {availableDimensions.map((dim) => (
                  <option key={dim.id} value={dim.id}>
                    {dim.code}. {dim.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Dropdown 3: Jump directly to specific subtopic item */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              ๓. กระโดดไปยังหัวข้อย่อยเฉพาะ
            </label>
            <div className="relative">
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full appearance-none text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-xl pl-3.5 pr-9 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden transition-all cursor-pointer"
              >
                <option value="all">🔍 ทุกข้อย่อย (แสดงเรียงตามลำดับ)</option>
                {(selectedDimensionId !== 'all'
                  ? allTopicItems.filter((i) => i.dimensionId === selectedDimensionId)
                  : selectedMainCategory !== 'all'
                  ? allTopicItems.filter((i) => i.mainCategory === selectedMainCategory)
                  : allTopicItems
                ).map((entry) => (
                  <option key={entry.item.id} value={entry.item.id}>
                    ข้อ {entry.item.code} {entry.item.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Quick Search & Filter Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาข้อความ, คีย์เวิร์ด หรือชื่อหัวข้อ..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {(selectedMainCategory !== 'all' ||
            selectedDimensionId !== 'all' ||
            selectedItemId !== 'all' ||
            searchQuery) && (
            <button
              onClick={() => {
                setSelectedMainCategory('all');
                setSelectedDimensionId('all');
                setSelectedItemId('all');
                setSearchQuery('');
              }}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-medium px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors shrink-0 cursor-pointer"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      </div>

      {/* List of Topic Cards */}
      <div className="space-y-4">
        {filteredTopics.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <Filter className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">ไม่พบหัวข้อที่ค้นหา</h3>
            <p className="text-xs text-slate-500">
              ลองเปลี่ยนการเลือกใน Dropdown ด้านบน หรือคลิกปุ่มล้างตัวกรอง
            </p>
          </div>
        ) : (
          filteredTopics.map((entry) => {
            const hasImages = entry.item.evidenceImages && entry.item.evidenceImages.length > 0;
            const hasDescription = entry.item.actualResultDescription && entry.item.actualResultDescription.trim().length > 0;

            return (
              <div
                key={entry.item.id}
                id={`topic-${entry.item.id}`}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all p-5 sm:p-6 space-y-4"
              >
                {/* Topic Header: Title, Category Badges & Edit Button */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                          entry.mainCategory === 'form11'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {entry.mainCategoryTitle}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="font-medium text-slate-600 text-xs">
                        {entry.dimensionCode}. {entry.dimensionTitle}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 text-xs font-extrabold flex items-center justify-center shrink-0">
                        {entry.item.code}
                      </span>
                      <span>{entry.item.title}</span>
                    </h3>
                  </div>

                  {/* Edit Button with Auth Guard */}
                  <button
                    onClick={() =>
                      handleEditClick({
                        item: entry.item,
                        dimensionId: entry.dimensionId,
                        dimensionTitle: entry.dimensionTitle,
                        formType: entry.mainCategory,
                      })
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer shadow-2xs ${
                      isAuthenticated
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>แก้ไขเนื้อหา & รูปภาพ</span>
                    {!isAuthenticated && <Lock className="w-3 h-3 text-slate-400 ml-0.5" />}
                  </button>
                </div>

                {/* Content Section: Work Result Description */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>ผลการปฏิบัติงาน / รายละเอียดเนื้อหา:</span>
                  </div>

                  {hasDescription ? (
                    <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {entry.item.actualResultDescription}
                    </div>
                  ) : (
                    <div className="bg-amber-50/50 rounded-xl p-4 border border-dashed border-amber-200 text-xs text-amber-800 flex items-center justify-between gap-3">
                      <span>ยังไม่ได้ระบุรายละเอียดเนื้อหาในข้อนี้ (ผู้ดูแลสามารถกดปุ่มแก้ไขเพื่อพิมพ์เนื้อหาได้)</span>
                      <button
                        onClick={() =>
                          handleEditClick({
                            item: entry.item,
                            dimensionId: entry.dimensionId,
                            dimensionTitle: entry.dimensionTitle,
                            formType: entry.mainCategory,
                          })
                        }
                        className="text-emerald-700 hover:underline font-semibold shrink-0 cursor-pointer"
                      >
                        + พิมพ์เนื้อหา
                      </button>
                    </div>
                  )}
                </div>

                {/* Evidence Photos Section */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-bold text-slate-700 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <span>
                        รูปภาพหลักฐานประกอบ (
                        {entry.item.evidenceImages ? entry.item.evidenceImages.length : 0} รูป)
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        handleEditClick({
                          item: entry.item,
                          dimensionId: entry.dimensionId,
                          dimensionTitle: entry.dimensionTitle,
                          formType: entry.mainCategory,
                        })
                      }
                      className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>เพิ่มรูปภาพ</span>
                    </button>
                  </div>

                  {hasImages ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                      {entry.item.evidenceImages.map((img) => (
                        <div
                          key={img.id}
                          className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex flex-col justify-between hover:shadow-md transition-all"
                        >
                          <div
                            onClick={() => onSelectImagePreview(img.url, img.caption)}
                            className="h-32 w-full overflow-hidden relative cursor-pointer"
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
                    <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center bg-slate-50/50">
                      <p className="text-xs text-slate-400">
                        ยังไม่มีรูปภาพหลักฐานในข้อนี้ คุณสามารถกดปุ่ม "เพิ่มรูปภาพ" เพื่ออัปโหลดภาพถ่ายผลงานได้
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit modal if opened */}
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
