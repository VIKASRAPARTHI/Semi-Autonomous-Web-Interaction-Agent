"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Compass, Eye, Rocket, Settings2 } from "lucide-react";
import { AutonomyCard } from "@/components/AutonomyCard";

export default function CreateAgentPage() {
    const router = useRouter();
    const [url, setUrl] = useState("");
    const [autonomy, setAutonomy] = useState<"passive" | "active" | "deep">("active");
    const [isDeploying, setIsDeploying] = useState(false);

    const handleDeploy = async () => {
        setIsDeploying(true);
        try {
            const res = await fetch('http://localhost:8000/agent/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, autonomy_level: autonomy })
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/agents/${data.agent_id}`);
            } else {
                alert("Failed to start agent");
            }
        } catch (e) {
            alert("Error connecting to backend");
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span>Agent Command</span>
                        <span>/</span>
                        <span className="text-foreground">New Configuration</span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Agent Configuration</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Bot className="w-5 h-5 text-muted-foreground" />
                    </div>
                </div>
            </div>

            <p className="text-muted-foreground">Define the target parameters, autonomy level, and behavioral rules for your autonomous web agent.</p>

            {/* Target Definition */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Target Definition</h2>
                <div className="bg-card border border-border rounded-xl p-6">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Target URL</label>
                    <div className="flex items-center bg-background border border-border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/50">
                        <span className="text-muted-foreground mr-2">🔗</span>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1 bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground/50"
                            placeholder="https://www.example.com"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">The agent will begin exploration from this entry point.</p>
                </div>
            </section>

            {/* Autonomy Level */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Autonomy Level</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AutonomyCard
                        title="Passive Observer"
                        description="Read-only mode. Does not click buttons or submit forms."
                        icon={Eye}
                        selected={autonomy === "passive"}
                        onSelect={() => setAutonomy("passive")}
                    />
                    <AutonomyCard
                        title="Active Explorer"
                        description="Navigates links and performs basic interactions. Safe for most sites."
                        icon={Compass}
                        selected={autonomy === "active"}
                        onSelect={() => setAutonomy("active")}
                    />
                    <AutonomyCard
                        title="Deep Interactor"
                        description="Full autonomy. Submits forms, handles auth flows, and edge cases."
                        icon={Bot}
                        selected={autonomy === "deep"}
                        onSelect={() => setAutonomy("deep")}
                    />
                </div>
            </section>

            {/* Advanced Settings Placeholder */}
            <section className="border border-border rounded-xl p-4 cursor-pointer hover:bg-muted/30 transition-colors flex justify-between items-center group">
                <div className="flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                    <span className="font-medium text-foreground">Advanced Settings</span>
                </div>
                <span className="text-muted-foreground">▼</span>
            </section>

            {/* Footer Actions */}
            <div className="pt-6 border-t border-border flex justify-end gap-3">
                <button className="px-6 py-2.5 rounded-lg border border-border font-medium hover:bg-muted text-foreground transition-colors">
                    Save Draft
                </button>
                <button
                    onClick={handleDeploy}
                    disabled={isDeploying}
                    className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isDeploying ? (
                        <>Deploying...</>
                    ) : (
                        <>
                            <Rocket className="w-4 h-4" />
                            Deploy Agent
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
