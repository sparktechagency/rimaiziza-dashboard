import { baseApi } from "../../base/baseAPI";

const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder)=>({
        getAnalytics:  builder.query({
            query: ()=>`/analytics/stat-counts${location?.search}`,
            transformResponse: (res: {data: any})=> res?.data,
        }),
        getUsersGrowth:  builder.query({
            query: ()=>`/analytics/admin-user-growth-chart${location?.search}`,
            transformResponse: (res: {data: any})=> res?.data,
        }),
        getOverView: builder.query({
            query: ()=>`/analytics/overview${location?.search}`,
            transformResponse: (res: {data: any})=> res?.data
        }),
        getRevenueGrowth: builder.query({
            query: (year)=>`/analytics/yearly-revenue-chart?year=${year}`,
            transformResponse: (res: {data: any})=> res?.data
        }),
        getBookingUsersGrowth: builder.query({
            query: (year)=>`/analytics/yearly-booking-user-chart?year=${year}`,
            transformResponse: (res: {data: any})=> res?.data
        })
    })
})

export const {
    useGetAnalyticsQuery,
    useGetUsersGrowthQuery,
    useGetOverViewQuery,
    useGetRevenueGrowthQuery,
    useGetBookingUsersGrowthQuery
} = dashboardApi;