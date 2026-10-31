import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Product,
  Order,
  WithdrawalRequest,
  ChatMessage,
  MessageNotification,
  WithdrawalMethod,
  OrderStatus,
  ProductCategory,
  TopSeller,
  UserProduct,
  CartItem,
  BankAccountDetails,
  PaymentMethodType,
  SellerPlan,
  SELLER_PLANS,
  PlanPurchaseRequest,
} from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';
import { INITIAL_MAIN_USER, INITIAL_FAKE_USERS } from '../data/mockUsers';
import { INITIAL_TOP_SELLERS } from '../data/mockTopSellers';

import { isSupabaseConfigured } from '../lib/supabaseClient';

// Helper for guaranteed unique keys and IDs to prevent collision in React render trees
export const generateUniqueId = (prefix: string = 'id'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

interface AppContextType {
  // Supabase Database Connection
  isSupabaseModalOpen: boolean;
  setIsSupabaseModalOpen: (open: boolean) => void;
  isSupabaseConfigured: boolean;
  checkSupabaseConfig: () => void;

  // Navigation & View Mode
  viewMode: 'frontend' | 'backend';
  setViewMode: (mode: 'frontend' | 'backend') => void;
  frontendTab: 'home' | 'my_products' | 'sell_products' | 'orders' | 'profile';
  setFrontendTab: (tab: 'home' | 'my_products' | 'sell_products' | 'orders' | 'profile') => void;

  // Active User & All Users
  currentUser: User;
  setCurrentUser: (user: User) => void;
  allUsers: User[];
  switchActiveUser: (userId: string) => void;
  loginOrRegister: (email: string, name: string, referralCode?: string, phone?: string, password?: string) => void;
  logout: () => void;
  updateUserWithdrawalPermission: (userId: string, canWithdraw: boolean) => void;

  // Products & Top Sellers
  products: Product[];
  topSellers: TopSeller[];
  selectedProductForOrder: Product | null;
  setSelectedProductForOrder: (product: Product | null) => void;
  adminAddProductToCatalog: (newProduct: Omit<Product, 'id'>) => void;
  buyProductWithBalance: (product: Product, quantity?: number) => { success: boolean; message: string };

  // Merchant Store Inventory (My Products Tab) & Buy Back
  userProducts: UserProduct[];
  addProductToMerchantStore: (catalogId: string, stock: number) => void;
  removeProductFromMerchantStore: (userProductId: string) => void;
  adminBuyBackProduct: (userProductId: string, totalAmountToCredit: number, profitAmount: number) => { success: boolean; message: string };

  // Shopping Cart & Drawer
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  checkoutCart: (
    shippingAddress: string,
    paymentMethod: PaymentMethodType,
    customerName: string,
    customerEmail: string
  ) => { success: boolean; message: string; orderId?: string };
  submitProductBankPayment: (
    productId: string,
    senderBank: string,
    senderAcc: string,
    senderHolder: string,
    txRef: string
  ) => { success: boolean; message: string };

  // Orders
  orders: Order[];
  placeOrder: (product: Product, quantity?: number) => void;
  adminBuyFulfillOrder: (orderId: string) => void;
  adminUpdateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  adminAddOrderToUser: (
    userId: string,
    productId: string,
    quantity?: number,
    customNotes?: string,
    customStatus?: OrderStatus
  ) => void;
  adminAssignCustomProductToUser: (
    userId: string,
    title: string,
    price: number,
    commissionRate: number,
    category?: ProductCategory,
    description?: string
  ) => void;

  // Withdrawals
  withdrawals: WithdrawalRequest[];
  requestWithdrawal: (method: WithdrawalMethod, accountDetails: string, amount: number) => { success: boolean; message: string };
  requestBankWithdrawal: (bank: BankAccountDetails, amount: number) => { success: boolean; message: string };
  addBankAccount: (bank: Omit<BankAccountDetails, 'id'>) => void;
  adminProcessWithdrawal: (withdrawalId: string, action: 'approve' | 'reject', remark?: string) => void;

  // Balances & Credit Score Controls (Admin)
  updateUserBalance: (userId: string, availableDeltaOrExact: number, freezeDeltaOrExact: number, isExact?: boolean) => void;
  updateUserCreditScore: (userId: string, newScore: number) => void;

  // Chat & Telegram Support
  chatMessages: ChatMessage[];
  sendUserChatMessage: (text: string) => void;
  sendCustomerChatMessage: (text: string, orderNumber?: string, department?: string) => void;
  sendAdminChatMessage: (targetUserId: string, text: string, agentName?: string) => void;
  telegramSupportUrl: string;
  setTelegramSupportUrl: (url: string) => void;

  // Notifications
  notifications: MessageNotification[];
  markNotificationsRead: (userId: string) => void;
  sendMemberNotificationWithImage: (userId: string, title: string, content: string, imageUrl?: string) => void;

  // Store Activation Plans (Plan 1 to Plan 8 - Full Store) & Approval Desk
  sellerPlans: SellerPlan[];
  planRequests: PlanPurchaseRequest[];
  isPlansModalOpen: boolean;
  setIsPlansModalOpen: (open: boolean) => void;
  assignPlanToMember: (userId: string, planLevel: number) => { success: boolean; message: string; count: number };
  activatePlanWithBalance: (planLevel: number) => { success: boolean; message: string };
  requestPlanPurchase: (planLevel: number) => { success: boolean; message: string };
  adminProcessPlanRequest: (requestId: string, action: 'approve' | 'reject', remark?: string) => { success: boolean; message: string };

  // Modals
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isWithdrawModalOpen: boolean;
  setIsWithdrawModalOpen: (open: boolean) => void;
  isMessagesModalOpen: boolean;
  setIsMessagesModalOpen: (open: boolean) => void;
  isCustomerServiceOpen: boolean;
  setIsCustomerServiceOpen: (open: boolean) => void;

  // Stats
  unreadNotificationCount: number;
  unreadChatCount: number;
  pendingWithdrawalsCount: number;
  pendingOrdersCount: number;
  pendingPlanRequestsCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ebuy_ecommerce_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [viewMode, setViewMode] = useState<'frontend' | 'backend'>('frontend');
  const [frontendTab, setFrontendTab] = useState<'home' | 'my_products' | 'sell_products' | 'orders' | 'profile'>('home');

  // Modals
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [isSupabaseReady, setIsSupabaseReady] = useState<boolean>(() => isSupabaseConfigured());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState<boolean>(false);
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState<boolean>(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState<boolean>(false);
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<Product | null>(null);

  const checkSupabaseConfig = () => {
    setIsSupabaseReady(isSupabaseConfigured());
  };

  useEffect(() => {
    const handleConfigChange = () => {
      setIsSupabaseReady(isSupabaseConfigured());
    };
    window.addEventListener('supabase-config-changed', handleConfigChange);
    return () => window.removeEventListener('supabase-config-changed', handleConfigChange);
  }, []);

  // Telegram Support URL Config
  const [telegramSupportUrl, setTelegramSupportUrlState] = useState<string>(() => {
    return localStorage.getItem(`${LOCAL_STORAGE_KEY}_telegramUrl`) || 'https://t.me/EbuyOfficialSupport';
  });

  const setTelegramSupportUrl = (url: string) => {
    setTelegramSupportUrlState(url);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_telegramUrl`, url);
  };

  // Core Data
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_products`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [topSellers] = useState<TopSeller[]>(INITIAL_TOP_SELLERS);

  // Shopping Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_cart`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // User Products (Merchant Store)
  const [userProducts, setUserProducts] = useState<UserProduct[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_userProducts`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'up-1',
        userId: INITIAL_MAIN_USER.id,
        productId: INITIAL_PRODUCTS[0].id,
        product: INITIAL_PRODUCTS[0],
        stock: 25,
        unitsSold: 14,
        revenueGenerated: Number((INITIAL_PRODUCTS[0].discountPrice * 14).toFixed(2)),
        profitRate: 0.20,
        listedDate: '2026-02-15',
      },
      {
        id: 'up-2',
        userId: INITIAL_MAIN_USER.id,
        productId: INITIAL_PRODUCTS[1].id,
        product: INITIAL_PRODUCTS[1],
        stock: 18,
        unitsSold: 9,
        revenueGenerated: Number((INITIAL_PRODUCTS[1].discountPrice * 9).toFixed(2)),
        profitRate: 0.20,
        listedDate: '2026-02-18',
      },
    ];
  });

  // Store Plan Purchase Applications (Pending backend admin review)
  const [planRequests, setPlanRequests] = useState<PlanPurchaseRequest[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_planRequests`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'req-plan-101',
        userId: INITIAL_MAIN_USER.id,
        userName: INITIAL_MAIN_USER.name,
        userEmail: INITIAL_MAIN_USER.email,
        planLevel: 2,
        planName: 'Plan 2 - Pro Merchant',
        planPrice: 350,
        productCount: 8,
        profitPercentage: 22,
        requestedAt: '2026-10-28 11:20 AM',
        status: 'pending',
      },
      {
        id: 'req-plan-102',
        userId: INITIAL_FAKE_USERS[0].id,
        userName: INITIAL_FAKE_USERS[0].name,
        userEmail: INITIAL_FAKE_USERS[0].email,
        planLevel: 3,
        planName: 'Plan 3 - Advanced Enterprise',
        planPrice: 1200,
        productCount: 15,
        profitPercentage: 25,
        requestedAt: '2026-10-28 01:45 PM',
        status: 'pending',
      },
    ];
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_users`);
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((u) => ({
            ...u,
            referralCode: u.referralCode || `REF-${u.id.replace('user-', '')}`,
            bankAccounts: u.bankAccounts && u.bankAccounts.length > 0 ? u.bankAccounts : INITIAL_MAIN_USER.bankAccounts,
            pendingBalance: u.pendingBalance ?? 0,
            storeName: u.storeName || `${u.name} Store`,
            canWithdraw: u.canWithdraw !== false,
            password: u.password || 'password123',
            planLevel: u.planLevel || 1,
            planName: u.planName || 'Plan 1 - Starter Store',
            pendingPlanLevel: u.pendingPlanLevel,
            pendingPlanName: u.pendingPlanName,
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [INITIAL_MAIN_USER, ...INITIAL_FAKE_USERS];
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem(`${LOCAL_STORAGE_KEY}_currentUserId`) || INITIAL_MAIN_USER.id;
  });

  const rawUser = allUsers.find(u => u.id === currentUserId) || allUsers[0] || INITIAL_MAIN_USER;
  const currentUser: User = {
    ...rawUser,
    bankAccounts: rawUser.bankAccounts && rawUser.bankAccounts.length > 0 ? rawUser.bankAccounts : INITIAL_MAIN_USER.bankAccounts,
    referralCode: rawUser.referralCode || `REF-${rawUser.id.replace('user-', '')}`,
    pendingBalance: rawUser.pendingBalance ?? 0,
    storeName: rawUser.storeName || `${rawUser.name} Store`,
    canWithdraw: rawUser.canWithdraw !== false,
    password: rawUser.password || 'password123',
    planLevel: rawUser.planLevel || 1,
    planName: rawUser.planName || 'Plan 1 - Starter Store',
    pendingPlanLevel: rawUser.pendingPlanLevel,
    pendingPlanName: rawUser.pendingPlanName,
  };

  // Initial Seed Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_orders`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'ord-1001',
        orderNumber: 'EB-2026-9021',
        userId: INITIAL_MAIN_USER.id,
        userName: INITIAL_MAIN_USER.name,
        userEmail: INITIAL_MAIN_USER.email,
        items: [
          {
            product: INITIAL_PRODUCTS[0], // iPhone 16 Pro Max
            quantity: 1,
            unitPrice: INITIAL_PRODUCTS[0].discountPrice,
          },
        ],
        totalAmount: INITIAL_PRODUCTS[0].discountPrice,
        commissionEarned: Number((INITIAL_PRODUCTS[0].discountPrice * 0.05).toFixed(2)),
        status: 'pending',
        createdAt: '2026-10-28 09:15 AM',
        updatedAt: '2026-10-28 09:15 AM',
        notes: 'Awaiting supplier confirmation from backend',
        processedByAdmin: false,
      },
      {
        id: 'ord-1002',
        orderNumber: 'EB-2026-8842',
        userId: INITIAL_MAIN_USER.id,
        userName: INITIAL_MAIN_USER.name,
        userEmail: INITIAL_MAIN_USER.email,
        items: [
          {
            product: INITIAL_PRODUCTS[26], // Sony Headphones
            quantity: 1,
            unitPrice: INITIAL_PRODUCTS[26].discountPrice,
          },
        ],
        totalAmount: INITIAL_PRODUCTS[26].discountPrice,
        commissionEarned: Number((INITIAL_PRODUCTS[26].discountPrice * 0.05).toFixed(2)),
        status: 'completed',
        createdAt: '2026-10-27 02:40 PM',
        updatedAt: '2026-10-27 03:00 PM',
        notes: 'Verified and delivered',
        processedByAdmin: true,
      },
      {
        id: 'ord-1003',
        orderNumber: 'EB-2026-7731',
        userId: INITIAL_FAKE_USERS[0].id, // Sarah Jenkins
        userName: INITIAL_FAKE_USERS[0].name,
        userEmail: INITIAL_FAKE_USERS[0].email,
        items: [
          {
            product: INITIAL_PRODUCTS[8], // MacBook Pro 16"
            quantity: 1,
            unitPrice: INITIAL_PRODUCTS[8].discountPrice,
          },
        ],
        totalAmount: INITIAL_PRODUCTS[8].discountPrice,
        commissionEarned: Number((INITIAL_PRODUCTS[8].discountPrice * 0.06).toFixed(2)),
        status: 'processing',
        createdAt: '2026-10-28 08:30 AM',
        updatedAt: '2026-10-28 08:45 AM',
        notes: 'High-tier VIP grab order',
        processedByAdmin: false,
      },
      {
        id: 'ord-1004',
        orderNumber: 'EB-2026-6629',
        userId: INITIAL_FAKE_USERS[1].id, // David Chen
        userName: INITIAL_FAKE_USERS[1].name,
        userEmail: INITIAL_FAKE_USERS[1].email,
        items: [
          {
            product: INITIAL_PRODUCTS[1], // S25 Ultra
            quantity: 2,
            unitPrice: INITIAL_PRODUCTS[1].discountPrice,
          },
        ],
        totalAmount: INITIAL_PRODUCTS[1].discountPrice * 2,
        commissionEarned: Number((INITIAL_PRODUCTS[1].discountPrice * 2 * 0.05).toFixed(2)),
        status: 'completed',
        createdAt: '2026-10-26 11:20 AM',
        updatedAt: '2026-10-26 12:15 PM',
        notes: 'Order batch fulfilled',
        processedByAdmin: true,
      },
    ];
  });

  // Initial Withdrawals
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_withdrawals`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'wd-501',
        userId: INITIAL_MAIN_USER.id,
        userName: INITIAL_MAIN_USER.name,
        userEmail: INITIAL_MAIN_USER.email,
        method: 'USDT (TRC20)',
        accountDetails: 'TQjX9yMvT8p2zWk9N7rV5kH8xLpQr4190Z',
        amount: 500.00,
        fee: 5.00,
        receivedAmount: 495.00,
        status: 'pending',
        requestedAt: '2026-10-28 07:45 AM',
        adminRemark: 'Under automated compliance review',
      },
      {
        id: 'wd-502',
        userId: INITIAL_FAKE_USERS[3].id, // Marcus Thorne
        userName: INITIAL_FAKE_USERS[3].name,
        userEmail: INITIAL_FAKE_USERS[3].email,
        method: 'Bank Transfer',
        accountDetails: 'Barclays Bank UK - IBAN GB29BARC202015392819',
        amount: 1200.00,
        fee: 15.00,
        receivedAmount: 1185.00,
        status: 'pending',
        requestedAt: '2026-10-28 08:10 AM',
        adminRemark: 'Awaiting swift verification',
      },
      {
        id: 'wd-503',
        userId: INITIAL_FAKE_USERS[1].id, // David Chen
        userName: INITIAL_FAKE_USERS[1].name,
        userEmail: INITIAL_FAKE_USERS[1].email,
        method: 'USDT (TRC20)',
        accountDetails: 'TGy881OpRtx22Wq918VmnKk1903Za12',
        amount: 3500.00,
        fee: 35.00,
        receivedAmount: 3465.00,
        status: 'approved',
        requestedAt: '2026-10-26 04:30 PM',
        processedAt: '2026-10-26 05:15 PM',
        adminRemark: 'Approved by senior finance manager',
      },
    ];
  });

  // Initial Chat Messages (Customer Service)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_chatMessages`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'msg-01',
        senderId: 'sys-agent-1',
        senderName: 'Ebuy Support Team',
        senderRole: 'agent',
        targetUserId: INITIAL_MAIN_USER.id,
        text: 'Welcome to Ebuy Customer Service! How can we assist you with your orders, balance, or VIP privileges today?',
        timestamp: '10:00 AM',
        isRead: true,
      },
      {
        id: 'msg-02',
        senderId: INITIAL_MAIN_USER.id,
        senderName: INITIAL_MAIN_USER.name,
        senderRole: 'user',
        targetUserId: INITIAL_MAIN_USER.id,
        text: 'Hello, I just placed an order for the iPhone 16 Pro Max and requested a withdrawal of $500. Could you please check it?',
        timestamp: '10:02 AM',
        isRead: true,
      },
      {
        id: 'msg-03',
        senderId: 'sys-agent-1',
        senderName: 'Ebuy VIP Specialist (Emma)',
        senderRole: 'agent',
        targetUserId: INITIAL_MAIN_USER.id,
        text: 'Your order EB-2026-9021 is queued for backend supplier processing. Our operations manager will buy and fulfill it shortly! Your credit score is healthy at 98%.',
        timestamp: '10:04 AM',
        isRead: true,
      },
      // Chat with Sarah Jenkins
      {
        id: 'msg-11',
        senderId: INITIAL_FAKE_USERS[0].id,
        senderName: INITIAL_FAKE_USERS[0].name,
        senderRole: 'user',
        targetUserId: INITIAL_FAKE_USERS[0].id,
        text: 'Hi, can I upgrade to VIP 4 to increase daily order commission limit?',
        timestamp: '09:12 AM',
        isRead: true,
      },
      {
        id: 'msg-12',
        senderId: 'sys-agent-1',
        senderName: 'Senior Agent Liam',
        senderRole: 'agent',
        targetUserId: INITIAL_FAKE_USERS[0].id,
        text: 'Hello Sarah! Yes, once your active balance reaches $10,000, your VIP 4 status is automatically granted.',
        timestamp: '09:15 AM',
        isRead: true,
      },
    ];
  });

  // Initial Notifications (Messages Tab in Profile)
  const [notifications, setNotifications] = useState<MessageNotification[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notifications`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const seenIds = new Set<string>();
          return parsed.map((n: MessageNotification, idx: number) => {
            let uniqueId = n.id;
            if (!uniqueId || seenIds.has(uniqueId)) {
              uniqueId = generateUniqueId(`notif-sanitized-${idx}`);
            }
            seenIds.add(uniqueId);
            return {
              ...n,
              id: uniqueId,
            };
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'notif-1',
        userId: INITIAL_MAIN_USER.id,
        title: '20% Mega Deal Promotion Active',
        content: 'Enjoy exclusive 20% discount on all 40 trending mobile phones, laptops, and smart gadgets in the Ebuy catalog!',
        type: 'system',
        timestamp: '2 hours ago',
        isRead: false,
      },
      {
        id: 'notif-2',
        userId: INITIAL_MAIN_USER.id,
        title: 'Withdrawal Application Received ($500.00)',
        content: 'Your withdrawal request of $500.00 to USDT address TQjX9y... has been submitted to the backend finance desk.',
        type: 'finance',
        timestamp: '3 hours ago',
        isRead: false,
      },
      {
        id: 'notif-3',
        userId: INITIAL_MAIN_USER.id,
        title: 'High Credit Rating Maintained',
        content: 'Congratulations! Your account credit score is currently 98%. You enjoy priority order allocation and rapid withdrawals.',
        type: 'credit',
        timestamp: '1 day ago',
        isRead: true,
      },
      {
        id: 'notif-4',
        userId: INITIAL_MAIN_USER.id,
        title: 'Order EB-2026-8842 Completed',
        content: 'Your order has been fulfilled by the backend supplier and your commission of $15.96 has been deposited.',
        type: 'order',
        timestamp: '1 day ago',
        isRead: true,
      },
    ];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_currentUserId`, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_withdrawals`, JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_chatMessages`, JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_cart`, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_userProducts`, JSON.stringify(userProducts));
  }, [userProducts]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_planRequests`, JSON.stringify(planRequests));
  }, [planRequests]);

  // Cart Helpers
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = Number(
    cart.reduce((acc, item) => acc + item.product.discountPrice * item.quantity, 0).toFixed(2)
  );

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(i => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setCart([]);

  const checkoutCart = (
    shippingAddress: string,
    paymentMethod: PaymentMethodType,
    customerName: string,
    customerEmail: string
  ) => {
    if (cart.length === 0) return { success: false, message: 'Cart is empty' };

    const orderNum = `EB-CART-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-cart-${Date.now()}`,
      orderNumber: orderNum,
      userId: currentUser.id,
      userName: customerName || currentUser.name,
      userEmail: customerEmail || currentUser.email,
      items: cart.map(i => ({
        product: i.product,
        quantity: i.quantity,
        unitPrice: i.product.discountPrice,
      })),
      totalAmount: cartTotal,
      commissionEarned: Number((cartTotal * 0.05).toFixed(2)),
      status: 'processing',
      createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      updatedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      shippingAddress,
      paymentMethod,
      trackingNumber: `TRK-USPS-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: 'Order placed via Cart Checkout',
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCartOpen(false);

    const notif: MessageNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: `Order Placed (${orderNum})`,
      content: `Your order for $${cartTotal.toFixed(2)} has been submitted. Tracking: ${newOrder.trackingNumber}.`,
      type: 'order',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [notif, ...prev]);

    return { success: true, message: `Order #${orderNum} successfully placed!`, orderId: newOrder.id };
  };

  const submitProductBankPayment = (
    productId: string,
    senderBank: string,
    senderAcc: string,
    senderHolder: string,
    txRef: string
  ) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return { success: false, message: 'Product not found' };

    const orderNum = `EB-WIRE-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-bank-${Date.now()}`,
      orderNumber: orderNum,
      userId: currentUser.id,
      userName: senderHolder || currentUser.name,
      userEmail: currentUser.email,
      items: [{ product: prod, quantity: 1, unitPrice: prod.discountPrice }],
      totalAmount: prod.discountPrice,
      commissionEarned: Number((prod.discountPrice * (prod.commissionRate ?? 0.05)).toFixed(2)),
      status: 'pending',
      createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      updatedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      paymentMethod: 'Direct Bank Wire (IBAN/IFSC)',
      notes: `Bank Wire: ${senderBank} | Acc: ${senderAcc} | TxRef: ${txRef}`,
      trackingNumber: `TRK-PENDING-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    setOrders(prev => [newOrder, ...prev]);

    const notif: MessageNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: `Bank Payment Submitted (${orderNum})`,
      content: `Payment reference ${txRef} for ${prod.title} ($${prod.discountPrice.toFixed(2)}) is awaiting Admin verification.`,
      type: 'order',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [notif, ...prev]);

    return {
      success: true,
      message: `Payment submitted! Reference #${txRef} queued for Admin approval.`,
    };
  };

  // Merchant Store Inventory Helpers
  const addProductToMerchantStore = (catalogId: string, stock: number) => {
    const prod = products.find(p => p.id === catalogId);
    if (!prod) return;

    setUserProducts(prev => {
      const existing = prev.find(up => up.userId === currentUser.id && up.productId === catalogId);
      if (existing) {
        return prev.map(up =>
          up.id === existing.id ? { ...up, stock: up.stock + stock } : up
        );
      }
      const newUp: UserProduct = {
        id: `up-${Date.now()}`,
        userId: currentUser.id,
        productId: catalogId,
        product: prod,
        stock,
        unitsSold: 0,
        revenueGenerated: 0,
        profitRate: 0.20,
        listedDate: new Date().toISOString().split('T')[0],
      };
      return [newUp, ...prev];
    });
  };

  const removeProductFromMerchantStore = (userProductId: string) => {
    setUserProducts(prev => prev.filter(up => up.id !== userProductId));
  };

  // Switch Active Frontend User
  const switchActiveUser = (userId: string) => {
    const found = allUsers.find(u => u.id === userId);
    if (found) {
      setCurrentUserId(found.id);
    }
  };

  const setCurrentUser = (user: User) => {
    setAllUsers(prev => prev.map(u => (u.id === user.id ? user : u)));
    setCurrentUserId(user.id);
  };

  const loginOrRegister = (
    email: string,
    name: string,
    referralCode?: string,
    phone?: string,
    password?: string
  ) => {
    const existing = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setAllUsers(prev =>
        prev.map(u => {
          if (u.id === existing.id) {
            return {
              ...u,
              referredBy: referralCode?.trim() ? referralCode.trim().toUpperCase() : u.referredBy,
              phone: phone?.trim() ? phone.trim() : u.phone,
              password: password ? password : u.password,
            };
          }
          return u;
        })
      );
      setCurrentUserId(existing.id);
      setIsAuthModalOpen(false);
      return;
    }

    const cleanName = name.trim() || 'New Member';
    const genCode = `REF-${cleanName.replace(/\s+/g, '').toUpperCase().slice(0, 4)}${Math.floor(100 + Math.random() * 900)}`;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: email.trim(),
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      role: 'user',
      availableBalance: 2500.00,
      freezeBalance: 0.00,
      creditScore: 100,
      vipLevel: 'VIP 1',
      phone: phone?.trim() || '+1 (555) 000-1122',
      password: password || 'password123',
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      canWithdraw: true,
      walletAddress: 'TX' + Math.random().toString(36).substring(2, 12).toUpperCase() + '99',
      referralCode: genCode,
      referredBy: referralCode?.trim() ? referralCode.trim().toUpperCase() : undefined,
      bankAccounts: INITIAL_MAIN_USER.bankAccounts,
      storeName: `${cleanName}'s Store`,
    };

    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    setIsAuthModalOpen(false);

    // Welcome notification
    const welcomeNotif: MessageNotification = {
      id: `notif-${Date.now()}`,
      userId: newUser.id,
      title: 'Welcome to Ebuy Platform',
      content: `Account registered successfully! Referral code: ${genCode}. You can now purchase products and trade with direct buyback.`,
      imageUrl: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80',
      type: 'system',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [welcomeNotif, ...prev]);
  };

  const updateUserWithdrawalPermission = (userId: string, canWithdraw: boolean) => {
    setAllUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, canWithdraw } : u))
    );
  };

  // Buy Product Directly with Available Balance (Account se amount deduct hogi)
  const buyProductWithBalance = (product: Product, quantity = 1) => {
    const totalCost = Number((product.discountPrice * quantity).toFixed(2));
    if (currentUser.availableBalance < totalCost) {
      return {
        success: false,
        message: `Insufficient balance! Available: $${currentUser.availableBalance.toFixed(2)}, required: $${totalCost.toFixed(2)}. Contact backend admin to top up.`,
      };
    }

    // Deduct amount from user's account balance
    setAllUsers(prev =>
      prev.map(u => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            availableBalance: Number((u.availableBalance - totalCost).toFixed(2)),
          };
        }
        return u;
      })
    );

    // Add to My Products (userProducts)
    const newUp: UserProduct = {
      id: `up-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      productId: product.id,
      product,
      stock: quantity,
      unitsSold: 0,
      revenueGenerated: 0,
      profitRate: 0.20,
      purchasePrice: totalCost,
      status: 'active',
      listedDate: new Date().toISOString().split('T')[0],
      addedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
    };
    setUserProducts(prev => [newUp, ...prev]);

    // Create order entry
    const orderNum = `EB-BUY-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-buy-${Date.now()}`,
      orderNumber: orderNum,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      items: [{ product, quantity, unitPrice: product.discountPrice }],
      totalAmount: totalCost,
      commissionEarned: Number((totalCost * (product.commissionRate ?? 0.05)).toFixed(2)),
      status: 'completed',
      createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      updatedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      paymentMethod: 'Account Available Balance',
      trackingNumber: `TRK-BAL-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: `Purchased with balance (-$${totalCost.toFixed(2)}). Visible in My Products.`,
    };
    setOrders(prev => [newOrder, ...prev]);

    // Notify user
    const notif: MessageNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: `Order Buy Completed (-$${totalCost.toFixed(2)})`,
      content: `"${product.title}" purchased successfully! $${totalCost.toFixed(2)} deducted from your available balance. The item is now listed in My Products awaiting buy back.`,
      imageUrl: product.imageUrl,
      type: 'order',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [notif, ...prev]);

    return {
      success: true,
      message: `Purchased "${product.title}"! $${totalCost.toFixed(2)} deducted from balance. Added to My Products!`,
    };
  };

  // Backend Buy Back from Member (Admin buys back product, adds profit to member's account, moves item to Sell Products)
  const adminBuyBackProduct = (
    userProductId: string,
    totalAmountToCredit: number,
    profitAmount: number
  ) => {
    const targetItem = userProducts.find(up => up.id === userProductId);
    if (!targetItem) return { success: false, message: 'Item not found in member store.' };

    const targetUser = allUsers.find(u => u.id === targetItem.userId);
    if (!targetUser) return { success: false, message: 'Member account not found.' };

    const creditAmount = Number(totalAmountToCredit.toFixed(2));
    const profit = Number(profitAmount.toFixed(2));

    // 1. Credit amount (cost + profit) into target user's available balance
    setAllUsers(prev =>
      prev.map(u => {
        if (u.id === targetItem.userId) {
          return {
            ...u,
            availableBalance: Number((u.availableBalance + creditAmount).toFixed(2)),
          };
        }
        return u;
      })
    );

    // 2. Mark product as sold_back in userProducts
    setUserProducts(prev =>
      prev.map(up => {
        if (up.id === userProductId) {
          return {
            ...up,
            status: 'sold_back',
            buyBackPrice: creditAmount,
            buyBackProfit: profit,
            soldBackAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
          };
        }
        return up;
      })
    );

    // 3. Send notification with product picture to the member
    const notif: MessageNotification = {
      id: `notif-${Date.now()}`,
      userId: targetItem.userId,
      title: `Buy Back Settled: +$${creditAmount.toFixed(2)} Credited!`,
      content: `Administration has bought back "${targetItem.product.title}". Total $${creditAmount.toFixed(2)} (including $${profit.toFixed(2)} pure profit) has been credited directly to your available balance. Check your Sell Products tab.`,
      imageUrl: targetItem.product.imageUrl,
      type: 'finance',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [notif, ...prev]);

    return {
      success: true,
      message: `Buy back successful! $${creditAmount.toFixed(2)} credited to ${targetUser.name}'s balance.`,
    };
  };

  // Send Notification with Image to Member (or broadcast to all)
  const sendMemberNotificationWithImage = (
    userId: string,
    title: string,
    content: string,
    imageUrl?: string
  ) => {
    const time = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    if (userId === 'all') {
      const newNotifs: MessageNotification[] = allUsers.map(u => ({
        id: `notif-${Date.now()}-${u.id}`,
        userId: u.id,
        title,
        content,
        imageUrl: imageUrl || undefined,
        type: 'system',
        timestamp: time,
        isRead: false,
      }));
      setNotifications(prev => [...newNotifs, ...prev]);
    } else {
      const newNotif: MessageNotification = {
        id: `notif-${Date.now()}`,
        userId,
        title,
        content,
        imageUrl: imageUrl || undefined,
        type: 'system',
        timestamp: time,
        isRead: false,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const logout = () => {
    setIsAuthModalOpen(true);
  };

  // Order Placement (From Front End)
  const placeOrder = (product: Product, quantity = 1) => {
    const totalAmount = Number((product.discountPrice * quantity).toFixed(2));
    const commissionEarned = Number((totalAmount * (product.commissionRate ?? 0.05)).toFixed(2));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `EB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      items: [
        {
          product,
          quantity,
          unitPrice: product.discountPrice,
        },
      ],
      totalAmount,
      commissionEarned,
      status: 'pending',
      createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      updatedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      notes: 'New customer order awaiting backend supplier fulfillment',
      processedByAdmin: false,
    };

    setOrders(prev => [newOrder, ...prev]);

    // Send a confirmation notification
    const newNotif: MessageNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: `Order Submitted (${newOrder.orderNumber})`,
      content: `Your order for "${product.title}" ($${totalAmount}) has been submitted. It is now pending backend supplier purchase!`,
      type: 'order',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Admin Buys / Fulfills the Order
  // "means backend mai 10 aisy fake id attach krna jo idhr front mai chat kry means k jo front mai orders hogy wo show hogy backend sy mai buy kru tu front mai show ho"
  const adminBuyFulfillOrder = (orderId: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const commission = targetOrder.commissionEarned || 10;

    // 1. Mark order as completed & processedByAdmin
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: 'completed',
              updatedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
              notes: 'Fulfillment purchased by Backend Admin. Supplier dispatched.',
              processedByAdmin: true,
            }
          : o
      )
    );

    // 2. Credit commission or release frozen balance to the customer
    setAllUsers(prev =>
      prev.map(u => {
        if (u.id === targetOrder.userId) {
          return {
            ...u,
            availableBalance: Number((u.availableBalance + commission).toFixed(2)),
          };
        }
        return u;
      })
    );

    // 3. Notify the customer
    const notif: MessageNotification = {
      id: `notif-${Date.now()}`,
      userId: targetOrder.userId,
      title: `Order ${targetOrder.orderNumber} Completed!`,
      content: `Backend Admin has fulfilled your order! Commission of +$${commission.toFixed(2)} has been credited to your available balance.`,
      type: 'order',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [notif, ...prev]);

    // 4. Also post in their customer service chat thread for transparency
    const chatMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'admin-auto',
      senderName: 'Ebuy Order Desk',
      senderRole: 'admin',
      targetUserId: targetOrder.userId,
      text: `Notice: Order #${targetOrder.orderNumber} ($${targetOrder.totalAmount.toFixed(2)}) was purchased and fulfilled by the Backend Admin desk. Commission credited!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };
    setChatMessages(prev => [...prev, chatMsg]);
  };

  // Admin updates order status
  const adminUpdateOrderStatus = (orderId: string, status: OrderStatus, notes?: string) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              status,
              updatedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
              notes: notes || o.notes,
            }
          : o
      )
    );
  };

  // Admin adds a new product to store catalog
  const adminAddProductToCatalog = (newProduct: Omit<Product, 'id'>) => {
    const created: Product = {
      ...newProduct,
      id: `prod-cat-${Date.now()}`,
    };
    setProducts(prev => [created, ...prev]);
  };

  // Admin directly adds an order to any member's account
  const adminAddOrderToUser = (
    userId: string,
    productId: string,
    quantity = 1,
    customNotes = 'Product order assigned directly by Backend Admin',
    customStatus: OrderStatus = 'pending'
  ) => {
    const targetUser = allUsers.find(u => u.id === userId);
    const targetProd = products.find(p => p.id === productId);
    if (!targetUser || !targetProd) return;

    const totalAmount = Number((targetProd.discountPrice * quantity).toFixed(2));
    const commissionEarned = Number((totalAmount * (targetProd.commissionRate ?? 0.05)).toFixed(2));

    const newOrder: Order = {
      id: `ord-adm-${Date.now()}`,
      orderNumber: `EB-VIP-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: targetUser.id,
      userName: targetUser.name,
      userEmail: targetUser.email,
      items: [
        {
          product: targetProd,
          quantity,
          unitPrice: targetProd.discountPrice,
        },
      ],
      totalAmount,
      commissionEarned,
      status: customStatus,
      createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      updatedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      notes: customNotes,
      processedByAdmin: customStatus === 'completed',
    };

    setOrders(prev => [newOrder, ...prev]);

    // If completed immediately, award commission
    if (customStatus === 'completed') {
      setAllUsers(prev =>
        prev.map(u => (u.id === targetUser.id ? { ...u, availableBalance: Number((u.availableBalance + commissionEarned).toFixed(2)) } : u))
      );
    }

    // Notify the member
    const notif: MessageNotification = {
      id: `notif-${Date.now()}`,
      userId: targetUser.id,
      title: `Assigned Order: ${targetProd.title}`,
      content: `The backend management assigned order #${newOrder.orderNumber} for "${targetProd.title}" ($${totalAmount.toFixed(2)}) to your account. Commission reward: +$${commissionEarned.toFixed(2)}.`,
      type: 'order',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Admin creates a custom product and directly assigns it to member
  const adminAssignCustomProductToUser = (
    userId: string,
    title: string,
    price: number,
    commissionRate: number,
    category: ProductCategory = 'electronics',
    description = 'Exclusive assigned product from backend administration'
  ) => {
    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) return;

    const originalPrice = Number((price / 0.8).toFixed(2));
    const customProd: Product = {
      id: `prod-assigned-${Date.now()}`,
      title,
      category,
      originalPrice,
      discountPrice: price,
      discountPercentage: 20,
      rating: 5.0,
      reviewCount: 38,
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80',
      stock: 50,
      specs: ['Direct VIP Allocation', 'Guaranteed Commission', 'Priority Processing'],
      description,
      isTrending: true,
      commissionRate,
    };

    // Add to catalog so it's globally usable
    setProducts(prev => [customProd, ...prev]);

    // Add order to the member's account
    adminAddOrderToUser(userId, customProd.id, 1, 'VIP Assigned Order by Administrator', 'pending');
  };

  // Withdrawal Request by User
  const requestWithdrawal = (method: WithdrawalMethod, accountDetails: string, amount: number) => {
    if (currentUser.canWithdraw === false) {
      return {
        success: false,
        message: 'Account Withdrawal is Locked (Band): Your withdrawal privileges are paused by administration. Please contact customer support.',
      };
    }
    if (amount <= 0) {
      return { success: false, message: 'Please enter a valid withdrawal amount.' };
    }
    if (amount > currentUser.availableBalance) {
      return { success: false, message: `Insufficient available balance. You only have $${currentUser.availableBalance.toFixed(2)}.` };
    }

    const feeRate = 0.01; // 1% handling fee
    const fee = Number((amount * feeRate).toFixed(2));
    const receivedAmount = Number((amount - fee).toFixed(2));

    // Deduct available balance and move to freeze balance while pending
    setAllUsers(prev =>
      prev.map(u => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            availableBalance: Number((u.availableBalance - amount).toFixed(2)),
            freezeBalance: Number((u.freezeBalance + amount).toFixed(2)),
          };
        }
        return u;
      })
    );

    const newWd: WithdrawalRequest = {
      id: `wd-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      method,
      accountDetails,
      amount,
      fee,
      receivedAmount,
      status: 'pending',
      requestedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      adminRemark: 'Pending administrative approval',
    };

    setWithdrawals(prev => [newWd, ...prev]);

    // Send notification
    const notif: MessageNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: `Withdrawal Requested ($${amount.toFixed(2)})`,
      content: `Your withdrawal of $${amount.toFixed(2)} via ${method} is submitted to Admin review. The amount is temporarily moved to freeze balance.`,
      type: 'finance',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [notif, ...prev]);

    return { success: true, message: 'Withdrawal submitted successfully to Backend review.' };
  };

  const requestBankWithdrawal = (bank: BankAccountDetails, amount: number) => {
    if (currentUser.canWithdraw === false) {
      return {
        success: false,
        message: 'Account Withdrawal is Locked (Band): Your withdrawal privileges are paused by administration. Please contact customer support.',
      };
    }
    if (amount <= 0) return { success: false, message: 'Please enter a valid amount.' };
    if (amount > currentUser.availableBalance) {
      return { success: false, message: `Insufficient available balance ($${currentUser.availableBalance.toFixed(2)}).` };
    }

    const fee = Number((amount * 0.01).toFixed(2));
    const receivedAmount = Number((amount - fee).toFixed(2));

    setAllUsers(prev =>
      prev.map(u =>
        u.id === currentUser.id
          ? {
              ...u,
              availableBalance: Number((u.availableBalance - amount).toFixed(2)),
              freezeBalance: Number((u.freezeBalance + amount).toFixed(2)),
            }
          : u
      )
    );

    const newWd: WithdrawalRequest = {
      id: `wd-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      method: 'Bank Transfer',
      accountDetails: `${bank.bankName} - ${bank.accountNumber} (${bank.accountHolder})`,
      amount,
      fee,
      receivedAmount,
      status: 'pending',
      requestedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      bankDetails: bank,
      payoutReference: `WIRE-REF-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setWithdrawals(prev => [newWd, ...prev]);

    const notif: MessageNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: `Bank Withdrawal Requested ($${amount.toFixed(2)})`,
      content: `Withdrawal request of $${amount.toFixed(2)} to ${bank.bankName} (${bank.accountNumber}) submitted for Admin audit.`,
      type: 'finance',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [notif, ...prev]);

    return { success: true, message: `Withdrawal request of $${amount.toFixed(2)} submitted successfully!` };
  };

  const addBankAccount = (bankData: Omit<BankAccountDetails, 'id'>) => {
    const newBank: BankAccountDetails = {
      ...bankData,
      id: `bank-${Date.now()}`,
    };

    setAllUsers(prev =>
      prev.map(u => {
        if (u.id === currentUser.id) {
          const existing = u.bankAccounts || [];
          return {
            ...u,
            bankAccounts: [...existing, newBank],
            bankDetails: {
              accountHolder: newBank.accountHolder,
              bankName: newBank.bankName,
              accountNumber: newBank.accountNumber,
            },
          };
        }
        return u;
      })
    );
  };

  // Admin Processes Withdrawal
  const adminProcessWithdrawal = (withdrawalId: string, action: 'approve' | 'reject', remark?: string) => {
    const targetWd = withdrawals.find(w => w.id === withdrawalId);
    if (!targetWd) return;

    if (action === 'approve') {
      // Complete withdrawal: deduct from freeze balance permanently
      setAllUsers(prev =>
        prev.map(u => {
          if (u.id === targetWd.userId) {
            return {
              ...u,
              freezeBalance: Math.max(0, Number((u.freezeBalance - targetWd.amount).toFixed(2))),
            };
          }
          return u;
        })
      );

      setWithdrawals(prev =>
        prev.map(w =>
          w.id === withdrawalId
            ? {
                ...w,
                status: 'approved',
                processedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
                adminRemark: remark || 'Approved and funds transferred by Admin.',
              }
            : w
        )
      );

      // Notification
      const notif: MessageNotification = {
        id: `notif-${Date.now()}`,
        userId: targetWd.userId,
        title: `Withdrawal Approved ($${targetWd.receivedAmount.toFixed(2)})`,
        content: `Your withdrawal of $${targetWd.amount.toFixed(2)} has been approved by the Admin and sent to your account (${targetWd.accountDetails}).`,
        type: 'finance',
        timestamp: 'Just now',
        isRead: false,
      };
      setNotifications(prev => [notif, ...prev]);
    } else {
      // Reject withdrawal: return from freeze balance back to available balance
      setAllUsers(prev =>
        prev.map(u => {
          if (u.id === targetWd.userId) {
            return {
              ...u,
              availableBalance: Number((u.availableBalance + targetWd.amount).toFixed(2)),
              freezeBalance: Math.max(0, Number((u.freezeBalance - targetWd.amount).toFixed(2))),
            };
          }
          return u;
        })
      );

      setWithdrawals(prev =>
        prev.map(w =>
          w.id === withdrawalId
            ? {
                ...w,
                status: 'rejected',
                processedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
                adminRemark: remark || 'Rejected by Admin. Funds restored to available balance.',
              }
            : w
        )
      );

      // Notification
      const notif: MessageNotification = {
        id: `notif-${Date.now()}`,
        userId: targetWd.userId,
        title: `Withdrawal Rejected`,
        content: `Your withdrawal request of $${targetWd.amount.toFixed(2)} was rejected: "${remark || 'Account details verification needed'}". Funds have been returned to your available balance.`,
        type: 'finance',
        timestamp: 'Just now',
        isRead: false,
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  // Balance & Freeze controls
  const updateUserBalance = (userId: string, availableDeltaOrExact: number, freezeDeltaOrExact: number, isExact = false) => {
    setAllUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const newAvail = isExact ? availableDeltaOrExact : Number((u.availableBalance + availableDeltaOrExact).toFixed(2));
          const newFreeze = isExact ? freezeDeltaOrExact : Number((u.freezeBalance + freezeDeltaOrExact).toFixed(2));
          return {
            ...u,
            availableBalance: Math.max(0, newAvail),
            freezeBalance: Math.max(0, newFreeze),
          };
        }
        return u;
      })
    );

    // Notification to user
    const notif: MessageNotification = {
      id: `notif-${Date.now()}`,
      userId,
      title: 'Financial Balance Adjusted by Admin',
      content: `Your account balance was updated by the administrative console. Available: $${availableDeltaOrExact.toFixed(2)}, Frozen: $${freezeDeltaOrExact.toFixed(2)}.`,
      type: 'finance',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Credit score control
  const updateUserCreditScore = (userId: string, newScore: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(newScore)));
    setAllUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, creditScore: clamped } : u))
    );

    const notif: MessageNotification = {
      id: `notif-${Date.now()}`,
      userId,
      title: `Credit Score Updated: ${clamped}%`,
      content: `The system risk evaluation team updated your account credit score to ${clamped}%. ${
        clamped < 80 ? 'Warning: Low credit score may restrict order grab velocity.' : 'Status is excellent!'
      }`,
      type: 'credit',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Chat message from user
  const sendUserChatMessage = (text: string) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: 'user',
      targetUserId: currentUser.id,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    setChatMessages(prev => [...prev, newMsg]);

    // Optional subtle automated response if after hours or fast confirmation
    setTimeout(() => {
      setChatMessages(curr => {
        // check if already replied recently
        const autoReply: ChatMessage = {
          id: `msg-auto-${Date.now()}`,
          senderId: 'sys-agent-live',
          senderName: 'Ebuy Online Agent',
          senderRole: 'agent',
          targetUserId: currentUser.id,
          text: `Thank you for reaching out, ${currentUser.name}! Our backend support operator is reviewing your inquiry right now.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
        };
        return [...curr, autoReply];
      });
    }, 1200);
  };

  // Chat message from Admin Backend (Admin replying directly to user)
  const sendAdminChatMessage = (targetUserId: string, text: string, agentName = 'E-seller Admin Helpdesk') => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: generateUniqueId('msg-admin'),
      senderId: 'admin-desk',
      senderName: agentName,
      senderRole: 'agent',
      targetUserId,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    setChatMessages(prev => [...prev, newMsg]);

    // Also dispatch to member's notification list so it shows in Profile -> Messages with sender details
    const adminNotif: MessageNotification = {
      id: generateUniqueId('notif-admin-msg'),
      userId: targetUserId,
      title: `Message from ${agentName}`,
      content: text.trim(),
      type: 'system',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [adminNotif, ...prev]);
  };

  const sendCustomerChatMessage = (text: string, orderNumber?: string, department?: string) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: generateUniqueId('msg-user'),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: 'user',
      targetUserId: currentUser.id,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      orderNumber,
      department,
    };

    setChatMessages(prev => [...prev, newMsg]);

    setTimeout(() => {
      setChatMessages(curr => {
        const autoReply: ChatMessage = {
          id: generateUniqueId('msg-auto'),
          senderId: 'sys-agent-live',
          senderName: department ? `${department.toUpperCase()} Support Agent` : 'E-seller Online Agent',
          senderRole: 'agent',
          targetUserId: currentUser.id,
          text: `Thank you for reaching out, ${currentUser.name}! Our representative is reviewing your inquiry regarding ${orderNumber ? `Order #${orderNumber}` : 'your account'}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
          orderNumber,
          department,
        };
        return [...curr, autoReply];
      });
    }, 1200);
  };

  const markNotificationsRead = (userId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.userId === userId ? { ...n, isRead: true } : n))
    );
  };

  // Assign Plan to Member (Admin or Store System)
  const assignPlanToMember = (userId: string, planLevel: number) => {
    const plan = SELLER_PLANS.find(p => p.level === planLevel) || SELLER_PLANS[0];

    // Update user profile
    setAllUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? {
              ...u,
              planLevel: plan.level,
              planName: plan.name,
              vipLevel: `VIP ${Math.min(8, Math.max(1, plan.level))}`,
            }
          : u
      )
    );

    // Auto-allocate exact catalog products based on plan.productCount
    const selectedCatalogProds = products.slice(0, plan.productCount);
    const newItems: UserProduct[] = selectedCatalogProds.map((catProd, idx) => ({
      id: generateUniqueId(`up-${userId.slice(-4)}-${idx}`),
      userId,
      productId: catProd.id,
      product: catProd,
      stock: Math.floor(Math.random() * 25) + 15,
      unitsSold: Math.floor(Math.random() * 8) + 1,
      revenueGenerated: Number((catProd.discountPrice * (Math.floor(Math.random() * 6) + 1)).toFixed(2)),
      profitRate: plan.profitPercentage / 100,
      listedDate: new Date().toISOString().split('T')[0],
    }));

    setUserProducts(prev => {
      const others = prev.filter(up => up.userId !== userId);
      return [...others, ...newItems];
    });

    // Notify member
    const notif: MessageNotification = {
      id: generateUniqueId('notif-plan'),
      userId,
      title: `Store Activated: ${plan.name}`,
      content: `Your merchant account is now activated on ${plan.name} ($${plan.price.toLocaleString()}). ${plan.productCount} wholesale products allocated to your store inventory with a ${plan.profitPercentage}% profit yield!`,
      type: 'system',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [notif, ...prev]);

    return {
      success: true,
      message: `Assigned ${plan.name} (${plan.productCount} products) to user.`,
      count: plan.productCount,
    };
  };

  // Front Member Self-Activates Plan using Account Balance (Direct Instant if approved)
  const activatePlanWithBalance = (planLevel: number) => {
    const plan = SELLER_PLANS.find(p => p.level === planLevel) || SELLER_PLANS[0];
    if (currentUser.availableBalance < plan.price) {
      return {
        success: false,
        message: `Insufficient balance! ${plan.name} requires $${plan.price.toLocaleString()}, but your available balance is $${currentUser.availableBalance.toFixed(2)}. Please recharge or contact support.`,
      };
    }

    // Deduct price from available balance
    setAllUsers(prev =>
      prev.map(u =>
        u.id === currentUser.id
          ? {
              ...u,
              availableBalance: Number((u.availableBalance - plan.price).toFixed(2)),
            }
          : u
      )
    );

    const res = assignPlanToMember(currentUser.id, planLevel);
    return {
      success: true,
      message: `Congratulations! ${plan.name} activated successfully with $${plan.price.toLocaleString()} deducted. ${res.count} products added to your store!`,
    };
  };

  // Front Member Submits Plan Purchase Application (Pending Backend Admin Approval)
  const requestPlanPurchase = (planLevel: number) => {
    const plan = SELLER_PLANS.find(p => p.level === planLevel) || SELLER_PLANS[0];

    // Check if user already has this plan active
    if (currentUser.planLevel === planLevel) {
      return {
        success: false,
        message: `You already have ${plan.name} active on your merchant account!`,
      };
    }

    // Check if user already has an active pending application
    const existingPending = planRequests.find(r => r.userId === currentUser.id && r.status === 'pending');
    if (existingPending) {
      return {
        success: false,
        message: `You already have a pending application for ${existingPending.planName}. Please await backend administrator approval.`,
      };
    }

    if (currentUser.availableBalance < plan.price) {
      return {
        success: false,
        message: `Insufficient balance! ${plan.name} requires $${plan.price.toLocaleString()}, but your available balance is $${currentUser.availableBalance.toFixed(2)}. Please recharge your account or contact support.`,
      };
    }

    // Deduct plan price from available balance and set pending plan
    setAllUsers(prev =>
      prev.map(u =>
        u.id === currentUser.id
          ? {
              ...u,
              availableBalance: Number((u.availableBalance - plan.price).toFixed(2)),
              pendingPlanLevel: plan.level,
              pendingPlanName: plan.name,
            }
          : u
      )
    );

    const newReq: PlanPurchaseRequest = {
      id: generateUniqueId('plan-req'),
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      planLevel: plan.level,
      planName: plan.name,
      planPrice: plan.price,
      productCount: plan.productCount,
      profitPercentage: plan.profitPercentage,
      requestedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      status: 'pending',
    };

    setPlanRequests(prev => [newReq, ...prev]);

    // Send member notification
    const notif: MessageNotification = {
      id: generateUniqueId('notif-plan-app'),
      userId: currentUser.id,
      title: `Plan Application Submitted: ${plan.name}`,
      content: `Your application to activate ${plan.name} ($${plan.price.toLocaleString()}) has been submitted to the backend admin desk. $${plan.price.toLocaleString()} is held in escrow. Upon administrative approval, ${plan.productCount} wholesale products will be added to your My Products inventory!`,
      type: 'system',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [notif, ...prev]);

    return {
      success: true,
      message: `Application for ${plan.name} submitted successfully! Awaiting backend admin approval before activation.`,
    };
  };

  // Backend Admin Processes Plan Request (Approve or Reject)
  const adminProcessPlanRequest = (requestId: string, action: 'approve' | 'reject', remark?: string) => {
    const targetReq = planRequests.find(r => r.id === requestId);
    if (!targetReq) {
      return { success: false, message: 'Plan application record not found.' };
    }

    if (action === 'approve') {
      // 1. Assign plan & auto-add exact products to My Products
      assignPlanToMember(targetReq.userId, targetReq.planLevel);

      // 2. Clear pending status on member
      setAllUsers(prev =>
        prev.map(u =>
          u.id === targetReq.userId
            ? {
                ...u,
                pendingPlanLevel: undefined,
                pendingPlanName: undefined,
              }
            : u
        )
      );

      // 3. Mark request approved
      setPlanRequests(prev =>
        prev.map(r =>
          r.id === requestId
            ? {
                ...r,
                status: 'approved',
                processedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
                adminRemark: remark || 'Approved by backend administration. Store inventory populated.',
              }
            : r
        )
      );

      // 4. Send notification
      const notif: MessageNotification = {
        id: generateUniqueId('notif-plan-approved'),
        userId: targetReq.userId,
        title: `Plan Approved: ${targetReq.planName}!`,
        content: `Congratulations! Your application for ${targetReq.planName} has been approved by administration. ${targetReq.productCount} wholesale products are now active in your My Products tab ready for buy back.`,
        type: 'system',
        timestamp: 'Just now',
        isRead: false,
      };
      setNotifications(prev => [notif, ...prev]);

      return {
        success: true,
        message: `Approved ${targetReq.planName} for ${targetReq.userName}. ${targetReq.productCount} products added to member store!`,
      };
    } else {
      // Reject: Refund held funds back to member's available balance
      setAllUsers(prev =>
        prev.map(u =>
          u.id === targetReq.userId
            ? {
                ...u,
                availableBalance: Number((u.availableBalance + targetReq.planPrice).toFixed(2)),
                pendingPlanLevel: undefined,
                pendingPlanName: undefined,
              }
            : u
        )
      );

      // Mark request rejected
      setPlanRequests(prev =>
        prev.map(r =>
          r.id === requestId
            ? {
                ...r,
                status: 'rejected',
                processedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
                adminRemark: remark || 'Application declined. Full funds refunded to available balance.',
              }
            : r
        )
      );

      // Send notification
      const notif: MessageNotification = {
        id: generateUniqueId('notif-plan-rejected'),
        userId: targetReq.userId,
        title: `Plan Application Declined`,
        content: `Your application for ${targetReq.planName} was not approved. Remark: "${remark || 'Requirements not verified'}". $${targetReq.planPrice.toLocaleString()} has been refunded back to your available balance.`,
        type: 'system',
        timestamp: 'Just now',
        isRead: false,
      };
      setNotifications(prev => [notif, ...prev]);

      return {
        success: true,
        message: `Declined request for ${targetReq.userName}. $${targetReq.planPrice.toLocaleString()} refunded to member balance.`,
      };
    }
  };

  // Counts
  const unreadNotificationCount = notifications.filter(n => n.userId === currentUser.id && !n.isRead).length;
  const unreadChatCount = chatMessages.filter(m => m.targetUserId === currentUser.id && m.senderRole !== 'user' && !m.isRead).length;
  const pendingWithdrawalsCount = withdrawals.filter(w => w.status === 'pending').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const pendingPlanRequestsCount = planRequests.filter(r => r.status === 'pending').length;

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        frontendTab,
        setFrontendTab,
        currentUser,
        setCurrentUser,
        allUsers,
        switchActiveUser,
        loginOrRegister,
        logout,
        updateUserWithdrawalPermission,
        products,
        topSellers,
        selectedProductForOrder,
        setSelectedProductForOrder,
        adminAddProductToCatalog,
        buyProductWithBalance,
        userProducts,
        addProductToMerchantStore,
        removeProductFromMerchantStore,
        adminBuyBackProduct,
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        checkoutCart,
        submitProductBankPayment,
        orders,
        placeOrder,
        adminBuyFulfillOrder,
        adminUpdateOrderStatus,
        adminAddOrderToUser,
        adminAssignCustomProductToUser,
        withdrawals,
        requestWithdrawal,
        requestBankWithdrawal,
        addBankAccount,
        adminProcessWithdrawal,
        updateUserBalance,
        updateUserCreditScore,
        chatMessages,
        sendUserChatMessage,
        sendCustomerChatMessage,
        sendAdminChatMessage,
        telegramSupportUrl,
        setTelegramSupportUrl,
        notifications,
        markNotificationsRead,
        sendMemberNotificationWithImage,
        sellerPlans: SELLER_PLANS,
        planRequests,
        isPlansModalOpen,
        setIsPlansModalOpen,
        assignPlanToMember,
        activatePlanWithBalance,
        requestPlanPurchase,
        adminProcessPlanRequest,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isWithdrawModalOpen,
        setIsWithdrawModalOpen,
        isMessagesModalOpen,
        setIsMessagesModalOpen,
        isCustomerServiceOpen,
        setIsCustomerServiceOpen,
        isSupabaseModalOpen,
        setIsSupabaseModalOpen,
        isSupabaseConfigured: isSupabaseReady,
        checkSupabaseConfig,
        unreadNotificationCount,
        unreadChatCount,
        pendingWithdrawalsCount,
        pendingOrdersCount,
        pendingPlanRequestsCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
