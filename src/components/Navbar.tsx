import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Shield,
  Search,
  ArrowRightLeft,
  Headphones,
  SlidersHorizontal,
  Bell,
  LogIn,
  Wallet,
  Send,
  Database,
} from 'lucide-react';
import { ProductCategory } from '../types';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  const {
    viewMode,
    setViewMode,
    frontendTab,
    setFrontendTab,
    cartCount,
    setIsCartOpen,
    currentUser,
    setIsCustomerServiceOpen,
    setIsAuthModalOpen,
    setIsMessagesModalOpen,
    unreadNotificationCount,
    telegramSupportUrl,
    pendingWithdrawalsCount,
    pendingOrdersCount,
    setIsPlansModalOpen,
    setIsSupabaseModalOpen,
    isSupabaseConfigured,
  } = useApp();

  const categories: { label: string; value: ProductCategory }[] = [
    { label: 'All Catalog', value: 'all' },
    { label: 'Smartphones', value: 'mobiles' },
    { label: 'Laptops', value: 'laptops' },
    { label: 'Projectors & Electronics', value: 'electronics' },
    { label: 'Audio, Speakers & Earbuds', value: 'audio' },
    { label: 'Wearables', value: 'wearables' },
    { label: 'Fast Chargers & Gear', value: 'accessories' },
    { label: 'Winter Apparel & Jackets', value: 'apparel' },
    { label: 'Footwear & Shoes', value: 'footwear' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800 text-slate-100 shadow-xl">
      {/* Top Banner: Authentic promotional notice & mode toggle */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 px-4 py-2 text-xs text-white">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wide uppercase bg-black/30 px-2 py-0.5 rounded text-[10px]">⚡ FLASH 20% OFF</span>
            <span className="font-medium">Live wholesale discount on all products. Buy back with instant account profit!</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlansModalOpen(true)}
              className="bg-amber-950/80 hover:bg-black text-amber-200 font-bold px-3 py-1 rounded-lg border border-amber-400/50 text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <span>⚡ Store Plans (Plan 1-8)</span>
            </button>

            <button
              onClick={() => setIsCustomerServiceOpen(true)}
              className="hover:underline flex items-center gap-1.5 font-semibold text-amber-100 bg-amber-900/60 px-2.5 py-1 rounded-lg border border-amber-300/40 text-[11px] transition hover:bg-amber-900/80"
            >
              <Send className="w-3 h-3 text-sky-300" />
              <span>Telegram Support</span>
            </button>

            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="flex items-center gap-1.5 font-semibold text-emerald-200 bg-emerald-950/70 hover:bg-emerald-900/90 px-2.5 py-1 rounded-lg border border-emerald-500/40 text-[11px] transition shadow-sm"
              title="Configure Supabase Cloud Database"
            >
              <Database className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">Supabase</span>
              <span>DB</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSupabaseConfigured ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'
                }`}
              ></span>
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'frontend' ? 'backend' : 'frontend')}
              className="bg-slate-900/90 hover:bg-slate-900 text-white font-medium text-[11px] px-3 py-1 rounded-lg transition flex items-center gap-1.5 border border-white/20"
            >
              <ArrowRightLeft className="w-3 h-3 text-amber-400" />
              {viewMode === 'frontend' ? 'Switch to Backend Admin' : 'Return to Storefront'}
              {(pendingOrdersCount > 0 || pendingWithdrawalsCount > 0) && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Enlarged with Prominent E-seller Brand */}
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-5 flex items-center justify-between gap-6">
        {/* Brand: E-seller */}
        <button
          onClick={() => {
            setViewMode('frontend');
            setFrontendTab('home');
          }}
          className="group text-left shrink-0 flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg ring-2 ring-amber-400/30 group-hover:scale-105 transition-transform">
            E
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
              <span>E-seller</span>
              <span className="text-amber-400 text-3xl leading-none">.</span>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-amber-400/90 -mt-1">
              Wholesale & Merchant Desk
            </p>
          </div>
        </button>

        {/* Search Bar in Header */}
        <div className="hidden md:flex flex-1 max-w-xl items-center relative">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search smartphones, laptops, audio gear, accessories..."
              className="w-full bg-slate-900 border border-slate-700 text-sm text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-500 transition placeholder:text-slate-500 shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-300">
          <button
            onClick={() => {
              setViewMode('frontend');
              setFrontendTab('home');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              viewMode === 'frontend' && frontendTab === 'home'
                ? 'text-amber-400 font-bold'
                : 'hover:text-white'
            }`}
          >
            Catalog
          </button>

          <button
            onClick={() => {
              setViewMode('frontend');
              setFrontendTab('my_products');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              viewMode === 'frontend' && frontendTab === 'my_products'
                ? 'text-amber-400 font-bold'
                : 'hover:text-white'
            }`}
          >
            My Products
          </button>

          <button
            onClick={() => {
              setViewMode('frontend');
              setFrontendTab('sell_products');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              viewMode === 'frontend' && frontendTab === 'sell_products'
                ? 'text-amber-400 font-bold'
                : 'hover:text-white'
            }`}
          >
            Sell Products
          </button>

          <button
            onClick={() => setIsPlansModalOpen(true)}
            className="whitespace-nowrap shrink-0 text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
          >
            <span>Store Plans</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/40">1-8</span>
          </button>

          <button
            onClick={() => {
              setViewMode('frontend');
              setFrontendTab('profile');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              viewMode === 'frontend' && frontendTab === 'profile'
                ? 'text-amber-400 font-bold'
                : 'hover:text-white'
            }`}
          >
            Profile
          </button>
        </nav>


        {/* Zone 3: Primary Action (Balance, Notifications, Login/Register & Cart) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Member Balance */}
          <button
            onClick={() => {
              setViewMode('frontend');
              setFrontendTab('profile');
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500 text-xs text-white transition"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono font-bold tabular-nums text-emerald-400">
              ${currentUser.availableBalance.toFixed(2)}
            </span>
          </button>

          {/* System Notifications Bell */}
          <button
            onClick={() => setIsMessagesModalOpen(true)}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="System Notifications"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            )}
          </button>

          {/* Login / Register with Referral Code Button */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition whitespace-nowrap"
          >
            <LogIn className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
            <span className="text-[10px] text-amber-400 font-mono hidden md:inline">({currentUser.referralCode})</span>
          </button>

          {/* Cart Drawer */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950 text-amber-400">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Segmented Strip */}
      <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 py-2 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
