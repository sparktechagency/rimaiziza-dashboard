import { baseApi } from "../../base/baseAPI";

const hostApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getHosts: builder.query({
            query: () => ({
                url: `/users/hosts${location?.search}`,
            }),  
            providesTags: ['host'],          
        }),

        getHostById: builder.query({
            query: (id) => `/users/hosts/${id}`,
            transformResponse: (res: { data: any }) => res?.data,
            providesTags: ['host'],          
        }),

        createHost: builder.mutation({
            query: (body) => ({
                url: "/users/create-host",
                method: "POST",
                body,
            }),
            invalidatesTags: ['host'],
        }),

        updateHost: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/hosts/${id}`,
                method: "PUT",
                body,
            }),
        }),

        deleteHost: builder.mutation({
            query: (id) => ({
                url: `/users/hosts/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['host'],
        }),

        getHostAnalytics: builder.query({
            query: (id) => `/hosts/${id}/analytics`,
            transformResponse: (res: { data: any }) => res?.data,
        }),

        getHostGrowth: builder.query({
            query: () => `/analytics/admin-host-growth-chart${location?.search}`,
            transformResponse: (res: { data: any }) => res?.data,
        }),
    }),
});

export const {
    useGetHostsQuery,
    useGetHostByIdQuery,
    useCreateHostMutation,
    useUpdateHostMutation,
    useDeleteHostMutation,
    useGetHostAnalyticsQuery,
    useGetHostGrowthQuery,
} = hostApi;
