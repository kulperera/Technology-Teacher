import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Download, 
  Wallet, 
  BookOpen, 
  DownloadCloud, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Eye, 
  CreditCard, 
  X, 
  Plus, 
  Phone, 
  Mail, 
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';
import type { UserAccount, CourseMaterial, Subject } from '../types/index.ts';
import { formatLKR } from '../utils/courseLogic.ts';

interface RegisteredUsersManagerProps {
  users: UserAccount[];
  materials: CourseMaterial[];
  subjects: Subject[];
  onUpdateUser: (user: UserAccount) => void;
  onAddUser: (user: UserAccount) => void;
}

export const RegisteredUsersManager: React.FC<RegisteredUsersManagerProps> = ({
  users,
  materials,
  subjects,
  onUpdateUser,
  onAddUser
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mediumFilter, setMediumFilter] = useState<'all' | 'sinhala' | 'english'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'instructor'>('all');
  
  // Selected user for detailed activity modal
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  
  // Balance adjustment modal
  const [adjustingUser, setAdjustingUser] = useState<UserAccount | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(500);
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit');
  const [adjustReason, setAdjustReason] = useState('Manual admin credit adjustment');

  // Add new user modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+94 7');
  const [newMedium, setNewMedium] = useState<'sinhala' | 'english' | 'both'>('sinhala');
  const [newRole, setNewRole] = useState<'student' | 'instructor'>('student');
  const [newStartingBalance, setNewStartingBalance] = useState<number>(1000);

  // Filtered users
  const filteredUsers = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (mediumFilter !== 'all') {
      if (u.preferredMedium && u.preferredMedium !== 'both' && u.preferredMedium !== mediumFilter) {
        return false;
      }
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchPhone = u.phone ? u.phone.toLowerCase().includes(q) : false;
      return matchName || matchEmail || matchPhone;
    }
    return true;
  });

  // Aggregate stats
  const totalStudents = users.filter(u => u.role === 'student').length;
  const sinhalaStudents = users.filter(u => u.preferredMedium === 'sinhala' || !u.preferredMedium).length;
  const englishStudents = users.filter(u => u.preferredMedium === 'english').length;
  const totalWalletHoldings = users.reduce((acc, u) => acc + (u.walletBalance || 0), 0);
  const totalDownloadsByAllUsers = users.reduce((acc, u) => acc + (u.downloadHistory?.length || 0), 0);

  // Handle wallet adjustment
  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingUser) return;

    const currentBalance = adjustingUser.walletBalance || 0;
    const newBalance = adjustType === 'credit'
      ? currentBalance + Math.abs(adjustAmount)
      : Math.max(0, currentBalance - Math.abs(adjustAmount));

    const updated: UserAccount = {
      ...adjustingUser,
      walletBalance: newBalance
    };

    onUpdateUser(updated);
    if (selectedUser?.id === adjustingUser.id) {
      setSelectedUser(updated);
    }
    setAdjustingUser(null);
  };

  // Handle create user
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newUser: UserAccount = {
      id: 'usr_' + Date.now().toString(),
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim(),
      role: newRole,
      status: 'active',
      preferredMedium: newMedium,
      enrolledSubjects: ['engineering-tech'],
      purchasedMaterialIds: [],
      downloadHistory: [],
      completedMaterialIds: [],
      walletBalance: newStartingBalance,
      createdAt: new Date().toISOString()
    };

    onAddUser(newUser);
    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('+94 7');
  };

  // Export users to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Preferred Medium', 'Wallet Balance (LKR)', 'Unlocked Materials Count', 'Downloads Count', 'Registered Date'];
    const rows = filteredUsers.map(u => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.phone || 'N/A',
      u.role,
      u.status || 'active',
      u.preferredMedium || 'sinhala',
      u.walletBalance || 0,
      u.purchasedMaterialIds?.length || 0,
      u.downloadHistory?.length || 0,
      new Date(u.createdAt).toLocaleDateString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TechnologyTeacher_Registered_Users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Total Students</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {totalStudents}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Enrolled Accounts</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">සිංහල මාධ්‍යය</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700 tabular-nums">
            {sinhalaStudents}
          </div>
          <span className="text-[11px] text-slate-500">Sinhala Track</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">English Medium</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-700 tabular-nums">
            {englishStudents}
          </div>
          <span className="text-[11px] text-slate-500">English Track</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Student Balances</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 tabular-nums">
            LKR {totalWalletHoldings.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Active Wallet Pool</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Total Downloads</span>
            <DownloadCloud className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700 tabular-nums">
            {totalDownloadsByAllUsers}
          </div>
          <span className="text-[11px] text-slate-500">Verified Dispatches</span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search registered students by name, email, or telephone (+94)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Filters and Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Medium filter */}
          <select
            value={mediumFilter}
            onChange={e => setMediumFilter(e.target.value as any)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white"
          >
            <option value="all">All Mediums</option>
            <option value="sinhala">Sinhala Medium (සිංහල)</option>
            <option value="english">English Medium</option>
          </select>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as any)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="instructor">Instructors / Admins</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
            title="Download registered student roster in CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export</span> CSV
          </button>

          {/* Register New User Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Student</span>
          </button>
        </div>
      </div>

      {/* Registered Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Student / User</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Medium Track</th>
                <th className="py-3 px-3">Enrolled Subjects</th>
                <th className="py-3 px-3 text-center">Unlocked Units</th>
                <th className="py-3 px-3 text-center">Downloads</th>
                <th className="py-3 px-3 text-right">Wallet Balance</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    No registered people found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => {
                  const isSinhala = u.preferredMedium === 'sinhala';
                  const isInstructor = u.role === 'instructor';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isInstructor ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isInstructor && (
                                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                                  Admin
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">
                              Joined {new Date(u.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          <div className="text-slate-700 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[150px]">{u.email}</span>
                          </div>
                          {u.phone && (
                            <div className="text-slate-500 text-[11px] flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{u.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Medium */}
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          isSinhala
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : u.preferredMedium === 'english'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {isSinhala ? 'සිංහල මාධ්‍යය' : u.preferredMedium === 'english' ? 'English' : 'Both Tracks'}
                        </span>
                      </td>

                      {/* Enrolled Subjects */}
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[170px]">
                          {u.enrolledSubjects.map(subId => {
                            const subObj = subjects.find(s => s.id === subId);
                            return (
                              <span key={subId} className="text-[10px] bg-slate-100 text-slate-700 font-medium px-1.5 py-0.5 rounded">
                                {subObj ? subObj.code : subId}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      {/* Unlocked */}
                      <td className="py-3 px-3 text-center font-bold text-slate-800 tabular-nums">
                        {u.purchasedMaterialIds?.length || 0}
                      </td>

                      {/* Downloads */}
                      <td className="py-3 px-3 text-center font-bold text-blue-700 tabular-nums">
                        {u.downloadHistory?.length || 0}
                      </td>

                      {/* Wallet Balance */}
                      <td className="py-3 px-3 text-right font-black text-slate-900 tabular-nums">
                        LKR {(u.walletBalance || 0).toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{u.status || 'Active'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View student activity & download ledger"
                            aria-label={`View ${u.name}'s details`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Adjust wallet */}
                          <button
                            onClick={() => {
                              setAdjustingUser(u);
                              setAdjustAmount(500);
                              setAdjustType('credit');
                            }}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Adjust student wallet balance"
                            aria-label={`Adjust ${u.name}'s wallet`}
                          >
                            <Wallet className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL 1: STUDENT ACTIVITY & DOWNLOAD LEDGER ================= */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedUser.name} · Student Ledger
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span>{selectedUser.email}</span>
                    {selectedUser.phone && <span>· {selectedUser.phone}</span>}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-slate-500 block mb-0.5 font-medium">Wallet Balance</span>
                  <span className="text-lg font-black text-emerald-700 tabular-nums">
                    LKR {(selectedUser.walletBalance || 0).toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-slate-500 block mb-0.5 font-medium">Unlocked Units</span>
                  <span className="text-lg font-black text-blue-700 tabular-nums">
                    {selectedUser.purchasedMaterialIds?.length || 0}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-slate-500 block mb-0.5 font-medium">Total Downloads</span>
                  <span className="text-lg font-black text-purple-700 tabular-nums">
                    {selectedUser.downloadHistory?.length || 0}
                  </span>
                </div>
              </div>

              {/* Download History Ledger */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                    <DownloadCloud className="w-4 h-4 text-blue-600" />
                    <span>Download History & Timestamps</span>
                  </h4>
                  <span className="text-slate-500 text-[11px]">
                    {selectedUser.downloadHistory?.length || 0} logged actions
                  </span>
                </div>

                {(!selectedUser.downloadHistory || selectedUser.downloadHistory.length === 0) ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-400">
                    This student hasn't downloaded any files yet.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                    {selectedUser.downloadHistory.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-50">
                        <div>
                          <div className="font-semibold text-slate-900">{item.fileName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>Subject: {item.subjectId}</span>
                            <span>· Size: {item.fileSize}</span>
                            <span>· Track: {item.medium}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-mono text-slate-500 block">
                            {new Date(item.downloadedAt).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(item.downloadedAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Unlocked Course Materials */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Purchased / Unlocked Course Materials</span>
                </h4>

                {(!selectedUser.purchasedMaterialIds || selectedUser.purchasedMaterialIds.length === 0) ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-400">
                    No paid materials unlocked yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {selectedUser.purchasedMaterialIds.map(matId => {
                      const mat = materials.find(m => m.id === matId);
                      return (
                        <div key={matId} className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-slate-900">
                              {mat ? mat.title : matId}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {mat?.moduleName} · {mat?.medium === 'sinhala' ? 'Sinhala Medium' : 'English Medium'}
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Unlocked
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  setAdjustingUser(selectedUser);
                  setAdjustAmount(500);
                  setAdjustType('credit');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Credit / Adjust Wallet</span>
              </button>

              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: ADJUST WALLET BALANCE ================= */}
      {adjustingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" />
                <span>Adjust Student Wallet</span>
              </h3>
              <button
                onClick={() => setAdjustingUser(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Update balance for <strong>{adjustingUser.name}</strong> ({adjustingUser.email}). Current balance: <strong className="text-emerald-700">LKR {(adjustingUser.walletBalance || 0).toLocaleString()}</strong>.
            </p>

            <form onSubmit={handleSaveAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Adjustment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('credit')}
                    className={`py-2 text-center rounded-lg font-semibold border ${
                      adjustType === 'credit'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    + Credit Balance (Add)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('debit')}
                    className={`py-2 text-center rounded-lg font-semibold border ${
                      adjustType === 'debit'
                        ? 'bg-rose-50 border-rose-600 text-rose-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    - Debit Balance (Deduct)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Amount (LKR)</label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  required
                  value={adjustAmount}
                  onChange={e => setAdjustAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason / Reference</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingUser(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Apply {adjustType === 'credit' ? 'Credit' : 'Debit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: ADD NEW STUDENT ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span>Register New Student</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Manually add a student (e.g. for offline bank transfers or direct classroom enrollments).
            </p>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sandun Dilshan"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="sandun@gmail.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mobile / WhatsApp Number</label>
                <input
                  type="text"
                  placeholder="+94 77 123 4567"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Medium Subcategory</label>
                  <select
                    value={newMedium}
                    onChange={e => setNewMedium(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="sinhala">සිංහල මාධ්‍යය</option>
                    <option value="english">English Medium</option>
                    <option value="both">Both Tracks</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Role</label>
                  <select
                    value={newRole}
                    onChange={e => setNewRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Initial Wallet Credit (LKR)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={newStartingBalance}
                  onChange={e => setNewStartingBalance(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
