import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEvent {
    id: string;
    time: string;
    type: "INFO" | "NAVIGATE" | "OBSERVATION" | "ACTION" | "ANALYSIS";
    message: string;
    detail?: string;
    meta?: string;
}

const events: LogEvent[] = [
    { id: "1", time: "14:24:01", type: "INFO", message: "Initialized session with ID #XS-92", detail: "" },
    { id: "2", time: "14:24:02", type: "NAVIGATE", message: "Navigated to homepage example-products.com", detail: "" },
    { id: "3", time: "14:24:04", type: "OBSERVATION", message: "Observation", detail: "Found 3 promotional banners and a newsletter popup modal covering the main content." },
    { id: "4", time: "14:24:05", type: "ACTION", message: "Closed modal via selector #close-modal-btn", detail: "" },
    { id: "5", time: "14:24:08", type: "ANALYSIS", message: "Analyzing navigation structure...", detail: "" },
    { id: "6", time: "14:24:12", type: "ACTION", message: "Clicking \"New Arrivals\" link", detail: "", meta: "Confidence: 98%" },
];

export function LiveLog() {
    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-border flex justify-between items-center">
                <h3 className="font-semibold text-foreground">Agent Stream</h3>
                <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer">Download Logs</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {events.map((event, index) => (
                    <div key={event.id} className="relative pl-6 border-l border-border/50 last:border-0">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-card border-2 border-muted-foreground/50 z-10" />

                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] text-muted-foreground font-mono">{event.time}</span>
                        </div>

                        {event.type === "OBSERVATION" ? (
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mt-1">
                                <div className="flex items-center gap-2 mb-1 text-yellow-500">
                                    <Eye className="w-3 h-3" />
                                    <span className="text-xs font-bold uppercase">Observation</span>
                                </div>
                                <p className="text-xs text-foreground/80 leading-relaxed">{event.detail}</p>
                            </div>
                        ) : (
                            <>
                                <p className={cn(
                                    "text-sm font-medium",
                                    event.type === "ACTION" ? "text-blue-400" : "text-foreground"
                                )}>
                                    {event.message}
                                    {event.meta && <span className="ml-2 inline-block px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px]">{event.meta}</span>}
                                </p>
                                {event.detail && <p className="text-xs text-muted-foreground mt-1">{event.detail}</p>}
                            </>
                        )}
                    </div>
                ))}

                {/* Current Indicator */}
                <div className="relative pl-6">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                    <p className="text-blue-500 text-sm font-medium">Processing next step...</p>
                </div>
            </div>
        </div>
    );
}
