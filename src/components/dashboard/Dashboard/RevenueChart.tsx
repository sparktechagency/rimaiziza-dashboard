import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { colors, getGridColor } from "../../../lib/chart-config";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../ui/select";

import { useGetRevenueGrowthQuery } from "../../../redux/features/dashboard/dashboardApi";
import { useState } from "react";

interface SalesChartProps {
    mode?: "light" | "dark";
}

const currentYear = new Date().getFullYear();

const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function RevenueChart({ mode = "light" }: SalesChartProps) {
    const [selectedYear, setSelectedYear] = useState(currentYear.toString());
    const { data: revenueChart, isLoading } = useGetRevenueGrowthQuery(selectedYear);

    console.log(selectedYear);
    const gridColor = getGridColor(mode);

    // 🔹 Transform API data
    const chartData =
        revenueChart?.data?.map((item: any) => ({
            month: monthNames[item.month - 1],
            value: item.totalRevenue,
            platformFee: item.platformFee,
            hostEarnings: item.hostEarnings,
        })) || [];

    return (
        <div className="bg-white pb-5 rounded-lg w-full shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-500 mb-5 py-3">
                <div className="pl-4">
                    <span className="text-sm uppercase text-slate-400 font-semibold">
                        Overview
                    </span>
                    <p className="text-xl font-semibold text-slate-800">
                        Revenue Growth
                    </p>
                </div>

                <div className="pr-5">
                    <Select
                        value={selectedYear}
                        onValueChange={(value) => setSelectedYear(value)}
                    >
                        <SelectTrigger className="w-30 bg-primary! text-white!">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>

                        <SelectContent className="bg-slate-700 text-white">
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                <SelectItem
                                    key={i}
                                    value={(currentYear - i).toString()}
                                >
                                    {currentYear - i}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={350} style={{ paddingInline: "20px" }}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={gridColor}
                        vertical={false}
                    />

                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: colors.gray[600], fontSize: 13 }}
                        dy={10}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: colors.gray[600], fontSize: 13 }}
                        tickFormatter={(value: number) => `$${value}`}
                        dx={-10}
                    />
                    <Legend />
                    <Tooltip
                        content={({ active, payload }: any) => {
                            if (active && payload && payload.length) {

                                const data = payload[0].payload;

                                return (
                                    <div className="rounded-lg border bg-background p-3 shadow-sm">
                                        <p className="font-semibold">{data.month}</p>

                                        <p>Total Revenue: RM {data.value}</p>
                                        <p>Platform Fee: RM {data.platformFee}</p>
                                        <p>Host Earnings: RM {data.hostEarnings}</p>
                                    </div>
                                );
                            }

                            return null;
                        }}
                    />

                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#fb2c36"
                        strokeWidth={4}
                        dot={false}
                        activeDot={{ r: 6 }}
                    />

                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}