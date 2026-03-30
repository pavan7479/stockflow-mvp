"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProtectedLayout from "@/components/ProtectedLayout";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { apiGet, apiDelete } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  quantity_on_hand: number;
  cost_price?: number;
  selling_price?: number;
  low_stock_threshold?: number;
  is_low_stock: boolean;
}

export default function ProductsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet("/api/products/");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError("Failed to load products.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleDelete = async (id: number) => {
    try {
      const response = await apiDelete(`/api/products/${id}/`);
      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id));
        showToast("Product deleted successfully", "success");
      } else {
        showToast("Failed to delete product", "error");
      }
    } catch {
      showToast("Error connecting to server", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <ProtectedLayout>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">Products</h1>
            {!loading && (
              <span className="px-2.5 py-0.5 rounded-full bg-surface border border-border text-xs font-bold text-primary-muted shrink-0">
                {products.length} {products.length === 1 ? "Item" : "Items"}
              </span>
            )}
          </div>
          <p className="text-primary-muted mt-1 font-medium hidden sm:block">Manage and track your inventory items</p>
        </div>
        <Button onClick={() => router.push("/products/new")} className="shadow-lg shadow-accent/20 shrink-0 px-8 font-bold">
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-primary-muted">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all placeholder:text-primary-muted text-white shadow-inner"
        />
      </div>

      {error ? (
        <div className="p-12 rounded-2xl border border-danger/20 bg-danger/5 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">{error}</h3>
          <Button variant="ghost" onClick={fetchProducts}>Retry Loader</Button>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#1a2233] text-primary-muted uppercase text-[10px] tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4 text-right">Qty</th>
                  <th className="px-6 py-4 text-right">Selling Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-12 ml-auto" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-20 ml-auto" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-16 ml-auto" /></td>
                    </tr>
                  ))
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{product.name}</div>
                        {product.description && (
                          <div className="text-xs text-primary-muted truncate max-w-[200px]">{product.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-primary-muted">{product.sku}</td>
                      <td className="px-6 py-4 text-right font-medium text-white">{product.quantity_on_hand}</td>
                      <td className="px-6 py-4 text-right text-white ">{formatCurrency(product.selling_price)}</td>
                      <td className="px-6 py-4">
                        {product.is_low_stock ? (
                          <Badge variant="warning">Low Stock</Badge>
                        ) : (
                          <Badge variant="success">In Stock</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {deletingId === product.id ? (
                          <div className="flex items-center justify-end gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                             <Button variant="ghost" className="h-8 px-2 text-[10px]" onClick={() => setDeletingId(null)}>Cancel</Button>
                             <Button variant="danger" className="h-8 px-3 text-[10px]" onClick={() => handleDelete(product.id)}>Confirm</Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => router.push(`/products/${product.id}/edit`)}
                              className="p-2 rounded-lg bg-surface border border-border text-primary-muted hover:text-accent hover:border-accent/50 transition-all"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeletingId(product.id)}
                              className="p-2 rounded-lg bg-surface border border-border text-primary-muted hover:text-danger hover:border-danger/50 transition-all"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="w-20 h-20 bg-surface border border-border rounded-full flex items-center justify-center mx-auto mb-4 text-primary-muted">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {searchQuery ? "No products match your search" : "No products yet"}
                      </h3>
                      <p className="text-primary-muted mb-6 max-w-xs mx-auto">
                        {searchQuery ? "Try a different search term or clear the filter." : "Get started by adding your first product to the inventory."}
                      </p>
                      {!searchQuery && (
                        <Button onClick={() => router.push("/products/new")}>
                          Add Your First Product
                        </Button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ProtectedLayout>
  );
}
