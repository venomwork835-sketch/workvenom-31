import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Order, WithdrawalRequest, OrderStatus, Product, ProductCategory } from '../../types';
import {
  ShieldCheck,
  Users,
  Package,
  ArrowUpRight,
  DollarSign,
  Lock,
  Percent,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Sliders,
  Search,
  RefreshCw,
  PlusCircle,
  Sparkles,
  ShoppingBag,
  AlertTriangle,
  ExternalLink,
  Plus,
  Share2,
  UserCheck,
  MessageSquare,
  Bot,
  Filter,
  Crown,
  Database,
  Key,
  Eye,
  EyeOff,
  Link,
  Copy,
  Check,
  LogOut,
  Calendar,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    allUsers,
    currentUser,
    switchActiveUser,
    setViewMode,
    orders,
    adminBuyFulfillOrder,
    adminUpdateOrderStatus,
    adminAddOrderToUser,
    adminAssignCustomProductToUser,
    adminAddProductToCatalog,
    withdrawals,
    adminProcessWithdrawal,
    updateUserBalance,
    updateUserCreditScore,
    chatMessages,
    sendAdminChatMessage,
    products,
    pendingWithdrawalsCount,
    pendingOrdersCount,
    updateUserWithdrawalPermission,
    assignPlanToMember,
    sellerPlans,
    userProducts,
    adminBuyBackProduct,
    sendMemberNotificationWithImage,
    planRequests,
    adminProcessPlanRequest,
    pendingPlanRequestsCount,
    setIsSupabaseModalOpen,
    isSupabaseConfigured,
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    setSharedDealModalOpen,
    setSharedDealData,
  } = useApp();

  // The 4 main backend tabs in exact requested order:
  // 1. Members (Referral Members & Count)
  // 2. Withdraw (Withdrawals Management)
  // 3. Orders & Products (Orders & Add to Member Account)
  // 4. Chat (Chat with 10 Members)
  const [activeAdminTab, setActiveAdminTab] = useState<'members' | 'withdrawals' | 'orders' | 'chat'>('members');

  // Admin Login Screen state
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  // Tab 2: Custom Withdrawal Decision Modal State
  const [wdModalTarget, setWdModalTarget] = useState<WithdrawalRequest | null>(null);
  const [wdDecision, setWdDecision] = useState<'approve' | 'reject'>('approve');
  const [wdNote, setWdNote] = useState<string>('');
  const [wdTime, setWdTime] = useState<string>('');
  const [wdDecisionFeedback, setWdDecisionFeedback] = useState<string | null>(null);

  // Tab 3: Custom Product Share Link Generator
  const [shareTargetProd, setShareTargetProd] = useState<Product | null>(null);
  const [sharePrice, setSharePrice] = useState<number>(250);
  const [shareProfit, setShareProfit] = useState<number>(50);
  const [shareTitle, setShareTitle] = useState<string>('');
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Tab 1: Member Financials Edit Modal
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editAvailable, setEditAvailable] = useState<number>(0);
  const [editFreeze, setEditFreeze] = useState<number>(0);
  const [editCreditScore, setEditCreditScore] = useState<number>(100);
  const [editCanWithdraw, setEditCanWithdraw] = useState<boolean>(true);
  const [editPlanLevel, setEditPlanLevel] = useState<number>(1);
  const [editSuccessMsg, setEditSuccessMsg] = useState<string | null>(null);

  // Tab 1: Filters & Search
  const [memberFilter, setMemberFilter] = useState<'all' | 'referred' | 'fake' | 'real'>('all');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Tab 2: Withdrawals Filter
  const [withdrawFilter, setWithdrawFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Tab 3: Orders & Products state
  const [orderSubTab, setOrderSubTab] = useState<'orders' | 'add_catalog' | 'plan_requests' | 'buyback' | 'plans' | 'assign'>('orders');
  const [planRequestFilter, setPlanRequestFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [planActionFeedback, setPlanActionFeedback] = useState<string | null>(null);
  
  // Interactive Buy Back Modal state
  const [buyBackModalItem, setBuyBackModalItem] = useState<any | null>(null);
  const [modalCreditAmount, setModalCreditAmount] = useState<number>(0);
  const [modalProfitAmount, setModalProfitAmount] = useState<number>(0);

  // Buy Back desk state
  const [buyBackCreditAmount, setBuyBackCreditAmount] = useState<{ [id: string]: number }>({});
  const [buyBackProfitAmount, setBuyBackProfitAmount] = useState<{ [id: string]: number }>({});
  const [buyBackSuccessMsg, setBuyBackSuccessMsg] = useState<string | null>(null);

  // Plans Management state
  const [selectedPlanUserId, setSelectedPlanUserId] = useState<string>(allUsers[0]?.id || '');
  const [selectedPlanLevel, setSelectedPlanLevel] = useState<number>(1);
  const [planSuccessMsg, setPlanSuccessMsg] = useState<string | null>(null);

  // Order assignment form
  const [assignTargetUserId, setAssignTargetUserId] = useState<string>(allUsers[0]?.id || '');
  const [assignMode, setAssignMode] = useState<'catalog' | 'custom'>('catalog');
  const [assignSelectedProductId, setAssignSelectedProductId] = useState<string>(products[0]?.id || '');
  const [assignQuantity, setAssignQuantity] = useState<number>(1);
  const [assignStatus, setAssignStatus] = useState<OrderStatus>('pending');
  const [assignNotes, setAssignNotes] = useState<string>('Priority task assigned by administrator');
  const [assignSuccessMsg, setAssignSuccessMsg] = useState<string | null>(null);

  // Custom product assignment inputs
  const [customTitle, setCustomTitle] = useState('');
  const [customPrice, setCustomPrice] = useState<number>(850);
  const [customCommissionRate, setCustomCommissionRate] = useState<number>(0.08); // 8%
  const [customCategory, setCustomCategory] = useState<ProductCategory>('electronics');

  // Add new product to catalog inputs
  const [newCatalogTitle, setNewCatalogTitle] = useState('');
  const [newCatalogCategory, setNewCatalogCategory] = useState<ProductCategory>('mobiles');
  const [newCatalogOriginalPrice, setNewCatalogOriginalPrice] = useState<number>(1200);
  const [newCatalogDiscountPrice, setNewCatalogDiscountPrice] = useState<number>(960);
  const [newCatalogImage, setNewCatalogImage] = useState('https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=400&q=80');
  const [newCatalogSpecs, setNewCatalogSpecs] = useState('Flagship Processor, OLED Display, 5G');
  const [newCatalogInstructions, setNewCatalogInstructions] = useState('Verify device specifications on delivery.');
  const [newCatalogDesc, setNewCatalogDesc] = useState('High performance device with 20% discount promotional rate.');
  const [newCatalogStock, setNewCatalogStock] = useState<number>(50);
  const [newCatalogProfitRate, setNewCatalogProfitRate] = useState<number>(0.20);
  const [catalogSuccessMsg, setCatalogSuccessMsg] = useState<string | null>(null);

  // Tab 4: Chat Desk
  const [selectedChatUserId, setSelectedChatUserId] = useState<string>(allUsers[0]?.id || currentUser.id);
  const [adminChatText, setAdminChatText] = useState('');
  const [chatSearchQuery, setChatSearchQuery] = useState('');

  // Open edit modal for a user
  const handleOpenEditUser = (user: User) => {
    setEditingUser(user);
    setEditAvailable(user.availableBalance);
    setEditFreeze(user.freezeBalance);
    setEditCreditScore(user.creditScore);
    setEditCanWithdraw(user.canWithdraw !== false);
    setEditPlanLevel(user.planLevel || 1);
    setEditSuccessMsg(null);
  };

  const handleSaveUserFinancials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUserBalance(editingUser.id, editAvailable, editFreeze, true);
    updateUserCreditScore(editingUser.id, editCreditScore);
    updateUserWithdrawalPermission(editingUser.id, editCanWithdraw);
    if (editPlanLevel !== (editingUser.planLevel || 1)) {
      assignPlanToMember(editingUser.id, editPlanLevel);
    }

    setEditSuccessMsg(`Updated ${editingUser.name}'s balance ($${editAvailable.toFixed(2)}), withdrawals (${editCanWithdraw ? 'OPEN' : 'LOCKED'}), plan (Plan ${editPlanLevel}) & credit score (${editCreditScore}%)!`);
    setTimeout(() => {
      setEditingUser(null);
      setEditSuccessMsg(null);
    }, 1500);
  };

  // Open Interactive Buy Back Modal
  const handleOpenBuyBackModal = (up: any) => {
    const defaultCredit = up.product.discountPrice;
    const defaultProfit = Number((defaultCredit * (up.profitRate || 0.20)).toFixed(2));
    setBuyBackModalItem(up);
    setModalCreditAmount(buyBackCreditAmount[up.id] !== undefined ? buyBackCreditAmount[up.id] : defaultCredit);
    setModalProfitAmount(buyBackProfitAmount[up.id] !== undefined ? buyBackProfitAmount[up.id] : defaultProfit);
  };

  // Confirm Buy Back in Modal
  const handleConfirmBuyBackModal = () => {
    if (!buyBackModalItem) return;
    const res = adminBuyBackProduct(buyBackModalItem.id, modalCreditAmount, modalProfitAmount);
    if (res.success) {
      setBuyBackSuccessMsg(res.message);
      setTimeout(() => setBuyBackSuccessMsg(null), 3500);
    }
    setBuyBackModalItem(null);
  };

  // Process Plan Purchase Request (Approve or Reject)
  const handleProcessPlanReq = (reqId: string, action: 'approve' | 'reject') => {
    const res = adminProcessPlanRequest(reqId, action);
    setPlanActionFeedback(res.message);
    setTimeout(() => setPlanActionFeedback(null), 4000);
  };

  // Admin executes quick buy-back on a user product
  const handleExecuteBuyBack = (upId: string, defaultCredit: number, defaultProfit: number) => {
    const credit = buyBackCreditAmount[upId] !== undefined ? buyBackCreditAmount[upId] : defaultCredit;
    const profit = buyBackProfitAmount[upId] !== undefined ? buyBackProfitAmount[upId] : defaultProfit;

    const res = adminBuyBackProduct(upId, credit, profit);
    if (res.success) {
      setBuyBackSuccessMsg(res.message);
      setTimeout(() => setBuyBackSuccessMsg(null), 3500);
    }
  };

  // Admin assigns plan directly
  const handleAdminAssignPlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanUserId) return;
    const res = assignPlanToMember(selectedPlanUserId, selectedPlanLevel);
    setPlanSuccessMsg(res.message);
    setTimeout(() => setPlanSuccessMsg(null), 3500);
  };

  // Assign product/order to member account handler
  const handleAssignOrderToMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTargetUserId) return;

    if (assignMode === 'catalog') {
      if (!assignSelectedProductId) return;
      adminAddOrderToUser(assignTargetUserId, assignSelectedProductId, assignQuantity, assignNotes, assignStatus);
      const targetUser = allUsers.find(u => u.id === assignTargetUserId);
      const targetProd = products.find(p => p.id === assignSelectedProductId);
      setAssignSuccessMsg(`Successfully assigned order "${targetProd?.title}" to ${targetUser?.name}'s account!`);
    } else {
      if (!customTitle.trim()) return;
      adminAssignCustomProductToUser(
        assignTargetUserId,
        customTitle.trim(),
        Number(customPrice),
        Number(customCommissionRate),
        customCategory,
        assignNotes
      );
      const targetUser = allUsers.find(u => u.id === assignTargetUserId);
      setAssignSuccessMsg(`Created custom product "${customTitle}" and added order to ${targetUser?.name}'s account!`);
      setCustomTitle('');
    }

    setTimeout(() => {
      setAssignSuccessMsg(null);
    }, 3000);
  };

  // Admin Login Gateway submit
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError(null);
    const res = adminLogin(adminUser, adminPass);
    if (!res.success) {
      setAdminAuthError(res.message);
    }
  };

  // Withdrawal Decision Handlers
  const handleOpenWdModal = (wd: WithdrawalRequest, action: 'approve' | 'reject') => {
    setWdModalTarget(wd);
    setWdDecision(action);
    const now = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    setWdTime(now);
    if (action === 'approve') {
      setWdNote(`Approved & Paid via ${wd.method}. Payout Ref: TX-${Date.now().toString().slice(-6)}`);
    } else {
      setWdNote(`Verification required: Destination account details mismatch or unverified ID.`);
    }
  };

  const handleConfirmWdDecision = () => {
    if (!wdModalTarget) return;
    adminProcessWithdrawal(wdModalTarget.id, wdDecision, wdNote, wdTime);
    setWdDecisionFeedback(`Withdrawal request for ${wdModalTarget.userName} (${wdDecision.toUpperCase()}) processed successfully!`);
    setWdModalTarget(null);
    setTimeout(() => setWdDecisionFeedback(null), 3500);
  };

  // Product Share Link Generator Handlers
  const handleOpenShareModal = (prod: Product) => {
    setShareTargetProd(prod);
    setSharePrice(prod.discountPrice);
    setShareProfit(Number((prod.discountPrice * (prod.commissionRate || 0.20)).toFixed(2)));
    setShareTitle(prod.title);
    setCopyFeedback(false);
  };

  const getShareableUrl = () => {
    if (!shareTargetProd) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    return `${origin}${path}?deal=${shareTargetProd.id}&price=${sharePrice}&profit=${shareProfit}&title=${encodeURIComponent(shareTitle || shareTargetProd.title)}`;
  };

  const handleCopyShareLink = () => {
    const url = getShareableUrl();
    if (!url) return;
    navigator.clipboard?.writeText(url);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  const handleTestShareLinkInStore = () => {
    if (!shareTargetProd) return;
    setSharedDealData({
      product: shareTargetProd,
      customPrice: sharePrice,
      customProfit: shareProfit,
      dealTitle: shareTitle || shareTargetProd.title,
    });
    setSharedDealModalOpen(true);
    setViewMode('frontend');
  };

  // Add product to store catalog handler
  const handleAddNewCatalogProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatalogTitle.trim()) return;

    const original = Number(newCatalogOriginalPrice);
    const discount = Number(newCatalogDiscountPrice || (original * 0.8).toFixed(2));
    const profitRate = Number(newCatalogProfitRate) || 0.20;

    adminAddProductToCatalog({
      title: newCatalogTitle.trim(),
      category: newCatalogCategory,
      originalPrice: original,
      discountPrice: discount,
      discountPercentage: Math.max(1, Math.round(((original - discount) / original) * 100)),
      rating: 4.9,
      reviewCount: 28,
      imageUrl: newCatalogImage.trim() || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=400&q=80',
      stock: newCatalogStock || 50,
      specs: newCatalogSpecs.split(',').map(s => s.trim()).filter(Boolean),
      instructions: newCatalogInstructions.trim(),
      description: newCatalogDesc.trim(),
      isTrending: true,
      commissionRate: profitRate,
    });

    setCatalogSuccessMsg(`Product "${newCatalogTitle}" added to Eseller store catalog with discount price $${discount.toFixed(2)} and ${(profitRate * 100).toFixed(0)}% profit! It is now live on the frontend.`);
    setNewCatalogTitle('');
    setTimeout(() => setCatalogSuccessMsg(null), 4000);
  };

  // Send admin chat message
  const handleSendAdminChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminChatText.trim()) return;
    sendAdminChatMessage(selectedChatUserId, adminChatText, 'E-seller Admin Supervisor');
    setAdminChatText('');
  };

  // Simulate Member Reply in Chat
  const handleSimulateMemberReply = () => {
    const targetUser = allUsers.find(u => u.id === selectedChatUserId);
    if (!targetUser) return;

    const sampleReplies = [
      `Thank you Admin! I can see my updated balance in my account.`,
      `I just received the commission for my assigned product order!`,
      `Could you please approve my withdrawal request to my USDT address?`,
      `Thank you for maintaining my credit score at ${targetUser.creditScore}%.`,
      `I shared my referral code ${targetUser.referralCode} with my team!`,
    ];
    const chosen = sampleReplies[Math.floor(Math.random() * sampleReplies.length)];

    // Send as user
    setTimeout(() => {
      sendAdminChatMessage(selectedChatUserId, chosen, targetUser.name);
    }, 400);
  };

  // Filter members for Tab 1
  const filteredUsers = allUsers.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      (u.referralCode && u.referralCode.toLowerCase().includes(memberSearchQuery.toLowerCase())) ||
      (u.referredBy && u.referredBy.toLowerCase().includes(memberSearchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (memberFilter === 'referred') return Boolean(u.referredBy);
    if (memberFilter === 'fake') return Boolean(u.isFake);
    if (memberFilter === 'real') return !u.isFake;
    return true;
  });

  // Filter withdrawals for Tab 2
  const filteredWithdrawals = withdrawals.filter(w => {
    if (withdrawFilter === 'all') return true;
    return w.status === withdrawFilter;
  });

  // Selected chat user & thread for Tab 4
  const selectedChatUser = allUsers.find(u => u.id === selectedChatUserId) || allUsers[0];
  const chatThread = chatMessages.filter(m => m.targetUserId === selectedChatUserId);

  // Chat member list (all 10 fake users + any real user)
  const chatMembers = allUsers.filter(u =>
    u.name.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
    (u.referralCode && u.referralCode.toLowerCase().includes(chatSearchQuery.toLowerCase()))
  );

  // Admin Login Gateway Protection
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-amber-500/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400"></div>

          <div className="text-center space-y-2 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Eseller Central Backend</h1>
            <p className="text-xs text-slate-400">
              Restricted Administrative Gateway. Please authenticate with supervisor credentials.
            </p>
          </div>

          {adminAuthError && (
            <div className="mb-4 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{adminAuthError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Username</span>
              </label>
              <input
                type="text"
                value={adminUser}
                onChange={e => setAdminUser(e.target.value)}
                placeholder="Enter username (default: admin)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 transition"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" /> Password
                </span>
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  {showPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPass ? 'Hide' : 'Show'}</span>
                </button>
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                value={adminPass}
                onChange={e => setAdminPass(e.target.value)}
                placeholder="Enter password (default: admin123)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 transition"
                required
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400 space-y-1">
              <div className="font-bold text-amber-400">Default Root Credentials:</div>
              <div className="flex justify-between font-mono">
                <span>Username: <strong className="text-white">admin</strong></span>
                <span>Password: <strong className="text-white">admin123</strong></span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Unlock Admin Desk</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <button
              onClick={() => setViewMode('frontend')}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Cancel & Return to Front Store</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Top Admin Navigation Header */}
      <div className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-tight">Eseller Central Control Desk</h1>
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  ROOT ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Referral tracking, withdrawals, product/order injection & 10 members chat desk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5"
              title="Configure Supabase Cloud Database"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supabase DB</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConfigured ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'
                }`}
              ></span>
            </button>

            <button
              onClick={adminLogout}
              className="bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-xs px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5"
              title="Log Out of Root Admin Desk"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Log Out Admin</span>
            </button>

            <button
              onClick={() => setViewMode('frontend')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition shadow flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Return to Front Store
            </button>
          </div>
        </div>

        {/* The 4 Requested Admin Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-slate-800/80 pt-1">
          {[
            {
              id: 'members' as const,
              label: '1. Members & Referrals',
              count: allUsers.length,
              icon: Users,
              desc: 'Member list with referral codes',
            },
            {
              id: 'withdrawals' as const,
              label: '2. Withdraw Desk',
              count: pendingWithdrawalsCount,
              badgeColor: 'bg-rose-500',
              icon: ArrowUpRight,
              desc: 'Audit payout requests',
            },
            {
              id: 'orders' as const,
              label: '3. Orders & Add Products',
              count: pendingOrdersCount,
              badgeColor: 'bg-amber-500',
              icon: Package,
              desc: 'Add order/product to member',
            },
            {
              id: 'chat' as const,
              label: '4. Chat (10 Members)',
              count: chatMessages.filter(m => m.senderRole === 'user' && !m.isRead).length,
              badgeColor: 'bg-blue-500',
              icon: MessageSquare,
              desc: 'Live chat with 10 members',
            },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-amber-400 text-amber-400 bg-slate-800/60'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.2 rounded-full text-slate-950 ${
                      tab.badgeColor || 'bg-amber-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* ============================================================== */}
        {/* TAB 1: MEMBERS (Referral members, list, counts, credit/balance) */}
        {/* ============================================================== */}
        {activeAdminTab === 'members' && (
          <div className="space-y-6">
            {/* Top KPI Cards: "itny members" */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-800/70 border border-slate-700/80 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                  <span>Total Members</span>
                  <Users className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white mt-2">{allUsers.length} Members</div>
                <p className="text-[11px] text-amber-400 font-semibold mt-0.5">
                  10 Core IDs + {allUsers.filter(u => !u.isFake).length} Registered
                </p>
              </div>

              <div className="bg-slate-800/70 border border-slate-700/80 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                  <span>Referred by Code</span>
                  <Share2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-400 mt-2">
                  {allUsers.filter(u => u.referredBy).length} Members
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Tracked via referral sponsor</p>
              </div>

              <div className="bg-slate-800/70 border border-slate-700/80 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                  <span>Total Network Balance</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  ${allUsers.reduce((acc, u) => acc + u.availableBalance, 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Freeze: ${allUsers.reduce((acc, u) => acc + u.freezeBalance, 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div className="bg-slate-800/70 border border-slate-700/80 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                  <span>Avg Credit Score</span>
                  <Percent className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-black text-indigo-400 mt-2">
                  {Math.round(allUsers.reduce((acc, u) => acc + u.creditScore, 0) / (allUsers.length || 1))}%
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Healthy credit grade</p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-slate-800/60 border border-slate-700/80 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all' as const, label: `All Members (${allUsers.length})` },
                  { id: 'referred' as const, label: `Referred via Code (${allUsers.filter(u => u.referredBy).length})` },
                  { id: 'fake' as const, label: `Core 10 Fake IDs (10)` },
                  { id: 'real' as const, label: `Real Users (${allUsers.filter(u => !u.isFake).length})` },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setMemberFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      memberFilter === f.id
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={memberSearchQuery}
                  onChange={e => setMemberSearchQuery(e.target.value)}
                  placeholder="Search member, email, referral code..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Members Table */}
            <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
              <div className="p-4 border-b border-slate-700/80 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    Member Accounts & Referral Registry ({filteredUsers.length} Shown)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click "Edit Financials" to inject balance or modify credit score; "Assign" to add products/orders
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Member</th>
                      <th className="py-3 px-3">Referral Code</th>
                      <th className="py-3 px-3">Referred By</th>
                      <th className="py-3 px-3">Store Plan</th>
                      <th className="py-3 px-3">Available ($)</th>
                      <th className="py-3 px-3">Freeze ($)</th>
                      <th className="py-3 px-3">Credit Score</th>
                      <th className="py-3 px-3">Withdrawals</th>
                      <th className="py-3 px-4 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60 font-medium">
                    {filteredUsers.map(user => {
                      const isMainActive = user.id === currentUser.id;
                      return (
                        <tr key={user.id} className="hover:bg-slate-800/80 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="relative">
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-600"
                                />
                                {isMainActive && (
                                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border border-slate-900"></span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-white flex items-center gap-1.5 truncate">
                                  {user.name}
                                  {user.isFake ? (
                                    <span className="text-[9px] bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded font-mono">
                                      Attached ID
                                    </span>
                                  ) : (
                                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
                                      Front User
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Member's Own Referral Code */}
                          <td className="py-3 px-3">
                            <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              {user.referralCode || 'REF-ESELLER99'}
                            </span>
                          </td>

                          {/* Referred By / Sponsor Code */}
                          <td className="py-3 px-3">
                            {user.referredBy ? (
                              <div className="flex items-center gap-1 text-[11px]">
                                <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                  {user.referredBy}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-500 italic">Direct / Root</span>
                            )}
                          </td>

                          {/* Store Plan */}
                          <td className="py-3 px-3">
                            <span className="font-bold text-[11px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 whitespace-nowrap">
                              Plan {user.planLevel || 1}
                            </span>
                          </td>

                          {/* Available Balance */}
                          <td className="py-3 px-3 font-mono font-bold text-white">
                            ${user.availableBalance.toFixed(2)}
                          </td>

                          {/* Freeze Balance */}
                          <td className="py-3 px-3 font-mono text-indigo-300">
                            ${user.freezeBalance.toFixed(2)}
                          </td>

                          {/* Credit Score */}
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                user.creditScore >= 90
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : user.creditScore >= 75
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {user.creditScore}%
                            </span>
                          </td>

                          {/* Withdrawal Status & Quick Toggle */}
                          <td className="py-3 px-3">
                            <button
                              onClick={() => updateUserWithdrawalPermission(user.id, user.canWithdraw === false)}
                              title="Click to toggle withdrawal permission for this member"
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition flex items-center gap-1 ${
                                user.canWithdraw !== false
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                              }`}
                            >
                              {user.canWithdraw !== false ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>Open</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3 h-3 text-rose-400" />
                                  <span>Locked</span>
                                </>
                              )}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditUser(user)}
                                title="Edit Financials (Balance & Credit Score)"
                                className="bg-slate-700 hover:bg-slate-600 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                              >
                                <Sliders className="w-3 h-3 text-amber-400" /> Edit
                              </button>

                              <button
                                onClick={() => {
                                  setAssignTargetUserId(user.id);
                                  setActiveAdminTab('orders');
                                  setOrderSubTab('assign');
                                }}
                                title="Assign Order or Product to this member"
                                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                              >
                                <Package className="w-3 h-3" /> Assign Order
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedChatUserId(user.id);
                                  setActiveAdminTab('chat');
                                }}
                                title="Chat with this member"
                                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                              >
                                <MessageSquare className="w-3 h-3" /> Chat
                              </button>

                              <button
                                onClick={() => {
                                  switchActiveUser(user.id);
                                  setViewMode('frontend');
                                }}
                                title="Login as this persona in front store"
                                className="bg-slate-700/60 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg text-[10px] font-bold transition"
                              >
                                Login
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dedicated Live Referral Registrations & Network Desk Card */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      ⚡ Live Referral Signups & Network Desk
                      <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                        {allUsers.filter(u => u.referredBy).length} Tracked
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Real-time register of members who joined the store using an invitation / referral code from front.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Total Referral Network Volume: </span>
                  <span className="text-sm font-black font-mono text-emerald-400">
                    ${allUsers.filter(u => u.referredBy).reduce((acc, u) => acc + u.availableBalance, 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {allUsers.filter(u => u.referredBy).length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs italic bg-slate-900/60 rounded-2xl border border-slate-800">
                  No member registered via referral code yet. When a user enters a referral code on signup or login, they will be tracked here live.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allUsers
                    .filter(u => u.referredBy)
                    .map(member => (
                      <div
                        key={`ref-${member.id}`}
                        className="bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 transition space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-9 h-9 rounded-full object-cover border border-emerald-500/40"
                            />
                            <div>
                              <div className="text-xs font-black text-white">{member.name}</div>
                              <div className="text-[10px] text-slate-400">{member.email}</div>
                            </div>
                          </div>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                            Active
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Sponsor Code:</span>
                            <span className="font-mono font-bold text-amber-400">{member.referredBy}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Store Plan:</span>
                            <span className="font-bold text-slate-200">Plan {member.planLevel || 1}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Available:</span>
                            <span className="font-mono font-bold text-white">${member.availableBalance.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Credit Score:</span>
                            <span className="font-bold text-emerald-400">{member.creditScore}%</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleOpenEditUser(member)}
                            className="flex-1 py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded-lg transition text-center"
                          >
                            Credit Balance
                          </button>
                          <button
                            onClick={() => {
                              setSelectedChatUserId(member.id);
                              setActiveAdminTab('chat');
                            }}
                            className="flex-1 py-1 px-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded-lg transition text-center"
                          >
                            Open Chat
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: WITHDRAW (Withdrawals Management Desk)                  */}
        {/* ============================================================== */}
        {activeAdminTab === 'withdrawals' && (
          <div className="space-y-6">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-800/70 border border-slate-700/80 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                  <span>Pending Withdrawal Audits</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-400 mt-2">
                  {withdrawals.filter(w => w.status === 'pending').length} Requests
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Require administrator sign-off</p>
              </div>

              <div className="bg-slate-800/70 border border-slate-700/80 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                  <span>Total Approved & Dispatched</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-400 mt-2">
                  $
                  {withdrawals
                    .filter(w => w.status === 'approved')
                    .reduce((acc, w) => acc + w.receivedAmount, 0)
                    .toFixed(2)}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Paid via USDT / Bank Wire</p>
              </div>

              <div className="bg-slate-800/70 border border-slate-700/80 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                  <span>Total Handling Fees (1%)</span>
                  <DollarSign className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-black text-indigo-400 mt-2">
                  $
                  {withdrawals
                    .filter(w => w.status === 'approved')
                    .reduce((acc, w) => acc + w.fee, 0)
                    .toFixed(2)}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Retained platform commission</p>
              </div>
            </div>

            {/* Filter */}
            <div className="bg-slate-800/60 border border-slate-700/80 p-4 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all' as const, label: `All Requests (${withdrawals.length})` },
                  { id: 'pending' as const, label: `Pending Action (${withdrawals.filter(w => w.status === 'pending').length})` },
                  { id: 'approved' as const, label: `Approved (${withdrawals.filter(w => w.status === 'approved').length})` },
                  { id: 'rejected' as const, label: `Rejected (${withdrawals.filter(w => w.status === 'rejected').length})` },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setWithdrawFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      withdrawFilter === f.id
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Withdrawals Table */}
            <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
              <div className="p-4 border-b border-slate-700/80">
                <h2 className="text-sm font-black text-white flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  Member Withdrawal Applications & Payout Audit
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Approve to release funds or Reject to automatically refund frozen dollars to member's balance
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Member</th>
                      <th className="py-3 px-3">Method</th>
                      <th className="py-3 px-3">Account / Wallet Destination</th>
                      <th className="py-3 px-3">Gross Amount</th>
                      <th className="py-3 px-3">1% Fee</th>
                      <th className="py-3 px-3">Net Payout</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Admin Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60 font-medium">
                    {filteredWithdrawals.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                          No withdrawal records matching current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredWithdrawals.map(wd => (
                        <tr key={wd.id} className="hover:bg-slate-800/80 transition">
                          <td className="py-3 px-4">
                            <div className="font-bold text-white">{wd.userName}</div>
                            <div className="text-[10px] text-slate-400">{wd.userEmail}</div>
                            <div className="text-[9px] text-slate-500 font-mono mt-0.5">{wd.requestedAt}</div>
                          </td>

                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-200">{wd.method}</span>
                          </td>

                          <td className="py-3 px-3">
                            <div className="font-mono text-[11px] text-amber-300 max-w-[200px] truncate select-all bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                              {wd.accountDetails}
                            </div>
                          </td>

                          <td className="py-3 px-3 font-mono font-bold text-white">
                            ${wd.amount.toFixed(2)}
                          </td>

                          <td className="py-3 px-3 font-mono text-slate-400">
                            ${wd.fee.toFixed(2)}
                          </td>

                          <td className="py-3 px-3 font-mono font-black text-emerald-400 text-sm">
                            ${wd.receivedAmount.toFixed(2)}
                          </td>

                          <td className="py-3 px-3">
                            {wd.status === 'pending' && (
                              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                Pending Audit
                              </span>
                            )}
                            {wd.status === 'approved' && (
                              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                Paid & Released
                              </span>
                            )}
                            {wd.status === 'rejected' && (
                              <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                Rejected & Refunded
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            {wd.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenWdModal(wd, 'approve')}
                                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs transition shadow flex items-center gap-1"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve Payout
                                </button>
                                <button
                                  onClick={() => handleOpenWdModal(wd, 'reject')}
                                  className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-bold px-2.5 py-1.5 rounded-xl text-xs transition flex items-center gap-1"
                                >
                                  <XCircle className="w-3.5 h-3.5" /> Reject
                                </button>
                              </div>
                            ) : (
                              <div className="text-[10px] space-y-0.5 text-right">
                                <div className="text-white font-medium">{wd.adminRemark || 'Processed'}</div>
                                {wd.processedAt && (
                                  <div className="text-[9px] text-amber-400 font-mono flex items-center justify-end gap-1">
                                    <Clock className="w-3 h-3 text-amber-400" />
                                    <span>{wd.processedAt}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: ORDERS & ADD PRODUCTS TO MEMBER'S ACCOUNT                */}
        {/* ============================================================== */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-6">
            {/* Sub-navigation inside Orders tab */}
            <div className="flex flex-wrap bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 gap-1 text-xs font-bold">
              <button
                onClick={() => setOrderSubTab('plan_requests')}
                className={`flex-1 min-w-[170px] py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  orderSubTab === 'plan_requests'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>Plan Requests Desk</span>
                {pendingPlanRequestsCount > 0 ? (
                  <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse ml-1">
                    {pendingPlanRequestsCount} Pending
                  </span>
                ) : (
                  <span className="bg-slate-700 text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                    {planRequests.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setOrderSubTab('buyback')}
                className={`flex-1 min-w-[160px] py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  orderSubTab === 'buyback'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" /> Member Store & Buy Back ({userProducts.length})
              </button>
              <button
                onClick={() => setOrderSubTab('plans')}
                className={`flex-1 min-w-[160px] py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  orderSubTab === 'plans'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Crown className="w-4 h-4 text-amber-300" /> Store Level Manager (Plan 1-8)
              </button>
              <button
                onClick={() => setOrderSubTab('assign')}
                className={`flex-1 min-w-[160px] py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  orderSubTab === 'assign'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <PlusCircle className="w-4 h-4" /> Assign Custom Order
              </button>
              <button
                onClick={() => setOrderSubTab('orders')}
                className={`flex-1 min-w-[160px] py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  orderSubTab === 'orders'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" /> Live Orders & Buying Center ({orders.length})
              </button>
              <button
                onClick={() => setOrderSubTab('add_catalog')}
                className={`flex-1 min-w-[160px] py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  orderSubTab === 'add_catalog'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" /> Catalog Manager ({products.length})
              </button>
            </div>

            {/* Sub-Section 00: STORE PLAN ACTIVATION REQUESTS DESK */}
            {orderSubTab === 'plan_requests' && (
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-black text-white flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-400" />
                      Plan Purchase & Activation Desk ({planRequests.length} Applications)
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                      When members purchase store plans (Plan 1: $200 up to Plan 8: $25,000 Full Store) from the frontend, they require your administrative authorization. Upon approval, their store is instantly upgraded and the exact number of catalog products is auto-populated in their <strong>My Products</strong> tab. If rejected, held funds are automatically refunded to their available balance.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-700 text-xs font-bold">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => {
                      const count = status === 'all'
                        ? planRequests.length
                        : planRequests.filter(r => r.status === status).length;
                      return (
                        <button
                          key={status}
                          onClick={() => setPlanRequestFilter(status)}
                          className={`px-3 py-1.5 rounded-lg capitalize transition text-xs flex items-center gap-1.5 ${
                            planRequestFilter === status
                              ? 'bg-amber-500 text-slate-950 font-black shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{status}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            planRequestFilter === status ? 'bg-slate-950/20 text-slate-900' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {planActionFeedback && (
                  <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{planActionFeedback}</span>
                  </div>
                )}

                {/* Table of Plan Requests */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/80 text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-700">
                      <tr>
                        <th className="py-3 px-4">Member Applicant</th>
                        <th className="py-3 px-3">Target Store Plan</th>
                        <th className="py-3 px-3">Plan Price</th>
                        <th className="py-3 px-3">Products to Populate</th>
                        <th className="py-3 px-3">Guaranteed Yield</th>
                        <th className="py-3 px-3">Applied At</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-4 text-right">Administrative Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60 font-medium">
                      {(() => {
                        const filtered = planRequests.filter(r => {
                          if (planRequestFilter === 'all') return true;
                          return r.status === planRequestFilter;
                        });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={8} className="py-12 text-center text-slate-500">
                                <Crown className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                                <p className="font-bold">No plan applications found for filter "{planRequestFilter}".</p>
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map((req) => {
                          const userObj = allUsers.find(u => u.id === req.userId);
                          return (
                            <tr key={req.id} className="hover:bg-slate-750/30 transition">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  {userObj?.avatar ? (
                                    <img
                                      src={userObj.avatar}
                                      alt=""
                                      className="w-8 h-8 rounded-full object-cover border border-amber-400/80 shrink-0"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white shrink-0">
                                      {req.userName.slice(0, 1)}
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-bold text-white flex items-center gap-1.5">
                                      <span>{req.userName}</span>
                                      <span className="text-[10px] text-amber-400 font-mono">
                                        (Bal: ${userObj?.availableBalance.toFixed(2) || '0.00'})
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono">
                                      {req.userEmail} · ID: {req.userId.slice(-6)}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-3">
                                <div>
                                  <span className="inline-block bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded text-[10px] font-black mr-1.5">
                                    Plan {req.planLevel}
                                  </span>
                                  <span className="font-bold text-white">{req.planName}</span>
                                </div>
                              </td>

                              <td className="py-3 px-3 font-mono font-bold text-emerald-400 text-sm">
                                ${req.planPrice.toLocaleString()}
                              </td>

                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1.5">
                                  <Package className="w-3.5 h-3.5 text-blue-400" />
                                  <span className="font-bold text-white">
                                    {req.productCount} Products
                                  </span>
                                  {req.planLevel === 8 && (
                                    <span className="text-[10px] font-bold text-amber-400 ml-1">(Full Store)</span>
                                  )}
                                </div>
                              </td>

                              <td className="py-3 px-3">
                                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                  {req.profitPercentage}% Profit Margin
                                </span>
                              </td>

                              <td className="py-3 px-3 text-[11px] text-slate-400 whitespace-nowrap">
                                {req.requestedAt}
                              </td>

                              <td className="py-3 px-3">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                                    req.status === 'approved'
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                      : req.status === 'pending'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                  }`}
                                >
                                  {req.status === 'approved' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                                  {req.status === 'pending' && <Clock className="w-3 h-3 text-amber-400" />}
                                  {req.status === 'rejected' && <XCircle className="w-3 h-3 text-rose-400" />}
                                  <span>{req.status}</span>
                                </span>
                              </td>

                              <td className="py-3 px-4 text-right">
                                {req.status === 'pending' ? (
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleProcessPlanReq(req.id, 'approve')}
                                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition shadow flex items-center gap-1"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                      <span>Approve Plan & Add Products</span>
                                    </button>
                                    <button
                                      onClick={() => handleProcessPlanReq(req.id, 'reject')}
                                      className="bg-rose-900/60 hover:bg-rose-700 text-rose-200 border border-rose-700/60 font-bold px-2.5 py-1.5 rounded-xl text-xs transition flex items-center gap-1"
                                    >
                                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                      <span>Reject & Refund</span>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="text-[10px] text-slate-400">
                                    <div>Processed {req.processedAt || 'recently'}</div>
                                    <div className="italic text-slate-500 truncate max-w-[160px] ml-auto">
                                      {req.adminRemark}
                                    </div>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-Section 0A: MEMBER STORE INVENTORY & BUY BACK DESK */}
            {orderSubTab === 'buyback' && (
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-black text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      Member Store Inventory & Buy Back Desk ({userProducts.length} Items)
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      See which member purchased what product from front store. When you execute **Buy Back**, the product original amount + guaranteed profit is credited directly to the member's account, and the item is settled into their **Sell Products** tab!
                    </p>
                  </div>
                </div>

                {buyBackSuccessMsg && (
                  <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{buyBackSuccessMsg}</span>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/80 text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-700">
                      <tr>
                        <th className="py-3 px-4">Member Persona</th>
                        <th className="py-3 px-3">Product in Store</th>
                        <th className="py-3 px-3">Unit Price</th>
                        <th className="py-3 px-3">Stock / Sold</th>
                        <th className="py-3 px-3">Profit Tier</th>
                        <th className="py-3 px-3">Buy Back Credit & Profit ($)</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60 font-medium">
                      {userProducts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                            No member store inventory yet. Front members can buy products with balance or admin can assign plans to populate products.
                          </td>
                        </tr>
                      ) : (
                        userProducts.map((up) => {
                          const owner = allUsers.find((u) => u.id === up.userId);
                          const defaultCredit = up.product.discountPrice;
                          const defaultProfit = Number(
                            (up.product.discountPrice * (up.profitRate || 0.2)).toFixed(2)
                          );
                          const currentCredit =
                            buyBackCreditAmount[up.id] !== undefined
                              ? buyBackCreditAmount[up.id]
                              : defaultCredit;
                          const currentProfit =
                            buyBackProfitAmount[up.id] !== undefined
                              ? buyBackProfitAmount[up.id]
                              : defaultProfit;

                          return (
                            <tr key={up.id} className="hover:bg-slate-800/80 transition">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  {owner?.avatar && (
                                    <img
                                      src={owner.avatar}
                                      alt=""
                                      className="w-7 h-7 rounded-full object-cover border border-amber-400"
                                    />
                                  )}
                                  <div>
                                    <div className="font-bold text-white truncate max-w-[140px]">
                                      {owner?.name || 'Member'}
                                    </div>
                                    <div className="text-[10px] text-amber-400 font-mono">
                                      Bal: ${owner?.availableBalance.toFixed(2) || '0.00'}
                                    </div>
                                    <div className="text-[9px] text-slate-500 font-mono">
                                      ID: {up.userId.slice(-6)}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2 max-w-[200px]">
                                  <img
                                    src={up.product.imageUrl}
                                    alt=""
                                    className="w-8 h-8 rounded bg-white p-0.5 object-contain shrink-0"
                                  />
                                  <div className="truncate">
                                    <p className="font-bold text-white truncate">{up.product.title}</p>
                                    <span className="text-[10px] text-slate-400 uppercase">
                                      {up.product.category}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-3 font-mono font-bold text-amber-400">
                                ${up.product.discountPrice.toFixed(2)}
                              </td>

                              <td className="py-3 px-3 text-[11px]">
                                <span className="font-bold text-white">{up.stock} left</span>
                                <span className="text-slate-500 ml-1">({up.unitsSold} sold)</span>
                              </td>

                              <td className="py-3 px-3">
                                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                  {((up.profitRate || 0.2) * 100).toFixed(0)}% Yield
                                </span>
                              </td>

                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                  <div>
                                    <span className="text-[9px] text-slate-400 block">Credit ($)</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      value={currentCredit}
                                      onChange={(e) =>
                                        setBuyBackCreditAmount((prev) => ({
                                          ...prev,
                                          [up.id]: parseFloat(e.target.value) || 0,
                                        }))
                                      }
                                      className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono font-bold text-white outline-none focus:border-amber-400"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-emerald-400 block">+ Profit ($)</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      value={currentProfit}
                                      onChange={(e) =>
                                        setBuyBackProfitAmount((prev) => ({
                                          ...prev,
                                          [up.id]: parseFloat(e.target.value) || 0,
                                        }))
                                      }
                                      className="w-18 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono font-bold text-emerald-300 outline-none focus:border-emerald-400"
                                    />
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => handleOpenBuyBackModal(up)}
                                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs transition shadow flex items-center gap-1.5 ml-auto whitespace-nowrap"
                                >
                                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                                  <span>Review & Buy Back (+${(currentCredit + currentProfit).toFixed(2)})</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-Section 0B: STORE LEVEL & PLANS MANAGER (PLAN 1 - PLAN 8) */}
            {orderSubTab === 'plans' && (
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-6">
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    Merchant Store Level & Plans Manager (Plan 1 to Plan 8 - Full Store)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select any member from the platform to assign their merchant plan. Updating their level automatically populates the exact corresponding number of products (4, 8, 15, 22, 30, 40, 50, or all 58 Full Store) into their store!
                  </p>
                </div>

                {planSuccessMsg && (
                  <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{planSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleAdminAssignPlanSubmit} className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-700/60">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-amber-400" /> Select Target Member
                      </label>
                      <select
                        value={selectedPlanUserId}
                        onChange={(e) => setSelectedPlanUserId(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold outline-none focus:border-amber-400"
                      >
                        {allUsers.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} (Current: Plan {u.planLevel || 1}) • Bal: ${u.availableBalance.toFixed(0)} • Code: {u.referralCode}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Crown className="w-4 h-4 text-amber-400" /> Select New Store Plan
                      </label>
                      <select
                        value={selectedPlanLevel}
                        onChange={(e) => setSelectedPlanLevel(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold outline-none focus:border-amber-400"
                      >
                        {sellerPlans.map((p) => (
                          <option key={p.id} value={p.level}>
                            {p.name} — ${p.price.toLocaleString()} ({p.productCount} Products, {p.profitPercentage}% Profit)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Plan Preview */}
                  {(() => {
                    const chosen = sellerPlans.find((p) => p.level === selectedPlanLevel) || sellerPlans[0];
                    return (
                      <div className="p-4 rounded-xl bg-slate-800 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                              {chosen.badge}
                            </span>
                            <span className="text-sm font-bold text-white">{chosen.name}</span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">{chosen.description}</p>
                          <div className="text-[11px] text-emerald-400 font-bold mt-1">
                            Allocates {chosen.productCount} Active Catalog Products with {chosen.profitPercentage}% Buy-Back Profit Yield
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs transition shadow flex items-center gap-1.5"
                        >
                          <Crown className="w-4 h-4" />
                          <span>Assign Plan & Update Products</span>
                        </button>
                      </div>
                    );
                  })()}
                </form>

                {/* All 8 Plans Grid Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  {sellerPlans.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-amber-400">{p.badge}</span>
                        <span className="font-extrabold text-white font-mono">${p.price.toLocaleString()}</span>
                      </div>
                      <p className="font-bold text-slate-200">{p.name}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{p.productCount} Products</span>
                        <span className="text-emerald-400 font-bold">{p.profitPercentage}% Yield</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Section 1: ASSIGN PRODUCT / ORDER TO MEMBER ACCOUNT */}
            {orderSubTab === 'assign' && (
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-6">
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-amber-400" />
                    Assign Product Order to Member Account
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select any member from the 10 fake IDs or registered users. When assigned, the order and commission will appear immediately in that member's account!
                  </p>
                </div>

                {assignSuccessMsg && (
                  <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{assignSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleAssignOrderToMember} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Step 1: Target Member */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-amber-400" /> Select Target Member
                      </label>
                      <select
                        value={assignTargetUserId}
                        onChange={e => setAssignTargetUserId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold outline-none focus:border-amber-400"
                      >
                        {allUsers.map(u => (
                          <option key={u.id} value={u.id}>
                            {u.name} ({u.isFake ? 'Attached ID' : 'Real User'}) • Avail: ${u.availableBalance.toFixed(0)} • Score: {u.creditScore}% • Code: {u.referralCode}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-400">
                        The order will be directly deposited into this member's profile and orders tab.
                      </p>
                    </div>

                    {/* Step 2: Mode Toggle (Catalog Product vs Custom VIP Product) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Assignment Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setAssignMode('catalog')}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                            assignMode === 'catalog'
                              ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                              : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          Pick from 40 Store Products
                        </button>
                        <button
                          type="button"
                          onClick={() => setAssignMode('custom')}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                            assignMode === 'custom'
                              ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                              : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          Create Custom VIP Task
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mode A: Select from Catalog */}
                  {assignMode === 'catalog' ? (
                    <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-amber-400" /> Select Product from Catalog
                      </label>
                      <select
                        value={assignSelectedProductId}
                        onChange={e => setAssignSelectedProductId(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                      >
                        {products.map(p => {
                          const rate = p.commissionRate ?? 0.05;
                          return (
                            <option key={p.id} value={p.id}>
                              [{p.category.toUpperCase()}] {p.title} — ${p.discountPrice} (20% OFF) • Commission: ${(p.discountPrice * rate).toFixed(2)} ({(rate * 100).toFixed(0)}%)
                            </option>
                          );
                        })}
                      </select>

                      {/* Preview of chosen product */}
                      {(() => {
                        const chosen = products.find(p => p.id === assignSelectedProductId);
                        if (!chosen) return null;
                        const total = chosen.discountPrice * assignQuantity;
                        const comm = total * (chosen.commissionRate ?? 0.05);
                        return (
                          <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                            <img
                              src={chosen.imageUrl}
                              alt={chosen.title}
                              className="w-14 h-14 object-contain bg-white rounded-lg p-1"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-white text-xs truncate">{chosen.title}</div>
                              <div className="text-[11px] text-amber-400 font-semibold mt-0.5">
                                Unit Price: ${chosen.discountPrice.toFixed(2)} (20% OFF applied)
                              </div>
                              <div className="text-[10px] text-emerald-400 font-bold">
                                Member Commission Earned on Fulfillment: +${comm.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    /* Mode B: Custom VIP Task / Product */
                    <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-300">Custom Task / Product Name</label>
                          <input
                            type="text"
                            value={customTitle}
                            onChange={e => setCustomTitle(e.target.value)}
                            placeholder="e.g. Special VIP Order Allocation #90"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-300">Order Amount ($)</label>
                          <input
                            type="number"
                            value={customPrice}
                            onChange={e => setCustomPrice(Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-300">Commission Rate</label>
                          <select
                            value={customCommissionRate}
                            onChange={e => setCustomCommissionRate(Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                          >
                            <option value={0.03}>3% Standard</option>
                            <option value={0.05}>5% Silver</option>
                            <option value={0.08}>8% Gold VIP</option>
                            <option value={0.12}>12% Diamond High-Yield</option>
                            <option value={0.20}>20% Super Bonus</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quantity, Initial Status & Notes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Quantity</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={assignQuantity}
                        onChange={e => setAssignQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Initial Status</label>
                      <select
                        value={assignStatus}
                        onChange={e => setAssignStatus(e.target.value as OrderStatus)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                      >
                        <option value="pending">Pending (Awaiting Admin Buy / Fulfill)</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed (Instantly Credit Commission)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Admin Remark / Notes</label>
                      <input
                        type="text"
                        value={assignNotes}
                        onChange={e => setAssignNotes(e.target.value)}
                        placeholder="e.g. VIP allocation task"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Product Order to Member's Account
                  </button>
                </form>
              </div>
            )}

            {/* Sub-Section 2: LIVE ORDERS LIST & BUY FULFILLMENT */}
            {orderSubTab === 'orders' && (
              <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
                <div className="p-4 border-b border-slate-700/80 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-black text-white flex items-center gap-2">
                      <Package className="w-4 h-4 text-amber-400" />
                      All Placed Orders & Live Supplier Fulfillment Desk ({orders.length})
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Click "Buy / Fulfill Order" to mark the order complete and instantly credit the commission to the member's balance!
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/80 text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-700">
                      <tr>
                        <th className="py-3 px-4">Order #</th>
                        <th className="py-3 px-3">Member</th>
                        <th className="py-3 px-3">Product Item</th>
                        <th className="py-3 px-3">Total Amount</th>
                        <th className="py-3 px-3">Commission</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-4 text-right">Fulfillment Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60 font-medium">
                      {orders.map(order => {
                        const item = order.items[0];
                        return (
                          <tr key={order.id} className="hover:bg-slate-800/80 transition">
                            <td className="py-3 px-4">
                              <span className="font-mono font-bold text-amber-400">{order.orderNumber}</span>
                              <div className="text-[10px] text-slate-400">{order.createdAt}</div>
                            </td>

                            <td className="py-3 px-3">
                              <div className="font-bold text-white">{order.userName}</div>
                              <div className="text-[10px] text-slate-400">{order.userEmail}</div>
                            </td>

                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2 max-w-[220px]">
                                {item?.product?.imageUrl && (
                                  <img
                                    src={item.product.imageUrl}
                                    alt=""
                                    className="w-7 h-7 object-contain bg-white rounded p-0.5 shrink-0"
                                  />
                                )}
                                <span className="font-bold text-slate-200 truncate">
                                  {item ? item.product.title : 'Order Item'}
                                </span>
                              </div>
                            </td>

                            <td className="py-3 px-3 font-mono font-bold text-white">
                              ${order.totalAmount.toFixed(2)}
                            </td>

                            <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                              +${order.commissionEarned.toFixed(2)}
                            </td>

                            <td className="py-3 px-3">
                              {order.status === 'pending' && (
                                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                  Pending Buy
                                </span>
                              )}
                              {order.status === 'processing' && (
                                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                  Processing
                                </span>
                              )}
                              {order.status === 'completed' && (
                                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                  Fulfilled & Credited
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-right">
                              {order.status === 'pending' || order.status === 'processing' ? (
                                <button
                                  onClick={() => adminBuyFulfillOrder(order.id)}
                                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs transition shadow flex items-center gap-1.5 ml-auto"
                                >
                                  <ShoppingBag className="w-3.5 h-3.5" /> Buy / Fulfill Order
                                </button>
                              ) : (
                                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 justify-end">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-Section 3: ADD NEW PRODUCT TO STORE CATALOG & CREATE SHARE LINKS */}
            {orderSubTab === 'add_catalog' && (
              <div className="space-y-6">
                <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-black text-white flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-amber-400" />
                        Create & Publish New Product to Eseller Store
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Any product created here will immediately appear live on the front store catalog with 20% discount badge, instructions, and full checkout capability.
                      </p>
                    </div>

                    <div className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Instant Frontend Synchronization</span>
                    </div>
                  </div>

                  {catalogSuccessMsg && (
                    <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{catalogSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleAddNewCatalogProduct} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-300">Product Title / Name</label>
                        <input
                          type="text"
                          value={newCatalogTitle}
                          onChange={e => setNewCatalogTitle(e.target.value)}
                          placeholder="e.g. Apple iPhone 16 Pro Max 512GB Natural Titanium"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">Store Category</label>
                        <select
                          value={newCatalogCategory}
                          onChange={e => setNewCatalogCategory(e.target.value as ProductCategory)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400 font-bold"
                        >
                          <option value="mobiles">Mobiles & Smartphones</option>
                          <option value="laptops">Laptops & MacBooks</option>
                          <option value="electronics">Electronics & Gaming</option>
                          <option value="audio">Audio & Headphones</option>
                          <option value="wearables">Smart Watches & Wearables</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">Original Price ($)</label>
                        <input
                          type="number"
                          value={newCatalogOriginalPrice}
                          onChange={e => {
                            const orig = Number(e.target.value);
                            setNewCatalogOriginalPrice(orig);
                            setNewCatalogDiscountPrice(Number((orig * 0.8).toFixed(2)));
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-amber-400"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">Front Discount Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newCatalogDiscountPrice}
                          onChange={e => setNewCatalogDiscountPrice(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono font-bold outline-none focus:border-amber-400"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">Guaranteed Profit Rate</label>
                        <select
                          value={newCatalogProfitRate}
                          onChange={e => setNewCatalogProfitRate(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold outline-none focus:border-amber-400"
                        >
                          <option value={0.10}>10% Profit Margin</option>
                          <option value={0.15}>15% Profit Margin</option>
                          <option value={0.20}>20% Standard Margin (Default)</option>
                          <option value={0.25}>25% High-Yield Margin</option>
                          <option value={0.30}>30% Super Margin</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">Initial Stock Units</label>
                        <input
                          type="number"
                          min="1"
                          value={newCatalogStock}
                          onChange={e => setNewCatalogStock(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-amber-400"
                          required
                        />
                      </div>
                    </div>

                    {/* Image URL & Quick Demo Presets */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-300">Product Image URL</label>
                        <span className="text-[10px] text-slate-400">Or pick one of the quick presets below:</span>
                      </div>
                      <input
                        type="url"
                        value={newCatalogImage}
                        onChange={e => setNewCatalogImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                      />

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {[
                          { label: 'iPhone 16 Pro', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=400&q=80' },
                          { label: 'MacBook Pro M3', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80' },
                          { label: 'Sony WH-1000XM5', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80' },
                          { label: 'Apple Watch Ultra', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80' },
                          { label: 'Galaxy S24 Ultra', url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=400&q=80' },
                          { label: 'RTX 4090 Gaming Rig', url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80' },
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setNewCatalogImage(preset.url)}
                            className="text-[10px] bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-1 rounded-lg border border-slate-700 transition"
                          >
                            + {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">Specifications (comma separated)</label>
                        <input
                          type="text"
                          value={newCatalogSpecs}
                          onChange={e => setNewCatalogSpecs(e.target.value)}
                          placeholder="e.g. 512GB Storage, 16GB RAM, 5G Chipset, Titanium Frame"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-amber-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Instructions & Delivery Notes (Special Requirement)</span>
                        </label>
                        <input
                          type="text"
                          value={newCatalogInstructions}
                          onChange={e => setNewCatalogInstructions(e.target.value)}
                          placeholder="e.g. Verify IMEI upon receipt. Immediate buy-back eligible upon plan settlement."
                          className="w-full bg-slate-900 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Product Overview & Detailed Description</label>
                      <textarea
                        rows={2}
                        value={newCatalogDesc}
                        onChange={e => setNewCatalogDesc(e.target.value)}
                        placeholder="Comprehensive product copy shown in store..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Publish Product to Front Store</span>
                    </button>
                  </form>
                </div>

                {/* Catalog Listing & Share Links Table */}
                <div className="bg-slate-800/50 border border-slate-700/80 rounded-3xl overflow-hidden shadow-xl space-y-4 p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Link className="w-4 h-4 text-amber-400" />
                        Store Product Catalog & Custom Referral Direct-Buy Links ({products.length} Products)
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Generate custom promotional links with modified price and profit yield. When a customer opens the link on frontend, a Direct Buy modal opens instantly!
                      </p>
                    </div>

                    <div className="text-xs text-slate-300 font-mono">
                      Catalog Total: <strong className="text-white">{products.length}</strong> items
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900/80 text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-700">
                        <tr>
                          <th className="py-3 px-4">Product Details</th>
                          <th className="py-3 px-3">Category</th>
                          <th className="py-3 px-3">Front Price</th>
                          <th className="py-3 px-3">Commission / Profit</th>
                          <th className="py-3 px-3">Stock</th>
                          <th className="py-3 px-4 text-right">Referral / Share Link</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60 font-medium">
                        {products.map(prod => {
                          const profit = (prod.discountPrice * (prod.commissionRate || 0.20)).toFixed(2);
                          return (
                            <tr key={prod.id} className="hover:bg-slate-800/80 transition">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3 max-w-[280px]">
                                  <img
                                    src={prod.imageUrl}
                                    alt={prod.title}
                                    className="w-10 h-10 object-contain bg-white rounded-lg p-1 shrink-0 border border-slate-700"
                                  />
                                  <div className="min-w-0">
                                    <div className="font-bold text-white truncate">{prod.title}</div>
                                    {prod.instructions && (
                                      <div className="text-[10px] text-amber-400 truncate">
                                        ℹ️ {prod.instructions}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-3">
                                <span className="bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                  {prod.category}
                                </span>
                              </td>

                              <td className="py-3 px-3 font-mono font-bold text-white">
                                <div>${prod.discountPrice.toFixed(2)}</div>
                                <div className="text-[10px] text-slate-500 line-through">${prod.originalPrice.toFixed(2)}</div>
                              </td>

                              <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                                +${profit} ({( (prod.commissionRate || 0.20) * 100 ).toFixed(0)}%)
                              </td>

                              <td className="py-3 px-3 font-mono text-slate-300">
                                {prod.stock || 50} units
                              </td>

                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => handleOpenShareModal(prod)}
                                  className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 font-bold px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 ml-auto shadow"
                                >
                                  <Link className="w-3.5 h-3.5" />
                                  <span>Generate Share Link</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: CHAT (Chat with 10 Members & Real Users)                */}
        {/* ============================================================== */}
        {activeAdminTab === 'chat' && (
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[620px]">
            {/* Left Column: 10 Members + Real User List */}
            <div className="md:col-span-4 border-r border-slate-700/80 flex flex-col bg-slate-900/60">
              <div className="p-4 border-b border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    Member Threads ({chatMembers.length})
                  </h3>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                    10 Fake IDs + Main
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={chatSearchQuery}
                    onChange={e => setChatSearchQuery(e.target.value)}
                    placeholder="Search member..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Members Scroll List */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 max-h-[500px]">
                {chatMembers.map(member => {
                  const isSelected = member.id === selectedChatUserId;
                  const memberMessages = chatMessages.filter(m => m.targetUserId === member.id);
                  const lastMsg = memberMessages[memberMessages.length - 1];

                  return (
                    <button
                      key={member.id}
                      onClick={() => setSelectedChatUserId(member.id)}
                      className={`w-full text-left p-3.5 transition flex items-center gap-3 ${
                        isSelected
                          ? 'bg-amber-500/15 border-l-4 border-amber-400 text-white'
                          : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border-2 border-slate-900"></span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black truncate">{member.name}</span>
                          <span className="text-[10px] font-mono text-amber-400/80">{member.vipLevel}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                          <span className="truncate max-w-[150px]">
                            {lastMsg ? lastMsg.text : 'Click to start conversation'}
                          </span>
                          <span className="font-mono text-[9px] text-slate-500">
                            ${member.availableBalance.toFixed(0)}
                          </span>
                        </div>
                        <div className="text-[9px] font-mono text-slate-500 mt-0.5">
                          Code: {member.referralCode}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Live Conversation Desk with Selected Member */}
            <div className="md:col-span-8 flex flex-col bg-slate-950/40">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-700/80 bg-slate-900/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedChatUser.avatar}
                    alt={selectedChatUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-400/60"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white">{selectedChatUser.name}</h4>
                      <span className="text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded-full border border-slate-700 font-bold">
                        {selectedChatUser.vipLevel}
                      </span>
                      {selectedChatUser.isFake ? (
                        <span className="text-[9px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                          10 Core Fake ID
                        </span>
                      ) : (
                        <span className="text-[9px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded font-bold">
                          Front Customer
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>Available: <strong className="text-white">${selectedChatUser.availableBalance.toFixed(2)}</strong></span>
                      <span>•</span>
                      <span>Credit Score: <strong className="text-amber-400">{selectedChatUser.creditScore}%</strong></span>
                      <span>•</span>
                      <span>Ref Code: <strong className="text-emerald-400">{selectedChatUser.referralCode}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSimulateMemberReply}
                    title="Simulate customer typing and replying"
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1"
                  >
                    <Bot className="w-3.5 h-3.5 text-amber-400" /> Simulate Member Reply
                  </button>

                  <button
                    onClick={() => {
                      switchActiveUser(selectedChatUser.id);
                      setViewMode('frontend');
                    }}
                    title="Open front store as this member"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-3 py-1.5 rounded-xl font-black transition flex items-center gap-1"
                  >
                    <UserCheck className="w-3.5 h-3.5" /> Login As Member
                  </button>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[360px] max-h-[420px]">
                {chatThread.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs italic">
                    No previous messages with {selectedChatUser.name}. Type below to send a customer service message.
                  </div>
                ) : (
                  chatThread.map(msg => {
                    const isFromAdmin = msg.senderRole === 'admin' || msg.senderRole === 'agent';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isFromAdmin ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400 font-medium">
                          <span>{msg.senderName}</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs font-medium shadow-sm ${
                            isFromAdmin
                              ? 'bg-amber-500 text-slate-950 font-semibold rounded-tr-none'
                              : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Quick Reply Presets */}
              <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[10px] text-slate-400 shrink-0 font-bold">Quick Replies:</span>
                {[
                  'Your order has been purchased and commission credited!',
                  'Your withdrawal request is approved and payout dispatched.',
                  'Please complete the assigned product order to upgrade VIP tier.',
                  `Your credit score is 100%. Priority processing granted.`,
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      sendAdminChatMessage(selectedChatUserId, preset, 'E-seller Admin Supervisor');
                    }}
                    className="text-[10px] bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition whitespace-nowrap"
                  >
                    {preset.slice(0, 32)}...
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendAdminChat} className="p-3 bg-slate-900 border-t border-slate-700/80 flex items-center gap-2">
                <input
                  type="text"
                  value={adminChatText}
                  onChange={e => setAdminChatText(e.target.value)}
                  placeholder={`Reply to ${selectedChatUser.name} as Customer Service Admin...`}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition shadow flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Financials Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={editingUser.avatar}
                  alt={editingUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-amber-400"
                />
                <div>
                  <h3 className="text-sm font-black text-white">{editingUser.name}</h3>
                  <div className="text-[10px] text-slate-400">{editingUser.email}</div>
                  <div className="text-[10px] text-amber-400 font-mono mt-0.5">Code: {editingUser.referralCode}</div>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white p-1 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {editSuccessMsg && (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{editSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveUserFinancials} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Available Balance ($)</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Current: ${editingUser.availableBalance.toFixed(2)}</span>
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    step="0.01"
                    value={editAvailable}
                    onChange={e => setEditAvailable(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Freeze Balance ($)</span>
                  <span className="text-[10px] text-indigo-400 font-mono">Current: ${editingUser.freezeBalance.toFixed(2)}</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    step="0.01"
                    value={editFreeze}
                    onChange={e => setEditFreeze(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Credit Score (0% - 100%)</label>
                  <span className="font-mono text-xs font-black text-amber-400">{editCreditScore}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editCreditScore}
                  onChange={e => setEditCreditScore(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Member Withdrawal Lock Control */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Member Withdrawal Permission</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    editCanWithdraw ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {editCanWithdraw ? 'Withdrawals Open' : 'Withdrawals Blocked'}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setEditCanWithdraw(true)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                      editCanWithdraw
                        ? 'bg-emerald-600 text-white border-emerald-500 font-black shadow'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Open / Allowed
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditCanWithdraw(false)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                      !editCanWithdraw
                        ? 'bg-rose-600 text-white border-rose-500 font-black shadow'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" /> Block / Locked
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  If blocked, member cannot withdraw from front store and will be instructed to contact admin.
                </p>
              </div>

              {/* Store Activation Plan (Plan 1 - Plan 8) */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Store Plan Level (Plan 1 - Plan 8)</span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">Plan {editPlanLevel}</span>
                </label>
                <select
                  value={editPlanLevel}
                  onChange={e => setEditPlanLevel(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-amber-400"
                >
                  {sellerPlans.map(p => (
                    <option key={p.id} value={p.level}>
                      {p.name} — ${p.price.toLocaleString()} ({p.productCount} prods, {p.profitPercentage}% profit)
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Changing plan auto-populates {sellerPlans.find(p => p.level === editPlanLevel)?.productCount || 4} products into this member's My Products tab.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl text-xs transition uppercase tracking-wider shadow"
              >
                Save Changes to Member Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DEDICATED BUY BACK CONFIRMATION & PROFIT SETTLEMENT MODAL     */}
      {/* ============================================================== */}
      {buyBackModalItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Execute Buy Back & Settle Profit</h3>
                  <p className="text-xs text-slate-400">Review refund capital and guaranteed profit settlement</p>
                </div>
              </div>
              <button
                onClick={() => setBuyBackModalItem(null)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Target Member Card */}
            {(() => {
              const member = allUsers.find(u => u.id === buyBackModalItem.userId);
              const currentTotalCredit = Number((modalCreditAmount + modalProfitAmount).toFixed(2));
              const projectedNewBalance = Number(((member?.availableBalance || 0) + currentTotalCredit).toFixed(2));

              return (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {member?.avatar ? (
                        <img src={member.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-amber-400" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center">
                          {member?.name.slice(0, 1) || 'M'}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-white text-xs">{member?.name || 'Member'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {buyBackModalItem.userId}</div>
                        <div className="text-[10px] text-amber-400 font-bold">{member?.planName || 'Plan 1'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Current Balance</div>
                      <div className="text-sm font-mono font-bold text-emerald-400">
                        ${member?.availableBalance.toFixed(2) || '0.00'}
                      </div>
                    </div>
                  </div>

                  {/* Target Product Info */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
                    <img
                      src={buyBackModalItem.product.imageUrl}
                      alt=""
                      className="w-12 h-12 rounded-xl bg-white p-1 object-contain shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-xs truncate">{buyBackModalItem.product.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                        <span className="uppercase">{buyBackModalItem.product.category}</span>
                        <span>·</span>
                        <span>Wholesale Price: <strong className="text-amber-400 font-mono">${buyBackModalItem.product.discountPrice.toFixed(2)}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Editable Settlement Amounts */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
                      <label className="text-[11px] font-bold text-slate-300 block">
                        Capital Amount to Credit ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={modalCreditAmount}
                        onChange={(e) => setModalCreditAmount(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono font-bold text-white outline-none focus:border-amber-400"
                      />
                      <span className="text-[9px] text-slate-400">Original unit wholesale cost refund</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
                      <label className="text-[11px] font-bold text-emerald-400 block">
                        Guaranteed Profit Amount ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={modalProfitAmount}
                        onChange={(e) => setModalProfitAmount(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono font-bold text-emerald-300 outline-none focus:border-emerald-400"
                      />
                      <span className="text-[9px] text-slate-400">Guaranteed buy-back profit yield</span>
                    </div>
                  </div>

                  {/* Settlement Breakdown Card */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Wholesale Capital Refund:</span>
                      <span className="font-mono font-bold text-white">${modalCreditAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Guaranteed Profit Yield:</span>
                      <span className="font-mono">+${modalProfitAmount.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-amber-500/30 flex justify-between text-sm font-black text-amber-300">
                      <span>Total Amount Added to Account:</span>
                      <span className="font-mono text-base">+${currentTotalCredit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                      <span>Member's Projected New Balance:</span>
                      <span className="font-mono font-bold text-emerald-300">${projectedNewBalance.toFixed(2)}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Executing buy back will deposit +${currentTotalCredit.toFixed(2)} directly into {member?.name}'s available balance, and transfer this item into their <strong>Sell Products</strong> tab with an official settlement notification.
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setBuyBackModalItem(null)}
                      className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmBuyBackModal}
                      className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black rounded-xl transition shadow flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 fill-current" />
                      <span>Confirm & Deposit (+${currentTotalCredit.toFixed(2)})</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* 1. Administrative Withdrawal Decision & Custom Reason Modal */}
      {wdModalTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    wdDecision === 'approve' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {wdDecision === 'approve' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {wdDecision === 'approve' ? 'Approve & Release Payout' : 'Reject Withdrawal Application'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Applicant: <strong className="text-white">{wdModalTarget.userName}</strong> ({wdModalTarget.userEmail})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWdModalTarget(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Payout Details */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Net Payout Amount:</span>
                <span className="font-mono font-black text-emerald-400 text-sm">
                  ${wdModalTarget.receivedAmount.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Destination Method:</span>
                <span className="font-bold text-slate-200">{wdModalTarget.method}</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-800">
                <span className="text-slate-500 block text-[10px]">Account / Wallet Address:</span>
                <span className="font-mono text-amber-300 text-[11px] break-all select-all">
                  {wdModalTarget.accountDetails}
                </span>
              </div>
            </div>

            {/* Admin Note / Rejection Reason Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <span>
                  {wdDecision === 'approve'
                    ? 'Administrative Approval Note / Transaction Ref:'
                    : 'Rejection Reason (Shown to User on Front):'}
                </span>
                <span className="text-[10px] text-amber-400 font-normal">Custom text & note</span>
              </label>
              <textarea
                rows={3}
                value={wdNote}
                onChange={e => setWdNote(e.target.value)}
                placeholder={
                  wdDecision === 'approve'
                    ? 'e.g. Paid via USDT TRC20 TX-7391823. Transferred successfully.'
                    : 'e.g. Destination account details did not match KYC verified profile. Please update.'
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                required
              />
            </div>

            {/* Timestamp input / audit record */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Audit Timestamp</span>
              </label>
              <input
                type="text"
                value={wdTime}
                onChange={e => setWdTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono outline-none focus:border-amber-400"
              />
              <p className="text-[10px] text-slate-400">
                This exact note and timestamp will be shown in the user's frontend Withdrawal History tab and notifications.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setWdModalTarget(null)}
                className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmWdDecision}
                className={`flex-1 py-2.5 px-4 text-xs font-black rounded-xl transition shadow flex items-center justify-center gap-1.5 ${
                  wdDecision === 'approve'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    : 'bg-rose-500 hover:bg-rose-400 text-white'
                }`}
              >
                {wdDecision === 'approve' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>{wdDecision === 'approve' ? 'Confirm Payout Approval' : 'Confirm Rejection & Refund'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Custom Product Share / Direct-Buy Link Modal */}
      {shareTargetProd && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Link className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Create Custom Direct-Buy Share Link</h3>
                  <p className="text-xs text-slate-400">Customize price & guaranteed profit for your customer</p>
                </div>
              </div>
              <button
                onClick={() => setShareTargetProd(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Target Product Preview */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <img
                src={shareTargetProd.imageUrl}
                alt={shareTargetProd.title}
                className="w-14 h-14 object-contain bg-white rounded-xl p-1 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  {shareTargetProd.category}
                </span>
                <p className="font-bold text-white text-xs truncate mt-1">{shareTargetProd.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Original Catalog Discount Price:{' '}
                  <strong className="text-slate-200 font-mono">${shareTargetProd.discountPrice.toFixed(2)}</strong>
                </p>
              </div>
            </div>

            {/* Customization Inputs */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Custom Deal Title</label>
                <input
                  type="text"
                  value={shareTitle}
                  onChange={e => setShareTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Target Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={sharePrice}
                    onChange={e => setSharePrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-500">Amount buyer will pay</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-400">Guaranteed Profit ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={shareProfit}
                    onChange={e => setShareProfit(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-emerald-300 font-mono font-bold outline-none focus:border-emerald-400"
                  />
                  <span className="text-[10px] text-slate-500">Credited on fulfillment</span>
                </div>
              </div>
            </div>

            {/* Generated Link URL Box */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950 border border-amber-500/30">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Link className="w-3.5 h-3.5" /> Direct-Buy Share URL
                </span>
                {copyFeedback && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Link Copied to Clipboard!
                  </span>
                )}
              </div>
              <input
                type="text"
                readOnly
                value={getShareableUrl()}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-slate-300 select-all outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="w-full sm:flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black rounded-xl transition shadow flex items-center justify-center gap-1.5"
              >
                {copyFeedback ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copyFeedback ? 'Copied Successfully!' : 'Copy Share Link'}</span>
              </button>

              <button
                type="button"
                onClick={handleTestShareLinkInStore}
                className="w-full sm:flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <ExternalLink className="w-4 h-4 text-amber-400" />
                <span>Test Link in Front Store</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
