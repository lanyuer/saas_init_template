import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";

// ==================== 组织表 ====================
export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    logo: text("logo"),
    metadata: jsonb("metadata"), // 扩展属性
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    slugIdx: index("organizations_slug_idx").on(table.slug),
  })
);

// ==================== 成员表 (用户-组织关联) ====================
export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("member"),
    permissions: jsonb("permissions"), // 细粒度权限覆盖
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userOrgIdx: uniqueIndex("memberships_user_org_idx").on(
      table.userId,
      table.organizationId
    ),
    orgIdx: index("memberships_organization_idx").on(table.organizationId),
  })
);

// ==================== 角色定义表 ====================
export const roles = pgTable(
  "roles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    permissions: jsonb("permissions").notNull(), // 权限标识数组
    isDefault: boolean("is_default").default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orgIdx: index("roles_organization_idx").on(table.organizationId),
    nameIdx: index("roles_name_idx").on(table.organizationId, table.name),
  })
);

// ==================== 邀请表 ====================
export const invitations = pgTable(
  "invitations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role").notNull().default("member"),
    inviterId: uuid("inviter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    status: text("status")
      .notNull()
      .default("pending"), // pending, accepted, expired
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orgIdx: index("invitations_organization_idx").on(table.organizationId),
    emailIdx: index("invitations_email_idx").on(table.email),
    tokenIdx: index("invitations_token_idx").on(table.token),
  })
);

// ==================== 工作区表 (可选) ====================
export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    settings: jsonb("settings"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orgIdx: index("workspaces_organization_idx").on(table.organizationId),
  })
);

// ==================== 关系定义 ====================
export const organizationsRelations = relations(organizations, ({ many }) => ({
  memberships: many(memberships),
  roles: many(roles),
  invitations: many(invitations),
  workspaces: many(workspaces),
}));

export const membershipsRelations = relations(memberships, ({ one }) => ({
  user: one(user, {
    fields: [memberships.userId],
    references: [user.id],
  }),
  organization: one(organizations, {
    fields: [memberships.organizationId],
    references: [organizations.id],
  }),
}));

export const rolesRelations = relations(roles, ({ one }) => ({
  organization: one(organizations, {
    fields: [roles.organizationId],
    references: [organizations.id],
  }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  organization: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id],
  }),
  inviter: one(user, {
    fields: [invitations.inviterId],
    references: [user.id],
  }),
}));

export const workspacesRelations = relations(workspaces, ({ one }) => ({
  organization: one(organizations, {
    fields: [workspaces.organizationId],
    references: [organizations.id],
  }),
}));

// ==================== 预定义角色常量 ====================
export const ORGANIZATION_ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
  GUEST: "guest",
} as const;

// ==================== 预定义权限 ====================
export const PERMISSIONS = {
  // 组织管理
  org: {
    manage: "org:manage",
    view: "org:view",
  },
  // 成员管理
  members: {
    invite: "members:invite",
    remove: "members:remove",
    update: "members:update",
    view: "members:view",
  },
  // 角色管理
  roles: {
    create: "roles:create",
    edit: "roles:edit",
    delete: "roles:delete",
    view: "roles:view",
  },
  // 账单管理
  billing: {
    view: "billing:view",
    manage: "billing:manage",
  },
  // 设置管理
  settings: {
    view: "settings:view",
    manage: "settings:manage",
  },
} as const;

// ==================== 导出类型 ====================
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type Membership = typeof memberships.$inferSelect;
export type NewMembership = typeof memberships.$inferInsert;
export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
