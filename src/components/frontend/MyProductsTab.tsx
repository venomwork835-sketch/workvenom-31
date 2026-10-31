import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProduct } from '../../types';
import {
  Package,
  Layers,
  ShoppingBag,
  TrendingUp,
  PlusCircle,
  ExternalLink,
  Trash2,
  Check,
  Crown,
} from 'lucide-react';

export const MyProductsTab: React.FC = () => {
  const {
    userProducts,
    currentUser,
    setFrontendTab,
    setViewMode,
    products,
    addProductToMerchantStore,
    removeProductFromMerchantStore,
    setIsPlansModalOpen,
  } = useApp();

  const [selectedCatalogId, setSelectedCatalogId] = useState<string>(products[0]?.id || '');
  const [stockToAdd, setStockToAdd] = useState<number>(10);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const myItems = userProducts.filter((up: UserProduct) => up.userId === currentUser.id && up.status !== 'sold_back');
  const totalStock = myItems.reduce((acc: number, curr: UserProduct) => acc + curr.stock, 0);
  const totalSold = myItems.reduce((acc: number, curr: UserProduct) => acc + curr.unitsSold, 0);
  const totalRevenue = myItems.reduce((acc: number, curr: UserProduct) => acc + curr.revenueGenerated, 0);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatalogId) return;

    addProductToMerchantStore(selectedCatalogId, Number(stockToAdd) || 1);
    const prod = products.find((p) => p.id === selectedCatalogId);
    setSuccessToast(`Added ${stockToAdd} units of ${prod?.title || 'product'} to store!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 space-y-8">
      {/* Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Merchant Store Inventory</span>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-400/40">
              {currentUser.planName || `Plan ${currentUser.planLevel || 1}`}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {currentUser.storeName || `${currentUser.name}'s Tech Store`}
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Manage your actively stocked catalog products, review unit velocity, track revenue, and restock hardware devices directly from wholesale fulfillment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsPlansModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-2 border border-blue-400/30"
          >
            <Crown className="w-4 h-4 text-amber-300" />
            <span>⚡ Store Plans (Plan 1-8)</span>
          </button>
          <button
            onClick={() => setFrontendTab('home')}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition shadow flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Browse Master Catalog</span>
          </button>
          <button
            onClick={() => setViewMode('backend')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-amber-400" />
            <span>Merchant Control Desk</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Active Listings</div>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
            {myItems.length}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Units in Stock</div>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
            {totalStock}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Units Sold</div>
          <div className="text-2xl font-black text-emerald-600 mt-1 tabular-nums">
            {totalSold}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Cumulative Store Revenue</div>
          <div className="text-2xl font-black text-amber-600 mt-1 tabular-nums">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Quick Add Form */}
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Direct Catalog Restock</h3>
            <p className="text-xs text-slate-500">
              Select any of the 40 flagship catalog electronics to restock into your merchant store.
            </p>
          </div>
        </div>

        <form onSubmit={handleQuickAdd} className="flex flex-col md:flex-row items-center gap-3">
          <select
            value={selectedCatalogId}
            onChange={(e) => setSelectedCatalogId(e.target.value)}
            className="flex-1 w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} (${p.discountPrice.toFixed(2)}) — {p.category.toUpperCase()}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="number"
              min="1"
              max="100"
              value={stockToAdd}
              onChange={(e) => setStockToAdd(parseInt(e.target.value) || 1)}
              className="w-24 bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg text-slate-800 text-center font-semibold"
              placeholder="Qty"
            />

            <button
              type="submit"
              className="whitespace-nowrap px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition"
            >
              Restock Item
            </button>
          </div>
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Stocked Product Inventory ({myItems.length})
          </h2>
        </div>

        {myItems.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-700">No products stocked yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Use the Restock tool above or browse the 40 Catalog items on the home page to start selling.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Item Details</th>
                  <th className="py-3 px-4">Wholesale / Retail</th>
                  <th className="py-3 px-4 text-center">Available Stock</th>
                  <th className="py-3 px-4 text-center">Units Sold</th>
                  <th className="py-3 px-4 text-right">Revenue Generated</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myItems.map((item: UserProduct) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-contain rounded bg-slate-100 border border-slate-200 p-1 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate max-w-xs">
                            {item.product.title}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Category: {item.product.category} · Added: {item.addedAt}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900 tabular-nums">
                        ${item.product.discountPrice.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-400 line-through tabular-nums">
                        ${item.product.originalPrice.toFixed(2)}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-mono font-semibold text-slate-800 tabular-nums">
                        {item.stock} units
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-mono font-semibold text-emerald-600 tabular-nums">
                        {item.unitsSold}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        ${item.revenueGenerated.toFixed(2)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => removeProductFromMerchantStore(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                        title="Remove product from store"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
