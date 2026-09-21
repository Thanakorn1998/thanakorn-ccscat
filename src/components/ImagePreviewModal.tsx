import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  caption: string;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  caption,
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 cursor-default"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="max-h-[78vh] flex items-center justify-center bg-black/40 overflow-hidden">
          <img
            src={imageUrl}
            alt={caption}
            className="max-h-[75vh] w-auto max-w-full object-contain mx-auto"
          />
        </div>

        {caption && (
          <div className="p-4 bg-slate-900 text-white text-xs sm:text-sm font-medium border-t border-slate-800">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
};
