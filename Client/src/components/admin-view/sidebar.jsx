import React, { Fragment, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import {
  LayoutDashboard,
  ShoppingBasket,
  BadgeCheck,
  BarChart2,
  Users,
} from "lucide-react";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "features",
    label: "Features",
    path: "/admin/features",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
  {
    id: "users",
    label: "Users",
    path: "/admin/users",
    icon: <Users />,
  },
];

function MenuItems({ setOpen, activeMenu, setActiveMenu }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setActiveMenu(menuItem.id); 
            setOpen ? setOpen(false) : null;
          }}
          className={`flex cursor-pointer text-lg items-center gap-2 rounded-md px-3 py-2 ${
            activeMenu === menuItem.id
              ? "bg-red-500 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
        >
          <span className="text-xl">{menuItem.icon}</span>
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("dashboard");

  useEffect(() => {
    // Tìm menu phù hợp với pathname hiện tại
    const found = adminSidebarMenuItems.find(item => location.pathname.startsWith(item.path));
    if (found) {
      setActiveMenu(found.id);
    }
  }, [location.pathname]);
  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 bg-black text-gray-300">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b border-gray-700">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <span className="text-2xl font-bold">Admin Panel</span>
              </SheetTitle>
            </SheetHeader>
            <MenuItems
              setOpen={setOpen}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
            />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 flex-col bg-black text-gray-300 p-6 lg:flex">
        <div className="flex cursor-pointer items-center gap-2 mb-8">
          <span className="text-2xl font-bold">Admin Panel</span>
        </div>
        <MenuItems
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;