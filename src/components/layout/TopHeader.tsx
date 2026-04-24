import { Bell, Search } from "lucide-react";

interface TopHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function TopHeader({ title, subtitle, actions }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-6">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-[14px] font-semibold text-foreground leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11px] text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {actions}
        <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors">
          <Search className="h-4 w-4 text-muted-foreground" />
        </button>
        <button className="relative flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
        </button>
      </div>
    </header>
  );
}