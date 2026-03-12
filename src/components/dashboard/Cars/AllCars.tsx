
import { Loader, Search, Trash2, UserPlus } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';


import {
  Eye,
  Pencil,
  Plus
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AddCarForm from './AddCarForm';
import { useDeleteCarMutation, useGetCarsQuery } from '../../../redux/features/cars/carsApi';
import { imageUrl } from '../../../redux/base/baseAPI';
import CarDetailsModal from './CarDetailsModal';
import { getSearchParams } from '../../../utils/getSearchParams';
import { useUpdateSearchParams } from '../../../utils/updateSearchParams';
import ManagePagination from '../../Shared/ManagePagination';
import Swal from "sweetalert2";

export default function AllCars() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [open, setOpen] = useState<any>(null);
  const { data: carsData, refetch, isLoading } = useGetCarsQuery({});
  const [deleteCar] = useDeleteCarMutation();
  const { searchTerm, page } = getSearchParams();
  const updateSearchParams = useUpdateSearchParams();

  useEffect(() => {
    refetch();
  }, [searchTerm, page]);


  const handleDeleteCar = async (car:any) => {
    const result = await Swal.fire({
      title: `Delete ${car?.model} car?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-primary)",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
     const response = await deleteCar(car?._id).unwrap();
      console.log("response", response);
      
      if (response?.success) {
        Swal.fire({
          title: "Deleted!",
          text: "Car has been deleted successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        refetch();
        setSelectedCar(null);
        setOpen(null);
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete car.",
        icon: "error",
      });

      console.error("Error deleting car:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                All Vehicles 
              </h2>
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
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 border-0">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Car
                  </Button>
                </DialogTrigger>

                <DialogContent className="min-w-4xl! max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">Add New Car</DialogTitle>
                  </DialogHeader>

                  <div className="mt-4">
                    <AddCarForm
                      open={isModalOpen}
                      onCancel={() => setIsModalOpen(false)}
                      data={selectedCar}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-36">Vehicle</TableHead>
                <TableHead className="w-36">License Plate</TableHead>
                <TableHead className="w-36">Model</TableHead>
                <TableHead className="w-28 text-right">Seat Number</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-44">Host</TableHead>
                <TableHead className="w-28 text-center">Actions</TableHead>
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
              ) : !isLoading && carsData?.data?.length ? carsData?.data?.map((car: any, index: number) => (
                <TableRow key={car._id} data-aos="fade-up" data-aos-delay={index * 100} className="hover:bg-muted/30 border-b last:border-0">

                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-24 overflow-hidden rounded-md border bg-muted flex-shrink-0">
                        <img
                          src={imageUrl + car?.coverImage}
                          alt={car?.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-medium leading-tight">{car?.brand}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="font-mono text-sm">{car?.licensePlate}</TableCell>
                  <TableCell className="font-mono text-sm">{car?.model}</TableCell>

                  <TableCell align='center' className=" font-medium">{car?.seatNumber}</TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`px-2.5 py-0.5 text-xs font-medium capitalize ${car?.isActive ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                        : "bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200"}`}
                    >
                      {car?.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="w-32">
                      {car?.host === '—' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 h-8 text-xs border-dashed"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Assign
                        </Button>
                      ) : (
                        <div className="flex items-center gap-3 w-14 rounded-md">
                          {car?.assignedHosts?.profileImage && <img
                            src={imageUrl + car?.assignedHosts?.profileImage}
                            alt={car?.name}
                            className="h-full w-full object-cover rounded-md"
                          />}
                          <span className="text-sm">{car?.assignedHosts?.name}</span>
                        </div>
                      )}
                    </div>

                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => { setSelectedCar(car); setOpen(true) }} className="text-muted-foreground hover:text-foreground transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => { setSelectedCar(car); setIsModalOpen(true) }} className="text-muted-foreground hover:text-foreground transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteCar(car) } className="text-muted-foreground hover:text-red-600 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : <TableRow> <TableCell align='center' colSpan={8} className='text-lg'>Car Data Not Found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>

        <ManagePagination meta={carsData?.meta} />
      </Card>
      <CarDetailsModal open={open} onClose={() => setOpen(false)} car={selectedCar} />
    </div>
  );
}