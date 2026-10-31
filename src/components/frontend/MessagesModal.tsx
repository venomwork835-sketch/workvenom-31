import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Package,
  Wallet,
  Info,
  X,
  CheckCheck,
  MessageSquare,
  ShieldCheck,
  Send,
  Headphones,
  Sparkles,
} from 'lucide-react';

export const MessagesModal: React.FC = () => {
  const {
    currentUser,
    notifications,
    markNotificationsRead,
    isMessagesModalOpen,
    setIsMessagesModalOpen,
    chatMessages,
    setIsCustomerServiceOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'admin' | 'system'>('all');

  if (!isMessagesModalOpen) return null;

  const userNotifs = notifications.filter((n) => n.userId === currentUser.id);
  const adminDirectMessages = chatMessages.filter(
    (m) => m.targetUserId === currentUser.id && m.senderRole !== 'user'
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4 text-amber-500" />;
      case 'finance':
        return <Wallet className="w-4 h-4 text-emerald-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[88vh] flex flex-col space-y-4 text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Member Inbox & Messages
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct messages from Backend Admin desk, orders & payout notices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => markNotificationsRead(currentUser.id)}
              className="text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 font-semibold flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1.5 rounded-xl border border-amber-200/60 dark:border-amber-800/60 transition"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mark read</span>
            </button>
            <button
              onClick={() => setIsMessagesModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1.5 rounded-xl transition ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-xs font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Updates ({userNotifs.length + adminDirectMessages.length})
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Messages ({adminDirectMessages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`flex-1 py-1.5 rounded-xl transition ${
              activeTab === 'system'
                ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-xs font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            System Notices ({userNotifs.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[58vh]">
          {/* Admin Direct Messages section */}
          {(activeTab === 'all' || activeTab === 'admin') && adminDirectMessages.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5 px-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Direct Admin Communications</span>
              </div>
              {adminDirectMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 rounded-2xl border border-amber-300 dark:border-amber-700 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-950/30 text-xs space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        From: {msg.senderName}
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                        Supervisor
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>

                  <p className="text-slate-800 dark:text-slate-200 text-xs font-medium leading-relaxed bg-white/70 dark:bg-slate-800/80 p-3 rounded-xl border border-amber-200/60 dark:border-slate-700">
                    {msg.text}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500">
                      Target Account: {currentUser.name} ({currentUser.referralCode})
                    </span>
                    <button
                      onClick={() => {
                        setIsMessagesModalOpen(false);
                        setIsCustomerServiceOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline"
                    >
                      <Headphones className="w-3 h-3" />
                      <span>Reply in Live Chat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* System Notifications section */}
          {(activeTab === 'all' || activeTab === 'system') && (
            <div className="space-y-2">
              {activeTab === 'all' && (
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 px-1 pt-1">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Activity & Financial Alerts</span>
                </div>
              )}

              {userNotifs.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">No system notifications found</p>
                </div>
              ) : (
                userNotifs.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-2xl border text-xs space-y-2 transition shadow-xs ${
                      n.isRead
                        ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                        : 'bg-amber-50/50 dark:bg-slate-800 border-amber-200 dark:border-amber-800 text-slate-900 dark:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                        {getIcon(n.type)}
                        <span>{n.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                    </div>

                    {/* Picture Attachment if sent by Admin */}
                    {n.imageUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 max-h-52 flex items-center justify-center">
                        <img
                          src={n.imageUrl}
                          alt={n.title}
                          className="w-full h-full object-cover max-h-52"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                      {n.content}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                      <span className="bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[9px]">
                        System Notice
                      </span>
                      <span>Member: {currentUser.referralCode}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
