import { Edit, Loader, Lock, Mail, Search, Trash2, Unlock, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader } from "../../ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";

import AddUserForm from "./AddUserForm";
import { useGetUsersQuery, useUpdateUserMutation } from "../../../redux/features/user/userApi";
import ManagePagination from "../../Shared/ManagePagination";
import { imageUrl } from "../../../redux/base/baseAPI";
import { getSearchParams } from "../../../utils/getSearchParams";
import { useUpdateSearchParams } from "../../../utils/updateSearchParams";
import { Input } from "../../ui/input";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function Users() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: userData, isLoading, refetch } = useGetUsersQuery({});
    const [updateUserStatus, { isLoading: updateLoading }] = useUpdateUserMutation();

    const users = userData?.data || [];
    const { searchTerm, page } = getSearchParams();
    const updateSearchParams = useUpdateSearchParams();

    useEffect(() => {
        refetch();
    }, [searchTerm, page]);


    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString();
    };

    const getStatusBadge = (status: string) => {
        const variants: any = {
            ACTIVE: "bg-green-100 text-green-800 hover:bg-green-100",
            INACTIVE: "bg-gray-100 text-gray-800 hover:bg-gray-100",
            PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        };

        return variants[status] || "bg-gray-100 text-gray-800";
    };

    const getRoleBadge = (role: string) => {
        const variants: any = {
            ADMIN: "bg-purple-100 text-purple-800 hover:bg-purple-100",
            USER: "bg-gray-100 text-gray-800 hover:bg-gray-100",
            EDITOR: "bg-blue-100 text-blue-800 hover:bg-blue-100",
            MODERATOR: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
        };

        return variants[role] || "bg-gray-100 text-gray-800";
    };

    const handleStatusChange = async (id: string, status: string) => {
        const isLocking = status === "INACTIVE";

        const result = await Swal.fire({
            title: isLocking ? "Lock this user?" : "Unlock this user?",
            text: isLocking
                ? "This user will not be able to access the platform."
                : "This user will regain access to the platform.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: isLocking ? "#d33" : "#3085d6",
            cancelButtonColor: "#6b7280",
            confirmButtonText: isLocking ? "Yes, Lock User" : "Yes, Unlock User",
        });

        if (!result.isConfirmed) return;

        try {
            const response = await updateUserStatus({ id, status }).unwrap();

            console.log("response", response);


            Swal.fire({
                icon: "success",
                title: isLocking ? "User Locked" : "User Unlocked",
                timer: 1500,
                showConfirmButton: false,
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text: "Failed to update user status",
            });
        }
    };
    return (
        <div className="p-5">
            <Card className="border-0">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-semibold mb-1">User Management</h3>
                            <p className="text-sm text-gray-500">
                                Manage and monitor user accounts
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={searchTerm}
                                    onChange={(e) => updateSearchParams({ searchTerm: e.target.value })}
                                    placeholder="Search vehicles..."
                                    className="pl-9 bg-background"
                                />
                            </div>
                            <div>
                                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 border-0">
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Add Car
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="min-w-4xl! max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-semibold">
                                                Add New User
                                            </DialogTitle>
                                        </DialogHeader>

                                        <div className="mt-4">
                                            <AddUserForm
                                                onSubmit={(formData) => {
                                                    console.log(
                                                        "Form submitted:",
                                                        Object.fromEntries(formData)
                                                    );
                                                    setIsModalOpen(false);
                                                }}
                                                onCancel={() => setIsModalOpen(false)}
                                            />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-200">
                                <TableHead className="text-gray-600 font-semibold uppercase text-xs pl-10">
                                    User
                                </TableHead>
                                <TableHead className="text-gray-600 font-semibold uppercase text-xs">
                                    Email
                                </TableHead>
                                <TableHead className="text-gray-600 font-semibold uppercase text-xs">
                                    Role
                                </TableHead>
                                <TableHead className="text-gray-600 font-semibold uppercase text-xs">
                                    Status
                                </TableHead>
                                <TableHead className="text-gray-600 font-semibold uppercase text-xs">
                                    Join Date
                                </TableHead>
                                <TableHead className="w-25 text-gray-600 font-semibold uppercase text-xs text-center">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align='center'>
                                        <div className="flex items-center justify-center gap-3">
                                            <Loader className="w-6 h-6 animate-spin" /> Loading
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : !isLoading && users?.length ? users.map((user: any) => (
                                <TableRow key={user._id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <div className="flex items-center gap-3 py-3 pl-5">
                                            {user?.profileImage ? (
                                                <img
                                                    src={`${imageUrl}${user.profileImage}`}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                    {user?.name?.charAt(0)}
                                                </div>
                                            )}

                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {user.name}
                                                </div>

                                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-gray-600">
                                        {user.email}
                                    </TableCell>

                                    <TableCell>
                                        <Badge className={getRoleBadge(user.role)}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <Badge className={`${getStatusBadge(user.status)} capitalize!`}>
                                            {user.status?.toLowerCase()}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-gray-600">
                                        {formatDate(user.createdAt)}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex gap-3 justify-center">
                                            <Button
                                                onClick={() => handleStatusChange(user?._id, user?.status?.toLowerCase() === "active" ? "INACTIVE" : "ACTIVE")}
                                                className={`${user?.status?.toLowerCase() === "active" ? "bg-red-200! text-white" : "bg-green-600 text-white"} 
                                             cursor-pointer hover:scale-110 transition-transform`}>
                                                {user?.status?.toLowerCase() === "active" ? (
                                                    <Lock className="w-4 h-4 text-red-600 cursor-pointer hover:scale-110 transition-transform" />
                                                ) : (
                                                    <Unlock className="w-4 h-4 text-green-600 cursor-pointer hover:scale-110 transition-transform" />
                                                )}
                                            </Button>
                                            <Button variant="outline">
                                                <Trash2 className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform text-red-600" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : <TableRow> <TableCell align='center' colSpan={6} className='text-lg'>User Data Not Found</TableCell></TableRow>}
                        </TableBody>
                    </Table>

                    <ManagePagination meta={userData?.meta} />
                </CardContent>
            </Card>
        </div>
    );
}