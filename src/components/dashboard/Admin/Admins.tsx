import { Mail, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { useCreateAdminMutation, useDeleteAdminMutation, useGetAdminQuery } from '../../../redux/features/user/userApi';
import { confirmDelete } from '../../Shared/confirmDelete';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader } from '../../ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../ui/dialog';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../../ui/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../ui/table';
import AddAdminForm from './AddAdminForm';



export default function AdminManage({ totalPages = 5 }: any) {
    
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: adminsData, refetch } = useGetAdminQuery({});
    const [addAdmin] = useCreateAdminMutation()
    const [deleteAdmin] = useDeleteAdminMutation()

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const getPages = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    

    const getStatusBadge = (status: any) => {
        const variants = {
            Active: 'bg-green-100 text-green-800 hover:bg-green-100',
            Inactive: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
            Pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
        };
        return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
    };




    const handleFormSubmit = async (formData: FormData) => {
        const data = Object.fromEntries(formData);

        const payload = {
            name: data.name,
            email: data.email,
            password: data.password,
            role: 'ADMIN',
        };

        try {
            const response = await addAdmin(payload)?.unwrap();

            if (response?.success) {
                toast?.success(response?.message);
                refetch();
                setIsModalOpen(false);
            }

        } catch (error: any) {
            toast?.error(error?.data?.message);
            setIsModalOpen(false);
        }

    };

    const handleAdminDelete = async (adminId: string) => {
        const isConfirmed = await confirmDelete({
            title: "Delete Admin?",
            text: "This admin account will be permanently removed.",
        });

        if (!isConfirmed) return;

        try {
            // 🔴 Call your API here
            await deleteAdmin(adminId);

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Admin has been deleted successfully.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed!",
                text: "Something went wrong while deleting.",
            });
        }
    };
    return (
        <div className="p-5">
            <Card className="w-full border-none shadow-lg gap-0">
                <CardHeader className="">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Manage and monitor administrator accounts
                            </p>
                        </div>
                        <div className="flex items-center gap-3">                            
                            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-purple-600 hover:bg-purple-700">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Add Admin
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl">Add Admin</DialogTitle>
                                    </DialogHeader>
                                    <AddAdminForm
                                        onSubmit={handleFormSubmit}
                                        onCancel={() => setIsModalOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className=" border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-100">
                                    <TableHead className="font-semibold text-gray text-gray-600 text-md pl-10">Admin</TableHead>
                                    <TableHead className="font-semibold text-gray text-gray-600 text-md">Contact</TableHead>
                                    <TableHead className="font-semibold text-gray text-gray-600 text-md">Role</TableHead>
                                    <TableHead className="font-semibold text-gray text-gray-600 text-md">Status</TableHead>
                                    <TableHead className="font-semibold text-gray text-gray-600 text-md text-right pr-10">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminsData?.data?.length ? adminsData?.data?.map((admin: any, index: number) => (
                                    <TableRow key={admin.id} className="hover:bg-gray-50" data-aos="fade-up" data-aos-delay={index * 100}>
                                        <TableCell>
                                            <div className="flex items-center gap-3 pl-5 py-2">
                                                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                                                    {admin.name
                                                        .split(' ')
                                                        .map((n: any) => n[0])
                                                        .join('')}
                                                </div>
                                                <span className="font-medium text-gray-900">{admin.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Mail size={14} />
                                                {admin.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 font-semibold">
                                                {admin.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusBadge(admin.status)}>{admin.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2 pr-5">                                                
                                                <Button
                                                onClick={()=>handleAdminDelete(admin?._id)}                                                    
                                                    size="sm"
                                                    className="bg-red-600!"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )) : <TableRow className="text-center py-12 text-gray-500">
                                    <TableCell colSpan={5}>
                                    <p className="text-lg text-center py-10">No admins found matching your search.</p>
                                    </TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>                        
                    </div>
                
                </CardContent>
            </Card>
        </div>

    );
}