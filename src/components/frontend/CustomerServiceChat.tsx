import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Headphones,
  Send,
  X,
  CheckCircle2,
  Clock,
  HelpCircle,
  Truck,
  Building,
} from 'lucide-react';

export const CustomerServiceChat: React.FC = () => {
  const {
    currentUser,
    chatMessages,
    sendCustomerChatMessage,
    telegramSupportUrl,
    isCustomerServiceOpen,
    setIsCustomerServiceOpen,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<'orders' | 'payouts' | 'general'>('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userMessages = chatMessages.filter((m) => m.targetUserId === currentUser.id);

  useEffect(() => {
    if (isCustomerServiceOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [userMessages, isCustomerServiceOpen]);

  if (!isCustomerServiceOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendCustomerChatMessage(inputMessage, undefined, selectedDepartment);
    setInputMessage('');
  };

  const quickPrompts = [
    {
      text: 'How soon are interbank wire payouts processed?',
      dept: 'payouts' as const,
    },
    {
      text: 'Where can I locate my order tracking number?',
      dept: 'orders' as const,
    },
    {
      text: 'What are the requirements for Merchant Store verification?',
      dept: 'general' as const,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full h-[620px] max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-900">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">E-seller Customer Support Desk</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Official merchant assistance for order dispatch, wire payouts, and account management
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCustomerServiceOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telegram Direct Connect Banner */}
        <div className="p-4 bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-sky-600 flex items-center justify-center font-black shadow-xs shrink-0">
              <Send className="w-5 h-5 -rotate-12 translate-x-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xs sm:text-sm">Official Telegram Customer Service</span>
                <span className="bg-white/20 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">24/7 Live</span>
              </div>
              <p className="text-[11px] text-sky-100 mt-0.5">
                Connect directly on Telegram: <span className="font-mono font-bold underline">{telegramSupportUrl}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => window.open(telegramSupportUrl, '_blank')}
            className="px-4 py-2 bg-white hover:bg-sky-50 text-sky-700 font-black text-xs rounded-xl transition shadow flex items-center justify-center gap-1.5 shrink-0 uppercase tracking-wider"
          >
            <span>Open Telegram Chat ↗</span>
          </button>
        </div>

        {/* Department Switcher */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 text-xs">
          {[
            { id: 'general', label: 'General Help', icon: HelpCircle },
            { id: 'orders', label: 'Orders & Tracking', icon: Truck },
            { id: 'payouts', label: 'Bank Wire Payouts', icon: Building },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedDepartment(id as any)}
              className={`flex-1 py-1.5 px-2 rounded-md font-medium transition flex items-center justify-center gap-1.5 ${
                selectedDepartment === id
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-amber-600" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {userMessages.map((msg) => {
            const isUser = msg.senderRole === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-600">
                    {isUser ? 'You' : msg.senderName}
                  </span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs'
                  }`}
                >
                  {msg.orderNumber && (
                    <div className="text-[10px] font-mono text-amber-400 font-bold mb-1">
                      Ref: #{msg.orderNumber}
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-2 bg-slate-100 border-t border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedDepartment(p.dept);
                sendCustomerChatMessage(p.text, undefined, p.dept);
              }}
              className="whitespace-nowrap px-3 py-1 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 rounded-full transition"
            >
              {p.text}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Type a message to ${selectedDepartment === 'payouts' ? 'Payout Specialists' : selectedDepartment === 'orders' ? 'Shipping Support' : 'Customer Care'}...`}
            className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
          />
          <button
            type="submit"
            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition"
          >
            <Send className="w-4 h-4 text-amber-400" />
          </button>
        </form>
      </div>
    </div>
  );
};
