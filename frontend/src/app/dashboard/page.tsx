"use client";

import React, { useEffect, useState } from "react";
import ProtectedLayout from "../../components/ProtectedLayout";
import StatCard from "../../components/ui/StatCard";
import Skeleton from "../../components/ui/Skeleton";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { apiGet } from "../../lib/api";

interface DashboardData {
  total_products: number;
  total_quantity: number;
  low_stock_items: Array<{
    id: number;
    name: string;
    sku: string;
    quantity_on_hand: number;
    low_stock_threshold: number;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lowStockCount = data?.low_stock_items.length || 0;

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet("/api/dashboard");
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        setError("Failed to fetch dashboard data. Please try again.");
      }
    } catch {
      setError("Unable to connect to the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <ProtectedLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-primary-muted mt-1 font-medium">Here&apos;s your inventory overview</p>
      </div>

      {error ? (
        <div className="p-12 rounded-2xl border border-danger/20 bg-danger/5 text-center">
          <div className="w-12 h-12 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{error}</h3>
          <Button variant="ghost" onClick={fetchDashboard} className="mt-2">
            Retry Connection
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <>
                <Skeleton className="h-36" />
                <Skeleton className="h-36" />
                <Skeleton className="h-36" />
              </>
            ) : (
              <>
                <StatCard
                  label="Total Products"
                  value={data?.total_products || 0}
                  variant="blue"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  }
                />
                <StatCard
                  label="Total Units"
                  value={data?.total_quantity || 0}
                  variant="green"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  }
                />
                <StatCard
                  label="Low Stock Alerts"
                  value={lowStockCount}
                  variant="amber"
                  pulse={lowStockCount > 0}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  }
                />
              </>
            )}
          </div>

          {/* Low Stock Table */}
          <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xl">
            <div className="px-6 py-5 border-b border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="font-bold text-white">Low Stock Items</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#1a2233] text-primary-muted uppercase text-[10px] tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4">Qty on Hand</th>
                    <th className="px-6 py-4">Threshold</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-20 float-right" /></td>
                      </tr>
                    ))
                  ) : data?.low_stock_items.length ? (
                    data.low_stock_items.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4 font-semibold text-white">{item.name}</td>
                        <td className="px-6 py-4 text-primary-muted font-mono text-xs">{item.sku}</td>
                        <td className="px-6 py-4 text-danger font-bold">{item.quantity_on_hand}</td>
                        <td className="px-6 py-4 text-primary-muted">{item.low_stock_threshold}</td>
                        <td className="px-6 py-4 text-right">
                          <Badge variant="danger">Low Stock</Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-white font-semibold mb-1">In Good Shape</h3>
                        <p className="text-primary-muted text-sm">All products are well-stocked</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </ProtectedLayout>
  );
}
