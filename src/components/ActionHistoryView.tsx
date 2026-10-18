import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Download, 
  Filter, 
  Shield, 
  User, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  FileDown,
  Globe
} from 'lucide-react';
import type { ActionLog, ActionType, UserAccount } from '../types/index.ts';

interface ActionHistoryViewProps {
  logs: ActionLog[];
  currentUser: UserAccount;
}

export const ActionHistoryView: React.FC<ActionHistoryViewProps> = ({
  logs,
  currentUser
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // If student, show their logs; if instructor, show all with toggle
  const [viewScope, setViewScope] = useState<'mine' | 'all'>(
    currentUser.role === 'instructor' ? 'all' : 'mine'
  );

  const filteredLogs = logs.filter(log => {
    if (viewScope === 'mine' && log.userId !== currentUser.id) {
      return false;
    }
    if (filterType !== 'all' && log.actionType !== filterType) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.details.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q) ||
        log.actionType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getActionBadge = (type: ActionType) => {
    switch (type) {
      case 'DOWNLOAD_RESOURCE':
        return <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-semibold">Download</span>;
      case 'PURCHASE_MATERIAL':
        return <span className="text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-semibold">Payment</span>;
      case 'MARK_COMPLETED':
        return <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold">Progress +</span>;
      case 'UNMARK_COMPLETED':
        return <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">Progress -</span>;
      case 'SUBMIT_SLIP':
        return <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold">Bank Slip</span>;
      case 'APPROVE_PAYMENT':
        return <span className="text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded text-[11px]">Approved</span>;
      case 'ADD_MATERIAL':
        return <span className="text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[11px] font-semibold">Instructor Upload</span>;
      default:
        return <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">{type}</span>;
    }
  };

  const exportAuditLogCSV = () => {
    const headers = 'ID,User,Role,Action,Details,Timestamp,IP\n';
    const rows = filteredLogs.map(l => 
      `"${l.id}","${l.userName}","${l.userRole}","${l.actionType}","${l.details.replace(/"/g, '""')}","${l.timestamp}","${l.ipAddress || ''}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edunexus_action_audit_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
            <span>Audit Trail & Activity Log</span>
            <span aria-hidden="true">·</span>
            <span>Tamper-Resistant Ledger</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            User Action History
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Continuous verifiable history of downloads, course purchases, module progress completions, and submissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'instructor' && (
            <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium border border-slate-200">
              <button
                onClick={() => setViewScope('all')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  viewScope === 'all' ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All Students
              </button>
              <button
                onClick={() => setViewScope('mine')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  viewScope === 'mine' ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                My Actions Only
              </button>
            </div>
          )}

          <button
            onClick={exportAuditLogCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action logs..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          <span className="text-slate-400 font-medium">Filter:</span>
          {[
            { id: 'all', label: 'All Actions' },
            { id: 'DOWNLOAD_RESOURCE', label: 'Downloads' },
            { id: 'PURCHASE_MATERIAL', label: 'Purchases' },
            { id: 'MARK_COMPLETED', label: 'Progress Marks' },
            { id: 'SUBMIT_SLIP', label: 'Bank Slips' }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setFilterType(type.id)}
              className={`px-2.5 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                filterType === type.id
                  ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Logs List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No action history records match the current filters.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map(log => (
              <div 
                key={log.id}
                className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="pt-0.5 sm:pt-0 shrink-0">
                    {getActionBadge(log.actionType)}
                  </div>

                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-900 leading-snug">
                      {log.details}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-medium text-slate-700">{log.userName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{log.userRole}</span>
                      {log.ipAddress && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-slate-400">{log.ipAddress}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="font-mono text-[11px] text-slate-400 shrink-0 text-left sm:text-right">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
