import { baseApi } from "../../base/baseAPI";
import Cookies from "js-cookie";

export type UserType = {
  _id: string;
  name: string;
  role: string;
  email: string;
  password: string;
  image: string;
  status: string;
  verified: boolean;
  contact?: string;
};

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    registerUser: build.mutation({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        body: data,
      }),
    }),
    loginAdmin: build.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
   
    changePassword: build.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),

    forgetPassword: build.mutation({
      query: (data) => {
        return {
          // url: "/auth/forgot-password",          
          url: "/auth/forget-password",          
          method: "POST",
          body: data,
        };
      },
    }),

    resendOTP: build.mutation({
      query: (data) => {
        return {
          // url: "/auth/forgot-password",          
          url: "/auth/resend-otp",          
          method: "POST",
          body: data,
        };
      },
    }),
    verifyOTP: build.mutation({
      query: (data) => {
        return {
          url: "/auth/verify-email",
          method: "POST",
          body: data,
        };
      },
    }),
    // reset password
    resetPassword: build.mutation({      
      query: (data) => {

       return {
        url: "/auth/reset-password",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",          
          resettoken: `${Cookies.get("verifyToken")}`, 
        },                    
        }      
      },
    }),
  }),
});

export const {
  useLoginAdminMutation,
  useRegisterUserMutation,
  useChangePasswordMutation,
  
  useResetPasswordMutation,
  useResendOTPMutation,
  useVerifyOTPMutation,
  useForgetPasswordMutation,  
} = authApi;
