import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  BookOpen, 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  CheckCircle, 
  XCircle, 
  Search, 
  Languages, 
  Filter, 
  ArrowUpRight, 
  Check, 
  AlertCircle,
  Eye,
  Layers,
  Sparkles,
  DollarSign,
  Users,
  CreditCard,
  Shield,
  Zap
} from 'lucide-react';
import type { 
  Subject, 
  CourseMaterial, 
  UserAccount, 
  PaymentSlip, 
  ActionLog, 
  Medium,
  PaymentGatewayConfig,
  GatewayTransaction
} from '../types/index.ts';
import { formatLKR } from '../utils/courseLogic.ts';
import { SubjectEditModal } from './SubjectEditModal.tsx';
import { MaterialEditModal } from './MaterialEditModal.tsx';
import { RegisteredUsersManager } from './RegisteredUsersManager.tsx';
import { PaymentGatewayManager } from './PaymentGatewayManager.tsx';

interface ControlPanelProps {
  subjects: Subject[];
  materials: CourseMaterial[];
  slips: PaymentSlip[];
  actionLogs: ActionLog[];
  currentUser: UserAccount;
  registeredUsers?: UserAccount[];
  gatewayConfig?: PaymentGatewayConfig;
  gatewayTransactions?: GatewayTransaction[];
  onSaveSubject: (subject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
  onSaveMaterial: (material: CourseMaterial) => void;
  onDeleteMaterial: (materialId: string) => void;
  onDuplicateMaterial: (material: CourseMaterial) => void;
  onApproveSlip: (slipId: string) => void;
  onRejectSlip: (slipId: string) => void;
  onPreviewMaterial: (material: CourseMaterial) => void;
  onUpdateUser?: (user: UserAccount) => void;
  onAddUser?: (user: UserAccount) => void;
  onUpdateGatewayConfig?: (config: PaymentGatewayConfig) => void;
  onSimulateWebhook?: (studentId: string, materialId: string, amount: number, method: string) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  subjects,
  materials,
  slips,
  actionLogs,
  currentUser,
  registeredUsers = [],
  gatewayConfig,
  gatewayTransactions = [],
  onSaveSubject,
  onDeleteSubject,
  onSaveMaterial,
  onDeleteMaterial,
  onDuplicateMaterial,
  onApproveSlip,
  onRejectSlip,
  onPreviewMaterial,
  onUpdateUser = () => {},
  onAddUser = () => {},
  onUpdateGatewayConfig = () => {},
  onSimulateWebhook = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<'subjects' | 'materials' | 'users' | 'gateway' | 'slips' | 'activity'>('subjects');


  // Filter state for Materials editor
  const [filterSubjectId, setFilterSubjectId] = useState<string>('all');
  const [filterMedium, setFilterMedium] = useState<Medium | 'all'>('all');
  const [materialSearch, setMaterialSearch] = useState('');

  // Modals state
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  const [editingMaterial, setEditingMaterial] = useState<CourseMaterial | null>(null);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);

  // Subject deletion confirmation state
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  // Calculated Stats
  const sinhalaMaterialsCount = materials.filter(m => m.medium === 'sinhala').length;
  const englishMaterialsCount = materials.filter(m => m.medium === 'english').length;
  const pendingSlips = slips.filter(s => s.status === 'pending');

  // Filtered materials
  const displayedMaterials = materials.filter(m => {
    if (filterSubjectId !== 'all' && m.subjectId !== filterSubjectId) return false;
    if (filterMedium !== 'all' && m.medium !== filterMedium) return false;
    if (materialSearch) {
      const q = materialSearch.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        (m.titleSi && m.titleSi.toLowerCase().includes(q)) ||
        m.moduleName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Control Panel Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Dedicated Content & Curriculum Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Curriculum & Materials Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Create, edit, and organize all subjects (including Subject 1: Engineering Technology) and their corresponding course materials across Sinhala and English medium subcategories.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={() => {
              setEditingSubject(null);
              setIsSubjectModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Subject</span>
          </button>

          <button
            onClick={() => {
              setEditingMaterial(null);
              setIsMaterialModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>New Course Material</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Total Subjects</span>
          <span className="text-xl font-bold text-slate-900 tabular-nums">{subjects.length}</span>
          <span className="text-[10px] text-blue-600 block mt-0.5 font-medium">Bilingual Tracks</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Total Units</span>
          <span className="text-xl font-bold text-slate-900 tabular-nums">{materials.length}</span>
          <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">Sinhala & English</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Registered People</span>
          <span className="text-xl font-bold text-blue-700 tabular-nums">{registeredUsers.length}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Students & Users</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Payment Gateway</span>
          <span className="text-xl font-bold text-indigo-700 uppercase tabular-nums">
            {gatewayConfig?.activeGateway || 'PayHere'}
          </span>
          <span className="text-[10px] text-emerald-600 block mt-0.5 font-semibold">● Linked & Active</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Sinhala / English</span>
          <span className="text-xl font-bold text-slate-800 tabular-nums">{sinhalaMaterialsCount}/{englishMaterialsCount}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Bi-Medium Units</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs col-span-2 md:col-span-1">
          <span className="text-[11px] font-medium text-slate-500 block">Pending Slips</span>
          <span className="text-xl font-bold text-amber-600 tabular-nums">{pendingSlips.length}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Awaiting Review</span>
        </div>
      </div>

      {/* Control Panel Tab Switcher */}
      <div className="border-b border-slate-200 flex items-center gap-4 sm:gap-6 text-xs font-semibold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('subjects')}
          className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'subjects'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Subjects ({subjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'materials'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Course Materials ({materials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'users'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-blue-600" />
          <span>Registered People ({registeredUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('gateway')}
          className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'gateway'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4 text-indigo-600" />
          <span>Payment Gateway & Facilities</span>
        </button>

        <button
          onClick={() => setActiveTab('slips')}
          className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'slips'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Bank Payment Slips</span>
          {pendingSlips.length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-md text-[10px]">
              {pendingSlips.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'activity'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Audit Log</span>
        </button>
      </div>


      {/* ================= TAB 1: SUBJECTS MANAGEMENT ================= */}
      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Curriculum Subjects Portfolio
              </h2>
              <p className="text-xs text-slate-500">
                Manage subject names in English & Sinhala, edit syllabus unit definitions, and organize tracks.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingSubject(null);
                setIsSubjectModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Subject</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjects.map((sub, index) => {
              const isSubject1 = sub.id === 'engineering-tech';
              const subjectMaterials = materials.filter(m => m.subjectId === sub.id);
              const sinhalaCount = subjectMaterials.filter(m => m.medium === 'sinhala').length;
              const englishCount = subjectMaterials.filter(m => m.medium === 'english').length;

              return (
                <div 
                  key={sub.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                        {sub.code}
                      </span>
                      {isSubject1 ? (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          Subject 1 (Primary Core)
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          {subjectMaterials.length} materials
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {sub.name}
                      </h3>
                      <div className="text-xs font-medium text-slate-600 mt-0.5">
                        {sub.nameSi}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {sub.description}
                    </p>

                    {/* Subcategories badge indicator */}
                    <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span>සිංහල මාධ්‍යය Materials:</span>
                        <span className="font-bold text-blue-700 tabular-nums">{sinhalaCount} units</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>English Medium Materials:</span>
                        <span className="font-bold text-indigo-700 tabular-nums">{englishCount} units</span>
                      </div>
                    </div>

                    {/* Topics preview */}
                    <div className="pt-2">
                      <span className="text-[11px] text-slate-500 font-semibold block mb-1">
                        Syllabus Units ({sub.topics.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {sub.topics.slice(0, 3).map(topic => (
                          <span key={topic.id} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded truncate max-w-[150px]">
                            {topic.name}
                          </span>
                        ))}
                        {sub.topics.length > 3 && (
                          <span className="text-[10px] text-slate-400 self-center">
                            +{sub.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Subject Card Footer Actions */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setEditingSubject(sub);
                        setIsSubjectModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100/70 rounded-lg transition-colors"
                      aria-label={`Edit ${sub.name}`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Subject</span>
                    </button>

                    {!isSubject1 && (
                      <button
                        onClick={() => setSubjectToDelete(sub)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete subject"
                        aria-label={`Delete ${sub.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: COURSE MATERIALS EDITOR ================= */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          {/* Filter & Search Controls */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Course Materials Management Table
                </h2>
                <p className="text-xs text-slate-500">
                  Click Edit on any resource to update pricing, syllabus content, medium, or file details.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingMaterial(null);
                  setIsMaterialModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Material</span>
              </button>
            </div>

            {/* Filter toolbar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 pt-2 border-t border-slate-100">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  placeholder="Search materials by title, module, or topic..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Subject Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Subject:</span>
                <select
                  value={filterSubjectId}
                  onChange={(e) => setFilterSubjectId(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="all">All Subjects ({materials.length})</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              {/* Medium Subcategory Switch */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-medium">Medium:</span>
                {(['all', 'sinhala', 'english'] as const).map(med => (
                  <button
                    key={med}
                    onClick={() => setFilterMedium(med)}
                    className={`px-2.5 py-1.5 rounded-lg border transition-colors ${
                      filterMedium === med
                        ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {med === 'all' ? 'All' : med === 'sinhala' ? 'සිංහල මාධ්‍යය' : 'English'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Materials Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-3.5 px-4">Subject & Subcategory</th>
                    <th className="py-3.5 px-4">Material Title</th>
                    <th className="py-3.5 px-4">Module & Unit</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">File Specs</th>
                    <th className="py-3.5 px-4">Downloads</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedMaterials.map(mat => {
                    const isSinhala = mat.medium === 'sinhala';
                    const parentSub = subjects.find(s => s.id === mat.subjectId);

                    return (
                      <tr key={mat.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900">{parentSub?.code || mat.subjectId}</div>
                          <span className={`text-[11px] font-semibold ${isSinhala ? 'text-blue-700' : 'text-slate-700'}`}>
                            {isSinhala ? 'සිංහල මාධ්‍යය' : 'English Medium'}
                          </span>
                        </td>

                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-bold text-slate-900 line-clamp-1">{mat.title}</div>
                          {mat.titleSi && isSinhala && (
                            <div className="text-[11px] text-blue-800 line-clamp-1">{mat.titleSi}</div>
                          )}
                          <div className="text-[10px] text-slate-400 capitalize">{mat.type.replace('_', ' ')}</div>
                        </td>

                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          Unit {mat.unitNumber}: {mat.moduleName}
                        </td>

                        <td className="py-3 px-4 font-bold text-slate-900 tabular-nums whitespace-nowrap">
                          {formatLKR(mat.price)}
                        </td>

                        <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                          {mat.fileFormat} · {mat.fileSize} · {mat.totalPages}p
                        </td>

                        <td className="py-3 px-4 font-mono text-slate-600 tabular-nums">
                          {mat.downloadCount}
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Edit Button */}
                            <button
                              onClick={() => {
                                setEditingMaterial(mat);
                                setIsMaterialModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg font-semibold transition-colors"
                              title="Edit all material properties"
                              aria-label={`Edit ${mat.title}`}
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>

                            {/* Duplicate Button */}
                            <button
                              onClick={() => onDuplicateMaterial(mat)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                              title="Clone material to create alternate language or unit"
                              aria-label={`Duplicate ${mat.title}`}
                            >
                              <Copy className="w-3 h-3" />
                              <span>Clone</span>
                            </button>

                            {/* Preview Button */}
                            <button
                              onClick={() => onPreviewMaterial(mat)}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Preview student note"
                              aria-label={`Preview ${mat.title}`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => onDeleteMaterial(mat.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete material"
                              aria-label={`Delete ${mat.title}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: REGISTERED PEOPLE & STUDENTS LEDGER ================= */}
      {activeTab === 'users' && (
        <RegisteredUsersManager
          users={registeredUsers}
          materials={materials}
          subjects={subjects}
          onUpdateUser={onUpdateUser}
          onAddUser={onAddUser}
        />
      )}

      {/* ================= TAB 4: PAYMENT GATEWAY FACILITIES ================= */}
      {activeTab === 'gateway' && gatewayConfig && (
        <PaymentGatewayManager
          config={gatewayConfig}
          transactions={gatewayTransactions}
          materials={materials}
          users={registeredUsers}
          onUpdateConfig={onUpdateGatewayConfig}
          onSimulateWebhook={onSimulateWebhook}
        />
      )}

      {/* ================= TAB 5: BANK PAYMENT SLIPS ================= */}
      {activeTab === 'slips' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Student Bank Deposit Verification
              </h2>

              <p className="text-xs text-slate-500">
                Approve or reject student slip uploads. Approving immediately unlocks access for the student.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Requested Resource</th>
                    <th className="py-3.5 px-4">Bank / Reference</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {slips.map(slip => (
                    <tr key={slip.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{slip.userName}</div>
                        <div className="text-[11px] text-slate-500">{slip.userEmail}</div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs font-semibold text-slate-800">
                        {slip.materialTitle}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{slip.bankName}</div>
                        <div className="font-mono text-slate-500 text-[11px]">Ref: {slip.referenceNumber}</div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-blue-700 tabular-nums">
                        {formatLKR(slip.amount)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                          slip.status === 'approved' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : slip.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {slip.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {slip.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onApproveSlip(slip.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => onRejectSlip(slip.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-medium text-xs transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: CMS ACTIVITY AUDIT ================= */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900">
            Control Panel Action Audit Trail
          </h2>
          <div className="divide-y divide-slate-100 text-xs">
            {actionLogs.slice(0, 20).map(log => (
              <div key={log.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-slate-900">{log.userName}</span>{' '}
                  <span className="text-slate-600">({log.actionType})</span>:{' '}
                  <span className="text-slate-800">{log.details}</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px] shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Subject Warning Dialog */}
      {subjectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900">
                Confirm Subject Deletion
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong>{subjectToDelete.name}</strong> ({subjectToDelete.code})? This will also remove any curriculum references.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSubjectToDelete(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-xl text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteSubject(subjectToDelete.id);
                  setSubjectToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs shadow-xs"
              >
                Delete Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <SubjectEditModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        subject={editingSubject}
        onSave={onSaveSubject}
        existingSubjectIds={subjects.map(s => s.id)}
      />

      <MaterialEditModal
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
        material={editingMaterial}
        subjects={subjects}
        instructorName={currentUser.name}
        onSave={onSaveMaterial}
      />
    </div>
  );
};
