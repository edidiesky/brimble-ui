import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Rocket,
  ScrollText,
  BarChart2,
  Settings,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Deployments",
    href: "/deployments",
    icon: Rocket,
  },
  {
    label: "Logs",
    href: "/logs",
    icon: ScrollText,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart2,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[220px] flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground">
          <Boxes className="h-4 w-4 text-background" />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Brimble Test UI
        </span>
      </div>

      {/* Project selector */}
      <div className="border-b border-border px-4 py-3">
        <button className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-sm bg-foreground/10 flex items-center justify-center text-[10px] font-bold text-foreground">
              B
            </div>
            <span className="font-medium text-foreground text-[14px]">brimble-paas</span>
          </div>
          <svg
            className="h-3.5 w-3.5 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[14px] font-medium transition-colors",
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-foreground flex items-center justify-center text-[11px] font-semibold text-background shrink-0">
            B
          </div>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-medium text-foreground">brimble-user</p>
            <p className="truncate text-[11px] text-muted-foreground">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}