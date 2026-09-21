import React from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import { FileCheck, CheckCircle2, ListFilter, Image as ImageIcon, ArrowRight } from 'lucide-react';

export const Form13Summary: React.FC = () => {
  const { data, stats, setActiveTab } = useEvaluation();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
              สรุปภาพรวม
            </span>
            <span className="text-xs text-slate-500 font-medium">รายงานสรุปผลงานตามหัวข้อ</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            สรุปการบันทึกผลการปฏิบัติงานทุกหัวข้อ
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            รวบรวมข้อมูลผลสัมฤทธิ์และพฤติกรรม พร้อมจำนวนหลักฐานประกอบ
          </p>
        </div>

        <button
          onClick={() => setActiveTab('topics')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <ListFilter className="w-4 h-4" />
          <span>เปิดดูตาม Dropdown หัวข้อ</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">หัวข้อการประเมินทั้งหมด</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{stats.totalTopics} หัวข้อ</div>
          <div className="text-xs text-slate-500 mt-1">
            ผลสัมฤทธิ์ {stats.form11Count} + พฤติกรรม {stats.form12Count}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">หัวข้อที่กรอกผลงานแล้ว</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {stats.topicsWithContent} / {stats.totalTopics}
          </div>
          <div className="text-xs text-emerald-700 mt-1">
            {Math.round((stats.topicsWithContent / (stats.totalTopics || 1)) * 100)}% มีข้อมูลแล้ว
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">รูปภาพหลักฐานทั้งหมด</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{stats.totalImages} รูป</div>
          <div className="text-xs text-blue-600 mt-1">พร้อมคำบรรยายประกอบ</div>
        </div>
      </div>
    </div>
  );
};
