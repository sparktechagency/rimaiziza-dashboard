// components/vehicle/CarDetailsModal.tsx
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from 'react'
import { imageUrl } from "../../../redux/base/baseAPI"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import {
    Dialog,
    DialogContent,
    DialogTitle
} from "../../ui/dialog"

interface CarDetailsModalProps {
    open: boolean
    onClose: () => void
    car?: any
}

export default function CarDetailsModal({ open, onClose, car }: CarDetailsModalProps) {
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0)



    const getStatusBadge = () => {
        if (!car?.isActive) return 'bg-red-100 text-red-800 hover:bg-red-100'
        if (car?.isAvailable) return 'bg-green-100 text-green-800 hover:bg-green-100'
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100'
    }

    const getStatusText = () => {
        if (!car?.isActive) return 'Inactive'
        if (car?.isAvailable) return 'Available'
        return 'Unavailable'
    }

    const allImages = car?.coverImage
        ? [car.coverImage, ...(car.images || [])]
        : []

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl p-0 gap-0 max-h-[90vh] overflow-y-auto">
                <div className="px-6 pt-5 pb-4 border-b sticky top-0 bg-white z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-semibold">
                                {car?.brand} {car?.model}
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {car?.vehicleId} • {car?.shortDescription}
                            </p>
                        </div>
                        <Badge
                            variant="outline"
                            className={`px-3 py-1 font-medium capitalize ${getStatusBadge()}`}
                        >
                            {getStatusText()}
                        </Badge>
                    </div>
                </div>

                <div className="px-6 pb-6 pt-6 space-y-8">
                    {/* Image Gallery */}
                    {allImages.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Vehicle Images</h3>
                            <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
                                <img
                                    src={imageUrl + allImages[currentImageIndex]}
                                    alt={`${car?.brand} ${car?.model}`}
                                    className="w-full h-full object-cover"
                                />
                                {allImages.length > 1 && (
                                    <>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                                            onClick={prevImage}
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                                            onClick={nextImage}
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </Button>

                                    </>
                                )}

                            </div>
                            <div className="h-10 w-3/5 mx-auto bottom-1 flex justify-center gap-2">
                                {allImages.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={imageUrl + img}
                                        alt={`${car?.brand} ${car?.model} - ${idx + 1}`}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`rounded-md transition-all object-cover ${idx === currentImageIndex
                                                ? 'bg-white w-20 border-2 border-black'
                                                : 'bg-white  w-8'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* About */}
                    {car?.about && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">About This Vehicle</h3>
                            <div className="p-4 bg-muted/20 rounded-lg">
                                <p className="text-sm leading-relaxed">{car.about}</p>
                            </div>
                        </div>
                    )}

                    {/* Vehicle Specifications */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Vehicle Specifications</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                    Year
                                </p>
                                <p className="font-medium">{car?.year}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                    Transmission
                                </p>
                                <p className="font-medium">{car?.transmission}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                    Fuel Type
                                </p>
                                <p className="font-medium">{car?.fuelType}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                    Mileage
                                </p>
                                <p className="font-medium">{car?.mileage}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                    Seat Number
                                </p>
                                <p className="font-medium">{car?.seatNumber} seats</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                    Color
                                </p>
                                <p className="font-medium">{car?.color}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                    License Plate
                                </p>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium">{car?.licensePlate}</p>                                    
                                </div>
                            </div>
                            <div>
                                <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                    With Driver
                                </p>
                                <p className="font-medium">{car?.withDriver ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Facilities & Features */}
                    {car?.facilities && car.facilities.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Facilities & Features</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {car.facilities.map((facility: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg"
                                    >
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm font-medium">{facility.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pricing */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Pricing</h3>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/40 border border-blue-200 rounded-xl p-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-blue-800/90">
                                        Daily Rate
                                    </p>
                                    <p className="text-2xl font-bold text-blue-700">
                                        RM {car?.dailyPrice?.toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-blue-800/90">
                                        Hourly Rate
                                    </p>
                                    <p className="text-xl font-semibold text-blue-700">
                                        RM {car?.hourlyPrice?.toLocaleString()}
                                    </p>
                                </div>
                                <div className="border-t border-blue-200 pt-3">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-medium text-blue-800/90">
                                            Deposit Amount
                                        </p>
                                        <p className="text-lg font-semibold text-blue-700">
                                            RM {car?.depositAmount?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white/60 rounded-lg p-3">
                                    <p className="text-sm text-blue-900">
                                        Minimum trip duration: {car?.minimumTripDuration} hours
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Host Information */}
                    {car?.assignedHosts && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Host Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                        Name
                                    </p>
                                    <p className="font-medium">{car.assignedHosts.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                        Email
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">{car.assignedHosts.email}</p>                                                                         
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                        Membership ID
                                    </p>
                                    <p className="font-medium">{car.assignedHosts.membershipId}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Location */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                    City
                                </p>
                                <p className="font-medium">{car?.city}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                    Pickup Coordinates
                                </p>
                                <p className="font-medium">
                                    {car?.pickupPoint?.coordinates?.join(', ')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Availability</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs uppercase font-semibold text-muted-foreground mb-2">
                                    Available Days
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {car?.availableDays?.map((day: string, idx: number) => (
                                        <Badge
                                            key={idx}
                                            variant="secondary"
                                            className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                                        >
                                            {day}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs uppercase font-semibold text-muted-foreground mb-2">
                                    Available Hours
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {car?.availableHours?.map((hour: string, idx: number) => (
                                        <Badge
                                            key={idx}
                                            variant="outline"
                                            className="bg-purple-50 text-purple-700 border-purple-200"
                                        >
                                            {hour} {Number(hour.split(':')[0]) < 12 ? 'AM' : 'PM'}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Additional Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                    Created At
                                </p>
                                <p className="font-medium">
                                    {new Date(car?.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                                    Last Updated
                                </p>
                                <p className="font-medium">
                                    {new Date(car?.updatedAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}