import React from 'react';
import { 
  FileText, 
  Download, 
  Lock, 
  CheckCircle, 
  Eye, 
  Check, 
  Languages, 
  User, 
  Calendar,
  Sparkles
} from 'lucide-react';
import type { CourseMaterial, UserAccount } from '../types/index.ts';
import { hasAccessToMaterial, formatLKR } from '../utils/courseLogic.ts';

interface CourseMaterialCardProps {
  material: CourseMaterial;
  currentUser: UserAccount;
  onPreview: (material: CourseMaterial) => void;
  onDownload: (material: CourseMaterial) => void;
  onUnlock: (material: CourseMaterial) => void;
  onToggleComplete: (materialId: string) => void;
}

export const CourseMaterialCard: React.FC<CourseMaterialCardProps> = ({
  material,
  currentUser,
  onPreview,
  onDownload,
  onUnlock,
  onToggleComplete
}) => {
  const hasAccess = hasAccessToMaterial(currentUser, material);
  const isCompleted = currentUser.completedMaterialIds.includes(material.id);
  const isSinhala = material.medium === 'sinhala';

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'lecture_note':
        return 'Lecture Note';
      case 'past_paper':
        return 'Past Examination Paper';
      case 'model_paper':
        return 'Model Paper & Marking Scheme';
      case 'tutorial_worksheet':
        return 'Practice Worksheet';
      case 'short_note':
        return 'Revision Short Note';
      default:
        return 'Course Resource';
    }
  };

  return (
    <div className={`bg-white rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group ${
      hasAccess 
        ? 'border-slate-200 hover:border-slate-300 hover:shadow-xs' 
        : 'border-slate-200 bg-slate-50/40 hover:border-slate-300'
    }`}>
      {/* Top Header Strip */}
      <div className="p-5 pb-4">
        {/* Unboxed Metadata Line (Anti-slop zero-pill) */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
          <div className="flex items-center gap-1.5 font-medium">
            <span className={isSinhala ? 'text-blue-700 font-semibold' : 'text-slate-800 font-semibold'}>
              {isSinhala ? 'සිංහල මාධ්‍යය' : 'English Medium'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-600">{getTypeLabel(material.type)}</span>
            <span aria-hidden="true">·</span>
            <span>Unit {material.unitNumber}</span>
          </div>

          {/* Pricing indicator */}
          <div className="text-right">
            {material.price === 0 ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Free Preview
              </span>
            ) : hasAccess ? (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Unlocked
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                {formatLKR(material.price)}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
          {material.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
          {material.description}
        </p>

        {/* Secondary Metadata Info (unboxed) */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
          <span>{material.fileFormat}</span>
          <span aria-hidden="true">·</span>
          <span>{material.fileSize}</span>
          <span aria-hidden="true">·</span>
          <span>{material.totalPages} Pages</span>
          <span aria-hidden="true">·</span>
          <span>{material.downloadCount} Downloads</span>
        </div>
      </div>

      {/* Action Footer Strip */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Preview Button */}
        <button
          onClick={() => onPreview(material)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 rounded-lg transition-colors"
          aria-label={`Preview ${material.title}`}
        >
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          <span>Preview Note</span>
        </button>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2">
          {hasAccess ? (
            <>
              {/* Mark Complete Checkbox for Progress Tracking */}
              {currentUser.role === 'student' && (
                <button
                  onClick={() => onToggleComplete(material.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-white border border-slate-300 text-slate-600 hover:text-slate-900'
                  }`}
                  title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                  aria-label={isCompleted ? 'Completed' : 'Mark Completed'}
                >
                  <CheckCircle className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline">{isCompleted ? 'Done' : 'Complete'}</span>
                </button>
              )}

              {/* Download Resource Button */}
              <button
                onClick={() => onDownload(material)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                aria-label={`Download ${material.title}`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </>
          ) : (
            /* Locked - Pay small fee or upload bank slip */
            <button
              onClick={() => onUnlock(material)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
              aria-label={`Unlock for ${formatLKR(material.price)}`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Unlock ({formatLKR(material.price)})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
