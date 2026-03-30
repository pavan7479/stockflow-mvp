import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "neutral";
}

const Badge = ({ children, variant = "neutral" }: BadgeProps) => {
  const variants = {
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    danger: "bg-danger/10 text-danger border-danger/20",
    neutral: "bg-surface text-primary-muted border-border",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
