import Cookies from "js-cookie";
import { FiLogOut } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { sidebarItems } from "../../lib/SidebarItems";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger
} from "../ui/tooltip";

// ───────────────── Children ───────────────────────────────
// Types
// interface SidebarItemChild {
//   path: string;
//   icon?: React.ReactNode;
//   label: string;
// }


// ────────────────────────────────────────────────
export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    Cookies.remove("accessToken");    
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "fixed  bg-white overflow-hidden border-r border-neutral-200 transition-all duration-300 w-70")}
    >
      <div className="h-screen flex flex-col">
        {/* Header / Logo + Toggle */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4">

          <div className="flex items-center gap-2">
            {/* Replace with your logo */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
              TL
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-neutral-900">
                TradeLink
              </span>
              <span className="text-xs text-neutral-500">
                Network
              </span>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <ScrollArea className=" h-full px-3 py-4 mb-auto">
          <nav className="space-y-2!">
            {sidebarItems.map((item, index) => {
              const itemPath = `/${item.path}`;
              const isItemActive = isActive(itemPath);
              // ────────────────────────────────────────────────
              // Simple item (no children)
              return (
                <TooltipProvider key={item.key}  >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={itemPath}
                        className={cn(
                          "group relative mb-2! flex w-full items-center gap-3 rounded-lg transition-all duration-200 min-h-11 justify-start px-3 py-2.5",
                          isItemActive
                            ? "bg-primary text-white!"
                            : "border border-black/20 text-black! hover:bg-primary hover:text-white!"
                        )}
                        data-aos="fade-up-right"
                        data-aos-delay={index * 100}
                      >
                        {item.icon && (
                          <span className="flex-shrink-0">{item.icon}</span>
                        )}
                        <span>{item.label}</span>
                      </Link>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Logout */}
        <div className="border-t border-neutral-200 p-3 ">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleLogout}
                  className={cn("w-full justify-center gap-3 bg-transparent! text-black! border-2! border-black/50!")}>
                  <FiLogOut className="h-5 w-5 shrink-0" />
                  <span>Log Out</span>
                </Button>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

    </aside>
  );
}