import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeTab } from './components/frontend/HomeTab';
import { MyProductsTab } from './components/frontend/MyProductsTab';
import { SellProductsTab } from './components/frontend/SellProductsTab';
import { OrdersTab } from './components/frontend/OrdersTab';
import { ProfileTab } from './components/frontend/ProfileTab';
import { BottomNav } from './components/frontend/BottomNav';
import { CartDrawer } from './components/frontend/CartDrawer';
import { AuthModal } from './components/frontend/AuthModal';
import { WithdrawModal } from './components/frontend/WithdrawModal';
import { MessagesModal } from './components/frontend/MessagesModal';
import { CustomerServiceChat } from './components/frontend/CustomerServiceChat';
import { PlansModal } from './components/frontend/PlansModal';
import { SupabaseSettingsModal } from './components/frontend/SupabaseSettingsModal';
import { AdminPortal } from './components/backend/AdminPortal';
import { ProductCategory } from './types';

function EbuyApp() {
  const { viewMode, frontendTab, isSupabaseModalOpen, setIsSupabaseModalOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Body */}
      <main className="flex-1">
        {viewMode === 'backend' ? (
          <AdminPortal />
        ) : (
          <div className="animate-fadeIn">
            {frontendTab === 'home' && (
              <HomeTab
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            )}
            {frontendTab === 'my_products' && <MyProductsTab />}
            {frontendTab === 'sell_products' && <SellProductsTab />}
            {frontendTab === 'orders' && <OrdersTab />}
            {frontendTab === 'profile' && <ProfileTab />}

            {/* Bottom 4-tab navigation bar for mobile view */}
            <BottomNav />
          </div>
        )}
      </main>

      {/* Interactive Global Modals */}
      <CartDrawer />
      <AuthModal />
      <WithdrawModal />
      <MessagesModal />
      <CustomerServiceChat />
      <PlansModal />
      <SupabaseSettingsModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <EbuyApp />
    </AppProvider>
  );
}
