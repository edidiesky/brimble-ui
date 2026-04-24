// import { Link, useLocation } from "@tanstack/react-router";
// import {
//   LayoutDashboard,
//   Rocket,
//   ScrollText,
//   BarChart2,
//   Settings,
//   Boxes,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// const navItems = [
//   {
//     label: "Overview",
//     href: "/",
//     icon: LayoutDashboard,
//   },
//   {
//     label: "Deployments",
//     href: "/deployments",
//     icon: Rocket,
//   },
//   {
//     label: "Logs",
//     href: "/logs",
//     icon: ScrollText,
//   },
//   {
//     label: "Analytics",
//     href: "/analytics",
//     icon: BarChart2,
//   },
//   {
//     label: "Settings",
//     href: "/settings",
//     icon: Settings,
//   },
// ];

export function Sidebar() {
//   const location = useLocation();

  return (
    <div className="fixed inset-y-0 left-0 z-40 flex w-[220px] flex-col border-r border-border bg-sidebar"></div>
  );
}