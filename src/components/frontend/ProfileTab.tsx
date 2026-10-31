import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  User as UserIcon,
  Mail,
  Wallet,
  Lock,
  ArrowUpRight,
  MessageSquare,
  Headphones,
  Award,
  ShieldCheck,
  ChevronRight,
  LogOut,
  UserCheck,
  CreditCard,
  Phone,
  Calendar,
  Sparkles,
  Copy,
  Check,
  Share2,
  Crown,
  Package,
  Zap,
  Clock,
} from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const {
    currentUser,
    setIsWithdrawModalOpen,
    setIsMessagesModalOpen,
    setIsCustomerServiceOpen,
    setIsAuthModalOpen,
    unreadNotificationCount,
    unreadChatCount,
    setViewMode,
    setIsPlansModalOpen,
  } = useApp();

  const [copiedReferral, setCopiedReferral] = React.useState(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(currentUser.referralCode || 'REF-EBUY99');
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  // Helper for credit score color
  const getCreditScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-50 border-emerald-200';
    if (score >= 75) return 'text-amber-500 bg-amber-50 border-amber-200';
    return 'text-rose-500 bg-rose-50 border-rose-200';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* 1. Profile Header Card: Name, Email, Avatar, VIP Level */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 text-white shadow-xl border border-slate-700/80 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                {currentUser.vipLevel}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{currentUser.name}</h1>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Phone className="w-3.5 h-3.5" />
                <span>{currentUser.phone}</span>
                <span className="text-slate-600">•</span>
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {currentUser.joinedDate}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="self-start sm:self-auto text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 text-slate-200"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" /> Switch Account
          </button>
        </div>
      </div>

      {/* 2. Financial Overview Cards: Available Balance, Freeze Balance & Credit Score */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Available Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Available Balance
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              ${currentUser.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              Ready for Withdrawal / Orders
            </p>
          </div>
        </div>

        {/* Freeze Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Freeze Balance
            </span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Lock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-indigo-900 tracking-tight">
              ${currentUser.freezeBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              In Order / Pending Withdraw
            </p>
          </div>
        </div>

        {/* Credit Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Credit Score
            </span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {currentUser.creditScore}%
              </div>
              <p className="text-[11px] text-amber-600 font-medium mt-0.5">
                {currentUser.creditScore >= 90 ? 'Grade A (Excellent)' : 'Grade B (Standard)'}
              </p>
            </div>
            <div className="w-12 bg-slate-100 rounded-full h-2 overflow-hidden self-center">
              <div
                className={`h-full rounded-full ${
                  currentUser.creditScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${currentUser.creditScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral / Invitation Code Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 rounded-2xl border border-amber-300/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">My Referral / Invitation Code</span>
              {currentUser.referredBy && (
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  Referred by: <strong className="text-amber-700">{currentUser.referredBy}</strong>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-600">Share your referral code to invite members to E-seller</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-white border border-amber-300 px-3 py-1.5 rounded-xl font-mono text-xs font-black text-slate-900 tracking-wider shadow-inner">
            {currentUser.referralCode || 'REF-ESELLER99'}
          </div>
          <button
            onClick={handleCopyCode}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 shadow-sm"
          >
            {copiedReferral ? (
              <>
                <Check className="w-3.5 h-3.5 text-slate-950" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Store Activation Plan Card (Plan 1 to Plan 8 - Full Store) */}
      <div className="bg-gradient-to-r from-blue-900/90 via-indigo-900 to-slate-900 rounded-3xl p-5 text-white shadow-xl border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/30 shadow-md shrink-0">
            <Crown className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Active Store Tier
              </span>
              <h3 className="text-base font-black text-white">
                {currentUser.planName || `Plan ${currentUser.planLevel || 1} - Starter Store`}
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Tier {currentUser.planLevel || 1} unlocks wholesale inventory with verified backend buy-back profit.
            </p>
            {currentUser.pendingPlanLevel && (
              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-1.5">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Pending Admin Approval: Plan {currentUser.pendingPlanLevel}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsPlansModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition flex items-center justify-center gap-2 shrink-0"
        >
          <span>⚡ Upgrade Store (Plan 1-8)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3. The Primary Requested Action Options in Profile */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-2 space-y-1">
        {/* Option: Store Plans */}
        <button
          onClick={() => setIsPlansModalOpen(true)}
          className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition shadow-sm border border-blue-100">
              <Crown className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition">
                  Store Activation Plans
                </h3>
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Plan 1 - 8
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Starter ($200, 4 products) up to Plan 8 ($25,000 Full Store)
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition" />
        </button>

        <div className="border-t border-slate-100 mx-3"></div>
        {/* Option 1: Withdraw */}
        <button
          onClick={() => setIsWithdrawModalOpen(true)}
          className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition shadow-sm border border-emerald-100">
              <ArrowUpRight className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition">
                Withdraw
              </h3>
              <p className="text-xs text-slate-500">
                Cash out available balance to USDT TRC20, Bank Wire or PayPal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-600 hidden sm:inline">
              Available: ${currentUser.availableBalance.toFixed(2)}
            </span>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition" />
          </div>
        </button>

        <div className="border-t border-slate-100 mx-3"></div>

        {/* Option 2: Messages */}
        <button
          onClick={() => setIsMessagesModalOpen(true)}
          className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition shadow-sm border border-amber-100">
              <MessageSquare className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-700 transition">
                  Messages
                </h3>
                {unreadNotificationCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {unreadNotificationCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Order updates, credit score notices & financial alerts
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition" />
        </button>

        <div className="border-t border-slate-100 mx-3"></div>

        {/* Option 3: Chat with Customer Service */}
        <button
          onClick={() => setIsCustomerServiceOpen(true)}
          className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition shadow-sm border border-indigo-100">
              <Headphones className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-700 transition">
                  Chat with Customer Service
                </h3>
                {unreadChatCount > 0 && (
                  <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {unreadChatCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                24/7 dedicated online live help desk for inquiries & order assistance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online
            </span>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition" />
          </div>
        </button>
      </div>

      {/* Admin Quick Switch & Support Note */}
      <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Want to test balance injection or approve this user's withdrawal?
          </span>
        </div>
        <button
          onClick={() => setViewMode('backend')}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-xl transition shadow-sm whitespace-nowrap"
        >
          Open Backend Control
        </button>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={() => setIsAuthModalOpen(true)}
        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl text-xs transition flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" /> Switch or Sign in Another Account
      </button>
    </div>
  );
};
