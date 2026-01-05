import Link from "next/link";
import { Play, Pause, RotateCw, AlertTriangle, CheckCircle2, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export type AgentStatus = "RUNNING" | "PAUSED" | "COMPLETED" | "FAILED" | "IDLE";

interface AgentCardProps {
    id: string;
    name: string;
    status: AgentStatus;
    target: string;
    lastRun: string;
    issues: number;
}

export function AgentCard({ id, name, status, target, lastRun, issues }: AgentCardProps) {
    return (
        <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Monitor className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{name}</h3>
                            <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide",
                                status === "RUNNING" && "bg-blue-500/10 text-blue-400",
                                status === "PAUSED" && "bg-orange-500/10 text-orange-400",
                                status === "COMPLETED" && "bg-green-500/10 text-green-400",
                                status === "FAILED" && "bg-red-500/10 text-red-500",
                                status === "IDLE" && "bg-gray-500/10 text-gray-500",
                            )}>
                                {status}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Target: {target}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-xs text-muted-foreground">Last Run</p>
                    <p className="text-sm font-medium text-foreground">{lastRun}</p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">Issues Found</p>
                    <p className={cn("text-sm font-medium", issues > 0 ? "text-red-400" : "text-foreground")}>
                        {issues} {issues > 0 && "(Critical)"}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <Link
                    href={`/agents/${id}`}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors hover:underline"
                >
                    View detailed logs
                </Link>
                <div className="flex items-center gap-2">
                    {status === "RUNNING" && <Pause className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer" />}
                    {status === "PAUSED" && <Play className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer" />}
                    {status === "COMPLETED" && <RotateCw className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer" />}
                </div>
            </div>
        </div>
    );
}
