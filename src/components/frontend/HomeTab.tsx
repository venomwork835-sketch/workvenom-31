import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory } from '../../types';
import {
  Star,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Check,
  Truck,
  RotateCcw,
  Award,
  Layers,
  Building,
  AlertCircle,
  X,
  CreditCard,
  Zap,
  Flame,
  Crown,
  Clock,
  Sparkles,
} from 'lucide-react';

interface HomeTabProps {
  searchQuery: string;
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  searchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  const {
    products = [],
    topSellers = [],
    addToCart,
    setIsCartOpen,
    currentUser,
    submitProductBankPayment,
    buyProductWithBalance,
    setViewMode,
    setIsPlansModalOpen,
  } = useApp();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [bankPurchaseProduct, setBankPurchaseProduct] = useState<Product | null>(null);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  const [buyErrorNotice, setBuyErrorNotice] = useState<string | null>(null);

  // Bank Form State
  const [senderBankName, setSenderBankName] = useState('Standard Chartered Global');
  const [senderAccountNumber, setSenderAccountNumber] = useState(
    currentUser?.bankAccounts?.[0]?.accountNumber || currentUser?.bankDetails?.accountNumber || '019283746192'
  );
  const [senderAccountHolder, setSenderAccountHolder] = useState(currentUser?.name || 'Member');
  const [transactionReference, setTransactionReference] = useState('WIRE-TX-' + Math.floor(100000 + Math.random() * 900000));
  const [bankFeedback, setBankFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const filteredProducts = (products || []).filter((p) => {
    if (!p) return false;
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const query = (searchQuery || '').toLowerCase();
    const matchesSearch =
      (p.title || '').toLowerCase().includes(query) ||
      (p.category || '').toLowerCase().includes(query) ||
      (p.specs || []).some((s) => (s || '').toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const categories: { key: ProductCategory; label: string }[] = [
    { key: 'all', label: `All Products (${products.length})` },
    { key: 'mobiles', label: 'Smartphones' },
    { key: 'laptops', label: 'Laptops' },
    { key: 'electronics', label: 'Projectors & Tech' },
    { key: 'audio', label: 'Speakers & Earbuds' },
    { key: 'accessories', label: 'Fast Chargers' },
    { key: 'apparel', label: 'Winter Apparel & Jackets' },
    { key: 'footwear', label: 'Shoes & Footwear' },
    { key: 'wearables', label: 'Wearables' },
  ];

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(product, 1);
    setAddedNotice(`Added "${product.title}" to cart!`);
    setTimeout(() => setAddedNotice(null), 2500);
  };

  const handleBuyNowWithBalance = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const res = buyProductWithBalance(product, 1);
    if (res.success) {
      setAddedNotice(res.message);
      setTimeout(() => setAddedNotice(null), 3500);
    } else {
      setBuyErrorNotice(res.message);
      setTimeout(() => setBuyErrorNotice(null), 4500);
    }
  };

  const handleOpenBankPurchase = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBankPurchaseProduct(product);
    setBankFeedback(null);
    setTransactionReference('WIRE-TX-' + Math.floor(100000 + Math.random() * 900000));
  };

  const handleBankPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankPurchaseProduct) return;

    const res = submitProductBankPayment(
      bankPurchaseProduct.id,
      senderBankName,
      senderAccountNumber,
      senderAccountHolder,
      transactionReference
    );

    setBankFeedback(res);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Toast Alert */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{addedNotice}</span>
        </div>
      )}

      {buyErrorNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl border border-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-300" />
          <span>{buyErrorNotice}</span>
        </div>
      )}

      {/* Hero Campaign Section (1 bold focal point) */}
      {/* Hero Campaign Section - FLASH 20% OFF SALE */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-8 md:p-12 border border-amber-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase bg-amber-500 text-slate-950 shadow-md">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>FLASH 20% OFF SALE · LIVE STORE PRODUCTS</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            ⚡ FLASH 20% OFF SALE
            <span className="block text-2xl md:text-3xl font-extrabold text-amber-400 mt-1">
              Live Tech, Phones, Laptops & Wholesale Catalog
            </span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
            All 58 wholesale catalog products are currently running on direct 20% flash discounts. Purchase with account balance or direct bank wire. Once admin executes buy back, total amount + your guaranteed net profit is credited instantly!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('catalog-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition shadow-lg shadow-amber-400/20 flex items-center gap-2"
            >
              <span>Explore All {products.length} Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlansModalOpen(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center gap-2 border border-blue-400/30"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>⚡ Store Plans (Plan 1-8)</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition border border-slate-700 flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Review Cart</span>
            </button>
          </div>
        </div>

        {/* Value Props Row */}
        <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Official 2-Year Global Warranty</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Fast Interbank Settlement & Wire Payouts</span>
          </div>
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Guaranteed Profit on Admin Buy Back</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Top Rated Merchant Community</span>
          </div>
        </div>
      </section>

      {/* Store Activation Plans Quick Card */}
      <section className="rounded-2xl p-6 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400">
            <Crown className="w-4 h-4" />
            <span>MERCHANT LEVEL & STORE PACKAGES</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white">
            Activate Store Plans (Plan 1 to Plan 8 - Full Store)
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Plan 1 starts at $200 (4 products) up to Plan 8 ($25,000 for Full 58-product store). Select your tier according to your capital to unlock products and maximum profit margins!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsPlansModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg transition flex items-center gap-2"
          >
            <span>View All 8 Plans</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Live Hot Selling Flash Deals Strip with Real Time Countdown */}
      <section className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-amber-400/80 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-md tracking-wider uppercase flex items-center gap-1.5 shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-current text-slate-950" />
              FLASH 20% OFF LIVE SALE
            </span>
            <span className="text-sm font-bold text-slate-900">
              Live Selling Products with Instant 20% Price Cut
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-800 bg-amber-200/80 px-3 py-1 rounded-lg border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
            <span>Flash Resets In: 05:42:19</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {products
            .filter((p) => p.isTrending)
            .slice(0, 6)
            .map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedProduct(item)}
                className="bg-white p-3.5 rounded-xl border border-amber-200 hover:border-amber-400 hover:shadow-lg transition cursor-pointer flex flex-col justify-between space-y-2.5 group"
              >
                <div className="relative aspect-square bg-slate-50 rounded-lg p-2 flex items-center justify-center overflow-hidden">
                  <span className="absolute top-1.5 right-1.5 bg-rose-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow">
                    -20%
                  </span>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-200"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {item.title}
                  </h4>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-sm font-black text-amber-600 font-mono tabular-nums">
                      ${item.discountPrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through tabular-nums">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <button
                    onClick={(e) => handleBuyNowWithBalance(item, e)}
                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span>Buy with Balance</span>
                  </button>
                  <button
                    onClick={(e) => handleOpenBankPurchase(item, e)}
                    className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1"
                  >
                    <Building className="w-3 h-3 text-slate-950" />
                    <span>Buy via Bank</span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Catalog & Filter Navigation */}
      <section id="catalog-grid" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Master Products Catalog ({filteredProducts.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              All products are displayed on this tab. Click &ldquo;Buy via Bank&rdquo; to submit bank payment for admin verification.
            </p>
          </div>

          {/* Interactive filter tabs (clean segmented controls) */}
          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-200/70 rounded-lg">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedCategory === cat.key
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500 font-medium">
              No products found matching &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-3 text-xs text-amber-600 font-semibold hover:underline"
            >
              Reset Category Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition flex flex-col cursor-pointer overflow-hidden"
                >
                  {/* Image Container with neutral solid backdrop */}
                  <div className="relative aspect-4/3 bg-slate-100 overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded shadow-xs">
                      20% OFF
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="uppercase font-semibold tracking-wider text-slate-400">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 text-amber-600 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{product.rating}</span>
                          <span className="text-slate-400">({product.reviewCount})</span>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition line-clamp-2">
                        {product.title}
                      </h3>

                      {/* Specs bullets */}
                      <ul className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                        {(product.specs || []).slice(0, 2).map((spec, i) => (
                          <li key={i} className="truncate">
                            · {spec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price and Actions */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-base font-extrabold text-slate-900 tabular-nums">
                            ${product.discountPrice.toFixed(2)}
                          </span>
                          <span className="text-xs text-slate-400 line-through ml-2 tabular-nums">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-emerald-600">
                          Save ${(product.originalPrice - product.discountPrice).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 pt-1">
                        <button
                          onClick={(e) => handleBuyNowWithBalance(product, e)}
                          className="w-full py-1.5 px-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-md transition flex items-center justify-center gap-1.5 shadow-xs"
                          title="Instant buy: deducts from account balance and adds to My Products"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Buy Now (-${product.discountPrice.toFixed(2)})</span>
                        </button>

                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            className="py-1 px-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold rounded transition flex items-center justify-center gap-1"
                          >
                            <ShoppingBag className="w-3 h-3 text-amber-400" />
                            <span>Cart</span>
                          </button>

                          <button
                            onClick={(e) => handleOpenBankPurchase(product, e)}
                            className="py-1 px-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded transition flex items-center justify-center gap-1 border border-slate-200"
                          >
                            <Building className="w-3 h-3 text-slate-500" />
                            <span>Wire</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bank Payment Purchase Modal (Awaiting Backend Admin Approval) */}
      {bankPurchaseProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative space-y-5 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Bank Wire Payment Submission
                </h3>
              </div>
              <button
                onClick={() => setBankPurchaseProduct(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Summary */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={bankPurchaseProduct.imageUrl}
                alt={bankPurchaseProduct.title}
                referrerPolicy="no-referrer"
                className="w-14 h-14 object-contain rounded bg-white border border-slate-200 p-1 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {bankPurchaseProduct.title}
                </h4>
                <p className="text-xs font-bold text-amber-600 tabular-nums">
                  Total Payable: ${bankPurchaseProduct.discountPrice.toFixed(2)} USD
                </p>
                <p className="text-[10px] text-slate-500">20% Promotional Discount Applied</p>
              </div>
            </div>

            {/* Admin Verification Notice */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Backend Admin Approval Required</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Enter your payment transfer details. Once verified by the administration desk in the backend, this product will be automatically delivered and added to your <strong>My Products</strong> store inventory!
              </p>
            </div>

            {bankFeedback ? (
              <div
                className={`p-4 rounded-xl text-xs space-y-2 text-center ${
                  bankFeedback.success
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm">Payment Submitted!</h4>
                <p>{bankFeedback.message}</p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setBankPurchaseProduct(null);
                      setViewMode('backend');
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition"
                  >
                    View in Backend Approvals Desk
                  </button>
                  <button
                    onClick={() => setBankPurchaseProduct(null)}
                    className="px-3 py-1.5 bg-slate-200 text-slate-800 font-semibold rounded text-xs transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBankPaymentSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Which Bank are you paying from?
                  </label>
                  <input
                    type="text"
                    required
                    value={senderBankName}
                    onChange={(e) => setSenderBankName(e.target.value)}
                    placeholder="e.g. Standard Chartered, Chase Bank, HSBC, HDFC, Habib Bank"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sender Bank Account Number
                  </label>
                  <input
                    type="text"
                    required
                    value={senderAccountNumber}
                    onChange={(e) => setSenderAccountNumber(e.target.value)}
                    placeholder="Account number used for transfer"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sender Account Holder Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={senderAccountHolder}
                    onChange={(e) => setSenderAccountHolder(e.target.value)}
                    placeholder="Full name as on bank statement"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Wire / Slip Transaction Reference ID
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionReference}
                    onChange={(e) => setTransactionReference(e.target.value)}
                    placeholder="e.g. WIRE-SCB-9982310"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-amber-500 uppercase"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow"
                >
                  <Building className="w-4 h-4 text-amber-400" />
                  <span>Submit Payment for Admin Approval (${bankPurchaseProduct.discountPrice.toFixed(2)})</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="aspect-square bg-slate-100 rounded-xl p-4 flex items-center justify-center">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.title}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="space-y-4">
                <div className="text-xs uppercase font-semibold text-amber-600 tracking-wider">
                  {selectedProduct.category}
                </div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900">
                  {selectedProduct.title}
                </h2>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1 text-amber-600 font-semibold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{selectedProduct.rating}</span>
                  </div>
                  <span>·</span>
                  <span>{selectedProduct.reviewCount} customer reviews</span>
                  <span>·</span>
                  <span className="text-emerald-600 font-medium">In Stock ({selectedProduct.stock} units)</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg flex items-baseline gap-3">
                  <span className="text-2xl font-black text-slate-900 tabular-nums">
                    ${selectedProduct.discountPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-slate-400 line-through tabular-nums">
                    ${selectedProduct.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    20% Discount
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Key Specifications</h4>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {(selectedProduct.specs || []).map((s, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => {
                      const p = selectedProduct;
                      setSelectedProduct(null);
                      handleBuyNowWithBalance(p);
                    }}
                    className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition flex items-center justify-center gap-2 shadow"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Buy with Balance (-${selectedProduct.discountPrice.toFixed(2)})</span>
                  </button>

                  <button
                    onClick={() => {
                      const p = selectedProduct;
                      setSelectedProduct(null);
                      handleOpenBankPurchase(p);
                    }}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-200"
                  >
                    <Building className="w-4 h-4 text-slate-600" />
                    <span>Bank Wire</span>
                  </button>

                  <button
                    onClick={() => {
                      addToCart(selectedProduct, 1);
                      setIsCartOpen(true);
                      setSelectedProduct(null);
                    }}
                    className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Verified Sellers Leaderboard (Quantitative Rigor) */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Top 10 Verified Global Sellers</span>
            </h2>
            <p className="text-xs text-slate-500">
              Community benchmark of merchants ranked by sales volume, verified orders, and customer satisfaction.
            </p>
          </div>
          <span className="text-xs text-slate-400">Audited Interbank Performance</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                <th className="pb-3 pl-2">Rank</th>
                <th className="pb-3">Merchant / Store</th>
                <th className="pb-3">Seller Tier</th>
                <th className="pb-3 text-right">Orders Fulfilled</th>
                <th className="pb-3 text-right">Positive Rating</th>
                <th className="pb-3 pr-2 text-right">Cumulative Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(topSellers || []).map((seller) => (
                <tr key={seller.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 pl-2 font-mono font-bold text-slate-800">
                    #{seller.rank}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={seller.avatar}
                        alt={seller.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{seller.name}</div>
                        <div className="text-[11px] text-slate-500">{seller.storeName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {seller.sellerLevel}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono tabular-nums text-slate-700">
                    {seller.totalOrders.toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-mono tabular-nums text-emerald-600 font-semibold">
                    {seller.positiveRating}%
                  </td>
                  <td className="py-3 pr-2 text-right font-mono font-bold text-slate-900 tabular-nums">
                    ${seller.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
