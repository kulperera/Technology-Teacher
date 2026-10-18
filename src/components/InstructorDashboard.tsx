import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building2, 
  FileText, 
  Layers, 
  TrendingUp, 
  Users, 
  DownloadCloud, 
  DollarSign,
  AlertCircle,
  Eye,
  Check
} from 'lucide-react';
import type { 
  Subject, 
  CourseMaterial, 
  UserAccount, 
  PaymentSlip, 
  ActionLog, 
  SubjectId, 
  Medium, 
  MaterialType 
} from '../types/index.ts';
import { formatLKR } from '../utils/courseLogic.ts';

interface InstructorDashboardProps {
  subjects: Subject[];
  materials: CourseMaterial[];
  slips: PaymentSlip[];
  actionLogs: ActionLog[];
  currentUser: UserAccount;
  onAddMaterial: (newMaterial: Omit<CourseMaterial, 'id' | 'downloadCount' | 'publishedDate'>) => void;
  onDeleteMaterial: (materialId: string) => void;
  onApproveSlip: (slipId: string) => void;
  onRejectSlip: (slipId: string) => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  subjects,
  materials,
  slips,
  actionLogs,
  currentUser,
  onAddMaterial,
  onDeleteMaterial,
  onApproveSlip,
  onRejectSlip
}) => {
  const [activeTab, setActiveTab] = useState<'materials' | 'slips' | 'activity'>('materials');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for new material
  const [subjectId, setSubjectId] = useState<SubjectId>('engineering-tech');
  const [medium, setMedium] = useState<Medium>('sinhala');
  const [title, setTitle] = useState('');
  const [titleSi, setTitleSi] = useState('');
  const [description, setDescription] = useState('');
  const [moduleName, setModuleName] = useState('Mechanical & Workshop Technology');
  const [unitNumber, setUnitNumber] = useState(1);
  const [type, setType] = useState<MaterialType>('lecture_note');
  const [price, setPrice] = useState(450);
  const [fileFormat, setFileFormat] = useState<'PDF' | 'DOCX' | 'ZIP'>('PDF');
  const [fileSize, setFileSize] = useState('4.5 MB');
  const [totalPages, setTotalPages] = useState(32);
  const [sampleContent, setSampleContent] = useState('');

  // KPIs
  const totalDownloads = materials.reduce((acc, m) => acc + m.downloadCount, 0);
  const totalRevenue = slips
    .filter(s => s.status === 'approved')
    .reduce((acc, s) => acc + s.amount, 0) + (actionLogs.filter(l => l.actionType === 'PURCHASE_MATERIAL').length * 450);
  const pendingSlips = slips.filter(s => s.status === 'pending');

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddMaterial({
      subjectId,
      medium,
      title: title.trim(),
      titleSi: titleSi.trim() || undefined,
      description: description.trim(),
      moduleName,
      unitNumber,
      type,
      price: Number(price),
      currency: 'LKR',
      fileFormat,
      fileSize,
      totalPages: Number(totalPages),
      sampleContent: sampleContent.trim() || `Core theoretical principles for ${title} under ${medium} medium curriculum.`,
      instructorName: currentUser.name
    });

    setIsAddModalOpen(false);
    // Reset form
    setTitle('');
    setTitleSi('');
    setDescription('');
    setSampleContent('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & KPI Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
            <span>Instructor Portal</span>
            <span aria-hidden="true">·</span>
            <span>Content & Payment Management</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Instructor Control Center
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Publish Engineering Technology and STEM learning units, adjust course fees, and verify student payments.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Course Material</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Published Materials</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {materials.length}
          </div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">
            Across 5 Core Subjects
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Total Student Downloads</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {totalDownloads.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            PDF & Note Resources
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Total Course Revenue</div>
          <div className="text-2xl font-bold text-blue-700 mt-1 tabular-nums">
            LKR {totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Card & Approved Slips
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Pending Bank Slips</div>
          <div className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">
            {pendingSlips.length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Awaiting Verification
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('materials')}
          className={`pb-3 px-1 border-b-2 transition-colors ${
            activeTab === 'materials'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Course Materials Inventory ({materials.length})
        </button>

        <button
          onClick={() => setActiveTab('slips')}
          className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-1.5 ${
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
          className={`pb-3 px-1 border-b-2 transition-colors ${
            activeTab === 'activity'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Live Student Activity Stream
        </button>
      </div>

      {/* Tab 1: Course Materials Inventory */}
      {activeTab === 'materials' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3.5 px-4">Subject & Medium</th>
                  <th className="py-3.5 px-4">Material Title</th>
                  <th className="py-3.5 px-4">Unit / Module</th>
                  <th className="py-3.5 px-4">Price (LKR)</th>
                  <th className="py-3.5 px-4">Format / Pages</th>
                  <th className="py-3.5 px-4">Downloads</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {materials.map(mat => {
                  const isSinhala = mat.medium === 'sinhala';
                  return (
                    <tr key={mat.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 uppercase">{mat.subjectId}</div>
                        <span className={`text-[11px] font-semibold ${isSinhala ? 'text-blue-700' : 'text-slate-700'}`}>
                          {isSinhala ? 'සිංහල මාධ්‍යය' : 'English Medium'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-900 max-w-xs">
                        <div className="truncate font-semibold">{mat.title}</div>
                        <div className="text-[11px] text-slate-400 capitalize">{mat.type.replace('_', ' ')}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        Unit {mat.unitNumber}: {mat.moduleName}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900 tabular-nums">
                        {formatLKR(mat.price)}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {mat.fileFormat} · {mat.totalPages} pgs
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600 tabular-nums">
                        {mat.downloadCount}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onDeleteMaterial(mat.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete material"
                          aria-label={`Delete ${mat.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Bank Payment Slips Review */}
      {activeTab === 'slips' && (
        <div className="space-y-4">
          {slips.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              No bank deposit slips have been submitted yet.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="py-3.5 px-4">Student</th>
                      <th className="py-3.5 px-4">Resource Requested</th>
                      <th className="py-3.5 px-4">Bank & Ref Number</th>
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

                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="truncate font-semibold text-slate-800">{slip.materialTitle}</div>
                          <div className="text-[11px] text-slate-400 font-mono">ID: {slip.materialId}</div>
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
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => onRejectSlip(slip.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-medium text-xs transition-colors"
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
          )}
        </div>
      )}

      {/* Tab 3: Live Student Activity Stream */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">
            Real-Time Student Activity Feed
          </h3>
          <div className="divide-y divide-slate-100 text-xs">
            {actionLogs.slice(0, 15).map(log => (
              <div key={log.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-slate-900">{log.userName}</span>{' '}
                  <span className="text-slate-600">{log.details}</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px] shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Course Material Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                Add New Course Material Resource
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMaterial} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Subject Dropdown */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value as SubjectId)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Medium Subcategory (Available for ALL subjects!) */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Medium Subcategory
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMedium('sinhala')}
                      className={`flex-1 py-2 px-3 rounded-lg border font-medium text-center transition-colors ${
                        medium === 'sinhala'
                          ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                          : 'border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      සිංහල මාධ්‍යය
                    </button>
                    <button
                      type="button"
                      onClick={() => setMedium('english')}
                      className={`flex-1 py-2 px-3 rounded-lg border font-medium text-center transition-colors ${
                        medium === 'english'
                          ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                          : 'border-slate-300 bg-white text-slate-700'
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
                  Material Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Electrical Power Distribution & Single Phase Drives Note"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Sinhala title if applicable */}
              {medium === 'sinhala' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sinhala Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={titleSi}
                    onChange={(e) => setTitleSi(e.target.value)}
                    placeholder="උදා: විදුලි බල සම්ප්‍රේෂණය සහ පරිපථ විශ්ලේෂණය"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Syllabus Description / Topics Covered
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Brief summary of learning objectives, past paper references, and key diagrams..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Module, Unit, Price, Type */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Number</label>
                  <input
                    type="number"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(Number(e.target.value))}
                    min={1}
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
                    <option value="past_paper">Past Paper</option>
                    <option value="model_paper">Model Paper</option>
                    <option value="tutorial_worksheet">Worksheet</option>
                    <option value="short_note">Short Note</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (LKR)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min={0}
                    step={50}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-400">0 for free preview</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pages</label>
                  <input
                    type="number"
                    value={totalPages}
                    onChange={(e) => setTotalPages(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Sample Study Content */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Study Content / Key Points (Included in student download & preview)
                </label>
                <textarea
                  value={sampleContent}
                  onChange={(e) => setSampleContent(e.target.value)}
                  rows={3}
                  placeholder="Enter formula derivations, key concepts, or step-by-step past paper solutions..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Publish Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
