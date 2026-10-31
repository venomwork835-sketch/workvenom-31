import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CheckCircle2,
  Sparkles,
  Zap,
  TrendingUp,
  Package,
  ShieldCheck,
  Crown,
  AlertCircle,
  ExternalLink,
  Wallet,
  ArrowRight,
  Clock,
} from 'lucide-react';

export const PlansModal: React.FC = () => {
  const {
    isPlansModalOpen,
    setIsPlansModalOpen,
    sellerPlans,
    currentUser,
    requestPlanPurchase,
    telegramSupportUrl,
  } = useApp();

  const [activatingLevel, setActivatingLevel] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isPlansModalOpen) return null;

  const handleActivate = (level: number) => {
    setActivatingLevel(level);
    setFeedback(null);
    const res = requestPlanPurchase(level);
    setFeedback(res);
    setActivatingLevel(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="relative px-6 py-6 sm:px-8 sm:py-7 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                E-seller Official Store Tiers
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Merchant Store Activation Plans
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl">
                Choose your store package from Plan 1 to Plan 8 (Full Store). Each tier unlocks catalog products, instant buy-back profit margins, and high priority liquidity.
              </p>
            </div>
            <button
              onClick={() => {
                setFeedback(null);
                setIsPlansModalOpen(false);
              }}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Status Bar */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/30 flex items-center justify-center text-blue-200">
                <Wallet className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <p className="text-xs text-slate-300 font-medium">Available Balance</p>
                <p className="text-lg font-bold text-white tracking-tight">
                  ${currentUser.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/30 flex items-center justify-center text-purple-200">
                <Sparkles className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <p className="text-xs text-slate-300 font-medium">Active Store Plan</p>
                <p className="text-sm font-bold text-white">
                  {currentUser.planName || `Plan ${currentUser.planLevel || 1}`}
                </p>
                {currentUser.pendingPlanLevel && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full mt-1 border border-amber-400/30">
                    <Clock className="w-3 h-3" />
                    Pending Approval: Plan {currentUser.pendingPlanLevel}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-start sm:justify-end">
              <a
                href={telegramSupportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white shadow-md transition-all"
              >
                <span>Recharge via Telegram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mx-6 mt-4 p-4 rounded-2xl text-sm flex items-start gap-3 border ${
              feedback.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
            }`}
          >
            {feedback.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 font-medium">{feedback.message}</div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sellerPlans.map((plan) => {
              const isCurrent = (currentUser.planLevel || 1) === plan.level;
              const isFullStore = plan.level === 8;
              const canAfford = currentUser.availableBalance >= plan.price;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between rounded-2xl p-5 transition-all border ${
                    isCurrent
                      ? 'border-blue-600 ring-2 ring-blue-500/40 bg-blue-50/40 dark:bg-blue-950/20 shadow-lg'
                      : isFullStore
                      ? 'border-amber-400/80 bg-gradient-to-b from-amber-500/10 to-transparent dark:from-amber-950/20 shadow-md hover:border-amber-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                  }`}
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        isFullStore
                          ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                          : isCurrent
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {plan.badge}
                    </span>
                    {isCurrent && (
                      <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Current Plan
                      </span>
                    )}
                  </div>

                  {/* Plan Name & Price */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                      {plan.name}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        ${plan.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">/ store</span>
                    </div>

                    {/* Stats Pills */}
                    <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60">
                        <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                          <Package className="w-3 h-3 text-blue-500" />
                          Products
                        </div>
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                          {plan.productCount} {plan.level === 8 ? '(Full)' : 'Items'}
                        </p>
                      </div>

                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60">
                        <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                          <TrendingUp className="w-3 h-3" />
                          Profit Yield
                        </div>
                        <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {plan.profitPercentage}%
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {plan.description}
                    </p>

                    {/* Feature list */}
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-5 pt-3">
                    {isCurrent ? (
                      <div className="w-full py-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-bold text-xs text-center border border-blue-300 dark:border-blue-700">
                        Currently Active
                      </div>
                    ) : currentUser.pendingPlanLevel === plan.level ? (
                      <div className="w-full py-2.5 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs text-center border border-amber-500/40 flex items-center justify-center gap-1.5 shadow-sm">
                        <Clock className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        <span>Pending Admin Approval</span>
                      </div>
                    ) : currentUser.pendingPlanLevel ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed opacity-60"
                      >
                        <span>Plan {currentUser.pendingPlanLevel} Under Review</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(plan.level)}
                        disabled={activatingLevel === plan.level}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                          isFullStore
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
                            : canAfford
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        {canAfford ? (
                          <>
                            <span>Request Activation (${plan.price.toLocaleString()})</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <span>Need ${(plan.price - currentUser.availableBalance).toLocaleString(undefined, { maximumFractionDigits: 0 })} More</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Store plans require one-time administrator approval. Upon approval, all allocated products automatically populate in My Products with guaranteed buy-back profit.</span>
          </div>
          <button
            onClick={() => setIsPlansModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
