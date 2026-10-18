import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Building2, 
  Wallet, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  FileText, 
  Upload, 
  Sparkles, 
  AlertCircle,
  Smartphone,
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';
import type { CourseMaterial, UserAccount, PaymentSlip, PaymentGatewayConfig } from '../types/index.ts';
import { formatLKR } from '../utils/courseLogic.ts';

interface CheckoutModalProps {
  material: CourseMaterial | null;
  currentUser: UserAccount;
  gatewayConfig?: PaymentGatewayConfig;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (materialId: string, amount: number, method: string) => void;
  onSubmitBankSlip: (slip: Omit<PaymentSlip, 'id' | 'status' | 'submittedAt'>) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  material,
  currentUser,
  gatewayConfig,
  isOpen,
  onClose,
  onPaymentSuccess,
  onSubmitBankSlip
}) => {
  if (!isOpen || !material) return null;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'telco' | 'bank_slip' | 'wallet'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [txnId, setTxnId] = useState('');
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('4532 8900 1234 5678');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('789');
  const [cardName, setCardName] = useState(currentUser.name);

  // Telco wallet form state
  const [telcoNumber, setTelcoNumber] = useState(currentUser.phone || '+94 77 882 1199');
  const [telcoProvider, setTelcoProvider] = useState<'ezcash' | 'mcash'>('ezcash');
  const [telcoPin, setTelcoPin] = useState('1234');

  // Bank slip form state
  const [bankName, setBankName] = useState('Bank of Ceylon (BOC)');
  const [referenceNumber, setReferenceNumber] = useState('BOC-TRX-' + Math.floor(100000 + Math.random() * 900000));
  const [slipFileUploaded, setSlipFileUploaded] = useState(true);

  const activeGateway = gatewayConfig?.activeGateway || 'payhere';
  const isSandbox = gatewayConfig?.mode !== 'live';

  const handleCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const prefix = activeGateway === 'stripe' ? 'STRIPE_CH_' : 'PAYHERE_TXN_';
      const generatedTxn = prefix + Date.now().toString().slice(-6);
      setTxnId(generatedTxn);
      setIsProcessing(false);
      setPaymentCompleted(true);
      onPaymentSuccess(material.id, material.price, `${activeGateway.toUpperCase()} Card Gateway`);
    }, 900);
  };

  const handleTelcoPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const generatedTxn = 'EZCASH_REF_' + Date.now().toString().slice(-6);
      setTxnId(generatedTxn);
      setIsProcessing(false);
      setPaymentCompleted(true);
      onPaymentSuccess(material.id, material.price, `${telcoProvider === 'ezcash' ? 'eZ Cash' : 'mCash'} Mobile`);
    }, 900);
  };

  const handleWalletPayment = () => {
    if (currentUser.walletBalance < material.price) return;
    setIsProcessing(true);

    setTimeout(() => {
      const generatedTxn = 'WAL_DEBIT_' + Date.now().toString().slice(-6);
      setTxnId(generatedTxn);
      setIsProcessing(false);
      setPaymentCompleted(true);
      onPaymentSuccess(material.id, material.price, 'Student Digital Wallet');
    }, 700);
  };

  const handleBankSlipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      onSubmitBankSlip({
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        materialId: material.id,
        materialTitle: material.title,
        amount: material.price,
        referenceNumber,
        bankName
      });
      setIsProcessing(false);
      setPaymentCompleted(true);
      setTxnId(referenceNumber);
    }, 800);
  };

  const handleAutofillTestCard = () => {
    setCardNumber('4532 8900 1234 5678');
    setCardExpiry('12/28');
    setCardCvc('345');
    setCardName(currentUser.name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Technology Teacher Payment Portal</span>
              <span className="font-bold text-blue-700 capitalize">
                · {activeGateway === 'payhere' ? 'PayHere Gateway' : `${activeGateway} Gateway`}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                isSandbox ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isSandbox ? 'Sandbox' : 'Live'}
              </span>
            </div>
            <h2 id="checkout-modal-title" className="text-lg font-bold text-slate-900 mt-0.5">
              Unlock Course Material
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            aria-label="Close checkout modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {paymentCompleted ? (
            /* Success State */
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {paymentMethod === 'bank_slip' ? 'Bank Deposit Slip Submitted!' : 'Payment Verified & Unlocked!'}
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  {paymentMethod === 'bank_slip'
                    ? 'Your bank slip has been logged for instructor verification. Provisional study access is now active on your account.'
                    : `Your access to "${material.title}" has been permanently granted.`}
                </p>
              </div>

              {/* Receipt Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between text-slate-500">
                  <span>Gateway Ref:</span>
                  <span className="font-mono font-bold text-blue-700">{txnId}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Resource:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[200px]">{material.title}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Medium / Subject:</span>
                  <span className="font-medium capitalize text-slate-800">{material.medium} · {material.subjectId}</span>
                </div>
                <div className="flex justify-between text-slate-500 pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Amount Paid:</span>
                  <span className="font-bold text-blue-700">{formatLKR(material.price)}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Return to Course Materials & Download
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Item Card Summary */}
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/80 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-blue-800 font-semibold uppercase">
                    <span>{material.subjectId}</span>
                    <span aria-hidden="true">·</span>
                    <span>{material.medium === 'sinhala' ? 'සිංහල මාධ්‍යය' : 'English Medium'}</span>
                    <span aria-hidden="true">·</span>
                    <span>Unit {material.unitNumber}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2">
                    {material.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{material.fileFormat}</span>
                    <span aria-hidden="true">·</span>
                    <span>{material.fileSize}</span>
                    <span aria-hidden="true">·</span>
                    <span>By {material.instructorName}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-500">Amount Due</div>
                  <div className="text-lg font-extrabold text-blue-700">
                    {formatLKR(material.price)}
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Linked Payment Facility:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600 text-slate-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-600 mb-2" />
                    <div>
                      <div className="text-xs font-bold leading-tight">Card / Visa</div>
                      <div className="text-[10px] text-slate-500">3D Secure</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('telco')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'telco'
                        ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600 text-slate-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-indigo-600 mb-2" />
                    <div>
                      <div className="text-xs font-bold leading-tight">eZ Cash / mCash</div>
                      <div className="text-[10px] text-slate-500">Telco Wallets</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_slip')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'bank_slip'
                        ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600 text-slate-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-emerald-600 mb-2" />
                    <div>
                      <div className="text-xs font-bold leading-tight">Bank Slip</div>
                      <div className="text-[10px] text-slate-500">BOC / CDM</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'wallet'
                        ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600 text-slate-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Wallet className="w-5 h-5 text-purple-600 mb-2" />
                    <div>
                      <div className="text-xs font-bold leading-tight">Wallet</div>
                      <div className="text-[10px] text-slate-500">LKR {currentUser.walletBalance}</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Method A: Card Payment via Linked Gateway */}
              {paymentMethod === 'card' && (
                <form onSubmit={handleCardPayment} className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-600">
                      Gateway: <strong className="text-blue-700 capitalize">{activeGateway} Sri Lanka</strong>
                    </span>
                    {isSandbox && (
                      <button
                        type="button"
                        onClick={handleAutofillTestCard}
                        className="text-[11px] text-blue-600 hover:text-blue-700 font-bold underline"
                      >
                        Auto-fill Test Card
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Expires (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        CVC Security
                      </label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isProcessing ? 'Processing Gateway Security...' : `Pay ${formatLKR(material.price)} via ${activeGateway.toUpperCase()}`}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Method B: Telco Wallets (eZ Cash / mCash) */}
              {paymentMethod === 'telco' && (
                <form onSubmit={handleTelcoPayment} className="space-y-3 pt-1">
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-900">
                    <p className="font-semibold">Sri Lankan Mobile Wallets (Dialog / Mobitel):</p>
                    <p className="mt-0.5 text-[11px] text-indigo-700">
                      Charge directly to your Dialog eZ Cash or Mobitel mCash account with instant OTP authorization.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTelcoProvider('ezcash')}
                      className={`py-2 text-center rounded-lg text-xs font-bold border ${
                        telcoProvider === 'ezcash'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Dialog eZ Cash
                    </button>
                    <button
                      type="button"
                      onClick={() => setTelcoProvider('mcash')}
                      className={`py-2 text-center rounded-lg text-xs font-bold border ${
                        telcoProvider === 'mcash'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Mobitel mCash
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      value={telcoNumber}
                      onChange={(e) => setTelcoNumber(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Wallet Security PIN (Test PIN: 1234)
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={telcoPin}
                      onChange={(e) => setTelcoPin(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{isProcessing ? 'Authorizing Mobile Wallet...' : `Confirm LKR ${material.price} Debit`}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Method C: Bank Transfer Slip */}
              {paymentMethod === 'bank_slip' && (
                <form onSubmit={handleBankSlipSubmit} className="space-y-3 pt-1">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                    <p className="font-semibold">Technology Teacher Deposit Account:</p>
                    <p className="mt-0.5">Bank: <strong>{gatewayConfig?.bankDetails.bankName || 'Bank of Ceylon (BOC)'}</strong></p>
                    <p>Acc No: <strong>{gatewayConfig?.bankDetails.accountNumber || '8900-2441-9002'}</strong></p>
                    <p>Account Name: {gatewayConfig?.bankDetails.accountName || 'Technology Teacher STEM Academy'}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Your Bank / Branch
                    </label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="Bank of Ceylon (BOC)">Bank of Ceylon (BOC)</option>
                      <option value="Commercial Bank of Ceylon">Commercial Bank of Ceylon</option>
                      <option value="People's Bank">People's Bank</option>
                      <option value="Sampath Bank">Sampath Bank</option>
                      <option value="Hatton National Bank (HNB)">Hatton National Bank (HNB)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Bank Transaction / Slip Reference No.
                    </label>
                    <input
                      type="text"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Slip Upload */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Attach Deposit Slip (Image or PDF)
                    </label>
                    <div className="border border-dashed border-slate-300 rounded-lg p-4 text-center bg-slate-50 flex flex-col items-center justify-center">
                      <Upload className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-xs text-slate-700 font-medium">bank_deposit_slip_TechnologyTeacher.jpg</span>
                      <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">✓ File verified & attached (1.2 MB)</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isProcessing ? 'Submitting Slip for Verification...' : 'Submit Deposit Slip'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Method D: Student Wallet */}
              {paymentMethod === 'wallet' && (
                <div className="space-y-4 pt-1">
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-purple-800 font-medium">Your Current Balance:</span>
                      <span className="font-bold text-purple-900 text-sm">
                        LKR {currentUser.walletBalance.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-purple-800 font-medium">Resource Price:</span>
                      <span className="font-bold text-purple-900 text-sm">
                        - LKR {material.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-purple-200 pt-2 flex justify-between items-center text-xs font-bold text-purple-950">
                      <span>Remaining Balance:</span>
                      <span>
                        LKR {Math.max(0, currentUser.walletBalance - material.price).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {currentUser.walletBalance < material.price ? (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Insufficient wallet balance. Please use Card or Bank Slip to purchase.</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleWalletPayment}
                      disabled={isProcessing}
                      className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isProcessing ? 'Deducting Wallet Balance...' : `Pay LKR ${material.price} from Wallet`}</span>
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
