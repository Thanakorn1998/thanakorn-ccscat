import React, { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import { Lock, KeyRound, Eye, EyeOff, X, AlertCircle, CheckCircle2 } from 'lucide-react';

export const PasswordModal: React.FC = () => {
  const { isPasswordModalOpen, setIsPasswordModalOpen, authenticate } = useEvaluation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isPasswordModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage('กรุณากรอกรหัสผ่าน');
      return;
    }

    const ok = authenticate(password);
    if (ok) {
      setIsSuccess(true);
      setErrorMessage('');
      setTimeout(() => {
        setIsSuccess(false);
        setPassword('');
      }, 500);
    } else {
      setErrorMessage('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleClose = () => {
    setPassword('');
    setErrorMessage('');
    setIsPasswordModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">เข้าสู่ระบบแก้ไขข้อมูล</h3>
              <p className="text-xs text-slate-400">สำหรับผู้ดูแลเพื่อเพิ่มรูปภาพและเนื้อหา</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
            บุคคลทั่วไปสามารถเข้ามาเปิดดูหัวข้อ เนื้อหา และรูปภาพผลงานได้ตามปกติ
            แต่หากต้องการ <strong>แก้ไขหัวเว็บ, แก้ไขเนื้อหา หรืออัปโหลดรูปภาพ</strong> กรุณากรอกรหัสผ่านผู้ดูแลระบบ
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              รหัสผ่านผู้ดูแลระบบ
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="กรอกรหัสผ่าน..."
                className={`w-full text-sm border rounded-xl pl-3.5 pr-10 py-2.5 bg-white transition-all focus:outline-hidden ${
                  errorMessage
                    ? 'border-rose-400 ring-2 ring-rose-100'
                    : 'border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>รหัสผ่านถูกต้อง! กำลังเปิดโหมดแก้ไข...</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              ยืนยันรหัสผ่าน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
