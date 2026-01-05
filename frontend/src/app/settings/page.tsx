"use client";

import { User, Bell, Shield, Keyboard, Palette, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
    { name: "General", icon: User, active: true },
    { name: "Notifications", icon: Bell, active: false },
    { name: "Security", icon: Shield, active: false },
    { name: "Shortcuts", icon: Keyboard, active: false },
    { name: "Appearance", icon: Palette, active: false },
];

export default function SettingsPage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your workspace preferences and account settings.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-64 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                tab.active
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-6 max-w-2xl">
                    {/* Profile Section */}
                    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
                            <button className="text-sm text-primary hover:underline">Change Avatar</button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-muted-foreground">First Name</label>
                                <input type="text" defaultValue="Alex" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                                <input type="text" defaultValue="Chen" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                            <input type="email" defaultValue="alex.chen@example.com" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                    </div>

                    {/* API Config */}
                    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-foreground">API Configuration</h2>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-muted-foreground">OpenAI API Key</label>
                            <input type="password" defaultValue="sk-........................" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                            <p className="text-xs text-muted-foreground">Required for LLM-based decision making.</p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-lg shadow-blue-500/20 transition-all">
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
