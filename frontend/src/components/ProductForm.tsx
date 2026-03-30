"use client";

import React, { useState } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { useRouter } from "next/navigation";

interface ProductFormData {
  name: string;
  sku: string;
  description: string;
  quantity_on_hand: number;
  cost_price: number | string;
  selling_price: number | string;
  low_stock_threshold: number | string;
}

interface ProductFormProps {
  initialValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading: boolean;
  submitLabel: string;
  error?: string | null;
}

const ProductForm = ({ initialValues, onSubmit, isLoading, submitLabel, error }: ProductFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialValues?.name || "",
    sku: initialValues?.sku || "",
    description: initialValues?.description || "",
    quantity_on_hand: initialValues?.quantity_on_hand || 0,
    cost_price: initialValues?.cost_price || "",
    selling_price: initialValues?.selling_price || "",
    low_stock_threshold: initialValues?.low_stock_threshold || "",
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  const validate = () => {
    const errors: Partial<Record<keyof ProductFormData, string>> = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.sku.trim()) errors.sku = "SKU is required.";
    if (formData.quantity_on_hand < 0) errors.quantity_on_hand = "Quantity cannot be negative.";
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Clean data: convert empty strings to null for numeric fields
      const cleanedData = {
        ...formData,
        cost_price: formData.cost_price === "" ? null : formData.cost_price,
        selling_price: formData.selling_price === "" ? null : formData.selling_price,
        low_stock_threshold: formData.low_stock_threshold === "" ? null : formData.low_stock_threshold,
        description: formData.description.trim() === "" ? null : formData.description.trim(),
      };
      await onSubmit(cleanedData as ProductFormData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
    // Clear error when user types
    if (fieldErrors[name as keyof ProductFormData]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl border border-danger/20 bg-danger/5 text-danger text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 md:col-span-2">
           <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Wireless Mouse G502"
            error={fieldErrors.name}
            required
          />
        </div>

        <Input
          label="SKU"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          placeholder="e.g. MOUSE-G502-BLK"
          error={fieldErrors.sku}
          className="font-mono"
          required
        />

        <Input
          label="Quantity on Hand"
          name="quantity_on_hand"
          type="number"
          value={formData.quantity_on_hand}
          onChange={handleChange}
          error={fieldErrors.quantity_on_hand}
          required
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-primary-muted mb-2 uppercase tracking-wider">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your product (optional)..."
            rows={3}
            className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-white placeholder-primary-muted transition-all duration-200 outline-none
              focus:border-accent focus:ring-1 focus:ring-accent/20 resize-none shadow-inner"
          />
        </div>

        <Input
          label="Cost Price (₹)"
          name="cost_price"
          type="number"
          step="0.01"
          value={formData.cost_price}
          onChange={handleChange}
          placeholder="0.00"
        />

        <Input
          label="Selling Price (₹)"
          name="selling_price"
          type="number"
          step="0.01"
          value={formData.selling_price}
          onChange={handleChange}
          placeholder="0.00"
        />

        <div className="md:col-span-2 border-t border-border mt-2 pt-6">
          <Input
            label="Low Stock Threshold"
            name="low_stock_threshold"
            type="number"
            value={formData.low_stock_threshold}
            onChange={handleChange}
            placeholder="Uses organization default if empty"
            helperText="An alert will trigger when stock falls to or below this level."
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <Button
          type="submit"
          loading={isLoading}
          className="w-full sm:w-auto px-8"
        >
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
