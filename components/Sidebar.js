"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Map, 
  History, 
  Waves,
  Menu,
  X
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    // Open by default on large screens
    if (window.innerWidth >= 1024) {
      setIsOpen(true);
    }
  }, []);

  const menuItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Peta Banjir",
      path: "/peta-banjir",
      icon: <Map size={20} />,
    },
    {
      title: "Riwayat Data",
      path: "/riwayat-data",
      icon: <History size={20} />,
    },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className={`lg:hidden fixed top-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out ${isOpen ? "left-[290px]" : "left-4"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-screen bg-slate-900 text-slate-100 transition-all duration-300 ease-in-out z-40
          ${isOpen ? "w-[280px] lg:w-64" : "w-0 lg:w-64"} 
          overflow-hidden border-r border-slate-800
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo / Header */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            {isOpen && (
              <div className="font-['Poppins'] font-bold text-xl tracking-tight overflow-hidden whitespace-nowrap">
                Banjir <span className="text-blue-400">Pamekasan</span>
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
                    ${isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                      : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"}
                  `}
                >
                  <div className={`${isActive ? "text-white" : "text-blue-400 group-hover:text-blue-300"}`}>
                    {item.icon}
                  </div>
                  {isOpen && (
                    <span className="font-medium whitespace-nowrap">{item.title}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-slate-800">
            {isOpen ? (
              <div className="text-xs text-slate-500 text-center">
                &copy;2026. Monitoring Banjir <br /> Kab. Pamekasan by Robby
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
