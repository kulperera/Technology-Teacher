import React, { useState, useEffect } from 'react';
import { X, Check, FileText, AlertCircle, Sparkles } from 'lucide-react';
import type { CourseMaterial, Subject, Medium, MaterialType } from '../types/index.ts';

interface MaterialEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: CourseMaterial | null; // null means creating new
  subjects: Subject[];
  instructorName: string;
  onSave: (material: CourseMaterial) => void;
}

export const MaterialEditModal: React.FC<MaterialEditModalProps> = ({
  isOpen,
  onClose,
  material,
  subjects,
  instructorName,
  onSave
}) => {
  if (!isOpen) return null;

  const isEditing = !!material;

  const [subjectId, setSubjectId] = useState(material?.subjectId || subjects[0]?.id || 'engineering-tech');
  const [medium, setMedium] = useState<Medium>(material?.medium || 'sinhala');
  const [title, setTitle] = useState(material?.title || '');
  const [titleSi, setTitleSi] = useState(material?.titleSi || '');
  const [description, setDescription] = useState(material?.description || '');
  const [moduleName, setModuleName] = useState(material?.moduleName || 'Mechanical & Workshop Technology');
  const [unitNumber, setUnitNumber] = useState(material?.unitNumber || 1);
  const [type, setType] = useState<MaterialType>(material?.type || 'lecture_note');
  const [price, setPrice] = useState(material?.price ?? 450);
  const [fileFormat, setFileFormat] = useState<'PDF' | 'DOCX' | 'ZIP'>(material?.fileFormat || 'PDF');
  const [fileSize, setFileSize] = useState(material?.fileSize || '5.2 MB');
  const [totalPages, setTotalPages] = useState(material?.totalPages || 36);
  const [sampleContent, setSampleContent] = useState(material?.sampleContent || '');

  useEffect(() => {
    if (material) {
      setSubjectId(material.subjectId);
      setMedium(material.medium);
      setTitle(material.title);
      setTitleSi(material.titleSi || '');
      setDescription(material.description);
      setModuleName(material.moduleName);
      setUnitNumber(material.unitNumber);
      setType(material.type);
      setPrice(material.price);
      setFileFormat(material.fileFormat);
      setFileSize(material.fileSize);
      setTotalPages(material.totalPages);
      setSampleContent(material.sampleContent);
    } else {
      setSubjectId(subjects[0]?.id || 'engineering-tech');
      setMedium('sinhala');
      setTitle('');
      setTitleSi('');
      setDescription('');
      setModuleName('Mechanical & Workshop Technology');
      setUnitNumber(1);
      setType('lecture_note');
      setPrice(450);
      setFileFormat('PDF');
      setFileSize('4.8 MB');
      setTotalPages(36);
      setSampleContent('');
    }
  }, [material, isOpen, subjects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const savedMaterial: CourseMaterial = {
      id: material ? material.id : `mat_${Date.now()}`,
      subjectId,
      medium,
      title: title.trim(),
      titleSi: titleSi.trim() || undefined,
      description: description.trim(),
      moduleName: moduleName.trim() || 'General Unit',
      unitNumber: Number(unitNumber) || 1,
      type,
      price: Math.max(0, Number(price) || 0),
      currency: 'LKR',
      fileFormat,
      fileSize: fileSize.trim() || '4.0 MB',
      downloadCount: material ? material.downloadCount : 0,
      totalPages: Math.max(1, Number(totalPages) || 1),
      sampleContent: sampleContent.trim() || `Core theoretical study principles and exam guidelines for ${title}.`,
      publishedDate: material ? material.publishedDate : new Date().toISOString().split('T')[0],
      instructorName: material?.instructorName || instructorName
    };

    onSave(savedMaterial);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="material-edit-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Control Panel · Material Editor
            </div>
            <h3 id="material-edit-title" className="text-base font-bold text-slate-900 mt-0.5">
              {isEditing ? `Edit Resource: ${material.title}` : 'Publish New Course Resource'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Subject & Medium Subcategory row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject Dropdown */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Parent Subject *
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Medium Subcategory (Available for ALL subjects!) */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Medium Subcategory *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMedium('sinhala')}
                  className={`py-2 px-3 rounded-lg border font-medium text-center transition-all ${
                    medium === 'sinhala'
                      ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold shadow-xs'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  සිංහල මාධ්‍යය
                </button>
                <button
                  type="button"
                  onClick={() => setMedium('english')}
                  className={`py-2 px-3 rounded-lg border font-medium text-center transition-all ${
                    medium === 'english'
                      ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold shadow-xs'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  English Medium
                </button>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Resource Title (English / Main Display) *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mechanical Workshop Technology & Lathe Mechanics Note"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              required
            />
          </div>

          {/* Sinhala Title */}
          {medium === 'sinhala' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Resource Title in Sinhala (සිංහල මාතෘකාව)
              </label>
              <input
                type="text"
                value={titleSi}
                onChange={(e) => setTitleSi(e.target.value)}
                placeholder="උදා: වැඩපළ තාක්ෂණය සහ පට්ටල් යන්ත්‍ර ක්‍රියාකාරීත්වය"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Curriculum Summary & Learning Outcomes *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Key concepts covered, exam weightage, and past paper reference numbers..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Unit, Module & Resource Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Unit Number</label>
              <input
                type="number"
                min={1}
                max={25}
                value={unitNumber}
                onChange={(e) => setUnitNumber(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Module Name</label>
              <input
                type="text"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                placeholder="e.g. Civil Construction"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Resource Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as MaterialType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="lecture_note">Lecture Note</option>
                <option value="past_paper">Past Examination Paper</option>
                <option value="model_paper">Model Paper & Scheme</option>
                <option value="tutorial_worksheet">Worksheet</option>
                <option value="short_note">Revision Short Note</option>
              </select>
            </div>
          </div>

          {/* Pricing with Presets */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-800">
                Course Material Price (LKR)
              </label>
              <span className="text-blue-700 font-bold tabular-nums">
                {price === 0 ? 'Free Preview' : `LKR ${Number(price).toLocaleString()}`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                step={50}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono"
              />
              {/* Quick Presets */}
              <div className="flex items-center gap-1">
                {[0, 450, 650, 850].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setPrice(val)}
                    className={`px-2.5 py-2 rounded-lg border text-[11px] font-semibold transition-colors ${
                      price === val
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {val === 0 ? 'Free' : `${val}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* File Format, Size & Page count */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">File Format</label>
              <select
                value={fileFormat}
                onChange={(e) => setFileFormat(e.target.value as 'PDF' | 'DOCX' | 'ZIP')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                <option value="PDF">PDF Document</option>
                <option value="DOCX">Word Document</option>
                <option value="ZIP">ZIP Bundle</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">File Size</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="e.g. 5.4 MB"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Total Pages</label>
              <input
                type="number"
                min={1}
                value={totalPages}
                onChange={(e) => setTotalPages(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          {/* Sample Study Notes & Content Excerpt */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Theoretical Notes & Study Outline (Downloaded by students)
            </label>
            <textarea
              value={sampleContent}
              onChange={(e) => setSampleContent(e.target.value)}
              rows={4}
              placeholder="Detailed lecture notes, equation formulas, safety guidelines, and worked examples..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Material Changes' : 'Publish Resource'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
