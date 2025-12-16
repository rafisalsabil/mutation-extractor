import { cn } from "@/lib/utils";

interface BadgeProps {
    type: 'Credit' | 'Debit' | 'Neutral';
    children: React.ReactNode;
    className?: string;
}

export function Badge({ type, children, className }: BadgeProps) {
    const styles = {
        Credit: "bg-success-bg text-success border border-success/20",
        Debit: "bg-error-bg text-error border border-error/20",
        Neutral: "bg-slate-100 text-text-secondary border border-gray-200",
    };

    return (
        <span className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            styles[type],
            className
        )}>
            {children}
        </span>
    );
}
