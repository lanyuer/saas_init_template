import {
  pgTable,
  uuid,
  text,
  timestamp,
  decimal,
  jsonb,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { organizations } from "./tenant";

// ==================== 订阅计划表 ====================
export const plans = pgTable(
  "plans",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(), // free, pro, enterprise
    description: text("description"),
    priceMonthly: decimal("price_monthly", { precision: 10, scale: 2 }).notNull(),
    priceYearly: decimal("price_yearly", { precision: 10, scale: 2 }).notNull(),
    stripePriceIdMonthly: text("stripe_price_id_monthly"),
    stripePriceIdYearly: text("stripe_price_id_yearly"),
    features: jsonb("features").notNull(), // 功能列表 [" Unlimited users", "Priority support"]
    limits: jsonb("limits").notNull(), // { users: 10, storage: "1GB" }
    isActive: boolean("is_active").default(true).notNull(),
    isPopular: boolean("is_popular").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    nameIdx: index("plans_name_idx").on(table.name),
  })
);

// ==================== 订阅表 ====================
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    planId: uuid("plan_id")
      .notNull()
      .references(() => plans.id),
    stripeSubscriptionId: text("stripe_subscription_id").unique(),
    status: text("status").notNull(), // active, canceled, past_due, trialing
    currentPeriodStart: timestamp("current_period_start", {
      withTimezone: true,
    }).notNull(),
    currentPeriodEnd: timestamp("current_period_end", {
      withTimezone: true,
    }).notNull(),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    trialStart: timestamp("trial_start", { withTimezone: true }),
    trialEnd: timestamp("trial_end", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orgIdx: index("subscriptions_organization_idx").on(table.organizationId),
    stripeIdx: index("subscriptions_stripe_idx").on(table.stripeSubscriptionId),
    statusIdx: index("subscriptions_status_idx").on(table.status),
  })
);

// ==================== 客户表 (Stripe Customer) ====================
export const customers = pgTable(
  "customers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" })
      .unique(),
    stripeCustomerId: text("stripe_customer_id").notNull().unique(),
    email: text("email").notNull(),
    name: text("name"),
    defaultPaymentMethod: text("default_payment_method"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    stripeIdx: index("customers_stripe_idx").on(table.stripeCustomerId),
    orgIdx: index("customers_organization_idx").on(table.organizationId),
  })
);

// ==================== 计费历史表 ====================
export const billingHistory = pgTable(
  "billing_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    subscriptionId: uuid("subscription_id").references(() => subscriptions.id),
    stripeInvoiceId: text("stripe_invoice_id"),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: text("currency").notNull().default("usd"),
    status: text("status").notNull(), // paid, failed, pending
    type: text("type").notNull(), // subscription, usage, credit, refund
    description: text("description"),
    invoiceUrl: text("invoice_url"),
    invoicePdf: text("invoice_pdf"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orgIdx: index("billing_history_organization_idx").on(table.organizationId),
    subIdx: index("billing_history_subscription_idx").on(table.subscriptionId),
    stripeIdx: index("billing_history_stripe_idx").on(table.stripeInvoiceId),
  })
);

// ==================== 关系定义 ====================
export const plansRelations = relations(plans, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [subscriptions.organizationId],
    references: [organizations.id],
  }),
  plan: one(plans, {
    fields: [subscriptions.planId],
    references: [plans.id],
  }),
  billingHistory: many(billingHistory),
}));

export const customersRelations = relations(customers, ({ one }) => ({
  organization: one(organizations, {
    fields: [customers.organizationId],
    references: [organizations.id],
  }),
}));

export const billingHistoryRelations = relations(billingHistory, ({ one }) => ({
  organization: one(organizations, {
    fields: [billingHistory.organizationId],
    references: [organizations.id],
  }),
  subscription: one(subscriptions, {
    fields: [billingHistory.subscriptionId],
    references: [subscriptions.id],
  }),
}));

// ==================== 订阅状态常量 ====================
export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  CANCELED: "canceled",
  PAST_DUE: "past_due",
  TRIALING: "trialing",
  INCOMPLETE: "incomplete",
  INCOMPLETE_EXPIRED: "incomplete_expired",
  UNPAID: "unpaid",
} as const;

// ==================== 导出类型 ====================
export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type BillingHistory = typeof billingHistory.$inferSelect;
export type NewBillingHistory = typeof billingHistory.$inferInsert;
