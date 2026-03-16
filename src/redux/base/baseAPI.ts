// import { createApi } from "@reduxjs/toolkit/query/react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({

    baseUrl: "http://https://dashboard.gogreenmatrix.my/api/v1",   
    // baseUrl: "https://moshfiqur5007.binarybards.online/api/v1",   
    prepareHeaders: (headers) => {      
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include",

  }),
  endpoints: () => ({}),
  tagTypes: ["user", "notifications", "admin", "category", "slider", "faqs", "withdrawal", "planner", "cars", "host", "booking", "profile", "rules", "commission"],
});

export const imageUrl = "https://dashboard.gogreenmatrix.my";
// export const imageUrl = "https://moshfiqur5007.binarybards.online";