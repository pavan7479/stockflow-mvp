import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: "blue" | "green" | "amber";
  pulse?: boolean;
}

const StatCard = ({ label, value, icon, variant = "blue", pulse = false }: StatCardProps) => {
  const themes = {
    blue: {
      bg: "bg-accent/5",
      border: "border-accent/10 focus-within:border-accent/40",
      icon: "text-accent",
      value: "text-white",
    },
    green: {
      bg: "bg-success/5",
      border: "border-success/10 focus-within:border-success/40",
      icon: "text-success",
      value: "text-white",
    },
    amber: {
      bg: pulse ? "bg-warning/10" : "bg-warning/5",
      border: pulse ? "border-warning animate-pulse" : "border-warning/10",
      icon: "text-warning",
      value: pulse ? "text-warning" : "text-white",
    },
  };

  const theme = themes[variant];

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 ${theme.bg} ${theme.border}`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`p-3 rounded-xl bg-surface border border-border shadow-inner ${theme.icon}`}>
          {icon}
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-primary-muted mb-1 uppercase tracking-wider">{label}</p>
        <h3 className={`text-3xl font-bold tracking-tight ${theme.value}`}>
          {value}
        </h3>
      </div>
    </div>
  );
};

export default StatCard;
