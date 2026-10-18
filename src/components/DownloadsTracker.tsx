import React, { useState } from 'react';
import { 
  DownloadCloud, 
  FileText, 
  Search, 
  ArrowDownToLine, 
  Clock, 
  HardDrive, 
  CheckCircle,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import type { UserAccount, CourseMaterial, DownloadRecord } from '../types/index.ts';
import { generateMaterialFileBlob } from '../utils/courseLogic.ts';

interface DownloadsTrackerProps {
  currentUser: UserAccount;
  materials: CourseMaterial[];
  onDownloadAgain: (material: CourseMaterial) => void;
  onExploreMore: () => void;
}

export const DownloadsTracker: React.FC<DownloadsTrackerProps> = ({
  currentUser,
  materials,
  onDownloadAgain,
  onExploreMore
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMedium, setFilterMedium] = useState<'all' | 'sinhala' | 'english'>('all');

  const history = currentUser.downloadHistory || [];

  const filteredHistory = history.filter(record => {
    if (filterMedium !== 'all' && record.medium !== filterMedium) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return record.fileName.toLowerCase().includes(q) || record.subjectId.toLowerCase().includes(q);
    }
    return true;
  });

  // Calculate total download stats
  const totalDownloads = history.length;
  const uniqueMaterials = new Set(history.map(h => h.materialId)).size;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
            <span>Student Vault</span>
            <span aria-hidden="true">·</span>
            <span>Resource Audit</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Downloadable Resource Tracking
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Audit log of all course notes, past papers, and study guides you have downloaded to your device.
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-center shadow-xs">
            <span className="block text-slate-500 text-[11px] font-medium">Total Files Downloaded</span>
            <span className="text-lg font-bold text-slate-900 tabular-nums">{totalDownloads}</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-center shadow-xs">
            <span className="block text-slate-500 text-[11px] font-medium">Unique Modules</span>
            <span className="text-lg font-bold text-blue-700 tabular-nums">{uniqueMaterials}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search downloaded file name..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium">Medium:</span>
          {(['all', 'sinhala', 'english'] as const).map(med => (
            <button
              key={med}
              onClick={() => setFilterMedium(med)}
              className={`px-3 py-1.5 rounded-lg border transition-colors capitalize ${
                filterMedium === med
                  ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {med === 'all' ? 'All Mediums' : med === 'sinhala' ? 'සිංහල මාධ්‍යය' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* Download History Table */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <DownloadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {history.length === 0 ? 'No downloaded resources yet' : 'No matching downloads found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {history.length === 0
                ? 'Unlock or browse course materials to download PDF notes and past papers.'
                : 'Try adjusting your search query or medium subcategory filter.'}
            </p>
          </div>
          {history.length === 0 && (
            <button
              onClick={onExploreMore}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-xs transition-colors"
            >
              Browse Course Materials
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3.5 px-4">File Name & Title</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Medium Track</th>
                  <th className="py-3.5 px-4">File Size</th>
                  <th className="py-3.5 px-4">Downloaded At</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((rec, index) => {
                  const matchingMat = materials.find(m => m.id === rec.materialId);

                  return (
                    <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <div className="truncate max-w-xs font-semibold">
                            {rec.fileName}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-700 uppercase">
                        {rec.subjectId}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`font-semibold ${
                          rec.medium === 'sinhala' ? 'text-blue-700' : 'text-slate-700'
                        }`}>
                          {rec.medium === 'sinhala' ? 'සිංහල මාධ්‍යය' : 'English Medium'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {rec.fileSize}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {new Date(rec.downloadedAt).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {matchingMat ? (
                          <button
                            onClick={() => onDownloadAgain(matchingMat)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium transition-colors"
                            title="Re-download resource file to your device"
                          >
                            <ArrowDownToLine className="w-3.5 h-3.5 text-blue-600" />
                            <span>Re-download</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 italic">Archived</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
