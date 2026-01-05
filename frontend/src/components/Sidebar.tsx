"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Bot,
    BarChart3,
    History,
    Settings,
    Command
} from "lucide-react";

const navItems = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "All Agents", href: "/agents", icon: Bot },
    { name: "Insights", href: "/insights", icon: BarChart3 },
    { name: "Logs", href: "/logs", icon: History },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-screen w-64 bg-card border-r border-border">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Command className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="font-bold text-lg text-foreground">Agent OS</h1>
                    <p className="text-xs text-muted-foreground">Admin Workspace</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
                    <div>
                        <p className="text-sm font-medium text-foreground">Alex Chen</p>
                        <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
