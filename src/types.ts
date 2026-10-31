export type UserRole = 'user' | 'admin';

export interface BankAccountDetails {
  id: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ibanOrIfsc?: string;
  branchOrSwift?: string;
  routingNumber?: string;
  isPrimary: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  availableBalance: number;
  freezeBalance: number;
  pendingBalance?: number;
  creditScore: number; // 0 - 100
  vipLevel: string;
  phone: string;
  joinedDate: string;
  isFake?: boolean;
  status: 'active' | 'suspended' | 'pending_verification';
  walletAddress?: string;
  referralCode: string;
  referredBy?: string;
  storeName?: string;
  password?: string;
  canWithdraw?: boolean; // true = allowed (open), false = locked (band)
  planLevel?: number; // 1 to 8 (1: 4 prods, 2: 8 prods, 3: 15 prods ... 8: Full Store 58 prods)
  planName?: string;
  pendingPlanLevel?: number;
  pendingPlanName?: string;
  bankAccounts?: BankAccountDetails[];
  bankDetails?: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
  };
}

export interface SellerPlan {
  id: string;
  level: number;
  name: string;
  price: number;
  productCount: number;
  profitPercentage: number;
  dailyEarningsEstimate: number;
  badge: string;
  description: string;
  features: string[];
}

export const SELLER_PLANS: SellerPlan[] = [
  {
    id: 'plan-1',
    level: 1,
    name: 'Plan 1 - Starter Store',
    price: 200,
    productCount: 4,
    profitPercentage: 20,
    dailyEarningsEstimate: 40,
    badge: 'Starter',
    description: 'Entry-level merchant plan. 4 active products + guaranteed buy back yield.',
    features: ['4 Active Products in Store', '20% Fixed Profit Yield', 'Daily Buy-Back Eligible', 'Standard Support'],
  },
  {
    id: 'plan-2',
    level: 2,
    name: 'Plan 2 - Growth Store',
    price: 350,
    productCount: 8,
    profitPercentage: 22,
    dailyEarningsEstimate: 77,
    badge: 'Bronze',
    description: 'Accelerated sales plan with 8 verified products and priority liquidity settlement.',
    features: ['8 Active Products in Store', '22% Profit Yield', 'Priority Order Processing', 'Direct Bank Payouts'],
  },
  {
    id: 'plan-3',
    level: 3,
    name: 'Plan 3 - Pro Merchant',
    price: 1200,
    productCount: 15,
    profitPercentage: 25,
    dailyEarningsEstimate: 300,
    badge: 'Silver',
    description: 'High-volume tier featuring 15 flagship electronics and higher turnover.',
    features: ['15 Active Products in Store', '25% Profit Yield', 'Fast Track Backend Buy Back', 'VIP Merchant Desk'],
  },
  {
    id: 'plan-4',
    level: 4,
    name: 'Plan 4 - Gold Merchant',
    price: 2500,
    productCount: 22,
    profitPercentage: 28,
    dailyEarningsEstimate: 700,
    badge: 'Gold',
    description: 'Advanced store volume with 22 devices, guaranteed turnover, and priority settlement.',
    features: ['22 Active Products in Store', '28% Profit Yield', 'Instant Balance Clearance', 'Dedicated Account Manager'],
  },
  {
    id: 'plan-5',
    level: 5,
    name: 'Plan 5 - Platinum Store',
    price: 5000,
    productCount: 30,
    profitPercentage: 30,
    dailyEarningsEstimate: 1500,
    badge: 'Platinum',
    description: 'Wholesale-grade portfolio with 30 hardware products and rapid buy back.',
    features: ['30 Active Products in Store', '30% Profit Yield', 'Priority Capital Buy Back', '24/7 Telegram VIP Support'],
  },
  {
    id: 'plan-6',
    level: 6,
    name: 'Plan 6 - Diamond Enterprise',
    price: 8500,
    productCount: 40,
    profitPercentage: 32,
    dailyEarningsEstimate: 2720,
    badge: 'Diamond',
    description: 'Mass market catalog coverage with 40 high-demand tech items and superior turnover.',
    features: ['40 Active Products in Store', '32% Profit Yield', 'Automated Daily Buy Back', 'Higher Withdrawal Limit'],
  },
  {
    id: 'plan-7',
    level: 7,
    name: 'Plan 7 - Crown Elite',
    price: 15000,
    productCount: 50,
    profitPercentage: 35,
    dailyEarningsEstimate: 5250,
    badge: 'Crown',
    description: 'Top-tier merchant allocation with 50 premium catalog devices across all categories.',
    features: ['50 Active Products in Store', '35% Profit Yield', 'Maximum Liquidity Routing', 'Exclusive Wholesale Pricing'],
  },
  {
    id: 'plan-8',
    level: 8,
    name: 'Plan 8 - Full Store (Master Wholesale)',
    price: 25000,
    productCount: 58,
    profitPercentage: 40,
    dailyEarningsEstimate: 10000,
    badge: 'Full Store',
    description: 'Complete wholesale store access with all 58 catalog products unlocked and highest 40% profit tier.',
    features: ['Full Store - All 58 Catalog Products', '40% Maximum Profit Yield', 'VIP Instant Buy-Back Desk', 'Zero-Fee Wire Clearances'],
  },
];

export type ProductCategory =
  | 'all'
  | 'mobiles'
  | 'laptops'
  | 'electronics'
  | 'audio'
  | 'wearables'
  | 'accessories'
  | 'footwear'
  | 'apparel';

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  originalPrice: number;
  discountPrice: number; // 20% discount
  discountPercentage: number; // default 20%
  rating: number;
  reviewCount: number;
  imageUrl: string;
  stock: number;
  specs: string[];
  description: string;
  instructions?: string;
  isTrending: boolean;
  commissionRate?: number; // defaults to 0.05
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'shipped'
  | 'delivered'
  | 'frozen'
  | 'cancelled';

export interface OrderItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  commissionEarned: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  processedByAdmin?: boolean;
  trackingNumber?: string;
  shippingAddress?: string;
  paymentMethod?: string;
}

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected';
export type WithdrawalMethod = 'USDT (TRC20)' | 'Bank Transfer' | 'PayPal' | 'Crypto (ERC20)';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  method: WithdrawalMethod;
  accountDetails: string;
  amount: number;
  fee: number;
  receivedAmount: number;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string;
  adminRemark?: string;
  bankDetails?: BankAccountDetails;
  payoutReference?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'agent' | 'admin' | 'system';
  targetUserId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  orderNumber?: string;
  department?: string;
}

export interface MessageNotification {
  id: string;
  userId: string;
  title: string;
  content: string;
  imageUrl?: string;
  type: 'order' | 'finance' | 'credit' | 'system';
  timestamp: string;
  isRead: boolean;
}

export interface TopSeller {
  rank: number;
  id: string;
  name: string;
  storeName: string;
  avatar: string;
  badge: string;
  sellerLevel: string;
  totalSales: number;
  totalOrders: number;
  positiveRating: number;
}

export type PaymentMethodType =
  | 'Direct Bank Wire (IBAN/IFSC)'
  | 'USDT (TRC20)'
  | 'PayPal Global'
  | 'Interbank Credit Settlement';

export interface UserProduct {
  id: string;
  userId: string;
  userName?: string;
  productId: string;
  product: Product;
  stock: number;
  unitsSold: number;
  revenueGenerated: number;
  profitRate: number;
  listedDate: string;
  addedAt?: string;
  status?: 'active' | 'sold_back';
  purchasePrice?: number;
  buyBackPrice?: number;
  buyBackProfit?: number;
  soldBackAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PlanRequestStatus = 'pending' | 'approved' | 'rejected';

export interface PlanPurchaseRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planLevel: number;
  planName: string;
  planPrice: number;
  price?: number;
  productCount: number;
  profitPercentage: number;
  requestedAt: string;
  status: PlanRequestStatus;
  processedAt?: string;
  adminRemark?: string;
}
