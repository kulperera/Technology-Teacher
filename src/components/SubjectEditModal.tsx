import React, { useState, useEffect } from 'react';
import { X, Layers, Plus, Trash2, Check, AlertCircle } from 'lucide-react';
import type { Subject, SubjectTopic } from '../types/index.ts';
import { validateSubjectData } from '../utils/courseLogic.ts';

interface SubjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject | null; // null means creating a new subject
  onSave: (subject: Subject) => void;
  existingSubjectIds: string[];
}

export const SubjectEditModal: React.FC<SubjectEditModalProps> = ({
  isOpen,
  onClose,
  subject,
  onSave,
  existingSubjectIds
}) => {
  if (!isOpen) return null;

  const isEditing = !!subject;

  const [name, setName] = useState(subject?.name || '');
  const [nameSi, setNameSi] = useState(subject?.nameSi || '');
  const [code, setCode] = useState(subject?.code || '');
  const [description, setDescription] = useState(subject?.description || '');
  const [descriptionSi, setDescriptionSi] = useState(subject?.descriptionSi || '');
  const [topics, setTopics] = useState<SubjectTopic[]>(subject?.topics || [
    { id: 'topic-1', name: 'Unit 1: Fundamentals', nameSi: 'මූලික ඒකකය 1' }
  ]);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicNameSi, setNewTopicNameSi] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (subject) {
      setName(subject.name);
      setNameSi(subject.nameSi);
      setCode(subject.code);
      setDescription(subject.description);
      setDescriptionSi(subject.descriptionSi);
      setTopics(subject.topics || []);
    } else {
      setName('');
      setNameSi('');
      setCode('NEW-' + Math.floor(10 + Math.random() * 89));
      setDescription('');
      setDescriptionSi('');
      setTopics([
        { id: 't-1', name: 'Core Foundations', nameSi: 'මූලික පදනම' }
      ]);
    }
    setErrors([]);
  }, [subject, isOpen]);

  const handleAddTopic = () => {
    if (!newTopicName.trim()) return;
    const newTopic: SubjectTopic = {
      id: 'topic_' + Date.now(),
      name: newTopicName.trim(),
      nameSi: newTopicNameSi.trim() || newTopicName.trim()
    };
    setTopics([...topics, newTopic]);
    setNewTopicName('');
    setNewTopicNameSi('');
  };

  const handleRemoveTopic = (topicId: string) => {
    setTopics(topics.filter(t => t.id !== topicId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateSubjectData({ name, nameSi, code });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const subjectId = isEditing 
      ? subject.id 
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `subj-${Date.now()}`;

    const savedSubject: Subject = {
      id: subjectId,
      name: name.trim(),
      nameSi: nameSi.trim(),
      code: code.trim(),
      description: description.trim() || `Course curriculum for ${name}. Both Sinhala and English mediums supported.`,
      descriptionSi: descriptionSi.trim() || `${nameSi} විෂය නිර්දේශය. සිංහල හා ඉංග්‍රීසි මාධ්‍ය දෙකෙන්ම අධ්‍යයන ද්‍රව්‍ය ලබාගත හැක.`,
      badgeColor: subject?.badgeColor || 'border-blue-200 bg-blue-50/50 text-blue-700',
      topics
    };

    onSave(savedSubject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="subject-edit-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Control Panel · Subject Suite
            </div>
            <h3 id="subject-edit-title" className="text-base font-bold text-slate-900 mt-0.5">
              {isEditing ? `Edit Subject: ${subject.name}` : 'Add New Curriculum Subject'}
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
          {errors.length > 0 && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 space-y-1">
              {errors.map((err, i) => (
                <div key={i} className="flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}

          {/* Bilingual Medium Subcategory Notice */}
          <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-xl text-blue-900">
            <span className="font-semibold block">Bilingual Standard:</span>
            <span>All subjects in the portal automatically support both <strong>Sinhala Medium (සිංහල මාධ්‍යය)</strong> and <strong>English Medium</strong> tracks for course materials.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject Name English */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Subject Name (English) *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Engineering Technology"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                required
              />
            </div>

            {/* Subject Name Sinhala */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Subject Name (Sinhala - සිංහලෙන්) *
              </label>
              <input
                type="text"
                value={nameSi}
                onChange={(e) => setNameSi(e.target.value)}
                placeholder="උදා: ඉංජිනේරු තාක්ෂණවේදය"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                required
              />
            </div>
          </div>

          {/* Subject Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Subject Code *
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. ET-41, SFT-43, ICT-45"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                required
              />
            </div>

            {isEditing && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  System Subject Identifier (ID)
                </label>
                <input
                  type="text"
                  value={subject.id}
                  disabled
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-100 rounded-lg font-mono text-slate-500"
                />
              </div>
            )}
          </div>

          {/* English Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Curriculum Overview & Scope (English)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Detailed description of curriculum syllabus, laboratory practicals, and exam scope..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sinhala Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              විෂය නිර්දේශයේ හැඳින්වීම (Sinhala Overview)
            </label>
            <textarea
              value={descriptionSi}
              onChange={(e) => setDescriptionSi(e.target.value)}
              rows={2}
              placeholder="උසස් පෙළ තාක්ෂණවේදය විෂය කරුණු, ප්‍රායෝගික පරීක්ෂණ සහ විභාග මට්ටම..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Units / Topics Manager */}
          <div className="pt-2 border-t border-slate-200">
            <label className="block font-semibold text-slate-800 mb-2">
              Syllabus Units / Modules ({topics.length})
            </label>

            {/* List of current topics */}
            <div className="space-y-1.5 mb-3 max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50/50">
              {topics.length === 0 ? (
                <div className="text-slate-400 p-2 text-center">No units added yet. Add units below.</div>
              ) : (
                topics.map((t, idx) => (
                  <div key={t.id} className="flex items-center justify-between bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-[10px]">#{idx + 1}</span>
                      <span className="font-semibold text-slate-800">{t.name}</span>
                      {t.nameSi && (
                        <span className="text-slate-500 text-[11px]">({t.nameSi})</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(t.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      aria-label={`Remove unit ${t.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add new unit inline */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              <input
                type="text"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="New Unit name in English"
                className="sm:col-span-2 px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
              <input
                type="text"
                value={newTopicNameSi}
                onChange={(e) => setNewTopicNameSi(e.target.value)}
                placeholder="Unit name in Sinhala (සිංහලෙන්)"
                className="sm:col-span-2 px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleAddTopic}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Unit</span>
              </button>
            </div>
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
              <span>{isEditing ? 'Save Subject Changes' : 'Create Subject'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
