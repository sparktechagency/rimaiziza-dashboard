// pages/hosts/HostsPage.tsx
import {
    Calendar,
    Car,
    Copy,
    Eye,
    Loader,
    Lock,
    Mail,
    Search,
    Trash2,
    Unlock,
    UserPlus
} from "lucide-react";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useDeleteHostMutation, useGetHostsQuery, useUpdateHostMutation } from "../../../redux/features/host/hostApi";
import { getSearchParams } from "../../../utils/getSearchParams";
import { useUpdateSearchParams } from "../../../utils/updateSearchParams";
import ManagePagination from "../../Shared/ManagePagination";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Input } from "../../ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table";
import AddHostForm from "./AddHostForm";
import HostDetailsModal from "./HostDetailsModal";

export default function Hosts() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHost, setSelectedHost] = useState<any>(null);
    const [openHostDetails, setOpenHostDetails] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const { data: hostsData, isLoading, refetch } = useGetHostsQuery({});
    const [deleteHost] = useDeleteHostMutation()
    const [updateHostStatus] = useUpdateHostMutation();

    const hosts = hostsData?.data ?? [];
    const { searchTerm, page } = getSearchParams();
    const updateSearchParams = useUpdateSearchParams();

    useEffect(() => {
        refetch();
    }, [searchTerm, page]);

    useEffect(() => {
        if (searchTerm) {
            setSearchInput(searchTerm);
        }
    }, []);

    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800 hover:bg-green-100'
            case 'suspended':
                return 'bg-red-100 text-red-800 hover:bg-red-100'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const handleHostDelete = async (host: any) => {
        const result = await Swal.fire({
            title: `Delete ${host?.name} host?`,
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--color-primary)",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it",
        });

        if (!result.isConfirmed) return;

        try {
            const response = await deleteHost(host._id).unwrap();

            if (response?.success) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Host has been deleted successfully.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });

                setSelectedHost(null);
                setOpenHostDetails(false);
            }
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Failed to delete host.",
                icon: "error",
            });

            console.error("Error deleting host:", error);
        }
    }

    const handleStatusChange = async (id: string, status: string) => {
        const isLocking = status === "INACTIVE";

        const result = await Swal.fire({
            title: isLocking ? "Lock this host?" : "Unlock this host?",
            text: isLocking
                ? "This host will not be able to access the platform."
                : "This host will regain access to the platform.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: isLocking ? "#d33" : "#3085d6",
            cancelButtonColor: "#6b7280",
            confirmButtonText: isLocking ? "Yes, Lock Host" : "Yes, Unlock Host",
        });

        if (!result.isConfirmed) return;

        try {
             await updateHostStatus({ id, status }).unwrap();

            Swal.fire({
                icon: "success",
                title: isLocking ? "Host Locked" : "Host Unlocked",
                timer: 1500,
                showConfirmButton: false,
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text: "Failed to update host status",
            });
        }
    };

    const handleChange = (e: any) => {
        updateSearchParams({ searchTerm: e.target.value });
        setSearchInput(e.target.value);
    }
    return (
        <div className="">
            <Card className="border-none shadow-sm m-5">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-semibold mb-1">Hosts Management</h3>
                            <p className="text-sm text-gray-500">Manage your hosts</p>
                        </div>

                        <div className=" flex items-center gap-2">
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={searchInput}
                                    onChange={handleChange}
                                    placeholder="Search host..."
                                    className="pl-10 bg-white"
                                />
                            </div>
                            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 border-0">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Add Host
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="min-w-4xl! max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-semibold">Add New Host</DialogTitle>
                                    </DialogHeader>
                                    <div className="mt-4">
                                        <AddHostForm
                                            open={isModalOpen}
                                            onCancel={() => setIsModalOpen(false)}
                                            data={selectedHost}
                                        />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                    </div>

                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-45 pl-6">Membership id</TableHead>
                                <TableHead className="w-55">Host</TableHead>
                                <TableHead className="w-70">E-mail and password</TableHead>
                                <TableHead className="w-25 text-center">Vehicles</TableHead>
                                <TableHead className="w-35 text-center">Revenue</TableHead>
                                <TableHead className="w-30 text-center">Total trips</TableHead>
                                <TableHead className="w-30 text-center">Status</TableHead>
                                <TableHead className="w-35 text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align='center'>
                                        <div className="flex items-center justify-center gap-3">
                                            <Loader className="w-6 h-6 animate-spin" /> Loading
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : hosts.length > 0 ? hosts.map((host: any, index: number) => (
                                <TableRow key={host._id} data-aos="fade-up" data-aos-delay={index * 100} className="hover:bg-muted/30">
                                    <TableCell className="pl-6 font-medium">
                                        <div className="space-y-1">
                                            <div>{host.membershipId}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {/* API returns ISO date string — format to readable date */}
                                                Joined: {new Date(host.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="font-medium">{host.name}</div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span>{host.email}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => navigator.clipboard.writeText(host.email)}
                                                >
                                                    <Copy className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Lock className="h-4 w-4 text-muted-foreground" />
                                                {/* Password hash should never be shown — display placeholder */}
                                                <span>{"•••••••••"}</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Car className="h-4 w-4 text-muted-foreground" />
                                            {/* API field: vehicleCount */}
                                            <span className="font-medium">{host.vehicleCount ?? 0}</span>
                                        </div>
                                    </TableCell>

                                    {/* API field: totalRevenue */}
                                    <TableCell className="text-center font-medium text-green-700">
                                        RM {(host.totalRevenue ?? 0).toLocaleString()}
                                    </TableCell>

                                    {/* API field: totalTrips */}
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>{host.totalTrips ?? 0}</span>
                                        </div>
                                    </TableCell>

                                    {/* API field: status (uppercase e.g. "ACTIVE") */}
                                    <TableCell className="text-center">
                                        <Badge
                                            variant="outline"
                                            className={`px-3 py-1 capitalize ${getStatusVariant(host.status)}`}
                                        >
                                            {host.status.toLowerCase()}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <Button
                                                onClick={() => { setOpenHostDetails(true); setSelectedHost(host); }}
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleStatusChange(host?._id, host?.status?.toLowerCase() === "active" ? "INACTIVE" : "ACTIVE")}
                                                className={`${host?.status?.toLowerCase() === "active" ? "bg-red-200! text-red-600!" : "bg-green-200! text-green-600!"} 
                                                                                         cursor-pointer hover:scale-110 transition-transform`}>
                                                {host?.status?.toLowerCase() === "active" ? (
                                                    <Lock className="w-4 h-4  cursor-pointer hover:scale-110 transition-transform" />
                                                ) : (
                                                    <Unlock className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform" />
                                                )}
                                            </Button>
                                            <button onClick={() => handleHostDelete(host)} className="text-muted-foreground hover:text-red-600 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell align='center' colSpan={8} className='text-lg'>Host Data Not Found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                <ManagePagination meta={hostsData?.meta} />
            </Card>
            <HostDetailsModal
                open={openHostDetails}
                host={selectedHost}
                onClose={() => { setOpenHostDetails(false); setSelectedHost(null); }}
            />
        </div>
    )
}