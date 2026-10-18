export type SubjectId = string;

export type Medium = 'sinhala' | 'english';

export type MaterialType = 
  | 'lecture_note' 
  | 'past_paper' 
  | 'model_paper' 
  | 'tutorial_worksheet' 
  | 'short_note';

export interface SubjectTopic {
  id: string;
  name: string;
  nameSi: string;
}

export interface Subject {
  id: SubjectId;
  name: string;
  nameSi: string;
  code: string;
  description: string;
  descriptionSi: string;
  badgeColor: string;
  topics: SubjectTopic[];
}

export interface CourseMaterial {
  id: string;
  subjectId: SubjectId;
  medium: Medium;
  title: string;
  titleSi?: string;
  description: string;
  moduleName: string;
  unitNumber: number;
  type: MaterialType;
  price: number; // In LKR (0 means free preview)
  currency: string;
  fileFormat: 'PDF' | 'DOCX' | 'ZIP';
  fileSize: string;
  downloadCount: number;
  totalPages: number;
  sampleContent: string;
  publishedDate: string;
  instructorName: string;
  featured?: boolean;
}

export interface DownloadRecord {
  materialId: string;
  downloadedAt: string;
  fileName: string;
  fileSize: string;
  subjectId: SubjectId;
  medium: Medium;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'student' | 'instructor';
  avatar?: string;
  enrolledSubjects: SubjectId[];
  purchasedMaterialIds: string[];
  downloadHistory: DownloadRecord[];
  completedMaterialIds: string[];
  walletBalance: number; // In LKR
  createdAt: string;
  status?: 'active' | 'suspended' | 'verified';
  preferredMedium?: 'sinhala' | 'english' | 'both';
}

export type ActionType = 
  | 'USER_LOGIN'
  | 'USER_REGISTER'
  | 'PURCHASE_MATERIAL'
  | 'DOWNLOAD_RESOURCE'
  | 'MARK_COMPLETED'
  | 'UNMARK_COMPLETED'
  | 'SUBMIT_SLIP'
  | 'APPROVE_PAYMENT'
  | 'REJECT_PAYMENT'
  | 'ADD_MATERIAL'
  | 'EDIT_MATERIAL'
  | 'DELETE_MATERIAL'
  | 'ADD_SUBJECT'
  | 'EDIT_SUBJECT'
  | 'DELETE_SUBJECT'
  | 'UPDATE_GATEWAY'
  | 'ADJUST_USER_WALLET'
  | 'GRANT_USER_ACCESS';

export interface ActionLog {
  id: string;
  userId: string;
  userName: string;
  userRole: 'student' | 'instructor';
  actionType: ActionType;
  details: string;
  timestamp: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

export interface PaymentSlip {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  materialId: string;
  materialTitle: string;
  amount: number;
  referenceNumber: string;
  bankName: string;
  slipImageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface PaymentGatewayConfig {
  activeGateway: 'payhere' | 'stripe' | 'webxpay' | 'direct_bank';
  mode: 'sandbox' | 'live';
  merchantId: string;
  secretKey: string;
  publicKey: string;
  currency: 'LKR' | 'USD';
  supportedMethods: ('visa_master' | 'ezcash_mcash' | 'frimi' | 'genie' | 'bank_transfer')[];
  autoApproveBankSlips: boolean;
  notifyOnPayment: boolean;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    branch: string;
  };
}

export interface GatewayTransaction {
  id: string;
  gateway: 'payhere' | 'stripe' | 'webxpay' | 'direct_bank' | 'wallet';
  referenceNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  materialId: string;
  materialTitle: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  createdAt: string;
  mode: 'sandbox' | 'live';
}

