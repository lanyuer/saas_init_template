# 企业级SAAS模板 Monorepo 架构实现计划

## 项目概述

将当前单仓库 Next.js 认证项目升级为**顶级企业级SAAS模板**，采用 Monorepo 架构，支持多租户、支付订阅、通知系统。

---

## 一、Monorepo目录结构

```
/home/work/github/auth-demo/
├── apps/
│   ├── web/                    # Next.js 主应用
│   │   ├── src/
│   │   │   ├── app/            # App Router 页面
│   │   │   │   ├── (auth)/     # 认证页面组
│   │   │   │   │   ├── sign-in/
│   │   │   │   │   ├── sign-up/
│   │   │   │   │   └── forgot-password/
│   │   │   │   ├── (dashboard)/ # 仪表板页面组
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── settings/
│   │   │   │   │   ├── team/
│   │   │   │   │   └── billing/
│   │   │   │   ├── api/        # API Routes
│   │   │   │   ├── layout.tsx
│   │   │   │   └── globals.css
│   │   │   ├── components/     # 业务组件
│   │   │   ├── hooks/          # 自定义 hooks
│   │   │   ├── lib/            # 业务逻辑
│   │   │   └── stores/         # Zustand 状态管理
│   │   ├── public/
│   │   ├── package.json
│   │   └── tailwind.config.ts
│   │
│   └── api-gateway/            # 独立API服务(可选)
│
├── packages/
│   ├── ui/                     # Shadcn/UI 组件库
│   │   ├── src/components/ui/  # 基础组件
│   │   ├── src/components/layout/ # 布局组件
│   │   └── package.json
│   │
│   ├── config/                 # 共享配置
│   │   ├── eslint/
│   │   ├── typescript/
│   │   ├── tailwind/
│   │   └── package.json
│   │
│   ├── database/               # 数据库层 ⭐
│   │   ├── src/schema/         # Drizzle schemas
│   │   │   ├── auth.ts         # 认证表
│   │   │   ├── tenant.ts       # 多租户表
│   │   │   ├── billing.ts      # 支付表
│   │   │   └── notification.ts # 通知表
│   │   ├── src/services/       # 业务服务层
│   │   ├── src/repositories/   # 数据访问层
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   │
│   ├── auth/                   # 认证共享逻辑
│   │   ├── src/client/         # 客户端
│   │   ├── src/server/         # 服务端
│   │   ├── src/plugins/        # 多租户插件
│   │   └── package.json
│   │
│   ├── ts-types/               # 共享类型定义
│   │   └── package.json
│   │
│   └── utils/                  # 工具函数
│       └── package.json
│
├── turbo.json
├── package.json
└── tsconfig.base.json
```

---

## 二、数据库Schema设计

### 2.1 认证模块 (auth.ts)
- `users` - 用户表
- `sessions` - 会话表
- `accounts` - OAuth账户表
- `verification` - 验证令牌表

### 2.2 多租户模块 (tenant.ts)
- `organizations` - 组织表 (含 slug 用于 URL)
- `memberships` - 成员关联表
- `roles` - 角色定义表
- `invitations` - 邀请表
- `workspaces` - 工作区表(可选)

### 2.3 支付订阅模块 (billing.ts)
- `plans` - 订阅计划表
- `subscriptions` - 订阅表
- `billing_history` - 计费历史
- `customers` - Stripe客户映射

### 2.4 通知模块 (notification.ts)
- `notifications` - 通知表
- `notification_preferences` - 用户偏好
- `email_logs` - 邮件发送日志

---

## 三、核心功能模块

### 3.1 多租户架构
- 组织上下文中间件
- 基于 slug 的 URL 路由: `app.com/org/{slug}/...`
- 权限检查装饰器/高阶组件

### 3.2 Stripe集成
- Checkout Session 创建
- Portal 账单管理
- Webhook 事件处理 (订阅更新、付款)

### 3.3 通知系统
- 应用内通知
- 邮件通知(按用户偏好)
- 通知类型: 邀请、账单、订阅变更等

### 3.4 Zustand状态管理
- `auth-store.ts` - 认证状态
- `organization-store.ts` - 当前组织
- `notification-store.ts` - 通知状态

---

## 四、分阶段实施计划

### Phase 1: Monorepo 基础架构
- ✅ 初始化 Turborepo
- ✅ 创建 packages/config, packages/utils
- ✅ 配置 pnpm workspace

### Phase 2: 数据库层重构
- 重构现有 schema 为 packages/database
- 添加多租户、支付、通知 schema
- 创建 repositories 抽象层

### Phase 3: UI 组件库
- 安装配置 Shadcn/UI
- 创建基础组件 (Button, Input, Card 等)
- 实现浅色主题

### Phase 4: 认证增强
- 重构 auth.ts 为 packages/auth
- 实现多租户插件
- RBAC 权限系统

### Phase 5: 多租户功能
- 组织 CRUD API
- 成员管理
- 邀请系统

### Phase 6: 支付订阅
- Stripe 服务层
- 订阅管理页面
- 账单历史

### Phase 7: 通知系统
- 通知服务
- 邮件集成
- 偏好设置

### Phase 8: 前端集成
- Next.js 应用完整页面
- Zustand stores
- 仪表板、设置页面

---

## 五、技术栈版本

| 包 | 版本 |
|---|---|
| Next.js | ^14.2.0 |
| React | ^18.3.0 |
| TypeScript | ^5.4.0 |
| Better-Auth | ^1.1.0 |
| Drizzle ORM | ^0.31.0 |
| Zustand | ^4.5.0 |
| Stripe | ^14.0.0 |
| Turbo | ^1.13.0 |
| Shadcn/UI | latest |

---

## 六、关键文件修改清单

1. `packages/database/src/schema/*.ts` - 新建完整 schema
2. `packages/auth/src/*.ts` - 重构认证逻辑
3. `apps/web/src/app/**/*` - 前端页面
4. `apps/web/src/stores/*.ts` - Zustand stores
5. `packages/ui/src/components/**/*` - UI 组件库

---

## 七、预计工作量

| Phase | 主要工作 | 复杂度 |
|-------|---------|-------|
| Phase 1 | Turborepo 配置 | 中 |
| Phase 2 | 数据库 schema + repositories | 高 |
| Phase 3 | UI 组件库 | 中 |
| Phase 4 | 多租户认证 | 高 |
| Phase 5 | 组织管理功能 | 中 |
| Phase 6 | Stripe 集成 | 高 |
| Phase 7 | 通知系统 | 中 |
| Phase 8 | 前端集成 | 高 |
