"use client";

import { ReactNode } from "react";
// 这里可以集成 ThemeProvider, ToastProvider, AuthProvider 等

export function SaaSProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}

