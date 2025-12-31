import { createAuthClient } from "better-auth/client";

/**
 * 创建客户端认证实例
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL, // 客户端基础 URL
  plugins: [],
});

/**
 * 认证客户端类型
 */
export type AuthClient = typeof authClient;

/**
 * 使用会话的 Hook 返回类型
 */
export type UseSessionReturn = Awaited<
  ReturnType<typeof authClient.useSession>
>;
