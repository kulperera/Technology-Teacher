import React, { useState, useEffect } from 'react';
import { 
  INITIAL_SUBJECTS, 
  INITIAL_MATERIALS, 
  INITIAL_USER, 
  INITIAL_INSTRUCTOR, 
  INITIAL_ACTION_LOGS, 
  INITIAL_PAYMENT_SLIPS,
  INITIAL_REGISTERED_USERS,
  DEFAULT_GATEWAY_CONFIG,
  INITIAL_GATEWAY_TRANSACTIONS
} from './data/mockData.ts';
import type { 
  Subject, 
  CourseMaterial, 
  UserAccount, 
  ActionLog, 
  PaymentSlip, 
  SubjectId, 
  Medium,
  PaymentGatewayConfig,
  GatewayTransaction
} from './types/index.ts';
import { 
  filterMaterials, 
  createActionLog, 
  createDownloadRecord, 
  generateMaterialFileBlob,
  updateMaterialInList,
  updateSubjectInList,
  deleteSubjectFromList
} from './utils/courseLogic.ts';
import { Navbar } from './components/Navbar.tsx';
import { SubjectCategorySelector } from './components/SubjectCategorySelector.tsx';
import { CourseMaterialCard } from './components/CourseMaterialCard.tsx';
import { MaterialPreviewModal } from './components/MaterialPreviewModal.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { StudentProgressDashboard } from './components/StudentProgressDashboard.tsx';
import { DownloadsTracker } from './components/DownloadsTracker.tsx';
import { ActionHistoryView } from './components/ActionHistoryView.tsx';
import { ControlPanel } from './components/ControlPanel.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Download,
  SlidersHorizontal,
  ShieldAlert,
  KeyRound
} from 'lucide-react';

export default function App() {
  // State with localStorage persistence
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('edunexus_subjects');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [materials, setMaterials] = useState<CourseMaterial[]>(() => {
    const saved = localStorage.getItem('edunexus_materials');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('edunexus_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [actionLogs, setActionLogs] = useState<ActionLog[]>(() => {
    const saved = localStorage.getItem('edunexus_action_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTION_LOGS;
  });

  const [slips, setSlips] = useState<PaymentSlip[]>(() => {
    const saved = localStorage.getItem('edunexus_slips');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_SLIPS;
  });

  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('edunexus_registered_users');
    return saved ? JSON.parse(saved) : INITIAL_REGISTERED_USERS;
  });

  const [gatewayConfig, setGatewayConfig] = useState<PaymentGatewayConfig>(() => {
    const saved = localStorage.getItem('edunexus_gateway_config');
    return saved ? JSON.parse(saved) : DEFAULT_GATEWAY_CONFIG;
  });

  const [gatewayTransactions, setGatewayTransactions] = useState<GatewayTransaction[]>(() => {
    const saved = localStorage.getItem('edunexus_gateway_txns');
    return saved ? JSON.parse(saved) : INITIAL_GATEWAY_TRANSACTIONS;
  });

  // Navigation and active filters
  const [activeTab, setActiveTab] = useState<'catalog' | 'learning' | 'downloads' | 'history' | 'control_panel'>('catalog');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId | 'all'>('engineering-tech');
  const [selectedMedium, setSelectedMedium] = useState<Medium | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Modals
  const [previewMaterial, setPreviewMaterial] = useState<CourseMaterial | null>(null);
  const [checkoutMaterial, setCheckoutMaterial] = useState<CourseMaterial | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin access gate states
  const [adminPasskey, setAdminPasskey] = useState('');
  const [adminPasskeyError, setAdminPasskeyError] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('edunexus_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('edunexus_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('edunexus_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('edunexus_action_logs', JSON.stringify(actionLogs));
  }, [actionLogs]);

  useEffect(() => {
    localStorage.setItem('edunexus_slips', JSON.stringify(slips));
  }, [slips]);

  useEffect(() => {
    localStorage.setItem('edunexus_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('edunexus_gateway_config', JSON.stringify(gatewayConfig));
  }, [gatewayConfig]);

  useEffect(() => {
    localStorage.setItem('edunexus_gateway_txns', JSON.stringify(gatewayTransactions));
  }, [gatewayTransactions]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Log user action helper
  const recordUserAction = (actionType: ActionLog['actionType'], details: string, metadata?: Record<string, any>) => {
    const newLog = createActionLog(currentUser, actionType, details, metadata);
    setActionLogs(prev => [newLog, ...prev]);
  };

  // Role switch handler
  const handleSwitchRole = () => {
    if (currentUser.role === 'student') {
      setCurrentUser(INITIAL_INSTRUCTOR);
      showToast('Switched to Admin Mode (Eng. Sunil Rajapakse)');
      recordUserAction('USER_LOGIN', 'Switched session to Admin / Instructor mode');
    } else {
      setCurrentUser(INITIAL_USER);
      showToast('Switched to Student Mode (Kasun Jayasundara)');
      recordUserAction('USER_LOGIN', 'Switched session to Student mode');
      if (activeTab === 'control_panel') {
        setActiveTab('catalog');
      }
    }
  };

  // Download resource action with real file generation
  const handleDownloadMaterial = (material: CourseMaterial) => {
    // Generate real text/file blob and trigger browser download
    const { blob, fileName } = generateMaterialFileBlob(material, currentUser.name);
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    // Record download record
    const downloadRecord = createDownloadRecord(material);
    const updatedHistory = [downloadRecord, ...(currentUser.downloadHistory || [])];

    setCurrentUser(prev => ({
      ...prev,
      downloadHistory: updatedHistory
    }));

    // Sync into registered users list
    setRegisteredUsers(prev => prev.map(u => 
      u.id === currentUser.id ? { ...u, downloadHistory: updatedHistory } : u
    ));

    // Increment material download count
    setMaterials(prev => prev.map(m => 
      m.id === material.id ? { ...m, downloadCount: m.downloadCount + 1 } : m
    ));

    // Log action history
    const mediumLabel = material.medium === 'sinhala' ? 'Sinhala Medium' : 'English Medium';
    recordUserAction(
      'DOWNLOAD_RESOURCE',
      `Downloaded "${material.title}" (${mediumLabel} - ${material.fileSize})`,
      { materialId: material.id, fileSize: material.fileSize, medium: material.medium }
    );

    showToast(`Downloading: ${fileName}`);
  };

  // Progress complete toggle
  const handleToggleComplete = (materialId: string) => {
    const isCompleted = currentUser.completedMaterialIds.includes(materialId);
    const targetMat = materials.find(m => m.id === materialId);
    const titleText = targetMat ? targetMat.title : materialId;

    if (isCompleted) {
      const updated = currentUser.completedMaterialIds.filter(id => id !== materialId);
      setCurrentUser(prev => ({ ...prev, completedMaterialIds: updated }));
      setRegisteredUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, completedMaterialIds: updated } : u));
      recordUserAction('UNMARK_COMPLETED', `Unmarked "${titleText}" as completed`);
      showToast(`Marked as in-progress`);
    } else {
      const updated = [...currentUser.completedMaterialIds, materialId];
      setCurrentUser(prev => ({ ...prev, completedMaterialIds: updated }));
      setRegisteredUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, completedMaterialIds: updated } : u));
      recordUserAction('MARK_COMPLETED', `Completed "${titleText}" study unit`);
      showToast(`Progress updated: Unit completed!`);
    }
  };

  // Payment checkout success
  const handlePaymentSuccess = (materialId: string, amount: number, method: string) => {
    const targetMat = materials.find(m => m.id === materialId);
    const matTitle = targetMat ? targetMat.title : materialId;
    const isWallet = method.includes('Wallet');
    const newWalletBalance = isWallet ? Math.max(0, currentUser.walletBalance - amount) : currentUser.walletBalance;
    const newPurchased = [...new Set([...currentUser.purchasedMaterialIds, materialId])];

    const updatedUser: UserAccount = {
      ...currentUser,
      purchasedMaterialIds: newPurchased,
      walletBalance: newWalletBalance
    };

    setCurrentUser(updatedUser);
    setRegisteredUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    // Record Gateway Transaction
    const gatewayPrefix = gatewayConfig.activeGateway === 'stripe' ? 'STRIPE_TXN_' : 'PAYHERE_TXN_';
    const txnRecord: GatewayTransaction = {
      id: 'gw_' + Date.now(),
      gateway: gatewayConfig.activeGateway,
      referenceNumber: gatewayPrefix + Date.now().toString().slice(-6),
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      materialId,
      materialTitle: matTitle,
      amount,
      currency: gatewayConfig.currency,
      paymentMethod: method,
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
      mode: gatewayConfig.mode
    };
    setGatewayTransactions(prev => [txnRecord, ...prev]);

    recordUserAction(
      'PURCHASE_MATERIAL',
      `Purchased "${matTitle}" for LKR ${amount} via ${method}`,
      { materialId, amount, method, txnRef: txnRecord.referenceNumber }
    );

    showToast(`Unlocked: "${matTitle}" is now accessible!`);
  };

  // Bank slip submission
  const handleSubmitBankSlip = (slipData: Omit<PaymentSlip, 'id' | 'status' | 'submittedAt'>) => {
    const newSlip: PaymentSlip = {
      ...slipData,
      id: 'slip_' + Date.now(),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    setSlips(prev => [newSlip, ...prev]);

    // Give provisional access so the student immediately gets a rewarding experience
    const newPurchased = [...new Set([...currentUser.purchasedMaterialIds, slipData.materialId])];
    setCurrentUser(prev => ({
      ...prev,
      purchasedMaterialIds: newPurchased
    }));
    setRegisteredUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, purchasedMaterialIds: newPurchased } : u));

    recordUserAction(
      'SUBMIT_SLIP',
      `Submitted bank slip (Ref: ${slipData.referenceNumber}) for "${slipData.materialTitle}"`,
      { referenceNumber: slipData.referenceNumber, amount: slipData.amount }
    );

    showToast(`Bank deposit slip submitted for verification!`);
  };

  // Instructor: Approve bank slip
  const handleApproveSlip = (slipId: string) => {
    const slip = slips.find(s => s.id === slipId);
    if (!slip) return;

    setSlips(prev => prev.map(s => s.id === slipId ? { ...s, status: 'approved' } : s));

    recordUserAction(
      'APPROVE_PAYMENT',
      `Approved bank deposit slip ${slip.referenceNumber} for student ${slip.userName}`,
      { slipId, amount: slip.amount }
    );

    showToast(`Approved payment slip ${slip.referenceNumber}`);
  };

  // Instructor: Reject bank slip
  const handleRejectSlip = (slipId: string) => {
    const slip = slips.find(s => s.id === slipId);
    if (!slip) return;

    setSlips(prev => prev.map(s => s.id === slipId ? { ...s, status: 'rejected' } : s));

    recordUserAction(
      'REJECT_PAYMENT',
      `Rejected bank deposit slip ${slip.referenceNumber} for student ${slip.userName}`,
      { slipId }
    );

    showToast(`Rejected payment slip ${slip.referenceNumber}`);
  };

  // Control Panel: Save Subject (Create or Edit)
  const handleSaveSubject = (savedSub: Subject) => {
    const exists = subjects.some(s => s.id === savedSub.id);
    if (exists) {
      setSubjects(prev => updateSubjectInList(prev, savedSub));
      recordUserAction('EDIT_SUBJECT', `Updated subject details for "${savedSub.name}" (${savedSub.code})`, { subjectId: savedSub.id });
      showToast(`Saved changes to "${savedSub.name}"`);
    } else {
      setSubjects(prev => [savedSub, ...prev]);
      recordUserAction('ADD_SUBJECT', `Created new curriculum subject "${savedSub.name}" (${savedSub.code})`, { subjectId: savedSub.id });
      showToast(`Created new subject "${savedSub.name}"`);
    }
  };

  // Control Panel: Delete Subject
  const handleDeleteSubject = (subjectId: string) => {
    const target = subjects.find(s => s.id === subjectId);
    setSubjects(prev => deleteSubjectFromList(prev, subjectId));
    if (selectedSubjectId === subjectId) {
      setSelectedSubjectId('all');
    }
    if (target) {
      recordUserAction('DELETE_SUBJECT', `Deleted curriculum subject "${target.name}" (${target.code})`, { subjectId });
      showToast(`Deleted subject "${target.name}"`);
    }
  };

  // Control Panel: Save Course Material (Create or Edit)
  const handleSaveMaterial = (savedMat: CourseMaterial) => {
    const exists = materials.some(m => m.id === savedMat.id);
    if (exists) {
      setMaterials(prev => updateMaterialInList(prev, savedMat));
      recordUserAction(
        'EDIT_MATERIAL',
        `Updated course material "${savedMat.title}" (${savedMat.medium} medium, ${savedMat.subjectId})`,
        { materialId: savedMat.id, subjectId: savedMat.subjectId }
      );
      showToast(`Updated material "${savedMat.title}"`);
    } else {
      setMaterials(prev => [savedMat, ...prev]);
      recordUserAction(
        'ADD_MATERIAL',
        `Published new course material "${savedMat.title}" in ${savedMat.medium} medium for ${savedMat.subjectId}`,
        { materialId: savedMat.id, subjectId: savedMat.subjectId }
      );
      showToast(`Published new resource: "${savedMat.title}"`);
    }
  };

  // Control Panel: Duplicate Material
  const handleDuplicateMaterial = (mat: CourseMaterial) => {
    const duplicated: CourseMaterial = {
      ...mat,
      id: `mat_${Date.now()}`,
      title: `${mat.title} (Copy)`,
      downloadCount: 0,
      publishedDate: new Date().toISOString().split('T')[0]
    };
    setMaterials(prev => [duplicated, ...prev]);
    recordUserAction('ADD_MATERIAL', `Duplicated material "${mat.title}" as new entry`);
    showToast(`Duplicated: "${duplicated.title}"`);
  };

  // Control Panel: Delete Material
  const handleDeleteMaterial = (materialId: string) => {
    const target = materials.find(m => m.id === materialId);
    setMaterials(prev => prev.filter(m => m.id !== materialId));

    if (target) {
      recordUserAction('DELETE_MATERIAL', `Deleted material "${target.title}"`);
      showToast(`Removed material "${target.title}"`);
    }
  };

  // Registered Users: Update existing student
  const handleUpdateUser = (updatedUser: UserAccount) => {
    setRegisteredUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    recordUserAction('ADJUST_USER_WALLET', `Updated record for user ${updatedUser.name} (Wallet: LKR ${updatedUser.walletBalance})`);
    showToast(`Updated user: ${updatedUser.name}`);
  };

  // Registered Users: Add new student
  const handleAddUser = (newUser: UserAccount) => {
    setRegisteredUsers(prev => [newUser, ...prev]);
    recordUserAction('GRANT_USER_ACCESS', `Admin enrolled new user: ${newUser.name} (${newUser.email})`);
    showToast(`Enrolled new student: ${newUser.name}`);
  };

  // Payment Gateway: Update Gateway Config
  const handleUpdateGatewayConfig = (newConfig: PaymentGatewayConfig) => {
    setGatewayConfig(newConfig);
    recordUserAction('UPDATE_GATEWAY', `Updated gateway configuration (${newConfig.activeGateway.toUpperCase()} · ${newConfig.mode} mode)`);
    showToast(`Payment Gateway updated to ${newConfig.activeGateway.toUpperCase()}`);
  };

  // Payment Gateway: Simulate Webhook IPN Callback
  const handleSimulateWebhook = (studentId: string, materialId: string, amount: number, method: string) => {
    const targetStudent = registeredUsers.find(u => u.id === studentId);
    const targetMaterial = materials.find(m => m.id === materialId);
    if (!targetStudent || !targetMaterial) return;

    const refNumber = 'PAYHERE-IPN-' + Math.floor(100000 + Math.random() * 900000);
    const updatedPurchased = [...new Set([...targetStudent.purchasedMaterialIds, materialId])];

    const updatedStudent: UserAccount = {
      ...targetStudent,
      purchasedMaterialIds: updatedPurchased
    };

    setRegisteredUsers(prev => prev.map(u => u.id === studentId ? updatedStudent : u));
    if (currentUser.id === studentId) {
      setCurrentUser(updatedStudent);
    }

    const txnRecord: GatewayTransaction = {
      id: 'gw_' + Date.now(),
      gateway: gatewayConfig.activeGateway,
      referenceNumber: refNumber,
      userId: studentId,
      userName: targetStudent.name,
      userEmail: targetStudent.email,
      materialId,
      materialTitle: targetMaterial.title,
      amount,
      currency: gatewayConfig.currency,
      paymentMethod: method,
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
      mode: gatewayConfig.mode
    };
    setGatewayTransactions(prev => [txnRecord, ...prev]);

    recordUserAction(
      'PURCHASE_MATERIAL',
      `Gateway IPN Verified: Unlocked "${targetMaterial.title}" for ${targetStudent.name} (Ref: ${refNumber})`,
      { studentId, materialId, refNumber }
    );

    showToast(`IPN Callback: "${targetMaterial.title}" unlocked for ${targetStudent.name}!`);
  };

  // User auth registration
  const handleRegisterUser = (newUser: UserAccount) => {
    setCurrentUser(newUser);
    setRegisteredUsers(prev => [newUser, ...prev]);
    recordUserAction('USER_REGISTER', `New user registered: ${newUser.name} (${newUser.role})`);
    showToast(`Welcome ${newUser.name}! Your account is active with bonus credits.`);
  };

  const handleLoginUser = (user: UserAccount) => {
    setCurrentUser(user);
    recordUserAction('USER_LOGIN', `User signed in: ${user.name}`);
    showToast(`Welcome back, ${user.name}!`);
  };

  // Admin PIN Gate unlock
  const handleAdminPasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasskey.trim() === 'admin2026' || adminPasskey.trim().toLowerCase() === 'admin') {
      setCurrentUser(INITIAL_INSTRUCTOR);
      setAdminPasskey('');
      setAdminPasskeyError(false);
      showToast('Admin Authorized: Access Granted to Control Panel');
    } else {
      setAdminPasskeyError(true);
    }
  };

  // Filtered materials for catalog
  const filteredCatalogMaterials = filterMaterials(materials, {
    subjectId: selectedSubjectId,
    medium: selectedMedium,
    searchQuery,
    typeFilter: selectedType
  });

  const pendingSlipsCount = slips.filter(s => s.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSwitchRole={handleSwitchRole}
        onOpenAuth={() => setIsAuthOpen(true)}
        pendingSlipsCount={pendingSlipsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Subject and Medium Category Switcher */}
            <SubjectCategorySelector
              subjects={subjects}
              selectedSubjectId={selectedSubjectId}
              onSelectSubject={setSelectedSubjectId}
              selectedMedium={selectedMedium}
              onSelectMedium={setSelectedMedium}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedType={selectedType}
              onSelectType={setSelectedType}
              totalMaterialsCount={materials.length}
            />

            {/* Materials Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-medium text-slate-500">
                  Showing <span className="font-bold text-slate-900">{filteredCatalogMaterials.length}</span> resources
                  {selectedSubjectId !== 'all' && ` in ${subjects.find(s => s.id === selectedSubjectId)?.name}`}
                  {selectedMedium !== 'all' && ` (${selectedMedium === 'sinhala' ? 'Sinhala Medium' : 'English Medium'})`}
                </div>
              </div>

              {filteredCatalogMaterials.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    No course materials found
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try clearing your search query or selecting "All Mediums" to view other available tracks.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedMedium('all');
                      setSelectedType('all');
                      setSelectedSubjectId('all');
                    }}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-medium hover:bg-slate-800 transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCatalogMaterials.map(material => (
                    <CourseMaterialCard
                      key={material.id}
                      material={material}
                      currentUser={currentUser}
                      onPreview={(mat) => setPreviewMaterial(mat)}
                      onDownload={(mat) => handleDownloadMaterial(mat)}
                      onUnlock={(mat) => setCheckoutMaterial(mat)}
                      onToggleComplete={handleToggleComplete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Student Progress Tab */}
        {activeTab === 'learning' && (
          <StudentProgressDashboard
            currentUser={currentUser}
            subjects={subjects}
            materials={materials}
            onDownloadAgain={handleDownloadMaterial}
            onNavigateToSubject={(subId) => {
              setSelectedSubjectId(subId as SubjectId);
              setActiveTab('catalog');
            }}
            onToggleComplete={handleToggleComplete}
          />
        )}

        {/* Downloads Tracker Tab */}
        {activeTab === 'downloads' && (
          <DownloadsTracker
            currentUser={currentUser}
            materials={materials}
            onDownloadAgain={handleDownloadMaterial}
            onExploreMore={() => setActiveTab('catalog')}
          />
        )}

        {/* Action History Audit Tab */}
        {activeTab === 'history' && (
          <ActionHistoryView
            logs={actionLogs}
            currentUser={currentUser}
          />
        )}

        {/* Dedicated Control Panel Tab (Strictly for Admin) */}
        {activeTab === 'control_panel' && (
          currentUser.role === 'instructor' ? (
            <ControlPanel
              subjects={subjects}
              materials={materials}
              slips={slips}
              actionLogs={actionLogs}
              currentUser={currentUser}
              registeredUsers={registeredUsers}
              gatewayConfig={gatewayConfig}
              gatewayTransactions={gatewayTransactions}
              onSaveSubject={handleSaveSubject}
              onDeleteSubject={handleDeleteSubject}
              onSaveMaterial={handleSaveMaterial}
              onDeleteMaterial={handleDeleteMaterial}
              onDuplicateMaterial={handleDuplicateMaterial}
              onApproveSlip={handleApproveSlip}
              onRejectSlip={handleRejectSlip}
              onPreviewMaterial={(mat) => setPreviewMaterial(mat)}
              onUpdateUser={handleUpdateUser}
              onAddUser={handleAddUser}
              onUpdateGatewayConfig={handleUpdateGatewayConfig}
              onSimulateWebhook={handleSimulateWebhook}
            />
          ) : (
            /* Admin Access Restriction Guard */
            <div className="max-w-xl mx-auto px-4 py-16">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-4">
                <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-200">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Administrator Authorization Required
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                    The Curriculum & Materials Control Panel is restricted exclusively to the site owner/administrator. Students cannot view or manage subjects, registered users, or payment gateways.
                  </p>
                </div>

                {/* Unlock Form */}
                <form onSubmit={handleAdminPasskeySubmit} className="pt-2 max-w-sm mx-auto space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1 text-left">
                      Enter Administrator Passkey
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        placeholder="Admin PIN (e.g. admin2026)"
                        value={adminPasskey}
                        onChange={e => {
                          setAdminPasskey(e.target.value);
                          setAdminPasskeyError(false);
                        }}
                        className={`w-full pl-9 pr-3 py-2 border rounded-xl text-xs font-mono focus:outline-hidden ${
                          adminPasskeyError ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                        }`}
                      />
                    </div>
                    {adminPasskeyError && (
                      <span className="text-[11px] text-rose-600 block mt-1 text-left">
                        Invalid admin passkey. Default passkey: <code className="font-bold">admin2026</code>
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Unlock Control Panel
                  </button>
                </form>

                <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setCurrentUser(INITIAL_INSTRUCTOR);
                      showToast('Admin account authorized.');
                    }}
                    className="text-xs text-blue-700 hover:text-blue-800 font-semibold underline"
                  >
                    1-Click Switch to Admin (Eng. Sunil Rajapakse)
                  </button>
                  <span className="text-slate-300 hidden sm:inline">·</span>
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="text-xs text-slate-600 hover:text-slate-900 font-medium"
                  >
                    Return to Student Course Catalog
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">Technology Teacher</span>
            <span aria-hidden="true">·</span>
            <span>Engineering Technology & STEM National Curriculum Portal</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Sinhala & English Medium Tracks</span>
            <span aria-hidden="true">·</span>
            <span>CBSL / PayHere Verified Gateway</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MaterialPreviewModal
        material={previewMaterial}
        currentUser={currentUser}
        isOpen={!!previewMaterial}
        onClose={() => setPreviewMaterial(null)}
        onDownload={handleDownloadMaterial}
        onUnlock={(mat) => setCheckoutMaterial(mat)}
        onToggleComplete={handleToggleComplete}
      />

      <CheckoutModal
        material={checkoutMaterial}
        currentUser={currentUser}
        gatewayConfig={gatewayConfig}
        isOpen={!!checkoutMaterial}
        onClose={() => setCheckoutMaterial(null)}
        onPaymentSuccess={handlePaymentSuccess}
        onSubmitBankSlip={handleSubmitBankSlip}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={handleLoginUser}
        onRegister={handleRegisterUser}
        onSwitchToStudentDemo={() => {
          setCurrentUser(INITIAL_USER);
          showToast('Signed in as Student (Kasun Jayasundara)');
        }}
        onSwitchToInstructorDemo={() => {
          setCurrentUser(INITIAL_INSTRUCTOR);
          showToast('Signed in as Admin (Eng. Sunil Rajapakse)');
        }}
      />
    </div>
  );
}
