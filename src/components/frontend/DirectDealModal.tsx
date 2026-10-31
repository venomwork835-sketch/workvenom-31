import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ShoppingBag,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Zap,
  ArrowRight,
  Wallet,
  Clock,
} from 'lucide-react';

export const DirectDealModal: React.FC = () => {
  const {
    sharedDealModalOpen,
    setSharedDealModalOpen,
    sharedDealData,
    currentUser,
    buySharedDealWithBalance,
    setFrontendTab,
  } = useApp();

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!sharedDealModalOpen || !sharedDealData) return null;

  const { product, customPrice, customProfit, dealTitle } = sharedDealData;
  const hasEnoughBalance = currentUser.availableBalance >= customPrice;

  const handleBuy = () => {
    setIsSubmitting(true);
    setFeedback(null);

    const result = buySharedDealWithBalance(product, customPrice, customProfit);
    setIsSubmitting(false);

    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
      setTimeout(() => {
        setSharedDealModalOpen(false);
        setFrontendTab('orders');
      }, 2200);
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-black/25 flex items-center justify-center text-amber-200 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest bg-black/30 px-2 py-0.5 rounded text-amber-200">
                DIRECT MERCHANT DEAL
              </span>
              <h3 className="text-base font-black tracking-tight mt-0.5">
                {dealTitle || 'Exclusive Shared Wholesale Offer'}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setSharedDealModalOpen(false)}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-black/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-slate-200 text-sm">
          {/* Product Showcase Card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex gap-4 items-center">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-24 h-24 object-contain rounded-xl bg-white p-2 shrink-0 border border-slate-700"
            />
            <div className="space-y-1 min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {product.category}
              </span>
              <h4 className="font-bold text-white text-base truncate">{product.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2">
                {product.description || 'Exclusive assigned wholesale inventory item.'}
              </p>
            </div>
          </div>

          {/* Pricing & Guaranteed Profit Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Special Buy Price
              </span>
              <div className="text-2xl font-black text-amber-400 font-mono">
                ${customPrice.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500 line-through">
                Reg: ${(customPrice * 1.25).toFixed(2)}
              </span>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3.5 space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Guaranteed Profit
              </span>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                +${customProfit.toFixed(2)}
              </div>
              <span className="text-[10px] text-emerald-300 font-semibold">
                Credited upon Backend fulfillment
              </span>
            </div>
          </div>

          {/* Instructions / Specs */}
          {(product.specs?.length > 0 || product.instructions) && (
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Deal Instructions & Specifications
              </span>
              {product.instructions && (
                <p className="text-xs text-amber-300 font-medium bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                  {product.instructions}
                </p>
              )}
              {product.specs?.length > 0 && (
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  {product.specs.map((s, idx) => (
                    <li key={idx} className="truncate">{s}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Member Balance Pill */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Your Available Balance:</span>
              <strong className="text-emerald-400 font-mono text-sm">
                ${currentUser.availableBalance.toFixed(2)}
              </strong>
            </div>
            {!hasEnoughBalance && (
              <span className="text-[11px] font-bold text-rose-400">
                Need ${(customPrice - currentUser.availableBalance).toFixed(2)} more
              </span>
            )}
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`p-3.5 rounded-2xl border flex items-center gap-2.5 text-xs font-bold ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setSharedDealModalOpen(false)}
            className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleBuy}
            disabled={!hasEnoughBalance || isSubmitting}
            className="flex-1 max-w-xs py-3 px-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{hasEnoughBalance ? 'BUY NOW & SUBMIT ORDER' : 'INSUFFICIENT BALANCE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
