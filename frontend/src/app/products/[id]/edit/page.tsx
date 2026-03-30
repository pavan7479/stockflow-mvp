"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import ProtectedLayout from "../../../../components/ProtectedLayout";
import ProductForm from "../../../../components/ProductForm";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Skeleton from "../../../../components/ui/Skeleton";
import { apiGet, apiPut, apiPatch, apiDelete } from "../../../../lib/api";
import { useToast } from "../../../../components/ui/Toast";

interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  quantity_on_hand: number;
  cost_price?: number;
  selling_price?: number;
  low_stock_threshold?: number;
}

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const { showToast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const [adjustmentValue, setAdjustmentValue] = useState<number | string>("");
  const [adjusting, setAdjusting] = useState(false);
  const [adjustError, setAdjustError] = useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiGet(`/api/products/${id}/`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        showToast("Product not found", "error");
        router.push("/products");
      }
    } catch {
      showToast("Error loading product", "error");
    } finally {
      setLoading(false);
    }
  }, [id, router, showToast]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleUpdate = async (formData: unknown) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const response = await apiPut(`/api/products/${id}/`, formData);
      const data = await response.json();
      if (response.ok) {
        showToast("Product updated successfully", "success");
        router.push("/products");
      } else {
        setServerError(data.detail || "Failed to update product.");
      }
    } catch {
      setServerError("Connection error.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdjustStock = async () => {
    if (!adjustmentValue) return;
    setAdjusting(true);
    setAdjustError(null);
    try {
      const response = await apiPatch(`/api/products/${id}/adjust-stock`, {
        adjustment: Number(adjustmentValue),
      });
      const data = await response.json();
      if (response.ok) {
        showToast("Stock adjusted successfully", "success");
        setProduct({ ...product, quantity_on_hand: data.quantity_on_hand } as Product);
        setAdjustmentValue("");
      } else {
        setAdjustError(data.detail || "Adjustment failed.");
      }
    } catch {
      setAdjustError("Connection error.");
    } finally {
      setAdjusting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await apiDelete(`/api/products/${id}/`);
      if (response.ok) {
        showToast("Product deleted successfully", "success");
        router.push("/products");
      } else {
        showToast("Failed to delete product", "error");
      }
    } catch {
      showToast("Connection error", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="max-w-2xl mx-auto space-y-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="max-w-2xl mx-auto space-y-8 pb-12">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Edit Product</h1>
          <p className="text-primary-muted mt-1 font-medium italic underline decoration-accent/20 underline-offset-4">{product?.name}</p>
        </div>

        <div className="bg-surface p-8 rounded-2xl border border-border shadow-2xl">
          <ProductForm
            initialValues={product || undefined}
            onSubmit={handleUpdate}
            isLoading={submitting}
            submitLabel="Update Product"
            error={serverError || undefined}
          />
        </div>

        {/* Quick Adjustment */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xl">
          <div className="px-8 py-5 border-b border-border bg-white/[0.02]">
            <h3 className="font-bold text-white tracking-wide">Quick Stock Adjustment</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-border/50">
              <span className="text-primary-muted font-medium uppercase tracking-widest text-xs">Current Stock</span>
              <span className="text-2xl font-black text-white">{product?.quantity_on_hand}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="flex-1 w-full">
                <Input
                  label="Adjustment (+/-)"
                  type="number"
                  value={adjustmentValue}
                  onChange={(e) => setAdjustmentValue(e.target.value)}
                  placeholder="e.g. 10 or -5"
                  error={adjustError || undefined}
                />
              </div>
              <Button onClick={handleAdjustStock} loading={adjusting} className="mb-0.5 min-w-[120px]">
                Apply
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-8 rounded-2xl border border-danger/20 bg-danger/5">
          <h3 className="font-bold text-danger mb-2 uppercase tracking-widest text-xs">Danger Zone</h3>
          <p className="text-sm text-primary-muted mb-6 font-medium">Deleting this product is permanent and cannot be undone.</p>
          <Button variant="danger" loading={isDeleting} onClick={handleDelete} className="w-full sm:w-auto">
            Delete Product
          </Button>
        </div>
      </div>
    </ProtectedLayout>
  );
}
