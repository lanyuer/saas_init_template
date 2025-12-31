import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";
import { organizations } from "./tenant";

// ==================== 通知类型常量 ====================
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

// ==================== 通知表 ====================
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    type: text("type").notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    data: jsonb("data"), // 附加数据 (如链接、action URL)
    isRead: boolean("is_read").default(false).notNull(),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("notifications_user_idx").on(table.userId),
    orgIdx: index("notifications_organization_idx").on(table.organizationId),
    typeIdx: index("notifications_type_idx").on(table.type),
    unreadIdx: index("notifications_unread_idx").on(table.userId, table.isRead),
  })
);

// ==================== 通知偏好设置表 ====================
export const notificationPreferences = pgTable(
  "notification_preferences",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    channel: text("channel").notNull(), // email, in_app, push
    isEnabled: boolean("is_enabled").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("notification_preferences_user_idx").on(table.userId),
    typeChannelIdx: index("notification_preferences_type_channel_idx").on(
      table.userId,
      table.type,
      table.channel
    ),
  })
);

// ==================== 邮件发送日志表 ====================
export const emailLogs = pgTable(
  "email_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    notificationId: uuid("notification_id").references(() => notifications.id),
    recipient: text("recipient").notNull(),
    subject: text("subject").notNull(),
    status: text("status").notNull(), // sent, failed, bounced
    error: text("error"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("email_logs_user_idx").on(table.userId),
    statusIdx: index("email_logs_status_idx").on(table.status),
  })
);

// ==================== 关系定义 ====================
export const notificationsRelations = relations(notifications, ({ one, many }) => ({
  user: one(user, {
    fields: [notifications.userId],
    references: [user.id],
  }),
  organization: one(organizations, {
    fields: [notifications.organizationId],
    references: [organizations.id],
  }),
  emailLogs: many(emailLogs),
}));

export const notificationPreferencesRelations = relations(
  notificationPreferences,
  ({ one }) => ({
    user: one(user, {
      fields: [notificationPreferences.userId],
      references: [user.id],
    }),
  })
);

export const emailLogsRelations = relations(emailLogs, ({ one }) => ({
  user: one(user, {
    fields: [emailLogs.userId],
    references: [user.id],
  }),
  notification: one(notifications, {
    fields: [emailLogs.notificationId],
    references: [notifications.id],
  }),
}));

// ==================== 通知渠道 ====================
export const NOTIFICATION_CHANNELS = {
  IN_APP: "in_app",
  EMAIL: "email",
  PUSH: "push",
} as const;

// ==================== 导出类型 ====================
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type NotificationPreference =
  typeof notificationPreferences.$inferSelect;
export type NewNotificationPreference =
  typeof notificationPreferences.$inferInsert;
export type EmailLog = typeof emailLogs.$inferSelect;
export type NewEmailLog = typeof emailLogs.$inferInsert;
