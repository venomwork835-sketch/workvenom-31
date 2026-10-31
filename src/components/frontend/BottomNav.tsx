import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Layers, ShoppingBag, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { frontendTab, setFrontendTab, orders, userProducts, currentUser } = useApp();

  const myItemsCount = userProducts.filter((up) => up.userId === currentUser.id).length;
  const userOrdersCount = orders.filter((o) => o.userId === currentUser.id).length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg md:hidden">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        {/* Tab 1: Home */}
        <button
          onClick={() => setFrontendTab('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            frontendTab === 'home' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1">Catalog</span>
        </button>

        {/* Tab 2: My Products */}
        <button
          onClick={() => setFrontendTab('my_products')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition relative ${
            frontendTab === 'my_products' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="relative">
            <Layers className="w-5 h-5" />
            {myItemsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 text-[9px] font-bold px-1 rounded-full">
                {myItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1">My Products</span>
        </button>

        {/* Tab 3: Sell Products */}
        <button
          onClick={() => setFrontendTab('sell_products')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition relative ${
            frontendTab === 'sell_products' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {userOrdersCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-slate-900 text-white text-[9px] font-bold px-1 rounded-full">
                {userOrdersCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1">Sell Products</span>
        </button>

        {/* Tab 4: Profile */}
        <button
          onClick={() => setFrontendTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            frontendTab === 'profile' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
};
