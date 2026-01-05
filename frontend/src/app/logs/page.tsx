"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEntry {
    id: string;
    timestamp: string;
    type: string;
    message: string;
    detail: string;
}

export default function LogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/logs?limit=50")
            .then(res => res.json())
            .then(data => {
                setLogs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span>AgentObserver</span>
                        <span>/</span>
                        <span className="text-foreground">Logs</span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Interaction Log</h1>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                        <Filter className="w-4 h-4" /> Filter Date
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-500" /> Detailed Log
                    </h3>
                    <div className="relative w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search logs by keyword..."
                            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Timestamp</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Message</th>
                                <th className="px-6 py-3">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {loading ? (
                                <tr><td colSpan={4} className="p-4 text-center">Loading logs...</td></tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded text-[10px] font-bold uppercase",
                                                log.type === "CLICK" && "bg-blue-500/10 text-blue-400",
                                                log.type === "WAIT" && "bg-purple-500/10 text-purple-400",
                                                log.type === "NAVIGATE" && "bg-yellow-500/10 text-yellow-400",
                                                log.type === "ERROR" && "bg-red-500/10 text-red-400",
                                                log.type === "OBSERVATION" && "bg-green-500/10 text-green-400",
                                                log.type === "ANALYSIS" && "bg-orange-500/10 text-orange-400",
                                            )}>
                                                {log.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs truncate max-w-[200px] text-foreground" title={log.message}>
                                            {log.message}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-muted-foreground line-clamp-2 md:line-clamp-1 max-w-[300px]">
                                                {log.detail}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
