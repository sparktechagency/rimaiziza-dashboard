import { baseApi } from "../../base/baseAPI";

const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFAQ: builder.query({
      query: () => "/faqs",
      providesTags: ["faqs"]
      // transformResponse: (res: { data: any }) => res?.data,
    }),
    addFAQ: builder.mutation({
      query: (data) => ({
        url: "/faqs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["faqs"]
    }),
    updateFAQ: builder.mutation({
      query: ({ id, data }) => ({
        url: `/faqs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["faqs"]
    }),
    deleteFAQ: builder.mutation({
      query: (id)=> {
        return {
          url: `/faqs/${id}`,
          method: "DELETE",          
        }
      }
    }),



   getAbout: builder.query({
      query: () => "/rules/ABOUT",
      transformResponse: (res: { data: any }) => res?.data,
    }),
    addAbout: builder.mutation({
      query: (data) => ({
          url: "/settings",
          method: "POST",
          body: data,
        }),
    }),
    getPrivacyPolicy: builder.query({
      query: () => "/rules/PRIVACY",
      transformResponse: (res: { data: any }) => res?.data,
    }),
    getTermsCondition: builder.query({
      query: () => "/rules/TERMS",      
      transformResponse: (res: { data: any }) => res?.data,
    }),
    addDisclaimer: builder.mutation({
      query: (data) => ({
          url: "/rules",
          method: "POST",
          body: data,
        }),
    }),

    addSupport: builder.mutation({
      query: (data) => {
        return {
          url: "/contact-info",
          method: "POST",
          body: data,
        };
      },
    }),
    getSupport: builder.query({
      query: () => "/contact-info",
      transformResponse: (res: { data: any }) => res?.data,
    }),
    // ---------------- Commission Manage  Start---------------
    getCommission: builder.query({
      query: () => "/platform/get-platform-fees",
      transformResponse: (res: { data: any }) => res?.data,
    }),
    updateCommission: builder.mutation({      
        query: (data) => ({
          url: `/platform/update-platform-fee/${data?.id}`,
          method: "PUT",
          body: data,
        }),
    }),

    // ---------------- Commission Manage  End---------------

    getNotification: builder.query({
      query: () => "/reports",
      transformResponse: (res: { data: any }) => res?.data,
    }),
  }),
});



export const {
  useGetFAQQuery,
  useGetAboutQuery,
  useGetPrivacyPolicyQuery,

  useGetSupportQuery,
  useAddSupportMutation,

  useGetCommissionQuery,
  useUpdateCommissionMutation,

  useAddAboutMutation,
  useAddFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,

  useGetTermsConditionQuery,
  useAddDisclaimerMutation,
} = settingApi;
