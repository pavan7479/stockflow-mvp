"use client";

import ProtectedLayout from "@/components/ProtectedLayout";

export default function SettingsPage() {
  return (
    <ProtectedLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-primary-muted mt-1 font-medium">Configure your organization preferences</p>
      </div>
      <div className="p-12 rounded-2xl border border-dashed border-border bg-surface/50 text-center">
        <p className="text-primary-muted">Settings management coming in the next step...</p>
      </div>
    </ProtectedLayout>
  );
}
