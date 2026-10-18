import React from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Lock, 
  BookOpen, 
  Calendar, 
  User, 
  CheckCircle2, 
  Share2,
  FileCheck
} from 'lucide-react';
import type { CourseMaterial, UserAccount } from '../types/index.ts';
import { hasAccessToMaterial, formatLKR } from '../utils/courseLogic.ts';

interface MaterialPreviewModalProps {
  material: CourseMaterial | null;
  currentUser: UserAccount;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (material: CourseMaterial) => void;
  onUnlock: (material: CourseMaterial) => void;
  onToggleComplete: (materialId: string) => void;
}

export const MaterialPreviewModal: React.FC<MaterialPreviewModalProps> = ({
  material,
  currentUser,
  isOpen,
  onClose,
  onDownload,
  onUnlock,
  onToggleComplete
}) => {
  if (!isOpen || !material) return null;

  const hasAccess = hasAccessToMaterial(currentUser, material);
  const isCompleted = currentUser.completedMaterialIds.includes(material.id);
  const isSinhala = material.medium === 'sinhala';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="material-preview-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span className="text-blue-700 font-bold">{material.subjectId}</span>
              <span aria-hidden="true">·</span>
              <span className={isSinhala ? 'text-blue-700' : 'text-slate-700'}>
                {isSinhala ? 'සිංහල මාධ්‍යය' : 'English Medium'}
              </span>
              <span aria-hidden="true">·</span>
              <span>Unit {material.unitNumber}</span>
            </div>
            <h2 id="material-preview-title" className="text-lg font-bold text-slate-900 leading-snug">
              {material.title}
            </h2>
            {material.titleSi && isSinhala && (
              <p className="text-xs text-blue-800 font-medium">
                {material.titleSi}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors shrink-0"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Format & Size</span>
              <span className="font-semibold text-slate-800">{material.fileFormat} ({material.fileSize})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Length</span>
              <span className="font-semibold text-slate-800">{material.totalPages} Pages</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Instructor</span>
              <span className="font-semibold text-slate-800 truncate block">{material.instructorName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Pricing</span>
              <span className="font-bold text-blue-700">{formatLKR(material.price)}</span>
            </div>
          </div>

          {/* Syllabus & Overview */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Resource Overview & Module
            </h3>
            <p className="text-slate-700 leading-relaxed bg-white border border-slate-200/70 p-3.5 rounded-xl text-xs sm:text-sm">
              {material.description}
            </p>
          </div>

          {/* Sample Study Content Excerpt */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Study Content Preview & Formulas
              </h3>
              <span className="text-[11px] text-slate-400">
                {hasAccess ? 'Full Verified Resource Available' : 'Excerpt preview'}
              </span>
            </div>
            
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap border border-slate-800">
              {material.sampleContent}
            </div>
          </div>

          {/* Study Verification Status */}
          {hasAccess && currentUser.role === 'student' && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'text-emerald-700' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold text-emerald-900">
                    {isCompleted ? 'Marked as Completed in Your Progress Tracker' : 'In Progress'}
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    Completed items contribute to your subject completion percentage.
                  </div>
                </div>
              </div>
              <button
                onClick={() => onToggleComplete(material.id)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                {isCompleted ? 'Mark Incomplete' : 'Mark as Done'}
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Close Preview
          </button>

          <div className="flex items-center gap-2">
            {hasAccess ? (
              <button
                onClick={() => {
                  onDownload(material);
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Full Resource ({material.fileFormat})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onUnlock(material);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Unlock for {formatLKR(material.price)}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
