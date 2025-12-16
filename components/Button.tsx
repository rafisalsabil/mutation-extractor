import * as React from "react"
// Button implementation


import { cn } from "@/lib/utils"

// I'll stick to a simple mapping object or simple logic to avoid another install if I can be quick, 
// but cva is standard. I'll just write it manually to avoid dependency hell if user has issues, 
// but actually I should probably install 'class-variance-authority' if I want to be "enterprise-ready" modern.
// Nah, I'll write standard Tailwind classes.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white";

        const variants = {
            primary: "bg-primary text-white hover:bg-primary-hover shadow-sm",
            secondary: "bg-white text-primary border border-border hover:bg-slate-50 shadow-sm",
            ghost: "hover:bg-slate-100 text-text-secondary hover:text-text-primary",
            destructive: "bg-error text-white hover:bg-red-700 shadow-sm",
            outline: "border border-input bg-transparent hover:bg-slate-100 hover:text-text-primary",
        };

        const sizes = {
            sm: "h-9 px-3 text-xs",
            md: "h-11 px-6 text-sm", // Adjusted height for 44px (11 * 4) as per spec
            lg: "h-12 px-8 text-base",
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {isLoading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"
