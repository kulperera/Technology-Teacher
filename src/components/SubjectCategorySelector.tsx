import React from 'react';
import { 
  Wrench, 
  Atom, 
  Laptop, 
  Sprout, 
  Calculator, 
  Search, 
  Languages, 
  Filter,
  CheckCircle2
} from 'lucide-react';
import type { Subject, SubjectId, Medium } from '../types/index.ts';

interface SubjectCategorySelectorProps {
  subjects: Subject[];
  selectedSubjectId: SubjectId | 'all';
  onSelectSubject: (id: SubjectId | 'all') => void;
  selectedMedium: Medium | 'all';
  onSelectMedium: (med: Medium | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: string;
  onSelectType: (type: string) => void;
  totalMaterialsCount: number;
}

export const SubjectCategorySelector: React.FC<SubjectCategorySelectorProps> = ({
  subjects,
  selectedSubjectId,
  onSelectSubject,
  selectedMedium,
  onSelectMedium,
  searchQuery,
  onSearchChange,
  selectedType,
  onSelectType,
  totalMaterialsCount
}) => {
  const getSubjectIcon = (id: SubjectId) => {
    switch (id) {
      case 'engineering-tech':
        return <Wrench className="w-4 h-4 text-blue-600" />;
      case 'science-for-tech':
        return <Atom className="w-4 h-4 text-emerald-600" />;
      case 'ict':
        return <Laptop className="w-4 h-4 text-purple-600" />;
      case 'biosystems-tech':
        return <Sprout className="w-4 h-4 text-amber-600" />;
      case 'combined-maths':
        return <Calculator className="w-4 h-4 text-indigo-600" />;
      default:
        return <Wrench className="w-4 h-4" />;
    }
  };

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Title with Subcategory announcement */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wide uppercase">
              <span>National Curriculum Portal</span>
              <span aria-hidden="true">·</span>
              <span>Bilingual Subcategories Available</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Curriculum Subjects & Study Materials
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Subject 1: <strong className="text-slate-900 font-semibold">Engineering Technology</strong> and all technology stream subjects are divided into <span className="font-medium text-blue-700">Sinhala Medium</span> and <span className="font-medium text-blue-700">English Medium</span> curriculum tracks.
            </p>
          </div>

          {/* Medium Subcategory Segmented Switch */}
          <div className="flex flex-col gap-1.5 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Languages className="w-3.5 h-3.5 text-blue-600" />
              <span>Select Medium Subcategory:</span>
            </div>
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-medium">
              <button
                onClick={() => onSelectMedium('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedMedium === 'all'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Mediums
              </button>
              <button
                onClick={() => onSelectMedium('sinhala')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  selectedMedium === 'sinhala'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <span>සිංහල මාධ්‍යය</span>
                <span className="text-[10px] opacity-80">(Sinhala)</span>
              </button>
              <button
                onClick={() => onSelectMedium('english')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  selectedMedium === 'english'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <span>English Medium</span>
              </button>
            </div>
          </div>
        </div>

        {/* Subjects horizontal selector bar */}
        <div className="py-4">
          <div className="text-xs font-semibold text-slate-500 mb-2.5">
            Select Subject:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => onSelectSubject('all')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap flex items-center gap-2 ${
                selectedSubjectId === 'all'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              All Subjects
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                selectedSubjectId === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {totalMaterialsCount}
              </span>
            </button>

            {subjects.map((sub, index) => {
              const isSelected = selectedSubjectId === sub.id;
              const isSubject1 = sub.id === 'engineering-tech';

              return (
                <button
                  key={sub.id}
                  onClick={() => onSelectSubject(sub.id)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all whitespace-nowrap flex items-center gap-2 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {getSubjectIcon(sub.id)}
                  <span>{sub.name}</span>
                  {isSubject1 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded">
                      Subject 1
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">
                    {sub.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Subject Context Banner */}
        {selectedSubject && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span className="text-blue-700 font-bold">{selectedSubject.code}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedSubject.nameSi}</span>
                {selectedSubject.id === 'engineering-tech' && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-700 font-medium">Core Technical Subject</span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {selectedMedium === 'sinhala' ? selectedSubject.descriptionSi : selectedSubject.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 shrink-0">
              <span className="font-medium text-slate-700">Units:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {selectedSubject.topics.slice(0, 3).map(topic => (
                  <span key={topic.id} className="text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                    {selectedMedium === 'sinhala' ? topic.nameSi : topic.name}
                  </span>
                ))}
                {selectedSubject.topics.length > 3 && (
                  <span className="text-slate-400 text-[11px]">+{selectedSubject.topics.length - 3} more</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search & Resource Type Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by topic, unit name, past paper year, or instructor..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
            <span className="text-slate-400 font-medium text-xs hidden md:inline">Type:</span>
            {[
              { id: 'all', label: 'All Resources' },
              { id: 'lecture_note', label: 'Lecture Notes' },
              { id: 'past_paper', label: 'Past Papers' },
              { id: 'model_paper', label: 'Model Papers' },
              { id: 'short_note', label: 'Revision Notes' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => onSelectType(type.id)}
                className={`px-2.5 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                  selectedType === type.id
                    ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
