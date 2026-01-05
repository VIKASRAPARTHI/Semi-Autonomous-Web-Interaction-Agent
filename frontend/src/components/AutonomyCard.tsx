import { LucideIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutonomyCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    selected: boolean;
    onSelect: () => void;
}

export function AutonomyCard({ title, description, icon: Icon, selected, onSelect }: AutonomyCardProps) {
    return (
        <div
            onClick={onSelect}
            className={cn(
                "cursor-pointer rounded-xl border p-6 transition-all relative",
                selected
                    ? "bg-primary/5 border-primary shadow-[0_0_0_2px_rgba(59,130,246,0.5)]"
                    : "bg-card border-border hover:border-border/80 hover:bg-muted/50"
            )}
        >
            <div className="flex justify-between items-start mb-3">
                <Icon className={cn("w-6 h-6", selected ? "text-primary" : "text-muted-foreground")} />
                <div className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                    selected ? "border-primary bg-primary text-white" : "border-muted-foreground/30"
                )}>
                    {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
            </div>
            <h3 className={cn("font-medium mb-1", selected ? "text-primary" : "text-foreground")}>{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
}
