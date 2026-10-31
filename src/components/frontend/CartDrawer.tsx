import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Building,
  CreditCard,
  Truck,
} from 'lucide-react';
import { PaymentMethodType } from '../../types';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    cartCount,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    checkoutCart,
    currentUser,
    setFrontendTab,
  } = useApp();

  const [shippingAddress, setShippingAddress] = useState(
    '742 Evergreen Terrace, Suite 400, Seattle, WA 98101'
  );
  const [customerName, setCustomerName] = useState(currentUser.name);
  const [customerEmail, setCustomerEmail] = useState(currentUser.email);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(
    'Direct Bank Wire (IBAN/IFSC)'
  );
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
    orderId?: string;
  } | null>(null);

  if (!isCartOpen) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const res = checkoutCart(shippingAddress, paymentMethod, customerName, customerEmail);
    setFeedback(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 text-slate-900">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">
              Shopping Cart ({cartCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {feedback ? (
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900">Order Confirmed!</h3>
              <p className="text-xs text-emerald-700">{feedback.message}</p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setFeedback(null);
                    setFrontendTab('orders');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition"
                >
                  View My Orders
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setFeedback(null);
                  }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700">Your cart is empty</h3>
              <p className="text-xs text-slate-500">
                Explore our catalog of 40 flagship electronics with 20% discounts.
              </p>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-cover rounded-md bg-white border border-slate-200 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-900 truncate">
                        {item.product.title}
                      </h4>
                      <p className="text-xs font-bold text-amber-600 tabular-nums">
                        ${item.product.discountPrice.toFixed(2)}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center border border-slate-300 rounded bg-white">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1 hover:bg-slate-100 text-slate-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-slate-800 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-slate-100 text-slate-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping & Payment Options Form */}
              <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Shipping & Payout Details
                </h3>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Payment Gateway
                  </label>
                  <div className="space-y-2">
                    {[
                      {
                        method: 'Direct Bank Wire (IBAN/IFSC)' as PaymentMethodType,
                        icon: Building,
                        desc: 'Interbank wire transfer to verified seller settlement IBAN',
                      },
                      {
                        method: 'Digital Wallet' as PaymentMethodType,
                        icon: CreditCard,
                        desc: 'Instant wallet debit from customer balance',
                      },
                      {
                        method: 'Cash on Delivery (COD)' as PaymentMethodType,
                        icon: Truck,
                        desc: 'Pay cash upon parcel delivery & physical inspection',
                      },
                    ].map(({ method, icon: Icon, desc }) => (
                      <label
                        key={method}
                        className={`flex items-start gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                          paymentMethod === method
                            ? 'border-amber-500 bg-amber-50/50 text-slate-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                          className="mt-0.5 text-amber-600 focus:ring-amber-500"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 font-semibold">
                            <Icon className="w-3.5 h-3.5 text-amber-600" />
                            {method}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Subtotal Calculation */}
                <div className="p-3 bg-slate-50 rounded-lg space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold tabular-nums">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Promotional Discount (20%)</span>
                    <span className="text-emerald-600 font-semibold">Included</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Standard Tracked Shipping</span>
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-amber-600 tabular-nums">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Place Order (${cartTotal.toFixed(2)})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
