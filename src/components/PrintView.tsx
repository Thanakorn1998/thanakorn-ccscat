import React from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import { Printer, ArrowLeft } from 'lucide-react';

export const PrintView: React.FC = () => {
  const { data, stats, setActiveTab } = useEvaluation();
  const profile = data.profile;
  const summary = data.summary;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top action toolbar (Hidden on print) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('topics')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้าเลือกดูตามหัวข้อ</span>
          </button>
          <div className="text-xs text-slate-500">
            เอกสารสรุปรายงานผลการปฏิบัติงานราชการ จัดรูปแบบพร้อมพิมพ์หรือบันทึกเป็น PDF
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์เอกสาร / บันทึกเป็น PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Document Container */}
      <div className="bg-white p-6 sm:p-10 max-w-4xl mx-auto shadow-sm border border-slate-200 text-black font-serif text-[13px] leading-normal print:border-none print:shadow-none print:p-0">
        {/* ================= HEADER & PROFILE ================= */}
        <div className="mb-8">
          <div className="text-right text-xs mb-2">เอกสารรายงานผลการปฏิบัติงาน</div>
          <div className="text-center font-bold text-base mb-1">
            รายงานผลการปฏิบัติงานพนักงานราชการทั่วไป
          </div>
          <div className="text-center text-xs mb-6 text-slate-600">
            {profile.organizationName} ({profile.agencyName})
          </div>

          {/* ข้อมูลของผู้รับการประเมิน */}
          <div className="font-bold mb-2">ข้อมูลของผู้รับการประเมิน</div>
          <div className="border border-black p-3 mb-6 space-y-1 text-xs">
            <div className="flex justify-between">
              <span>รอบการประเมิน: <strong>{profile.evaluationRound}</strong></span>
              <span>ระหว่างวันที่: <strong>{profile.startDate}</strong> ถึง <strong>{profile.endDate}</strong></span>
            </div>
            <div>ชื่อผู้รับการประเมิน: <strong>{profile.fullName}</strong></div>
            <div className="flex justify-between">
              <span>ตำแหน่ง: <strong>{profile.position}</strong></span>
              <span>กลุ่มงาน: <strong>{profile.workGroup || '-'}</strong></span>
            </div>
            <div className="flex justify-between">
              <span>สังกัด: <strong>{profile.organizationName}</strong></span>
              <span>ชื่องาน/โครงการ: <strong>{profile.projectName || '-'}</strong></span>
            </div>
            <div className="flex justify-between">
              <span>วันเริ่มสัญญาจ้าง: <strong>{profile.contractStartDate}</strong></span>
              <span>วันสิ้นสุดสัญญาจ้าง: <strong>{profile.contractEndDate}</strong></span>
            </div>
          </div>
        </div>

        {/* ================= หมวดที่ ๑: ผลสัมฤทธิ์ของงาน ================= */}
        <div className="mb-8">
          <div className="font-bold text-sm mb-2 border-b border-black pb-1">
            หมวดที่ ๑: รายงานผลสัมฤทธิ์ของงาน (๔ ด้าน)
          </div>
          <table className="w-full border-collapse border border-black text-left text-xs mb-4">
            <thead>
              <tr className="border-b border-black bg-slate-50 font-bold">
                <th className="border-r border-black p-2 w-16 text-center">ข้อ</th>
                <th className="border-r border-black p-2 w-1/3">หัวข้อ / ตัวชี้วัด</th>
                <th className="border-r border-black p-2">ผลการปฏิบัติงานจริง</th>
                <th className="p-2 w-20 text-center">หลักฐาน</th>
              </tr>
            </thead>
            <tbody>
              {data.form11.dimensions.map((dim) => (
                <React.Fragment key={dim.id}>
                  <tr className="bg-slate-100 font-bold border-b border-black">
                    <td colSpan={4} className="p-1.5 pl-3">
                      {dim.code}. {dim.title}
                    </td>
                  </tr>
                  {dim.items.map((item) => (
                    <tr key={item.id} className="border-b border-black align-top">
                      <td className="border-r border-black p-2 text-center font-bold">{item.code}</td>
                      <td className="border-r border-black p-2">
                        <div className="font-semibold">{item.title}</div>
                        {item.description && (
                          <div className="text-[11px] text-slate-600 mt-0.5">{item.description}</div>
                        )}
                      </td>
                      <td className="border-r border-black p-2 text-slate-800">
                        {item.actualResultDescription || (
                          <span className="text-slate-400 italic">ยังไม่ได้ระบุข้อความ</span>
                        )}
                      </td>
                      <td className="p-2 text-center text-xs">
                        {item.evidenceImages && item.evidenceImages.length > 0 ? (
                          <span className="font-bold text-emerald-800">
                            {item.evidenceImages.length} รูป
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= หมวดที่ ๒: พฤติกรรมการปฏิบัติงาน ================= */}
        <div className="mb-8">
          <div className="font-bold text-sm mb-2 border-b border-black pb-1">
            หมวดที่ ๒: รายงานพฤติกรรมและการปฏิบัติงาน (๕ สมรรถนะ)
          </div>
          <table className="w-full border-collapse border border-black text-left text-xs mb-4">
            <thead>
              <tr className="border-b border-black bg-slate-50 font-bold">
                <th className="border-r border-black p-2 w-16 text-center">ข้อ</th>
                <th className="border-r border-black p-2 w-1/3">สมรรถนะ / พฤติกรรม</th>
                <th className="border-r border-black p-2">ผลการปฏิบัติงานจริง</th>
                <th className="p-2 w-20 text-center">หลักฐาน</th>
              </tr>
            </thead>
            <tbody>
              {data.form12.competencies.map((comp) => (
                <React.Fragment key={comp.id}>
                  <tr className="bg-slate-100 font-bold border-b border-black">
                    <td colSpan={4} className="p-1.5 pl-3">
                      {comp.code}. {comp.title}
                    </td>
                  </tr>
                  {comp.items.map((item) => (
                    <tr key={item.id} className="border-b border-black align-top">
                      <td className="border-r border-black p-2 text-center font-bold">{item.code}</td>
                      <td className="border-r border-black p-2">
                        <div className="font-semibold">{item.title}</div>
                        {item.description && (
                          <div className="text-[11px] text-slate-600 mt-0.5">{item.description}</div>
                        )}
                      </td>
                      <td className="border-r border-black p-2 text-slate-800">
                        {item.actualResultDescription || (
                          <span className="text-slate-400 italic">ยังไม่ได้ระบุข้อความ</span>
                        )}
                      </td>
                      <td className="p-2 text-center text-xs">
                        {item.evidenceImages && item.evidenceImages.length > 0 ? (
                          <span className="font-bold text-teal-800">
                            {item.evidenceImages.length} รูป
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-4 text-xs mt-10 pt-4 border-t border-black">
          <div className="border border-black p-4 space-y-2">
            <div className="font-bold">ผู้รายงาน / ผู้รับการประเมิน :</div>
            <div className="pt-6 text-center space-y-1">
              <div>(ลงชื่อ)......................................................</div>
              <div>({profile.fullName})</div>
              <div>ตำแหน่ง {profile.position}</div>
            </div>
          </div>

          <div className="border border-black p-4 space-y-2">
            <div className="font-bold">ผู้บังคับบัญชา / ผู้ประเมิน :</div>
            <div className="pt-6 text-center space-y-1">
              <div>(ลงชื่อ)......................................................</div>
              <div>({summary.evaluatorName})</div>
              <div>ตำแหน่ง {summary.evaluatorPosition}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
