import { Bell, Car, CheckCircle, Clock, CreditCard, Settings, UserPlus } from 'lucide-react';
import { useEffect } from 'react';
import { useSocket } from '../../../hooks/socketConnection';
import { useGetRecentActivitiesQuery } from '../../../redux/features/notification/notificationApi';
import { useGetProfileQuery } from '../../../redux/features/user/userApi';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';

const getTypeConfig = (type: string) => {
    switch (type?.toUpperCase()) {
        case 'REQUESTED':
            return { icon: Car, color: 'bg-blue-100 text-blue-700' };
        case 'APPROVED':
            return { icon: CheckCircle, color: 'bg-green-100 text-green-700' };
        case 'REJECTED':
            return { icon: CheckCircle, color: 'bg-red-100 text-red-700' };
        case 'PAYMENT':
            return { icon: CreditCard, color: 'bg-yellow-100 text-yellow-700' };
        case 'USER':
            return { icon: UserPlus, color: 'bg-purple-100 text-purple-700' };
        case 'ADMIN':
            return { icon: Settings, color: 'bg-indigo-100 text-indigo-700' };
        default:
            return { icon: Bell, color: 'bg-gray-100 text-gray-700' };
    }
};

const getDetails = (refModel: any, activity: any) => {
  switch (refModel?.toLowerCase()) {
    case "car":
      return <>{activity.referenceId?.pickupPoint?.address}</>;

    case "booking":
      return (
        <>
          Date:{" "} 
          <span className='text-primary font-semibold uppercase'>
          {new Date(activity.referenceId?.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
          </span>          
        </>
      );

    case "review":
      return <>{activity.referenceId?.pickupPoint?.address}</>;

    case "user":
      return <>{activity.referenceId?.pickupPoint?.address}</>;

    default:
      return <>{activity.referenceId?.pickupPoint?.address}</>;
  }
};

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
};

const RecentActivity = () => {
    const { data, isLoading, refetch } = useGetRecentActivitiesQuery({});
    const { data: profileData } = useGetProfileQuery({});
    const activities = data?.data ?? [];
      const socket = useSocket()
    
      useEffect(() => {
        if (!socket) return;
    
        socket.on(`send-notification::${profileData?._id}`, () => {refetch()});
        socket.on(`unreadCountUpdate::${profileData?._id}`, () => {refetch()});
    
        return () => {
          socket.off(`send-notification::${profileData?._id}`);
          socket.off(`unreadCountUpdate::${profileData?._id}`);
        }
      }, [])

    return (
        <div className="p-5">
            <Card className="border-0">
                <CardHeader className="pb-0!">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-semibold mb-1">Recent Activity</h3>
                            <p className="text-sm text-gray-500">What's happening with your fleet</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-100 border-b">
                                <TableHead className="text-gray-600 font-semibold uppercase text-xs pl-10 w-[60%]">Activity</TableHead>
                                <TableHead className="text-gray-600 font-semibold uppercase text-xs w-[40%] text-right pr-10">Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center py-12 text-gray-400">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400" />
                                            Loading...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                activities.map((activity: any) => {
                                    const { color } = getTypeConfig(activity.type);                                    
                                    const detail = getDetails(activity?.referenceModel, activity);

                                    return (
                                        <TableRow
                                            key={activity._id}
                                            className="hover:bg-gray-50/50 border-b last:border-b-0"
                                        >
                                            <TableCell className="pl-10 pr-4 py-4">
                                                <div className="flex items-start gap-4">
                                                    <div className={`flex-shrink-0 w-11 h-11 rounded-2xl ${color} flex items-center justify-center`}>
                                                        <Bell className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-gray-900 text-sm leading-5 mb-1">
                                                            {activity.text}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">                                                            
                                                            <span className="truncate">{detail}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-10 py-4">
                                                <div className="flex items-center justify-end gap-2 text-sm text-gray-600 whitespace-nowrap">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{formatTimeAgo(activity.createdAt)}</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>

                    {!isLoading && activities.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No recent activity found.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default RecentActivity;