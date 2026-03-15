// pages/bookings/BookingsPage.tsx
import { Calendar, Eye, Loader, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetBookingsQuery } from "../../../redux/features/booking/bookingApi";
import { getSearchParams } from "../../../utils/getSearchParams";
import { useUpdateSearchParams } from "../../../utils/updateSearchParams";
import ManagePagination from "../../Shared/ManagePagination";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Input } from "../../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table";
import BookingDetailsModal from "./BookingDetailsModal";

export default function Bookings() {
    const [openBookingDetails, setOpenBookingDetails] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchInput, setSearchInput] = useState("");

    const { data: bookingData, isLoading, refetch } = useGetBookingsQuery({});

    const bookings = bookingData?.data ?? [];

    const { searchTerm, page, bookingStatus } = getSearchParams();
    const updateSearchParams = useUpdateSearchParams();

    useEffect(() => {
        refetch();
    }, [searchTerm, page, bookingStatus]);

    useEffect(() => {
        if (searchTerm) {
            setSearchInput(searchTerm);
        }
        if(statusFilter){
            setStatusFilter(statusFilter);
        }
    }, []);

    const handleChange = (e: any) => {
        updateSearchParams({ searchTerm: e.target.value });
        setSearchInput(e.target.value);
    }

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        updateSearchParams({ bookingStatus: value === "all" ? "" : value });
    };


    const getStatusVariant = (status: string) => {
        switch (status.toUpperCase()) {
            case 'CONFIRMED':
                return 'bg-green-100 text-green-800 hover:bg-green-100'
            case 'REQUESTED':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
            case 'PENDING':
                return 'bg-amber-100 text-amber-800 hover:bg-amber-100'
            case 'COMPLETED':
                return 'bg-slate-100 text-slate-800 hover:bg-slate-100'
            case 'CANCELED':
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 hover:bg-red-100'
            case 'EXPIRED':
                return 'bg-red-100 text-red-800 hover:bg-red-100'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    };


    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    };

    const formatDateTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };


    return (
        <div>
            <Card className="border-none shadow-sm m-5">

                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">All Bookings</h2>
                            <p className="text-muted-foreground text-sm mt-1">
                                Manage your bookings
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 mb-6 w-lg">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search bookings..."
                                    className="pl-10"
                                    name="search"
                                    value={searchInput}
                                    onChange={handleChange}
                                />
                            </div>
                            <Select value={statusFilter} name="status" onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-full sm:w-[180px] h-11! bg-primary! text-white! outline-none!">
                                    <SelectValue placeholder="All Status" className="text-white! border-none!" />
                                </SelectTrigger>
                                <SelectContent align="start" className="bg-primary! text-white!">
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="REQUESTED">Requested</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                    <SelectItem value="ONGOING">On Going</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    <SelectItem value="EXPIRED">Expired</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Booking ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Host</TableHead>
                                    <TableHead>Dates</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                                            <div className="flex items-center justify-center gap-3">
                                                <Loader className="w-6 h-6 animate-spin" /> Loading
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    bookings.map((booking: any, index: number) => {
                                        const vehicleName = `${booking.car?.year ?? ""} ${booking.car?.brand ?? ""} ${booking.car?.model ?? ""}`.trim();
                                        const durationMs = new Date(booking.toDate).getTime() - new Date(booking.fromDate).getTime();
                                        const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

                                        return (
                                            <TableRow key={booking._id} data-aos="fade-up" data-aos-delay={index * 100}>
                                                <TableCell>
                                                    <div className="font-medium">{booking.bookingId}</div>
                                                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDateTime(booking.requestedAt)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{booking.user?.name ?? "N/A"}</div>
                                                    <div className="text-xs text-muted-foreground">{booking.user?.email}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{vehicleName}</div>
                                                    <div className="text-xs text-muted-foreground">{booking.car?.licensePlate}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{booking.host?.name ?? "N/A"}</div>
                                                    <div className="text-xs text-muted-foreground">{booking.host?.email}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                                        <span className="font-medium">{formatDate(booking.fromDate)}</span>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        to {formatDate(booking.toDate)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {durationDays} day{durationDays !== 1 ? "s" : ""}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold">
                                                        RM {booking.totalAmount?.toFixed(2)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {durationDays} day{durationDays !== 1 ? "s" : ""}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`px-3 py-1 font-medium capitalize ${getStatusVariant(booking.bookingStatus)}`}
                                                    >
                                                        {booking.bookingStatus.toLowerCase()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        onClick={() => {
                                                            setOpenBookingDetails(true);
                                                            setSelectedBooking(booking);
                                                        }}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {!isLoading && bookings.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            No bookings found matching your criteria.
                        </div>
                    )}
                    <ManagePagination meta={bookingData?.meta} />
                </CardContent>
            </Card>

            <BookingDetailsModal
                open={openBookingDetails}
                booking={selectedBooking}
                onClose={() => {
                    setOpenBookingDetails(false);
                    setSelectedBooking(null);
                }}
            />
        </div>
    );
}