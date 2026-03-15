import {
  Bar,
  BarChart,
  CartesianGrid,  
  Legend,  
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


import { useState } from "react";
import { useGetBookingUsersGrowthQuery } from "../../../redux/features/dashboard/dashboardApi";

interface OrdersChartProps {
  mode?: "light" | "dark";
}

const currentYear = new Date().getFullYear();

const monthNames = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

export function BookingUsersChart({ mode = "light" }: OrdersChartProps) {

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  const { data:bookingUserData } = useGetBookingUsersGrowthQuery(selectedYear);

  
  // @ts-ignore
  const gridColor = getGridColor(mode);

  // Transform API data
  const chartData =
    bookingUserData?.data?.map((item: any) => ({
      month: monthNames[item.month - 1],
      bookings: item.bookings,
      users: item.users,
    })) || [];

  return (
    <div className="bg-white rounded-lg w-full pb-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-500 mb-5 py-3">
        <div className="pl-4">
          <span className="text-sm uppercase text-slate-400 font-semibold">
            Performance
          </span>
          <p className="text-xl font-semibold text-slate-700">
            Booking & Users
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

            <SelectContent className="bg-primary! text-white">
              {[0,1,2,3,4,5].map((i) => (
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
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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

                    <p>Bookings: {data.bookings}</p>
                    <p>Users: {data.users}</p>
                  </div>
                );
              }

              return null;
            }}
          />

          <Bar
            dataKey="bookings"
            fill={colors.theme.primary}
            radius={[6,6,0,0]}
            maxBarSize={18}
          />

          <Bar
            dataKey="users"
            fill={colors.theme.warning}
            radius={[6,6,0,0]}
            maxBarSize={18}
          />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}