import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-2">
        {label && (
          <label className="text-sm font-medium text-primary-muted ml-0.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-surface border border-border rounded-lg px-4 py-2 text-white placeholder-primary-muted transition-all duration-200 outline-none
            focus:border-accent focus:ring-1 focus:ring-accent/20
            ${error ? "border-danger ring-1 ring-danger/20" : ""}
            ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${className || ""}`}
          {...props}
        />
        {error && <p className="text-xs text-danger mt-1 ml-0.5">{error}</p>}
        {!error && helperText && <p className="text-[10px] text-primary-muted mt-1 ml-0.5">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
