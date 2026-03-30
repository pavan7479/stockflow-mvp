import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost";
  isLoading?: boolean;
}

const Button = ({
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  ...props
}: ButtonProps) => {
  const variants = {
    primary: "bg-accent hover:bg-accent-hover text-white",
    danger: "bg-danger hover:bg-red-700 text-white",
    ghost: "bg-transparent border border-border hover:bg-surface text-primary",
  };

  return (
    <button
      className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
        ${variants[variant]}
        ${isLoading || props.disabled ? "opacity-70 cursor-not-allowed" : ""}
        ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      <span className={isLoading ? "opacity-0" : "opacity-100"}>{children}</span>
      {isLoading && <span className="absolute inset-0 flex items-center justify-center">...</span>}
    </button>
  );
};

export default Button;
