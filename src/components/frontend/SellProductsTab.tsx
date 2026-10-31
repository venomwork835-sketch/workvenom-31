import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserProduct } from '../../types';
import {
  TrendingUp,
  CheckCircle2,
  DollarSign,
  Package,
  Layers,
  ArrowUpRight,
  ExternalLink,
  ShoppingBag,
  Clock,
  Sparkles,
} from 'lucide-react';

export const SellProductsTab: React.FC = () => {
  const {
    userProducts,
    currentUser,
    setFrontendTab,
    setViewMode,
    orders,
  } = useApp();

  // Sold back products for this user
  const soldBackItems = userProducts.filter(
    (up: UserProduct) => up.userId === currentUser.id && up.status === 'sold_back'
  );

  // Active items in merchant store
  const activeItems = userProducts.filter(
    (up: UserProduct) => up.userId === currentUser.id && up.status !== 'sold_back'
  );

  // Completed orders
  const completedOrders = orders.filter(
    (o) => o.userId === currentUser.id && (o.status === 'completed' || o.status === 'delivered')
  );

  const totalBuyBackRevenue = soldBackItems.reduce(
    (acc, curr) => acc + (curr.buyBackPrice || curr.product.discountPrice * 1.2),
    0
  );

  const totalBuyBackProfit = soldBackItems.reduce(
    (acc, curr) => acc + (curr.buyBackProfit || curr.product.discountPrice * 0.2),
    0
  );

  const totalCommissionOrders = completedOrders.reduce(
    (acc, curr) => acc + curr.commissionEarned,
    0
  );

  const totalCumulativeEarnings = totalBuyBackProfit + totalCommissionOrders;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 md:p-8 border border-slate-700/80 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Sell Products & Completed Buy Back Settlement</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Sold Products & Profit Realization
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              When administration buys back your products from the Backend Desk, your capital plus verified profit are credited instantly to your available account balance and archived here.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFrontendTab('my_products')}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition shadow flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>View My Active Products ({activeItems.length})</span>
            </button>

            <button
              onClick={() => setFrontendTab('home')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Buy More Products</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Sold Back Items</div>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
            {soldBackItems.length}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">Settled by Admin</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Buy Back Volume</div>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
            ${totalBuyBackRevenue.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Capital + Profit Deposited</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Net Profit Earned</div>
          <div className="text-2xl font-black text-emerald-600 mt-1 tabular-nums">
            +${totalBuyBackProfit.toFixed(2)}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">Credited to Balance</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Available Account Balance</div>
          <div className="text-2xl font-black text-amber-600 mt-1 tabular-nums">
            ${currentUser.availableBalance.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Ready for Withdrawal / Re-buy</div>
        </div>
      </div>

      {/* Sold Back Products List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Admin Buy Back Settlement History (واپس خریدے گئے پراڈکٹس اور منافع)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Items purchased by administration with exact credited settlement and net profit
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            {soldBackItems.length} Settled Items
          </span>
        </div>

        {soldBackItems.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
              <Package className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Buy Back Settlements Yet</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Buy products from the Catalog using your account balance. Once purchased, they will appear in your "My Products" store, where Backend Administration can initiate Buy Back and credit your profit here!
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setFrontendTab('home')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow"
              >
                Browse Catalog & Buy Products
              </button>
              <button
                onClick={() => setFrontendTab('my_products')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
              >
                Check My Products ({activeItems.length})
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {soldBackItems.map((item) => {
              const cost = item.purchasePrice || item.product.discountPrice;
              const buyBack = item.buyBackPrice || cost * 1.2;
              const profit = item.buyBackProfit || buyBack - cost;

              return (
                <div
                  key={item.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="w-16 h-16 object-contain rounded-xl bg-slate-50 border border-slate-200 p-1.5 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {item.product.category}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Settled on {item.soldBackAt || item.listedDate}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {item.product.title}
                      </h4>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-slate-500">
                          Original Cost: <span className="font-mono font-semibold text-slate-800">${cost.toFixed(2)}</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">
                          Units: <span className="font-semibold text-slate-800">{item.stock}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 sm:text-right shrink-0">
                    <div>
                      <div className="text-[11px] text-slate-500">Settlement Credited</div>
                      <div className="text-lg font-black text-slate-900 font-mono tabular-nums">
                        ${buyBack.toFixed(2)}
                      </div>
                      <div className="text-xs font-bold text-emerald-600 font-mono tabular-nums">
                        +${profit.toFixed(2)} Net Profit
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px] px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Added to Balance</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ID: {item.id}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
