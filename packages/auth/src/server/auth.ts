import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { toNextJsHandler } from "better-auth/next-js";
import { db, schema } from "@saas/db";
import { multiTenant } from "../plugins/multi-tenant";

/**
 * 创建服务端认证实例
 */
export const auth = betterAuth({
  // 邮箱密码认证
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  // 第三方认证 (可选)
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },

  // 数据库适配器
  database: drizzleAdapter(db, {
    provider: "postgresql",
    schema,
  }),

  // Cookie 配置
  advanced: {
    cookiePrefix: "saas",
    cookieSecure: process.env.NODE_ENV === "production",
  },

  // 插件
  plugins: [
    // 多租户插件
    multiTenant({
      getOrganizationId: async (ctx) => {
        // 从请求头获取组织 ID
        const orgId = ctx.request?.headers?.get("x-organization-id");
        return orgId;
      },
      checkPermission: async (ctx) => {
        // 权限检查逻辑
        return true;
      },
    }),
  ],
});

/**
 * 导出 Next.js API Route Handler
 */
export const { GET, POST } = toNextJsHandler(auth);

/**
 * 认证处理器类型
 */
export type AuthHandler = typeof auth;
