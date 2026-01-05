"use client";

import { Activity, Users, Globe, Zap, ArrowUpRight } from "lucide-react";
import { KPICard } from "@/components/KPICard";
import { ActivityChart } from "@/components/ActivityChart";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        active_agents: 0,
        total_agents: 0,
        pages_explored: 0,
        efficiency_score: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("http://localhost:8000/dashboard/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (e) {
                console.error("Failed to fetch stats", e);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
                    <p className="text-muted-foreground mt-1">Real-time insights into your autonomous workforce.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                        <Users className="w-4 h-4" /> Manage Agents
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        <ArrowUpRight className="w-4 h-4" /> New Task
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Active Agents"
                    value={stats.active_agents.toString()}
                    change="+2"
                    trend="up"
                    icon={Activity}
                />
                <KPICard
                    title="Pages Explored"
                    value={stats.pages_explored.toString()}
                    change="+124"
                    trend="up"
                    icon={Globe}
                />
                <KPICard
                    title="Avg. Efficiency"
                    value={`${stats.efficiency_score}%`}
                    change="+5%"
                    trend="up"
                    icon={Zap}
                />
                <KPICard
                    title="Total Agents"
                    value={stats.total_agents.toString()}
                    change="0"
                    trend="neutral"
                    icon={Users}
                />
            </div>

            {/* Graph Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Agent Activity (24h)</h3>
                    <div className="h-[300px] w-full">
                        <ActivityChart />
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">System Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Backend API</span>
                            <span className="flex items-center gap-1.5 text-xs font-medium text-green-500">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Operational
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Database (Mongo)</span>
                            <span className="flex items-center gap-1.5 text-xs font-medium text-green-500">
                                <span className="w-2 h-2 rounded-full bg-green-500" /> Connected
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Browser Service</span>
                            <span className="flex items-center gap-1.5 text-xs font-medium text-green-500">
                                <span className="w-2 h-2 rounded-full bg-green-500" /> Idle
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border">
                        <h4 className="text-sm font-semibold text-foreground mb-3">Recent Alerts</h4>
                        <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs">
                                <span className="font-bold text-orange-500 block mb-1">High Latency</span>
                                Agent "Crawler-01" experiencing network timeouts.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
