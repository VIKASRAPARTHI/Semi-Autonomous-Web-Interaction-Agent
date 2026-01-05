"use client";

import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { AgentCard } from "@/components/AgentCard";
import { useEffect, useState } from "react";

interface Agent {
    id: string;
    name: string;
    status: string;
    target_url: string;
    created_at: string;
    stats: { issues_found: number };
}

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/agents")
            .then(res => res.json())
            .then(data => {
                setAgents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">All Agents</h1>
                    <p className="text-muted-foreground mt-1">Manage and monitor your fleet of autonomous agents.</p>
                </div>
                <Link
                    href="/agents/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    Create New Agent
                </Link>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search agents by name, target, or status..."
                    className="w-full md:w-96 bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
            </div>

            {/* Agents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <p className="text-muted-foreground">Loading agents...</p> :
                    agents.length === 0 ? <p className="text-muted-foreground">No agents found.</p> :
                        agents.map(agent => (
                            <AgentCard
                                key={agent.id}
                                id={agent.id}
                                name={agent.name}
                                status={agent.status as any} // Cast status to satisfy type if needed, ideally match Backend Status enum with Frontend type.
                                target={agent.target_url}
                                lastRun={new Date(agent.created_at).toLocaleDateString()}
                                issues={agent.stats?.issues_found || 0}
                            />
                        ))
                }
            </div>
        </div>
    );
}
