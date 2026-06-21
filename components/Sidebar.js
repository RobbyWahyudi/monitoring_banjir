"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  History,
  Menu,
  X,
  Shield,
  RadioReceiver,
  MapPin,
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024,
  );
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/check-auth");
        const data = await res.json();
        setIsAdmin(data.authenticated);
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkAuth();
  }, [pathname]);

  const baseMenuItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Peta Sensor",
      path: "/peta-sensor",
      icon: <Map size={20} />,
    },
    {
      title: "Riwayat Data",
      path: "/riwayat-data",
      icon: <History size={20} />,
    },
  ];

  const adminMenuItems = [
    {
      title: "Dashboard Admin",
      path: "/admin",
      icon: <Shield size={20} />,
    },
    {
      title: "Kelola Sensor",
      path: "/admin/sensor",
      icon: <RadioReceiver size={20} />,
    },
    {
      title: "Kelola Titik Rawan",
      path: "/admin/titik-rawan",
      icon: <MapPin size={20} />,
    },
  ];

  const menuItems = isAdmin
    ? [...baseMenuItems, ...adminMenuItems]
    : baseMenuItems;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className={`lg:hidden fixed top-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out ${isOpen ? "left-72.5" : "left-4"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-slate-900 text-slate-100 transition-all duration-300 ease-in-out z-40
          ${isOpen ? "w-70 lg:w-64" : "w-0 lg:w-64"} 
          overflow-hidden border-r border-slate-800
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo / Header */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            {isOpen && (
              <div className="font-['Poppins'] font-bold text-xl tracking-tight overflow-hidden whitespace-nowrap">
                Monitoring <span className="text-blue-400">Banjir</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                        : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
                    }
                  `}
                >
                  <div
                    className={`${isActive ? "text-white" : "text-blue-400 group-hover:text-blue-300"}`}
                  >
                    {item.icon}
                  </div>
                  {isOpen && (
                    <span className="font-medium whitespace-nowrap">
                      {item.title}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-slate-800">
            {isAdmin && (
              <button
                onClick={async () => {
                  await fetch("/api/logout", { method: "POST" });
                  window.location.href = "/login";
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 mb-4 rounded-lg transition-all duration-200 group hover:bg-red-500/10 text-red-400 hover:text-red-300 ${!isOpen && "justify-center"}`}
              >
                <div className="text-red-400 group-hover:text-red-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </div>
                {isOpen && (
                  <span className="font-medium whitespace-nowrap">Logout</span>
                )}
              </button>
            )}

            {isOpen ? (
              <div className="text-xs text-slate-500 text-center">
                &copy;2026. Monitoring Banjir by Robby Wahyudi
              </div>
            ) : (
              <div className="flex justify-center text-blue-500 opacity-50 italic font-bold">
                BP
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
