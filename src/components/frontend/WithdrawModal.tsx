import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BankAccountDetails } from '../../types';
import {
  Building,
  CheckCircle2,
  AlertCircle,
  Plus,
  ShieldCheck,
  Check,
  X,
  ArrowUpRight,
  Clock,
  Lock,
} from 'lucide-react';

export const WithdrawModal: React.FC = () => {
  const {
    currentUser,
    withdrawals,
    requestBankWithdrawal,
    addBankAccount,
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'request_payout' | 'add_bank' | 'payout_history'>('request_payout');
  const bankList = currentUser.bankAccounts || [];
  const [selectedBankId, setSelectedBankId] = useState<string>(
    bankList[0]?.id || ''
  );
  const [amountStr, setAmountStr] = useState<string>('500');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Bank Form State
  const [bankName, setBankName] = useState('Standard Chartered Global');
  const [accountHolder, setAccountHolder] = useState(currentUser.name);
  const [accountNumber, setAccountNumber] = useState('019283746192');
  const [ibanOrIfsc, setIbanOrIfsc] = useState('SCBLPK0019283746192');
  const [branchOrSwift, setBranchOrSwift] = useState('SCBLUS33');

  if (!isWithdrawModalOpen) return null;

  const userWithdrawals = withdrawals.filter((w) => w.userId === currentUser.id);
  const selectedBank = bankList.find((b: BankAccountDetails) => b.id === selectedBankId) || bankList[0];

  const amount = parseFloat(amountStr) || 0;
  const feeRate = 0.01; // 1% transparent wire settlement fee
  const fee = Number((amount * feeRate).toFixed(2));
  const netReceived = Math.max(0, Number((amount - fee).toFixed(2)));

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!selectedBank) {
      setFeedback({ type: 'error', message: 'Please add or select a bank payout account first.' });
      return;
    }

    const res = requestBankWithdrawal(selectedBank, amount);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setAmountStr('');
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleAddBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName.trim() || !accountHolder.trim() || !accountNumber.trim() || !ibanOrIfsc.trim()) {
      setFeedback({ type: 'error', message: 'All bank account fields are required.' });
      return;
    }

    addBankAccount({
      bankName: bankName.trim(),
      accountHolder: accountHolder.trim(),
      accountNumber: accountNumber.trim(),
      ibanOrIfsc: ibanOrIfsc.trim().toUpperCase(),
      branchOrSwift: branchOrSwift.trim().toUpperCase(),
      isPrimary: true,
    });

    setFeedback({
      type: 'success',
      message: `Bank account (${bankName} - ${ibanOrIfsc}) verified and linked for payouts!`,
    });
    setActiveTab('request_payout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative space-y-6 text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Bank Payout & Withdrawal Portal
              </h2>
              <p className="text-xs text-slate-500">
                Available: <strong className="text-emerald-600">${currentUser.availableBalance.toFixed(2)}</strong> · Pending: ${(currentUser.pendingBalance || 0).toFixed(2)}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsWithdrawModalOpen(false);
              setFeedback(null);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => {
              setActiveTab('request_payout');
              setFeedback(null);
            }}
            className={`flex-1 py-1.5 text-center rounded-md transition ${
              activeTab === 'request_payout'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Request Payout
          </button>

          <button
            onClick={() => {
              setActiveTab('add_bank');
              setFeedback(null);
            }}
            className={`flex-1 py-1.5 text-center rounded-md transition ${
              activeTab === 'add_bank'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Link Bank Account
          </button>

          <button
            onClick={() => {
              setActiveTab('payout_history');
              setFeedback(null);
            }}
            className={`flex-1 py-1.5 text-center rounded-md transition ${
              activeTab === 'payout_history'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Settlement History ({userWithdrawals.length})
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3.5 rounded-lg text-xs flex items-start gap-2.5 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* TAB 1: Request Payout */}
        {activeTab === 'request_payout' && (
          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            {currentUser.canWithdraw === false && (
              <div className="bg-rose-50 border border-rose-300 text-rose-800 p-4 rounded-xl flex items-start gap-3">
                <Lock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-black text-rose-900">Withdrawal Permission Restricted</div>
                  <p className="text-rose-700 leading-relaxed">
                    Your account withdrawal privileges are temporarily restricted by administrative compliance. Please contact Customer Support via Telegram or Live Chat to review your account status.
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Destination Bank Account (IBAN / IFSC)
              </label>

              {bankList.length === 0 ? (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 space-y-2">
                  <p>You have not linked any bank accounts yet.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('add_bank')}
                    className="font-bold underline text-amber-900"
                  >
                    Click here to link your Bank Account
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {bankList.map((b: BankAccountDetails) => (
                    <label
                      key={b.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition ${
                        selectedBank?.id === b.id
                          ? 'border-amber-500 bg-amber-50/50 text-slate-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="bankSelection"
                        checked={selectedBank?.id === b.id}
                        onChange={() => setSelectedBankId(b.id)}
                        className="mt-0.5 text-amber-600 focus:ring-amber-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{b.bankName}</span>
                          <span className="text-[11px] text-slate-500">{b.accountHolder}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                          IBAN/IFSC: {b.ibanOrIfsc} · A/C: {b.accountNumber}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Withdrawal Amount ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">$</span>
                <input
                  type="number"
                  min="50"
                  step="0.01"
                  required
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="Enter amount (min $50)"
                  className="w-full text-xs pl-7 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                <span>Quick Fill:</span>
                {[100, 500, 1000, 2500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmountStr(amt.toString())}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-semibold"
                  >
                    ${amt}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAmountStr(currentUser.availableBalance.toString())}
                  className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded font-semibold ml-auto"
                >
                  All (${currentUser.availableBalance.toFixed(2)})
                </button>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Requested Amount</span>
                <span className="font-semibold tabular-nums">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Interbank Wire Clearing Fee (1.0%)</span>
                <span className="text-slate-500 tabular-nums">-${fee.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Net Receivable in Bank Account</span>
                <span className="text-emerald-600 tabular-nums">${netReceived.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={bankList.length === 0 || amount <= 0 || currentUser.canWithdraw === false}
              className={`w-full py-2.5 px-4 font-bold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow ${
                currentUser.canWithdraw === false
                  ? 'bg-rose-100 text-rose-500 cursor-not-allowed border border-rose-200'
                  : 'bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white'
              }`}
            >
              {currentUser.canWithdraw === false ? (
                <>
                  <Lock className="w-4 h-4 text-rose-500" />
                  <span>Withdrawal Locked by Admin</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-4 h-4 text-amber-400" />
                  <span>Submit Wire Withdrawal Request (${amount.toFixed(2)})</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: Link Bank Account */}
        {activeTab === 'add_bank' && (
          <form onSubmit={handleAddBankSubmit} className="space-y-4">
            <p className="text-xs text-slate-600">
              Add your official bank account details for direct interbank wire payouts. We support international IBAN and domestic IFSC routing.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. Standard Chartered Global, Chase, HSBC, HDFC, Habib Bank"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Holder Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="As registered on official bank statements"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  IBAN or IFSC Code
                </label>
                <input
                  type="text"
                  required
                  value={ibanOrIfsc}
                  onChange={(e) => setIbanOrIfsc(e.target.value)}
                  placeholder="e.g. SCBLPK0019283746192 or HDFC0001294"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-amber-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Bank account number"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Branch / SWIFT BIC Code (Optional)
                </label>
                <input
                  type="text"
                  value={branchOrSwift}
                  onChange={(e) => setBranchOrSwift(e.target.value)}
                  placeholder="e.g. SCBLUS33"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-amber-500 uppercase"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verify & Save Bank Account</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('request_payout')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: Settlement History */}
        {activeTab === 'payout_history' && (
          <div className="space-y-3">
            {userWithdrawals.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">No withdrawal records found yet.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {userWithdrawals.map((w) => (
                  <div
                    key={w.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900">
                        {w.bankDetails?.bankName || w.method || 'Bank Wire'}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          w.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : w.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {w.status}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>Account: {w.bankDetails?.ibanOrIfsc || w.accountDetails}</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        ${w.amount.toFixed(2)}
                      </span>
                    </div>

                    {w.payoutReference && (
                      <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                        Ref: {w.payoutReference}
                      </div>
                    )}

                    {/* Admin Remark / Rejection Reason Note */}
                    {w.adminRemark && (
                      <div
                        className={`p-2.5 rounded-lg border text-[11px] space-y-1 ${
                          w.status === 'approved'
                            ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                            : w.status === 'rejected'
                            ? 'bg-rose-50/90 border-rose-200 text-rose-950'
                            : 'bg-amber-50/90 border-amber-200 text-amber-950'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold">
                          {w.status === 'approved' && (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-800">Admin Approval Note:</span>
                            </>
                          )}
                          {w.status === 'rejected' && (
                            <>
                              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span className="text-rose-800">Decline Reason from Admin:</span>
                            </>
                          )}
                          {w.status === 'pending' && (
                            <>
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span className="text-amber-800">Audit Status:</span>
                            </>
                          )}
                        </div>
                        <p className="text-slate-800 font-medium pl-5 italic">"{w.adminRemark}"</p>
                        {w.processedAt && (
                          <p className="text-[10px] text-slate-500 pl-5">
                            Decided at: <span className="font-semibold text-slate-700">{w.processedAt}</span>
                          </p>
                        )}
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400">
                      Requested: {w.requestedAt}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
