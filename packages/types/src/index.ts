// ==================== 通用类型 ====================

/**
 * API 响应基础类型
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

/**
 * 分页结果
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ==================== 认证类型 ====================

/**
 * 用户基础类型
 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 会话类型
 */
export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 认证上下文
 */
export interface AuthContext {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
}

// ==================== 多租户类型 ====================

/**
 * 组织类型
 */
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 成员类型
 */
export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  permissions: string[];
  joinedAt: Date;
  updatedAt: Date;
}

/**
 * 角色类型
 */
export interface Role {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  permissions: string[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 邀请类型
 */
export interface Invitation {
  id: string;
  organizationId: string;
  email: string;
  role: string;
  inviterId: string;
  token: string;
  status: "pending" | "accepted" | "expired";
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 权限检查结果
 */
export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
}

/**
 * 工作区类型
 */
export interface Workspace {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  settings: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== 支付订阅类型 ====================

/**
 * 订阅计划类型
 */
export interface Plan {
  id: string;
  name: string;
  description: string | null;
  priceMonthly: number;
  priceYearly: number;
  stripePriceIdMonthly: string | null;
  stripePriceIdYearly: string | null;
  features: string[];
  limits: PlanLimits;
  isActive: boolean;
  isPopular: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 计划限制
 */
export interface PlanLimits {
  users: number;
  storage: string;
  apiCalls: number | "unlimited";
  workspaces: number;
}

/**
 * 订阅类型
 */
export interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  stripeSubscriptionId: string | null;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialStart: Date | null;
  trialEnd: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 订阅状态
 */
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid";

/**
 * 计费历史类型
 */
export interface BillingHistory {
  id: string;
  organizationId: string;
  subscriptionId: string | null;
  stripeInvoiceId: string | null;
  amount: number;
  currency: string;
  status: "paid" | "failed" | "pending";
  type: "subscription" | "usage" | "credit";
  description: string | null;
  invoiceUrl: string | null;
  invoicePdf: string | null;
  createdAt: Date;
}

/**
 * 客户类型
 */
export interface Customer {
  id: string;
  organizationId: string;
  stripeCustomerId: string;
  email: string;
  name: string | null;
  defaultPaymentMethod: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== 通知类型 ====================

/**
 * 通知类型枚举值
 */
export const NOTIFICATION_TYPES = {
  // 账户相关
  WELCOME: "welcome",
  EMAIL_VERIFIED: "email_verified",

  // 组织相关
  ORGANIZATION_INVITATION: "organization_invitation",
  ORGANIZATION_ROLE_CHANGED: "organization_role_changed",
  ORGANIZATION_MEMBER_REMOVED: "organization_member_removed",
  ORGANIZATION_CREATED: "organization_created",

  // 订阅相关
  SUBSCRIPTION_CREATED: "subscription_created",
  SUBSCRIPTION_CANCELED: "subscription_canceled",
  SUBSCRIPTION_PAYMENT_FAILED: "subscription_payment_failed",
  SUBSCRIPTION_PAYMENT_SUCCESS: "subscription_payment_success",
  SUBSCRIPTION_UPGRADED: "subscription_upgraded",
  SUBSCRIPTION_DOWNGRADED: "subscription_downgraded",
  SUBSCRIPTION_RENEWED: "subscription_renewed",

  // 账单相关
  INVOICE_PAID: "invoice_paid",
  INVOICE_FAILED: "invoice_failed",

  // 系统相关
  SYSTEM_ANNOUNCEMENT: "system_announcement",
  MAINTENANCE_SCHEDULED: "maintenance_scheduled",
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

/**
 * 通知类型
 */
export interface Notification {
  id: string;
  userId: string;
  organizationId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
}

/**
 * 通知偏好类型
 */
export interface NotificationPreference {
  id: string;
  userId: string;
  type: NotificationType;
  channel: "email" | "in_app" | "push";
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 通知创建参数
 */
export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  organizationId?: string;
}

// ==================== API 错误类型 ====================

/**
 * API 错误代码
 */
export const API_ERROR_CODES = {
  // 认证错误 (40x)
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",

  // 资源错误 (40x)
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  VALIDATION_ERROR: "VALIDATION_ERROR",

  // 业务错误 (40x)
  ORGANIZATION_NOT_FOUND: "ORGANIZATION_NOT_FOUND",
  ORGANIZATION_ALREADY_EXISTS: "ORGANIZATION_ALREADY_EXISTS",
  MEMBER_NOT_FOUND: "MEMBER_NOT_FOUND",
  MEMBER_ALREADY_EXISTS: "MEMBER_ALREADY_EXISTS",
  INVITATION_NOT_FOUND: "INVITATION_NOT_FOUND",
  INVITATION_EXPIRED: "INVITATION_EXPIRED",
  PERMISSION_DENIED: "PERMISSION_DENIED",

  // 订阅错误
  PLAN_NOT_FOUND: "PLAN_NOT_FOUND",
  SUBSCRIPTION_NOT_FOUND: "SUBSCRIPTION_NOT_FOUND",
  SUBSCRIPTION_UPDATE_FAILED: "SUBSCRIPTION_UPDATE_FAILED",

  // 服务器错误 (50x)
  INTERNAL_ERROR: "INTERNAL_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];
