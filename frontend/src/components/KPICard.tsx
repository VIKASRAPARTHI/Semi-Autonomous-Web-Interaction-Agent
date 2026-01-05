import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    icon: LucideIcon;
    iconColor?: string;
}

export function KPICard({ title, value, change, trend, icon: Icon, iconColor }: KPICardProps) {
    return (
        <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
                {iconColor ? <Icon className={cn("w-5 h-5", iconColor)} /> : <Icon className="w-5 h-5 text-muted-foreground" />}
            </div>
            <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-foreground">{value}</span>
                <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium mb-1",
                    trend === "up" && "bg-green-500/10 text-green-500",
                    trend === "down" && "bg-red-500/10 text-red-500",
                    trend === "neutral" && "bg-gray-500/10 text-gray-500",
                )}>
                    {change}
                </span>
            </div>
        </div>
    );
}
