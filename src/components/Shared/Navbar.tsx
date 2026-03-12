import { Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import Cookies from "js-cookie";
import { useGetProfileQuery } from "../../redux/features/user/userApi";



const Navbar = () => {
  const {data: profileData, isLoading} = useGetProfileQuery({});
  console.log("profileData", profileData);
  
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("accessToken");    
    navigate("/login");
  };

  return (
    <nav className=" bg-gradient-info shadow-lg w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-end gap-2">


          <div className="relative p-2 bg-white rounded-md">
            <Bell className="text-secondary" size={22} />
            <div className="absolute -top-1 -right-1 shadow-lg w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center">0</div>
          </div>
          {/* User Menu */}
          <div className="hidden md:flex border-l-2 border-slate-200 pl-0.5">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex bg-transparent! items-center gap-2 rounded-lg px-2 py-1.5 transition-colors  hover:bg-slate-200/50 focus:outline-none">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={profileData?.profileImage ? profileData?.profileImage : "/default-avatar.png"}
                    alt="Jessica Jones"
                  />
                  <AvatarFallback className="bg-slate-700 text-xs text-white">
                    {profileData?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex  flex-col  items-start">
                <p className="hidden text-sm font-semibold text-white lg:inline-block">
                  {profileData?.name || "User"}
                </p>
                <p className="hidden text-sm font-semibold text-white lg:inline-block">
                  {profileData?.email || "User"}
                </p>

                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 bg-white border-slate-300  text-black"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Welcome!</p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-slate-700" />

                <DropdownMenuItem
                  asChild
                  className="cursor-pointer focus:bg-slate-200 focus:text-white"
                >
                  <Link to="/setting#security-tab" className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>My profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="cursor-pointer focus:bg-slate-200 focus:text-white"
                >
                  <Link to="/setting" className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>


                <DropdownMenuItem
                  className="cursor-pointer text-white! bg-red-600!  "
                  onClick={() => handleLogout()}>
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#fff"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;