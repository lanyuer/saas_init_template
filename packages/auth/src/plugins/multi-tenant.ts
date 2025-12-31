import { BetterAuthPlugin, Context } from "better-auth";

export interface MultiTenantOptions {
  /**
   * 获取组织 ID 的策略
   */
  getOrganizationId: (context: Context) => Promise<string | null | undefined>;
  /**
   * 权限检查
   */
  checkPermission: (context: Context & { organizationId: string }) => Promise<boolean>;
}

/**
 * 多租户认证插件
 *
 * 功能：
 * 1. 在认证会话中注入组织上下文
 * 2. 提供权限检查机制
 * 3. 支持基于组织的访问控制
 */
export const multiTenant = (options: MultiTenantOptions): BetterAuthPlugin => {
  return {
    id: "multi-tenant",

    hooks: {
      /**
       * 认证后注入组织上下文
       */
      onAuthenticate: {
        handler: async (ctx) => {
          const orgId = await options.getOrganizationId(ctx);

          if (orgId && ctx.session) {
            // 将组织 ID 注入到会话中
            return {
              ...ctx.session,
              organizationId: orgId,
            };
          }

          return ctx;
        },
      },
    },

    /**
     * 导出组织上下文获取函数
     */
    __context: {
      getOrganizationId: options.getOrganizationId,
      checkPermission: options.checkPermission,
    },
  };
};

/**
 * 从会话中获取组织 ID
 */
export async function getOrganizationIdFromSession(
  session: { organizationId?: string } | null | undefined
): Promise<string | null> {
  return session?.organizationId ?? null;
}

/**
 * 检查用户是否有特定权限
 */
export async function checkUserPermission(
  userId: string,
  organizationId: string,
  permission: string
): Promise<boolean> {
  // TODO: 实现权限检查逻辑
  // 需要查询 membership 表中的权限配置
  return true;
}

/**
 * 获取用户在组织中的角色
 */
export async function getUserRole(
  userId: string,
  organizationId: string
): Promise<string | null> {
  // TODO: 实现角色获取逻辑
  // 需要查询 membership 表
  return null;
}
