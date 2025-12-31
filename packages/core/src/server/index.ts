import { auth } from "@saas/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * 获取当前会话 (服务端)
 */
export async function getSession() {
  return await auth.api.getSession({
    headers: headers(),
  });
}

/**
 * 确保用户已登录，否则重定向
 */
export async function requireUser() {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }
  return session;
}

/**
 * 获取当前组织上下文
 */
export async function getOrganizationContext() {
  const session = await getSession();
  if (!session) return null;

  const orgId = headers().get("x-organization-id");
  
  // TODO: 验证用户是否属于该组织
  
  return {
    user: session.user,
    organizationId: orgId,
  };
}

