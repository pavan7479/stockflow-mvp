"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedLayout from "@/components/ProtectedLayout";
import ProductForm from "@/components/ProductForm";
import { apiPost } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

export default function NewProductPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (formData: unknown) => {
    setLoading(true);
    setServerError(null);
    try {
      const response = await apiPost("/api/products/", formData);
      const data = await response.json();

      if (response.ok) {
        showToast("Product created successfully", "success");
        router.push("/products");
      } else {
        setServerError(data.detail || "Failed to create product. Please try again.");
      }
    } catch {
      setServerError("Connection error. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Add New Product</h1>
          <p className="text-primary-muted mt-1 font-medium">Create a new item in your inventory</p>
        </div>

        <div className="bg-surface p-8 rounded-2xl border border-border shadow-2xl">
          <ProductForm
            onSubmit={handleSubmit}
            isLoading={loading}
            submitLabel="Create Product"
            error={serverError || undefined}
          />
        </div>
      </div>
    </ProtectedLayout>
  );
}
