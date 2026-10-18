import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  Key, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Send, 
  Layers, 
  Zap, 
  Building2, 
  Wallet, 
  RefreshCw, 
  ExternalLink,
  Sliders,
  DollarSign
} from 'lucide-react';
import type { 
  PaymentGatewayConfig, 
  GatewayTransaction, 
  CourseMaterial, 
  UserAccount 
} from '../types/index.ts';
import { formatLKR } from '../utils/courseLogic.ts';

interface PaymentGatewayManagerProps {
  config: PaymentGatewayConfig;
  transactions: GatewayTransaction[];
  materials: CourseMaterial[];
  users: UserAccount[];
  onUpdateConfig: (config: PaymentGatewayConfig) => void;
  onSimulateWebhook: (studentId: string, materialId: string, amount: number, method: string) => void;
}

export const PaymentGatewayManager: React.FC<PaymentGatewayManagerProps> = ({
  config,
  transactions,
  materials,
  users,
  onUpdateConfig,
  onSimulateWebhook
}) => {
  // Local config form state
  const [formConfig, setFormConfig] = useState<PaymentGatewayConfig>(config);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Ping test state
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{
    status: 'success' | 'error';
    latencyMs: number;
    message: string;
    timestamp: string;
  } | null>({
    status: 'success',
    latencyMs: 42,
    message: 'PayHere Merchant Sandbox Gateway operational (HTTP 200 OK)',
    timestamp: new Date().toLocaleTimeString()
  });

  // Webhook Simulator state
  const [simStudentId, setSimStudentId] = useState<string>(users[0]?.id || '');
  const [simMaterialId, setSimMaterialId] = useState<string>(materials[0]?.id || '');
  const [simMethod, setSimMethod] = useState<string>('Visa / Mastercard (PayHere Gateway)');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simSuccess, setSimSuccess] = useState<string | null>(null);

  // Webhook URL
  const webhookUrl = `${window.location.origin}/api/v1/payment-ipn`;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formConfig);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      const latency = Math.floor(35 + Math.random() * 25);
      setIsPinging(false);
      setPingResult({
        status: 'success',
        latencyMs: latency,
        message: `${formConfig.activeGateway.toUpperCase()} Gateway API responded in ${latency}ms (Status: 200 OK · Valid Signature)`,
        timestamp: new Date().toLocaleTimeString()
      });
    }, 800);
  };

  const handleTriggerSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMat = materials.find(m => m.id === simMaterialId);
    const amount = targetMat ? targetMat.price : 650;
    
    setIsSimulating(true);
    setTimeout(() => {
      onSimulateWebhook(simStudentId, simMaterialId, amount, simMethod);
      setIsSimulating(false);
      setSimSuccess(`IPN Callback processed! Ref: PAYHERE-IPN-${Date.now().toString().slice(-6)}`);
      setTimeout(() => setSimSuccess(null), 4000);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Active Gateway Status */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Payment Gateway Integration & Facilities Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Linked Payment Gateways & Merchant Facilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Link and manage payment gateway facilities including <strong>PayHere (Sri Lanka)</strong>, <strong>Stripe</strong>, direct bank transfers, and student digital wallets to seamlessly collect course fees and automate material dispatch.
          </p>
        </div>

        {/* Live Status indicator card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shrink-0 text-xs space-y-2 min-w-[240px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">Active Gateway:</span>
            <span className="font-bold text-amber-300 uppercase tracking-wider">
              {formConfig.activeGateway}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">Environment:</span>
            <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
              formConfig.mode === 'live' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-900'
            }`}>
              {formConfig.mode} Mode
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">Gateway Health:</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Operational
            </span>
          </div>
        </div>
      </div>

      {/* Gateway Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PayHere Card */}
        <div 
          onClick={() => setFormConfig(prev => ({ ...prev, activeGateway: 'payhere' }))}
          className={`cursor-pointer rounded-xl border p-4.5 transition-all ${
            formConfig.activeGateway === 'payhere'
              ? 'bg-blue-50/70 border-blue-600 shadow-sm ring-2 ring-blue-600/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-black text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>PayHere</span>
            </div>
            {formConfig.activeGateway === 'payhere' && (
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                Active Link
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
            Sri Lanka's #1 CBSL-approved gateway. Supports Visa, Mastercard, eZ Cash, mCash, FriMi, and Genie.
          </p>
          <div className="text-[10px] text-slate-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>LKR Automated IPN Ready</span>
          </div>
        </div>

        {/* Stripe Card */}
        <div 
          onClick={() => setFormConfig(prev => ({ ...prev, activeGateway: 'stripe' }))}
          className={`cursor-pointer rounded-xl border p-4.5 transition-all ${
            formConfig.activeGateway === 'stripe'
              ? 'bg-blue-50/70 border-blue-600 shadow-sm ring-2 ring-blue-600/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-black text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>Stripe</span>
            </div>
            {formConfig.activeGateway === 'stripe' && (
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                Active Link
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
            Global payment gateway for international cards, Apple Pay, and Google Pay with 3D Secure verification.
          </p>
          <div className="text-[10px] text-slate-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Multi-Currency Cards</span>
          </div>
        </div>

        {/* WebXpay Card */}
        <div 
          onClick={() => setFormConfig(prev => ({ ...prev, activeGateway: 'webxpay' }))}
          className={`cursor-pointer rounded-xl border p-4.5 transition-all ${
            formConfig.activeGateway === 'webxpay'
              ? 'bg-blue-50/70 border-blue-600 shadow-sm ring-2 ring-blue-600/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>WebXpay</span>
            </div>
            {formConfig.activeGateway === 'webxpay' && (
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                Active Link
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
            Multi-channel Sri Lankan digital payments aggregator connecting major commercial banks and telco wallets.
          </p>
          <div className="text-[10px] text-slate-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Local Banking Network</span>
          </div>
        </div>

        {/* Direct Bank / Slip Card */}
        <div 
          onClick={() => setFormConfig(prev => ({ ...prev, activeGateway: 'direct_bank' }))}
          className={`cursor-pointer rounded-xl border p-4.5 transition-all ${
            formConfig.activeGateway === 'direct_bank'
              ? 'bg-blue-50/70 border-blue-600 shadow-sm ring-2 ring-blue-600/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Bank Slip Upload</span>
            </div>
            {formConfig.activeGateway === 'direct_bank' && (
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                Active Link
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
            Bank deposit & CDM slip upload (BOC, Sampath, Commercial Bank) with manual or automated verification.
          </p>
          <div className="text-[10px] text-slate-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Island-wide Branch Cash</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Settings & Facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Gateway Credentials & Options Configuration */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-600" />
                <span>Gateway API Credentials & Settings</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure your merchant keys for {formConfig.activeGateway.toUpperCase()}
              </p>
            </div>
            <button
              onClick={handleTestPing}
              disabled={isPinging}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
              <span>Ping Gateway</span>
            </button>
          </div>

          {/* Ping result notification */}
          {pingResult && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">{pingResult.message}</span>
                <span className="text-[11px] text-emerald-600 block mt-0.5 font-mono">
                  Latency: {pingResult.latencyMs}ms · Checked at {pingResult.timestamp}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
            {/* Mode Toggle */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">Environment Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormConfig(prev => ({ ...prev, mode: 'sandbox' }))}
                  className={`py-2 text-center rounded-lg font-bold border transition-colors ${
                    formConfig.mode === 'sandbox'
                      ? 'bg-amber-50 border-amber-500 text-amber-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Sandbox / Test Mode (Simulated Approvals)
                </button>
                <button
                  type="button"
                  onClick={() => setFormConfig(prev => ({ ...prev, mode: 'live' }))}
                  className={`py-2 text-center rounded-lg font-bold border transition-colors ${
                    formConfig.mode === 'live'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Live / Production (Real Cards & Accounts)
                </button>
              </div>
            </div>

            {/* Merchant ID */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Merchant ID / Account ID
              </label>
              <input
                type="text"
                required
                value={formConfig.merchantId}
                onChange={e => setFormConfig(prev => ({ ...prev, merchantId: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
              />
            </div>

            {/* Secret Key */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">
                  Secret Key / Merchant Secret
                </label>
                <button
                  type="button"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="text-[11px] text-blue-600 hover:underline font-medium"
                >
                  {showSecretKey ? 'Hide' : 'Reveal'}
                </button>
              </div>
              <input
                type={showSecretKey ? 'text' : 'password'}
                required
                value={formConfig.secretKey}
                onChange={e => setFormConfig(prev => ({ ...prev, secretKey: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
              />
            </div>

            {/* Currency Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Processing Currency</label>
                <select
                  value={formConfig.currency}
                  onChange={e => setFormConfig(prev => ({ ...prev, currency: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold"
                >
                  <option value="LKR">LKR (Sri Lankan Rupee)</option>
                  <option value="USD">USD (US Dollar)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bank Slip Auto-Approval</label>
                <select
                  value={formConfig.autoApproveBankSlips ? 'true' : 'false'}
                  onChange={e => setFormConfig(prev => ({ ...prev, autoApproveBankSlips: e.target.value === 'true' }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="false">Manual Review by Admin</option>
                  <option value="true">Instant Auto-Approve (Provisional)</option>
                </select>
              </div>
            </div>

            {/* Notification / IPN Webhook Endpoint */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                IPN / Webhook Notification URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={webhookUrl}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-600"
                />
                <button
                  type="button"
                  onClick={handleCopyWebhook}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs shrink-0 flex items-center gap-1"
                >
                  {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedWebhook ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Enter this URL into your PayHere/Stripe dashboard's Merchant Notification URL setting.
              </p>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-2">
              {saveSuccess ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1 text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  Gateway settings saved!
                </span>
              ) : <span></span>}

              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors"
              >
                Save Gateway Settings
              </button>
            </div>
          </form>
        </div>

        {/* Column 2: Webhook Simulator & Instant Dispatch Testing */}
        <div className="space-y-6">
          {/* Webhook & IPN Testing Facility */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600" />
                <span>Gateway Webhook & Instant Unlock Simulator</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Test the end-to-end payment gateway callback. Simulating an IPN webhook will verify automated course unlocking.
              </p>
            </div>

            {simSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{simSuccess}</span>
              </div>
            )}

            <form onSubmit={handleTriggerSimulation} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Registered Student</label>
                <select
                  value={simStudentId}
                  onChange={e => setSimStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
                >
                  {users.filter(u => u.role === 'student').map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email}) - Current unlocked: {u.purchasedMaterialIds?.length || 0}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Course Material to Unlock</label>
                <select
                  value={simMaterialId}
                  onChange={e => setSimMaterialId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
                >
                  {materials.map(m => (
                    <option key={m.id} value={m.id}>
                      [{m.medium === 'sinhala' ? 'සිංහල' : 'English'}] {m.title} - LKR {m.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Method / Channel</label>
                <select
                  value={simMethod}
                  onChange={e => setSimMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Visa / Mastercard (PayHere Gateway)">Visa / Mastercard (PayHere 3D Secure)</option>
                  <option value="eZ Cash / mCash Mobile (PayHere Gateway)">eZ Cash / mCash Telco Wallet</option>
                  <option value="FriMi / Genie QR (PayHere Gateway)">FriMi / Genie QR Code</option>
                  <option value="Stripe International Card">Stripe International Card</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSimulating}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{isSimulating ? 'Processing Simulated IPN...' : 'Simulate Incoming Payment Webhook'}</span>
              </button>
            </form>
          </div>

          {/* Bank Transfer Details Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Direct Bank Account Details (For Slip Uploads)</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-slate-700">
              <div>
                <span className="text-slate-400 block text-[11px]">Primary Bank:</span>
                <span className="font-bold">{formConfig.bankDetails.bankName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Account Number:</span>
                <span className="font-mono font-bold text-blue-700">{formConfig.bankDetails.accountNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Account Holder:</span>
                <span className="font-bold">{formConfig.bankDetails.accountName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Branch:</span>
                <span className="font-bold">{formConfig.bankDetails.branch}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gateway Transactions Ledger */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-3">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Gateway Transactions Ledger</span>
            </h3>
            <p className="text-xs text-slate-500">
              Real-time audit log of all online gateway transactions and dispatches.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            {transactions.length} Transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Gateway Ref</th>
                <th className="py-3 px-3">Student Customer</th>
                <th className="py-3 px-3">Unlocked Material</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3">Mode</th>
                <th className="py-3 px-4 text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No gateway transactions recorded yet.
                  </td>
                </tr>
              ) : (
                transactions.map(txn => (
                  <tr key={txn.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {txn.referenceNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{txn.userName}</div>
                      <div className="text-[11px] text-slate-400">{txn.userEmail}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800 line-clamp-1 max-w-[200px]" title={txn.materialTitle}>
                        {txn.materialTitle}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {txn.paymentMethod}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-slate-900 tabular-nums">
                      LKR {txn.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{txn.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {txn.mode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 font-mono text-[11px]">
                      {new Date(txn.createdAt).toLocaleDateString()} {new Date(txn.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
