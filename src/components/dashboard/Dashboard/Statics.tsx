import { FiUsers } from "react-icons/fi";
import { cn } from "../../../lib/utils";
import { Card, CardContent } from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";
import { TbCurrencyDollar, TbBrandBooking } from "react-icons/tb";
import { IoCarOutline } from "react-icons/io5";
import { useGetAnalyticsQuery } from "../../../redux/features/dashboard/dashboardApi";

const StatsCards = () => {
  const { data: anlyticsData, isLoading } = useGetAnalyticsQuery({});

  const stats = [
    {
      title: "Total Revenue",
      value: anlyticsData?.totalRevenue ?? 0,
      icon: TbCurrencyDollar,
      iconBgColor: "bg-red-500",
    },
    {
      title: "Total Bookings",
      value: anlyticsData?.totalBookings ?? 0,
      icon: TbBrandBooking,
      iconBgColor: "bg-amber-500",
    },
    {
      title: "Active Vehicles",
      value: anlyticsData?.activeVehicles ?? 0,
      icon: IoCarOutline,
      iconBgColor: "bg-yellow-500",
    },
    {
      title: "Total Customers",
      value: anlyticsData?.totalCustomers ?? 0,
      icon: FiUsers,
      iconBgColor: "bg-cyan-500",
    },
  ];

  return (
    <div className="w-full bg-gradient-info px-4 pt-4 pb-56">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <Card key={index} className="overflow-hidden">
              <CardContent className="px-6 ">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {isLoading ? (
                      <>
                        <Skeleton className="h-3 w-28 mb-3" />
                        <Skeleton className="h-8 w-20" />
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {stat.title}
                        </p>
                        <h3 className="mt-2 text-3xl font-bold tracking-tight">
                          {stat.value}
                        </h3>
                      </>
                    )}
                  </div>

                  {isLoading ? (
                    <Skeleton className="h-12 w-12 rounded-full" />
                  ) : (
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full shadow-lg",
                        stat.iconBgColor
                      )}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StatsCards;