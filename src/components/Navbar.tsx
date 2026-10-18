import React from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  DownloadCloud, 
  History, 
  UserCircle2, 
  ShieldCheck, 
  Wallet, 
  Sparkles,
  Layers,
  ArrowRightLeft,
  SlidersHorizontal
} from 'lucide-react';
import type { UserAccount } from '../types/index.ts';

interface NavbarProps {
  currentUser: UserAccount;
  activeTab: 'catalog' | 'learning' | 'downloads' | 'history' | 'control_panel';
  setActiveTab: (tab: 'catalog' | 'learning' | 'downloads' | 'history' | 'control_panel') => void;
  onSwitchRole: () => void;
  onOpenAuth: () => void;
  pendingSlipsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onSwitchRole,
  onOpenAuth,
  pendingSlipsCount = 0
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('catalog')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
              aria-label="Technology Teacher Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-sm transition-transform group-hover:scale-105">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-950 group-hover:text-blue-700 transition-colors whitespace-nowrap inline-flex items-center gap-1.5">
                  <span className="text-slate-900">Technology</span>
                  <span className="text-blue-600 bg-blue-50/90 border border-blue-200/90 px-1.5 py-0.5 rounded-md text-base sm:text-lg font-black tracking-normal">Teacher</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap flex items-center gap-1">
                  <span>Engineering Technology & STEM Portal</span>
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-600" aria-label="Main Navigation">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'catalog'
                  ? 'text-blue-700 bg-blue-50 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Course Materials
            </button>

            {currentUser.role === 'student' && (
              <>
                <button
                  onClick={() => setActiveTab('learning')}
                  className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'learning'
                      ? 'text-blue-700 bg-blue-50 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  My Progress
                </button>
                <button
                  onClick={() => setActiveTab('downloads')}
                  className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'downloads'
                      ? 'text-blue-700 bg-blue-50 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <DownloadCloud className="w-4 h-4" />
                  Downloads
                  {currentUser.downloadHistory.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-slate-200 text-slate-700 text-xs rounded-md">
                      {currentUser.downloadHistory.length}
                    </span>
                  )}
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'text-blue-700 bg-blue-50 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4" />
              Action History
            </button>

            {/* ONLY VISIBLE TO ADMIN */}
            {currentUser.role === 'instructor' && (
              <button
                onClick={() => setActiveTab('control_panel')}
                className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 border ${
                  activeTab === 'control_panel'
                    ? 'text-blue-700 bg-blue-50 border-blue-200 font-bold shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-transparent'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>Control Panel (Admin)</span>
                {pendingSlipsCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-white text-xs font-semibold rounded-md">
                    {pendingSlipsCount}
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* Zone 3: User controls & Role switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Switch Role Toggle for testing / admin preview */}
            <button
              onClick={onSwitchRole}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap border ${
                currentUser.role === 'instructor'
                  ? 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title={currentUser.role === 'instructor' ? 'Logged in as Admin. Click to switch to Student view' : 'Logged in as Student. Click to switch to Admin view'}
              aria-label={`Switch role: Currently ${currentUser.role}`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Role:</span>
              <span className="capitalize font-bold text-blue-700">
                {currentUser.role === 'instructor' ? 'Admin' : 'Student'}
              </span>
            </button>

            {/* Wallet indicator for student */}
            {currentUser.role === 'student' && (
              <div 
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold whitespace-nowrap"
                title="Your student wallet balance for instant resource unlocks"
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                <span>LKR {currentUser.walletBalance.toLocaleString()}</span>
              </div>
            )}

            {/* User Profile / Switcher */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors text-xs font-medium text-slate-800"
              aria-label="Account Settings"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden sm:inline truncate max-w-[110px]">{currentUser.name}</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="lg:hidden flex items-center gap-1 py-2 overflow-x-auto border-t border-slate-100 scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
              activeTab === 'catalog' ? 'bg-blue-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Course Materials
          </button>
          {currentUser.role === 'student' && (
            <>
              <button
                onClick={() => setActiveTab('learning')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
                  activeTab === 'learning' ? 'bg-blue-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Progress
              </button>
              <button
                onClick={() => setActiveTab('downloads')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
                  activeTab === 'downloads' ? 'bg-blue-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Downloads ({currentUser.downloadHistory.length})
              </button>
            </>
          )}
          <button
            onClick={() => setActiveTab('history')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
              activeTab === 'history' ? 'bg-blue-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Action Log
          </button>

          {/* ONLY SHOWN TO ADMIN ON MOBILE */}
          {currentUser.role === 'instructor' && (
            <button
              onClick={() => setActiveTab('control_panel')}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
                activeTab === 'control_panel' ? 'bg-blue-600 text-white' : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
              }`}
            >
              Control Panel (Admin)
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

