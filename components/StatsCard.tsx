import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string;
    subValue?: string;
    icon?: React.ReactNode;
    badge?: string;
    badgeColor?: 'Credit' | 'Debit' | 'Neutral';
    loading?: boolean;
}

export function StatsCard({ title, value, subValue, icon, badge, badgeColor, loading }: StatsCardProps) {
    if (loading) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                    <div className="h-8 w-32 bg-slate-100 rounded animate-pulse mb-2" />
                    <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-text-secondary">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold tracking-tight text-text-primary mt-1">{value}</div>
                <div className="flex items-center gap-2 mt-1">
                    {subValue && (
                        <p className="text-xs text-text-secondary">
                            {subValue}
                        </p>
                    )}
                    {badge && (
                        <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wide",
                            badgeColor === 'Credit' && "bg-success-bg text-success",
                            badgeColor === 'Debit' && "bg-error-bg text-error",
                        )}>
                            {badge}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
