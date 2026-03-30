"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Decorative Panel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface items-center justify-center border-r border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#2563eb15,transparent_50%)]" />
        <div className="relative z-10 p-12 max-w-lg">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">
            Inventory, <span className="text-accent underline decoration-accent/30">simplified</span>.
          </h1>
          <p className="text-lg text-primary-muted leading-relaxed">
            Manage your stock, track your organization&apos;s growth, and streamline operations with StockFlow.
          </p>
        </div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-sm flex flex-col items-center">
          <div className="mb-8 flex flex-col items-center">
            <h2 className="text-3xl font-bold tracking-tighter auth-glow text-accent mb-2">
              StockFlow
            </h2>
            <div className="h-1 w-12 bg-accent rounded-full" />
          </div>
          <div className="w-full bg-surface/50 p-6 md:p-8 rounded-2xl border border-border backdrop-blur-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
