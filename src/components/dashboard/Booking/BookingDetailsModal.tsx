// components/booking/BookingDetailsModal.tsx
import Swal from "sweetalert2";
import { imageUrl } from "../../../redux/base/baseAPI";
import { useCancelBookingMutation, useGetSingleBookingQuery } from "../../../redux/features/booking/bookingApi";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "../../ui/dialog";
import { Skeleton } from "../../ui/skeleton"; // ← add this if you have shadcn skeleton

interface BookingDetailsModalProps {
    open: boolean;
    onClose: () => void;
    booking?: { _id: string; bookingId: string }; // minimal shape expected
}

export default function BookingDetailsModal({
    open,
    onClose,
    booking,
}: BookingDetailsModalProps) {
    const {
        data: bookingData,
        isLoading,
        isError,
    } = useGetSingleBookingQuery(booking?._id ?? "", {
        skip: !booking?._id || !open, // prevent unnecessary calls
    });
    const [cancelBooking] = useCancelBookingMutation();



    const getStatusColor = (status: string = "") => {
        const s = status.toUpperCase();
        switch (s) {
            case "CONFIRMED":
                return "bg-green-100 text-green-800 hover:bg-green-100";
            case "PENDING":
            case "REQUESTED":
                return "bg-amber-100 text-amber-800 hover:bg-amber-100";
            case "COMPLETED":
                return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
            case "CANCELED":
            case "CANCELLED":
                return "bg-red-100 text-red-800 hover:bg-red-100";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    
    const handleCancelBooking = async (id: string) => {
        onClose()
    const result = await Swal.fire({
        title: "Cancel Booking?",
        text: "Are you sure you want to cancel this booking? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, cancel it",
        cancelButtonText: "No, keep it",
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
        await cancelBooking(id).unwrap();
        Swal.fire({
            title: "Cancelled!",
            text: "Booking has been cancelled successfully.",
            icon: "success",
            confirmButtonColor: "#4f46e5",
        });
    } catch (error: any) {
        Swal.fire({
            title: "Failed!",
            text: error?.data?.message ?? "Failed to cancel booking.",
            icon: "error",
            confirmButtonColor: "#dc2626",
        });
    }
};


    

    // Helper to format date nicely
    const formatDate = (iso?: string) =>
        iso ? new Date(iso).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        }) : "—";

    if (isError) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent>
                    <div className="p-6 text-center text-red-600">
                        Failed to load booking details
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl p-0 gap-0 max-h-[92vh] overflow-y-auto">
                {/* Header */}
                <div className="px-6 pt-5 pb-4 border-b sticky top-0 bg-white z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-semibold">
                                Booking {bookingData?.bookingId || booking?.bookingId || "..."}
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Detailed booking information
                            </p>
                        </div>

                        {isLoading ? (
                            <Skeleton className="h-7 w-24 rounded-full" />
                        ) : (
                            <Badge
                                variant="outline"
                                className={`px-4 py-1.5 font-medium capitalize ${getStatusColor(
                                    bookingData?.bookingStatus
                                )}`}
                            >
                                {bookingData?.bookingStatus?.toLowerCase() || "unknown"}
                            </Badge>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <div className="px-6 py-10 space-y-10">
                        <Skeleton className="h-8 w-48" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Skeleton className="h-20" />
                            <Skeleton className="h-20" />
                        </div>
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                ) : (
                    <div className="px-6 pb-8 pt-6 space-y-9">
                        {/* 1. Customer Information */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold">Customer Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                        Name
                                    </p>
                                    <p className="font-medium">{bookingData?.user?.name || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                        Email
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">{bookingData?.user?.email || "—"}</p>                                        
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. Host Information */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold">Host Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                        Name
                                    </p>
                                    <p className="font-medium">{bookingData?.host?.name || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                        Email
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">{bookingData?.host?.email || "—"}</p>                                       
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Vehicle Information */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold">Vehicle</h3>
                            <div className="flex flex-col sm:flex-row items-start gap-5 p-4 border rounded-xl bg-muted/30">
                                {bookingData?.car?.coverImage ? (
                                    <img
                                        src={ imageUrl + bookingData.car.coverImage}                                        
                                        alt={`${bookingData.car.brand} ${bookingData.car.model}`}
                                        className="w-full sm:w-36 h-28 object-cover rounded-lg border"
                                        onError={(e) => (e.currentTarget.src = "/fallback-car.jpg")}
                                    />
                                ) : (
                                    <div className="w-36 h-28 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                                        No image
                                    </div>
                                )}                               
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                            Vehicle
                                        </p>
                                        <p className="font-semibold text-lg">
                                            {bookingData?.car?.brand} {bookingData?.car?.model} ({bookingData?.car?.year})
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                            License Plate
                                        </p>
                                        <p className="font-medium">{bookingData?.car?.licensePlate || "—"}</p>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {bookingData?.car?.shortDescription || bookingData?.car?.about || "—"}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4. Rental Period */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold">Rental Period</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                        Start
                                    </p>
                                    <p className="font-medium">{formatDate(bookingData?.fromDate)}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                        End
                                    </p>
                                    <p className="font-medium">{formatDate(bookingData?.toDate)}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                        Duration
                                    </p>
                                    <p className="font-medium">
                                        {bookingData?.extendedHours
                                            ? `${bookingData.extendedHours} extra hours`
                                            : "1 day" /* you can calculate properly */}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 5. Pricing & Financials */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-semibold">Financial Summary</h3>

                            <div className="border rounded-xl overflow-hidden divide-y">
                                <div className="p-4 flex justify-between items-center">
                                    <span>Rental Price</span>
                                    <span className="font-medium">
                                        RM {bookingData?.rentalPrice?.toLocaleString()}
                                    </span>
                                </div>
                                <div className="p-4 flex justify-between items-center text-red-700 bg-red-50/60">
                                    <span>Platform Fee</span>
                                    <span>RM {bookingData?.platformFee?.toLocaleString()}</span>
                                </div>
                                <div className="p-4 flex justify-between items-center text-green-700 bg-green-50">
                                    <span className="font-bold">Host Earnings</span>
                                    <span className="font-bold text-lg">
                                        RM {bookingData?.hostCommission?.toLocaleString()}
                                    </span>
                                </div>
                                <div className="p-4 flex justify-between items-center bg-gray-50 font-semibold">
                                    <span>Total Amount (Customer)</span>
                                    <span className="text-xl">
                                        RM {bookingData?.totalAmount?.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="text-sm text-muted-foreground">
                                Deposit amount: RM {bookingData?.car?.depositAmount || 100} (not included in total)
                            </div>
                        </section>

                        {/* 6. Admin Actions */}
                        <section className="space-y-4 pt-4 border-t">
                            <h3 className="text-lg font-semibold text-destructive">Admin Actions</h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    variant="outline"
                                    className="border-red-500 text-red-600 hover:bg-red-50 flex-1"
                                    onClick={() => {
                                        handleCancelBooking(bookingData?._id);
                                    }}
                                    disabled={bookingData?.bookingStatus === "CANCELED"}
                                >
                                    Cancel Booking
                                </Button>                                
                            </div>
                        </section>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}