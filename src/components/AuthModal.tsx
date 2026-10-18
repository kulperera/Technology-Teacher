import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import type { UserAccount, SubjectId } from '../types/index.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onLogin: (user: UserAccount) => void;
  onRegister: (newUser: UserAccount) => void;
  onSwitchToStudentDemo: () => void;
  onSwitchToInstructorDemo: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onRegister,
  onSwitchToStudentDemo,
  onSwitchToInstructorDemo
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register') {
      if (!name || !email) return;
      const newUser: UserAccount = {
        id: 'usr_' + Date.now(),
        name,
        email,
        phone: phone || undefined,
        role,
        enrolledSubjects: ['engineering-tech', 'science-for-tech'],
        purchasedMaterialIds: [],
        downloadHistory: [],
        completedMaterialIds: [],
        walletBalance: 1500, // Welcome gift credit
        createdAt: new Date().toISOString()
      };
      onRegister(newUser);
    } else {
      // Simple login demo
      if (!email) return;
      const loggedUser: UserAccount = {
        ...currentUser,
        email: email || currentUser.email,
        name: name || currentUser.name
      };
      onLogin(loggedUser);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              EduNexus Identity
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              {mode === 'login' ? 'Sign In to Your Account' : 'Register New Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Quick Demo Accounts Switcher Strip */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 space-y-2">
            <div className="text-[11px] font-semibold text-blue-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Switch Demo Accounts:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onSwitchToStudentDemo();
                  onClose();
                }}
                className={`p-2 rounded-lg text-left border transition-all text-xs ${
                  currentUser.role === 'student'
                    ? 'border-blue-600 bg-white shadow-xs font-bold text-blue-900'
                    : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                }`}
              >
                <div className="font-semibold text-xs flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-blue-600" />
                  <span>Student Demo</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">Kasun Jayasundara</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSwitchToInstructorDemo();
                  onClose();
                }}
                className={`p-2 rounded-lg text-left border transition-all text-xs ${
                  currentUser.role === 'instructor'
                    ? 'border-blue-600 bg-white shadow-xs font-bold text-blue-900'
                    : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                }`}
              >
                <div className="font-semibold text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  <span>Instructor Demo</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">Eng. Sunil Rajapakse</div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ruwan Wickramasinghe"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Account Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`py-2 px-3 rounded-lg border text-center font-medium transition-colors ${
                        role === 'student' ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold' : 'border-slate-300'
                      }`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('instructor')}
                      className={`py-2 px-3 rounded-lg border text-center font-medium transition-colors ${
                        role === 'instructor' ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold' : 'border-slate-300'
                      }`}
                    >
                      Instructor / Teacher
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Mobile Phone (SMS notifications)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>{mode === 'login' ? 'Sign In to Portal' : 'Create Student Account (Get LKR 1,500 Bonus)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Switch mode */}
          <div className="text-center pt-2 text-xs text-slate-500">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Register Here
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
