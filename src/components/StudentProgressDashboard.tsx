import React from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  DownloadCloud, 
  BookOpen, 
  Clock, 
  Layers, 
  ChevronRight, 
  FileText, 
  Languages, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import type { Subject, CourseMaterial, UserAccount, DownloadRecord } from '../types/index.ts';
import { calculateSubjectProgress } from '../utils/courseLogic.ts';

interface StudentProgressDashboardProps {
  currentUser: UserAccount;
  subjects: Subject[];
  materials: CourseMaterial[];
  onDownloadAgain: (material: CourseMaterial) => void;
  onNavigateToSubject: (subjectId: string) => void;
  onToggleComplete: (materialId: string) => void;
}

export const StudentProgressDashboard: React.FC<StudentProgressDashboardProps> = ({
  currentUser,
  subjects,
  materials,
  onDownloadAgain,
  onNavigateToSubject,
  onToggleComplete
}) => {
  const overallProgress = calculateSubjectProgress(materials, currentUser.completedMaterialIds);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Overview Hero Stat Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
            <span>Student Learning Portal</span>
            <span aria-hidden="true">·</span>
            <span>{currentUser.name}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Curriculum Progress & Resource Tracking
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Track your completed study units, downloaded past papers, and revision notes across both Sinhala and English mediums.
          </p>

          {/* Overall Progress Bar */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">Total Curriculum Completion</span>
              <span className="text-blue-300 font-bold tabular-nums text-sm">
                {overallProgress.completed} of {overallProgress.total} Units ({overallProgress.percentage}%)
              </span>
            </div>
            
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700/60 p-0.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(overallProgress.percentage, 4)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Progress per Subject Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Subject & Medium Progress Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Individual tracking for Sinhala Medium and English Medium syllabus streams.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map(subject => {
            const isSubject1 = subject.id === 'engineering-tech';
            const subjectMaterials = materials.filter(m => m.subjectId === subject.id);
            const sinhalaProgress = calculateSubjectProgress(subjectMaterials, currentUser.completedMaterialIds, undefined, 'sinhala');
            const englishProgress = calculateSubjectProgress(subjectMaterials, currentUser.completedMaterialIds, undefined, 'english');
            const totalSubProg = calculateSubjectProgress(subjectMaterials, currentUser.completedMaterialIds);

            return (
              <div 
                key={subject.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-blue-700">{subject.code}</span>
                    {isSubject1 && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        Subject 1 (Core)
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900">
                    {subject.name}
                  </h4>
                  <div className="text-xs text-slate-500 mb-4 font-medium">
                    {subject.nameSi}
                  </div>

                  {/* Overall Subject Bar */}
                  <div className="space-y-1.5 mb-5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">Overall Progress</span>
                      <span className="font-bold text-slate-900 tabular-nums">
                        {totalSubProg.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${totalSubProg.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Subcategories Breakdown: Sinhala vs English */}
                  <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                    {/* Sinhala Medium Subcategory */}
                    <div>
                      <div className="flex justify-between text-slate-600 mb-1">
                        <span className="font-medium">සිංහල මාධ්‍යය (Sinhala)</span>
                        <span className="tabular-nums font-semibold text-slate-800">
                          {sinhalaProgress.completed}/{sinhalaProgress.total} ({sinhalaProgress.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${sinhalaProgress.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* English Medium Subcategory */}
                    <div>
                      <div className="flex justify-between text-slate-600 mb-1">
                        <span className="font-medium">English Medium</span>
                        <span className="tabular-nums font-semibold text-slate-800">
                          {englishProgress.completed}/{englishProgress.total} ({englishProgress.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${englishProgress.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => onNavigateToSubject(subject.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50/70 hover:bg-blue-100/70 rounded-lg transition-colors"
                  >
                    <span>View All Materials</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Items Checklist */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Completed Units Checklist
            </h3>
            <p className="text-xs text-slate-500">
              Click any item to toggle completion status in your academic progress ledger.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            {currentUser.completedMaterialIds.length} Units Finished
          </span>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden text-xs">
          {materials.map(material => {
            const isDone = currentUser.completedMaterialIds.includes(material.id);
            const isSinhala = material.medium === 'sinhala';

            return (
              <div 
                key={material.id}
                className={`p-3.5 flex items-center justify-between gap-3 transition-colors ${
                  isDone ? 'bg-emerald-50/30' : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => onToggleComplete(material.id)}
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                      isDone 
                        ? 'bg-emerald-600 border-emerald-600 text-white' 
                        : 'border-slate-300 hover:border-slate-400 bg-white'
                    }`}
                    aria-label={isDone ? `Mark ${material.title} incomplete` : `Mark ${material.title} complete`}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">{material.subjectId}</span>
                      <span aria-hidden="true">·</span>
                      <span className={isSinhala ? 'text-blue-700 font-medium' : 'text-slate-600'}>
                        {isSinhala ? 'සිංහල මාධ්‍යය' : 'English Medium'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Unit {material.unitNumber}</span>
                    </div>
                    <div className={`font-semibold truncate ${isDone ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                      {material.title}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                    isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isDone ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
