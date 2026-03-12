import { baseApi } from "../../base/baseAPI";

const bookingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    
    // Get All Bookings
    getBookings: build.query({
      query: () => `/bookings/all${location.search}`,
      providesTags: ["booking"],      
    }),

    // Get Single Booking
    getSingleBooking: build.query({
      query: (id) => `/bookings/${id}`,
      providesTags: ["booking"],
      transformResponse: (response: { data: any }) => response?.data,
    }),

    // Create Booking
    createBooking: build.mutation({
      query: (data) => ({
        url: "/bookings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["booking"],
    }),

    // Update Booking Status
    updateBookingStatus: build.mutation({
      query: (data) => ({
        url: `/bookings/status/${data?.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["booking"],
    }),

    // Delete Booking
    deleteBooking: build.mutation({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["booking"],
    }),

  }),
});

export const {
  useGetBookingsQuery,
  useGetSingleBookingQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
} = bookingApi;