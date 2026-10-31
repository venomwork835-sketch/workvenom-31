import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Users,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginOrRegister,
    allUsers,
    switchActiveUser,
    currentUser,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('password123');
  const [referralCode, setReferralCode] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    loginOrRegister(
      email.trim(),
      name.trim() || 'Valued Member',
      referralCode.trim() || undefined,
      phone.trim() || '+1 (555) 349-8201',
      password
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 my-8 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                E
              </span>
              <h2 className="text-base font-black text-slate-900">
                {mode === 'login' ? 'Sign In to E-seller' : 'Create E-seller Account'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Access your balances, 20% discount catalog & live order desk
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            Register New
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <span className="text-amber-600 font-extrabold text-[11px] bg-amber-100 px-1.5 py-0.5 rounded">REF</span>
                Referral / Invitation Code
              </label>
              <span className="text-[10px] text-slate-400 font-medium">(Optional or Required by Sponsor)</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={referralCode}
                onChange={e => setReferralCode(e.target.value.toUpperCase())}
                placeholder="e.g. VIP-GLOBAL99 or REF-AHMED101"
                className="w-full bg-amber-50/40 border border-amber-200/80 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500 placeholder:text-slate-400 placeholder:font-sans"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[10px] text-slate-400">Sample codes:</span>
              {['VIP-GLOBAL99', 'REF-AHMED101', 'REF-SARAH01'].map(sampleCode => (
                <button
                  key={sampleCode}
                  type="button"
                  onClick={() => setReferralCode(sampleCode)}
                  className="text-[10px] bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-600 px-2 py-0.5 rounded-md font-mono transition"
                >
                  +{sampleCode}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs transition shadow-md shadow-amber-500/20 uppercase tracking-wider mt-2"
          >
            {mode === 'login' ? 'Sign In with Referral' : 'Create Account & Start Shopping'}
          </button>
        </form>

        {/* Quick Switch Persona: 10 Fake accounts + Main user */}
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-600" /> Quick Persona Switcher (10 Fake IDs + Main)
            </span>
            <span className="text-[10px] text-slate-400">Click to load instantly</span>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {allUsers.map(user => {
              const isSelected = user.id === currentUser.id;
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    switchActiveUser(user.id);
                    setIsAuthModalOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-left border transition ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/70 text-slate-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold text-slate-900 truncate flex items-center gap-1">
                      {user.name.split(' ')[0]}
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-amber-600 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between">
                      <span>${user.availableBalance.toFixed(0)}</span>
                      <span className="text-[9px] font-mono text-amber-700 bg-amber-100/80 px-1 rounded">
                        {user.referralCode}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
