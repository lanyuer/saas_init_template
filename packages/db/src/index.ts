import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// 数据库连接配置
const connectionString = process.env.DATABASE_URL!;

// 创建 postgres 客户端
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// 创建 Drizzle 实例
export const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV === "development",
});

// 导出数据库连接客户端
export { client };

// 导出 schema
export { schema };
export * from "./schema";
