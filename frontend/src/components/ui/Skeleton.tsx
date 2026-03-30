import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "rect" | "circle";
}

const Skeleton = ({ className = "", variant = "rect" }: SkeletonProps) => {
  return (
    <div
      className={`animate-pulse bg-surface border border-border/50
        ${variant === "circle" ? "rounded-full" : "rounded-lg"}
        ${className}`}
    />
  );
};

export default Skeleton;
