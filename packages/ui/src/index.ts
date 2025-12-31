import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并 Tailwind CSS 类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 导出所有组件
export * from "./components/ui/button";
export * from "./components/ui/input";
export * from "./components/ui/card";
export * from "./components/ui/label";
export * from "./components/ui/select";
export * from "./components/ui/tabs";
export * from "./components/ui/avatar";
export * from "./components/ui/dropdown-menu";
export * from "./components/ui/sheet";
export * from "./components/ui/toast";
export * from "./components/ui/tooltip";
export * from "./components/ui/separator";
