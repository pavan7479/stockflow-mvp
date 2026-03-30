"use client";

import React, { useEffect, useState, useCallback } from "react";
import ProtectedLayout from "@/components/ProtectedLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { apiGet, apiPut } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

export default function SettingsPage() {
  const { showToast } = useToast();
  const [threshold, setThreshold] = useState<number | string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await apiGet("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setThreshold(data.default_low_stock_threshold);
      } else {
        setError("Failed to load settings.");
      }
    } catch {
      setError("Connection error.");
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await apiPut("/api/settings", {
        default_low_stock_threshold: Number(threshold),
      });
      if (response.ok) {
        showToast("Settings saved successfully", "success");
      } else {
        showToast("Failed to save settings", "error");
      }
    } catch {
      showToast("Connection error", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedLayout>
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-primary-muted mt-1 font-medium">Configure your organization&apos;s inventory preferences</p>
        </div>

        {error ? (
          <div className="p-12 rounded-2xl border border-danger/20 bg-danger/5 text-center">
            <h3 className="text-white font-semibold mb-4">{error}</h3>
            <Button variant="ghost" onClick={fetchSettings}>Retry</Button>
          </div>
        ) : (
          <div className="bg-surface p-8 rounded-2xl border border-border shadow-2xl">
            <form onSubmit={handleSave} className="space-y-8">
              <div className="p-6 rounded-xl bg-background border border-border/50">
                <Input
                  label="Default Low Stock Threshold"
                  type="number"
                  name="threshold"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  placeholder="e.g. 5"
                  helperText="Products without a custom threshold will be flagged as low stock below this quantity."
                  required
                />
              </div>

              <div className="pt-4">
                <Button type="submit" loading={saving} className="w-full sm:w-auto px-10">
                  Save Settings
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
