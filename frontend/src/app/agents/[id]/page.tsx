"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Pause, Square, RefreshCw, Lock, Globe, ExternalLink } from "lucide-react";

interface LogEvent {
    id: string;
    time: string;
    type: "INFO" | "NAVIGATE" | "OBSERVATION" | "ACTION" | "ANALYSIS" | "ERROR" | "SCREENSHOT";
    message: string;
    detail?: string;
    meta?: string;
    agent_id?: string;
}

export default function AgentLivePage() {
    const params = useParams();
    const id = params?.id as string;

    const [status, setStatus] = useState("IDLE");
    const [logs, setLogs] = useState<LogEvent[]>([]);
    const [currentUrl, setCurrentUrl] = useState("");
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [fps, setFps] = useState(0);
    const ws = useRef<WebSocket | null>(null);
    const frameCountRef = useRef(0);
    const lastFpsUpdate = useRef(Date.now());

    // Initial Fetch
    useEffect(() => {
        if (!id) return;

        fetch(`http://localhost:8000/agents/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.target_url) setCurrentUrl(data.target_url);
                if (data.status) setStatus(data.status);
            })
            .catch(err => console.error("Failed to fetch agent", err));

        // Fetch recent logs
        fetch(`http://localhost:8000/logs?agent_id=${id}&limit=20`)
            .then(res => res.json())
            .then(data => {
                // Convert backend logs to UI logs
                const formatted = data.map((l: any) => ({
                    id: l.id,
                    time: new Date(l.timestamp).toLocaleTimeString(),
                    type: l.type,
                    message: l.message,
                    detail: l.detail
                })).reverse();
                setLogs(formatted);
            });

    }, [id]);

    const displayLogs = logs.filter(l => l.type !== "SCREENSHOT");

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8000/ws");

        ws.current.onopen = () => {
            console.log("Connected to WS");
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            // Filter by agent_id if present
            if (data.agent_id && data.agent_id !== id) return;

            // Handle video frames
            if (data.type === "VIDEO_FRAME") {
                setScreenshot(`data:image/jpeg;base64,${data.message}`);

                // Update FPS counter
                frameCountRef.current += 1;
                const now = Date.now();
                if (now - lastFpsUpdate.current >= 1000) {
                    setFps(frameCountRef.current);
                    frameCountRef.current = 0;
                    lastFpsUpdate.current = now;
                }
                return;
            }

            // Legacy screenshot support
            if (data.type === "SCREENSHOT") {
                setScreenshot(`data:image/png;base64,${data.message}`);
                return;
            }

            const newLog: LogEvent = {
                id: Date.now().toString(),
                time: new Date().toLocaleTimeString(),
                type: data.type,
                message: data.message,
                detail: data.detail || "",
                meta: data.meta || ""
            };
            setLogs(prev => [...prev, newLog]);

            if (data.type === "NAVIGATE") {
                setCurrentUrl(data.detail || data.message);
            }
        };

        return () => {
            if (ws.current) ws.current.close();
        };
    }, [id]);

    const handleStop = async () => {
        await fetch("http://localhost:8000/agent/stop", { method: "POST" });
        setStatus("COMPLETED");
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold text-foreground">Agent Execution Dashboard</h1>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full animate-pulse ${status === 'RUNNING' ? 'bg-green-500' : 'bg-gray-500'}`} />
                            <span className="text-xs text-muted-foreground">Status: {status}</span>
                            <span className="text-xs text-muted-foreground ml-2">ID: {id?.substring(0, 8)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Session</p>
                        <p className="text-sm font-mono font-medium text-foreground">Active</p>
                    </div>
                    <div className="h-8 w-[1px] bg-border" />
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase flex items-center gap-2">
                            <Pause className="w-3 h-3" /> Pause
                        </button>
                        <button
                            onClick={handleStop}
                            className="px-3 py-1.5 rounded-md bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/20 text-xs font-bold uppercase flex items-center gap-2"
                        >
                            <Square className="w-3 h-3" /> Stop
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content (Browser View) */}
                <div className="flex-1 bg-background p-4 flex flex-col gap-4 overflow-hidden">
                    {/* Browser Bar */}
                    <div className="h-10 bg-card border border-border rounded-lg flex items-center px-4 gap-4 shrink-0">
                        <div className="flex gap-2">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            <Lock className="w-3 h-3 text-green-500" />
                        </div>
                        <input
                            type="text"
                            value={currentUrl || "Waiting for navigation..."}
                            readOnly
                            className="flex-1 bg-transparent text-xs font-mono text-muted-foreground focus:outline-none"
                        />
                        <div className="flex gap-3">
                            <RefreshCw className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
                            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
                        </div>
                    </div>

                    {/* Browser Canvas */}
                    <div className="flex-1 bg-zinc-900 rounded-lg border border-border relative overflow-hidden group shadow-2xl flex items-center justify-center">
                        {screenshot ? (
                            <img
                                src={screenshot}
                                alt="Remote Browser View"
                                className="max-w-full max-h-full object-contain shadow-xl rounded"
                            />
                        ) : (
                            <div className="text-center">
                                <Globe className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                                <span className="text-zinc-500 font-mono text-xs">Waiting for video stream...</span>
                            </div>
                        )}

                        <div className="absolute bottom-4 right-4 bg-zinc-900/80 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live View
                        </div>

                        {fps > 0 && (
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-mono text-green-400">
                                {fps} FPS
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar (Logs) */}
                <div className="w-[350px] bg-card border-l border-border shrink-0">
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b border-border flex justify-between items-center">
                            <h3 className="font-semibold text-foreground">Agent Stream</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {displayLogs.map((event) => (
                                <div key={event.id} className="relative pl-4 border-l border-border/50">
                                    <span className="text-[10px] text-muted-foreground font-mono">{event.time}</span>
                                    <p className="text-sm font-medium text-foreground">{event.message}</p>
                                    {event.detail && <p className="text-xs text-muted-foreground">{event.detail}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
