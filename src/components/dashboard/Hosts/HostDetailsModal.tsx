// components/host/HostDetailsModal.tsx
import { imageUrl } from "../../../redux/base/baseAPI"
import { useGetHostByIdQuery } from "../../../redux/features/host/hostApi"
import { Badge } from "../../ui/badge"
import {
    Dialog,
    DialogContent,
    DialogTitle
} from "../../ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"

interface HostDetailsModalProps {
    open: boolean
    onClose: () => void
    host: any
}

export default function HostDetailsModal({ open, onClose, host }: HostDetailsModalProps) {
    const { data: hostData } = useGetHostByIdQuery(host?._id, { skip: !host?._id });
    
    // Use fresh data from the by-ID query when available, fall back to list-level host prop
    const h = hostData ?? host


    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'available': return 'bg-green-100 text-green-800 hover:bg-green-100'
            case 'active':    return 'bg-green-100 text-green-800 border-green-300'
            case 'booked':    return 'bg-amber-100 text-amber-800 hover:bg-amber-100'
            case 'rented':    return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
            case 'inactive':
            case 'maintenance':
            case 'suspended': return 'bg-red-100 text-red-800 hover:bg-red-100'
            default:          return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="min-w-2xl p-0 gap-0">
                <div className="px-6 pt-5 pb-4 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-semibold">
                                Host Details — {h?.name}
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Complete host information and assigned vehicles
                            </p>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="information" className="w-full">
                    <div className="px-6 pt-4 border-b bg-muted/30">
                        <TabsList className="grid w-full max-w-100 mx-auto grid-cols-2 gap-5">
                            <TabsTrigger
                                className="bg-gray-300! text-gray-600
                                data-[state=active]:bg-primary! data-[state=active]:text-white!
                                data-[state=active]:shadow-md! transition-all"
                                value="information"
                            >
                                Information
                            </TabsTrigger>
                            <TabsTrigger
                                className="bg-gray-300! text-gray-600
                                data-[state=active]:bg-primary! data-[state=active]:text-white!
                                data-[state=active]:shadow-md! transition-all"
                                value="vehicles"
                            >
                                Assigned Vehicles
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* ──────────────────────────────────────── */}
                    {/* TAB 1: INFORMATION                      */}
                    {/* ──────────────────────────────────────── */}
                    <TabsContent value="information" className="px-6 pb-6 pt-6 space-y-8">

                        {/* Profile images */}
                        {(h?.profileImage || h?.coverImage) && (
                            <div className="flex items-center gap-4">
                                {h?.profileImage && (
                                    <img
                                        src={imageUrl + h.profileImage}
                                        alt={h.name}
                                        className="w-16 h-16 rounded-full object-cover border"
                                    />
                                )}
                                <div>
                                    <p className="font-semibold text-lg">{h?.name}</p>
                                    <p className="text-sm text-muted-foreground">{h?.membershipId}</p>
                                </div>
                            </div>
                        )}

                        {/* Stats cards — API fields: totalRevenue, totalTrips, vehicleCount */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-green-50 to-green-100/40 border border-green-200 rounded-xl p-5">
                                <p className="text-sm font-medium text-green-800/90 mb-1">Total Revenue (RM)</p>
                                <p className="text-3xl font-bold text-green-700">
                                    {(h?.totalRevenue ?? 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100/40 border border-blue-200 rounded-xl p-5">
                                <p className="text-sm font-medium text-blue-800/90 mb-1">Total Trips</p>
                                <p className="text-3xl font-bold text-blue-700">{h?.totalTrips ?? 0}</p>
                            </div>
                            <div className="bg-gradient-to-br from-amber-50 to-amber-100/40 border border-amber-200 rounded-xl p-5">
                                <p className="text-sm font-medium text-amber-800/90 mb-1">Total Vehicles</p>
                                <p className="text-3xl font-bold text-amber-700">{h?.vehicleCount ?? 0}</p>
                            </div>
                        </div>

                        {/* Personal & account info */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                        Membership ID
                                    </p>
                                    <p className="font-medium">{h?.membershipId}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                        Member Since
                                    </p>
                                    {/* API field: createdAt (ISO string) */}
                                    <p className="font-medium">
                                        {h?.createdAt ? new Date(h.createdAt).toLocaleDateString() : '—'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">Email</p>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">{h?.email}</p>                                        
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                        Verified
                                    </p>
                                    {/* API field: verified (boolean) */}
                                    <Badge variant="outline" className={h?.verified
                                        ? 'bg-green-100 text-green-800 border-green-300'
                                        : 'bg-red-100 text-red-800 border-red-300'}>
                                        {h?.verified ? 'Verified' : 'Unverified'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* API field: location.address */}
                                <div>
                                    <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">Address</p>
                                    <p className="font-medium">
                                        {h?.location?.address || '—'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">Status</p>
                                        {/* API field: status (uppercase e.g. "ACTIVE") */}
                                        <Badge
                                            variant="outline"
                                            className={`px-3 py-1 font-medium capitalize ${getStatusColor(h?.status)}`}
                                        >
                                            {h?.status?.toLowerCase()}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                            Stripe Onboarded
                                        </p>
                                        {/* API field: isStripeOnboarded */}
                                        <Badge variant="outline" className={h?.isStripeOnboarded
                                            ? 'bg-green-100 text-green-800 border-green-300'
                                            : 'bg-yellow-100 text-yellow-800 border-yellow-300'}>
                                            {h?.isStripeOnboarded ? 'Onboarded' : 'Pending'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* ──────────────────────────────────────── */}
                    {/* TAB 2: ASSIGNED VEHICLES                */}
                    {/* ──────────────────────────────────────── */}
                    <TabsContent value="vehicles" className="px-6 pb-8 pt-6">
                        <div className="space-y-4">
                            {!h?.vehicles?.length ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    No vehicles assigned to this host yet.
                                </div>
                            ) : (
                                h.vehicles.map((vehicle: any) => (
                                    <div
                                        key={vehicle._id}
                                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/40 transition-colors"
                                    >
                                        {/* API field: vehicle.coverImage */}
                                        {vehicle.coverImage && (
                                            <img
                                                src={imageUrl + vehicle.coverImage}
                                                alt={`${vehicle.brand} ${vehicle.model}`}
                                                className="w-20 h-14 rounded-md object-cover border shrink-0"
                                            />
                                        )}

                                        <div className="flex-1 space-y-1">
                                            {/* API fields: brand + model */}
                                            <p className="font-medium">{vehicle.brand} {vehicle.model} ({vehicle.year})</p>
                                            <p className="text-sm text-muted-foreground">
                                                {/* API fields: vehicleId, licensePlate */}
                                                ID: {vehicle.vehicleId} • Plate: {vehicle.licensePlate}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {/* API fields: dailyPrice, city */}
                                                RM {vehicle.dailyPrice}/day • {vehicle.city}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                            {/* API field: isAvailable (boolean) */}
                                            <Badge
                                                variant="outline"
                                                className={`px-3 py-1 font-medium ${vehicle.isAvailable
                                                    ? 'bg-green-100 text-green-800 border-green-300'
                                                    : 'bg-red-100 text-red-800 border-red-300'}`}
                                            >
                                                {vehicle.isAvailable ? 'Available' : 'Unavailable'}
                                            </Badge>
                                            {/* API field: isActive (boolean) */}
                                            <Badge
                                                variant="outline"
                                                className={`px-3 py-1 font-medium ${vehicle.isActive
                                                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                                                    : 'bg-gray-100 text-gray-800 border-gray-300'}`}
                                            >
                                                {vehicle.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}