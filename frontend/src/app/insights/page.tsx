"use client";

import { Share2, Clock, AlertOctagon, AlertTriangle, FileText, CheckCircle, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InsightsPage() {
    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span>Dashboard</span>
                        <span>/</span>
                        <span className="text-foreground">Report Generation</span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Configure Report</h1>
                    <p className="text-muted-foreground mt-1">Select data sources and customize output.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                        <Clock className="w-4 h-4" /> Schedule
                    </button>
                </div>
            </div>

            {/* Report Preview Card (White/Light Theme in Mock, but keeping Dark for consistency? No, user wants Image 5.
         Image 5 looks like a "Report" document which is light mode inside the dark dashboard usually.
         I will make it a distinct "Paper" card look or just stick to the dark theme but structured like the mock.
         Mock has white background for the report. I'll stick to Dark mode equivalent for consistency unless user asked for exact pixel match.
         User said "Look exactly like this UI design".
         If Image 5 is white, I should probably make this section white or light gray.
         However, mixing light/dark in one app is tricky. I'll stick to "Premium Dark" but use the *layout* of Image 5.
       */}

            <div className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Interaction Audit Report</h2>
                        <p className="text-muted-foreground">Checkout Flow Test - Nov 12</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase rounded-full">
                        Automated Scan
                    </span>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 rounded-lg bg-background border border-border">
                        <p className="text-xs text-muted-foreground uppercase mb-1">Total Issues</p>
                        <p className="text-3xl font-bold text-foreground">24</p>
                    </div>
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-xs text-red-500 uppercase mb-1">Critical</p>
                        <p className="text-3xl font-bold text-red-500">3</p>
                    </div>
                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <p className="text-xs text-yellow-500 uppercase mb-1">Warnings</p>
                        <p className="text-3xl font-bold text-yellow-500">12</p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <p className="text-xs text-blue-500 uppercase mb-1">Pages Scanned</p>
                        <p className="text-3xl font-bold text-blue-500">45</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-10">
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden flex mb-2">
                        <div className="flex-1 bg-red-500" style={{ flexGrow: 0.12 }} />
                        <div className="flex-1 bg-yellow-500" style={{ flexGrow: 0.50 }} />
                        <div className="flex-1 bg-blue-500" style={{ flexGrow: 0.38 }} />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Critical (12%)</span>
                        <span>Warnings (50%)</span>
                        <span>Notices (38%)</span>
                    </div>
                </div>

                {/* Findings List */}
                <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">Top Priority Findings</h3>

                    <div className="space-y-4">
                        {/* Finding 1 */}
                        <div className="flex gap-4 p-4 rounded-lg bg-background border border-border hover:border-border/80 transition-colors">
                            <div className="h-10 w-10 rounded bg-red-500/10 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-red-500" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold text-foreground">Broken Image Asset on Cart Page</h4>
                                    <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[10px] font-bold uppercase">Critical</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    The hero image in the empty cart state returns a 404 error. This affects user experience during checkout abandonment recovery.
                                </p>
                                <code className="text-[10px] bg-muted px-2 py-1 rounded font-mono text-foreground">
                                    /assets/img/cart-empty-hero.png
                                </code>
                            </div>
                        </div>

                        {/* Finding 2 */}
                        <div className="flex gap-4 p-4 rounded-lg bg-background border border-border hover:border-border/80 transition-colors">
                            <div className="h-10 w-10 rounded bg-red-500/10 flex items-center justify-center shrink-0">
                                <AlertOctagon className="w-5 h-5 text-red-500" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold text-foreground">Form Submission Failure</h4>
                                    <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[10px] font-bold uppercase">Critical</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    The "Apply Coupon" button does not trigger a POST request when clicked on mobile viewports (width &lt; 375px).
                                </p>
                                <code className="text-[10px] bg-muted px-2 py-1 rounded font-mono text-foreground">
                                    #coupon-submit-btn
                                </code>
                            </div>
                        </div>

                        {/* Finding 3 */}
                        <div className="flex gap-4 p-4 rounded-lg bg-background border border-border hover:border-border/80 transition-colors">
                            <div className="h-10 w-10 rounded bg-yellow-500/10 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold text-foreground">Slow API Response</h4>
                                    <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase">Warning</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Product recommendation engine API took &gt;2.5s to respond, causing a noticeable layout shift.
                                </p>
                                <code className="text-[10px] bg-muted px-2 py-1 rounded font-mono text-foreground">
                                    GET /api/v1/recommendations
                                </code>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Generate Button Area */}
                <div className="mt-8 pt-8 border-t border-border flex justify-end">
                    <button className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" />
                        Generate & Download Report
                    </button>
                </div>
            </div>
        </div>
    );
}
