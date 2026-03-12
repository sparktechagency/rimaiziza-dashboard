import { baseApi } from "../../base/baseAPI";

const carsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCars: builder.query({
            query: () => ({
                url: `/cars${location?.search}`,
            }),
            providesTags: ["cars"],
        }),

        getCarById: builder.query({
            query: (id) => `/cars/${id}`,
            transformResponse: (res: { data: any }) => res?.data,
            providesTags: ["cars"],
        }),

        createCar: builder.mutation({
            query: (body) => ({
                url: "/cars",
                method: "POST",
                body,
            }),
            invalidatesTags: ["cars"],
        }),

        updateCar: builder.mutation({
            query: (data) => ({
                url: `/cars/${data?.id}`,
                method: "PATCH",
                body: data?.formData,
            }),
            invalidatesTags: ["cars"],
        }),

        deleteCar: builder.mutation({
            query: (id) => ({
                url: `/cars/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["cars"],
        }),

        getCarAnalytics: builder.query({
            query: (id) => `/cars/${id}/analytics`,
            transformResponse: (res: { data: any }) => res?.data,
        }),

        getCarGrowth: builder.query({
            query: () => `/analytics/admin-car-growth-chart${location?.search}`,
            transformResponse: (res: { data: any }) => res?.data,
        }),
    }),
});

export const {
    useGetCarsQuery,
    useGetCarByIdQuery,
    useCreateCarMutation,
    useUpdateCarMutation,
    useDeleteCarMutation,
    useGetCarAnalyticsQuery,
    useGetCarGrowthQuery,
} = carsApi;
