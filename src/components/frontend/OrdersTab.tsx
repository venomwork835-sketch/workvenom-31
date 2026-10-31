import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Headphones,
  Search,
  Building,
  CreditCard,
  MapPin,
} from 'lucide-react';

export const OrdersTab: React.FC = () => {
  const {
    orders,
    currentUser,
    setFrontendTab,
    setIsCustomerServiceOpen,
    sendCustomerChatMessage,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const userOrders = orders.filter((o) => {
    const matchesUser = o.userId === currentUser.id;
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.trackingNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some((i) => i.product.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesUser && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Delivered</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Truck className="w-3 h-3 text-blue-600" />
            <span>In Transit (Shipped)</span>
          </span>
        );
      case 'processing':
        return (
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Processing Order</span>
          </span>
        );
      case 'pending':
        return (
          <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Pending Confirmation</span>
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  const handleInquireOrder = (order: Order) => {
    sendCustomerChatMessage(
      `Hello, I would like an update on Order #${order.orderNumber} (Tracking: ${order.trackingNumber}).`,
      order.orderNumber,
      'orders'
    );
    setIsCustomerServiceOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Package className="w-4 h-4" />
            <span>Tracked Shipments & Receipts</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Order Fulfillment Center
          </h1>
          <p className="text-xs text-slate-300">
            Real-time status updates, interbank payment references, and air waybill tracking numbers for all your orders.
          </p>
        </div>

        <button
          onClick={() => setFrontendTab('home')}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition shadow flex items-center gap-2"
        >
          <span>Continue Shopping</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order or tracking #..."
            className="w-full text-xs bg-slate-50 border border-slate-300 pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:border-amber-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'processing', 'shipped', 'delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap capitalize transition ${
                filterStatus === st
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {userOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 space-y-3">
          <Package className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-700">No matching orders found</h3>
          <p className="text-xs text-slate-500">
            You currently have no orders matching the selected filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">
                    Order #{order.orderNumber}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">Placed: {order.createdAt}</span>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <span className="font-bold text-slate-900 tabular-nums">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6 space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-contain rounded bg-slate-50 border border-slate-200 p-1 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-slate-900 truncate">
                          {item.product.title}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Qty: {item.quantity} · Price: ${item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right font-mono font-bold text-slate-900 text-xs tabular-nums">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment Meta */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 bg-slate-50/60 p-3 rounded-lg">
                  <div>
                    <span className="block font-semibold text-slate-700">Delivery Destination</span>
                    <span className="text-[11px] text-slate-500 flex items-start gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{order.shippingAddress}</span>
                    </span>
                  </div>

                  <div>
                    <span className="block font-semibold text-slate-700">Payment & Settlement</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {order.paymentMethod}
                    </span>
                  </div>

                  <div>
                    <span className="block font-semibold text-slate-700">Courier Tracking</span>
                    <span className="text-[11px] font-mono font-semibold text-amber-700 block mt-0.5">
                      {order.trackingNumber}
                    </span>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-2">
                  <p className="text-[11px] text-slate-400 italic">
                    {order.notes || 'Package handled by certified logistics partners.'}
                  </p>

                  <button
                    onClick={() => handleInquireOrder(order)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition flex items-center gap-1.5"
                  >
                    <Headphones className="w-3.5 h-3.5 text-amber-600" />
                    <span>Inquire with Helpdesk</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
