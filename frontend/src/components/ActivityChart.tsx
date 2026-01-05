"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
    { time: "00:00", value: 12 },
    { time: "04:00", value: 8 },
    { time: "08:00", value: 24 },
    { time: "12:00", value: 45 },
    { time: "16:00", value: 38 },
    { time: "20:00", value: 52 },
    { time: "23:59", value: 20 },
];

export function ActivityChart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="time"
                    stroke="#52525b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#52525b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", fontSize: "12px" }}
                    itemStyle={{ color: "#e4e4e7" }}
                    cursor={{ stroke: "#27272a", strokeWidth: 1 }}
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
