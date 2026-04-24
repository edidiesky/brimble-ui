import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, RefreshCw, Rocket } from "lucide-react";
import { DeploymentRow } from "./DeploymentRow";
import { DeployForm } from "./DeployForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listDeployments } from "@/api/deployemnt";
import type { DeploymentStatus } from "@/types";

const STATUS_FILTERS: { label: string; value: DeploymentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Ready", value: "running" },
  { label: "Building", value: "building" },
  { label: "Error", value: "failed" },
  { label: "Queued", value: "pending" },
];

export function DeploymentList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeploymentStatus | "all">("all");
  const [deployFormOpen, setDeployFormOpen] = useState(false);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["deployments"],
    queryFn: listDeployments,
    refetchInterval: 5000,
  });

  const filtered = (data ?? []).filter((d) => {
    const matchesStatus =
      statusFilter === "all" || d.status === statusFilter;
    const matchesSearch =
      search.trim() === "" ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.sourceRef.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-[15px] font-semibold text-foreground">
            Deployments
          </h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {data ? `${data.length} total` : "Loading..."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-muted-foreground ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
          <Button
            onClick={() => setDeployFormOpen(true)}
            size="sm"
            className="gap-1.5 text-[13px] h-8"
          >
            <Rocket className="h-3.5 w-3.5" />
            Deploy
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search deployments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-[12px]"
          />
        </div>

        <div className="flex items-center gap-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${
                statusFilter === f.value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1">
        {isLoading && (
          <div className="divide-y divide-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32 ml-auto" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mb-3">
              <span className="text-red-500 text-lg">!</span>
            </div>
            <p className="text-[14px] font-medium text-foreground">
              Failed to load deployments
            </p>
            <p className="text-[12px] text-muted-foreground mt-1 mb-4">
              Make sure the API is running on port 3000
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
              <Rocket className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-[14px] font-medium text-foreground">
              {search || statusFilter !== "all"
                ? "No deployments match your filters"
                : "No deployments yet"}
            </p>
            <p className="text-[12px] text-muted-foreground mt-1 mb-4">
              {search || statusFilter !== "all"
                ? "Try adjusting your search or filter"
                : "Deploy your first project to get started"}
            </p>
            {statusFilter === "all" && !search && (
              <Button size="sm" onClick={() => setDeployFormOpen(true)}>
                New Deployment
              </Button>
            )}
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div>
            {filtered.map((deployment) => (
              <DeploymentRow key={deployment.id} deployment={deployment} />
            ))}
          </div>
        )}
      </div>

      <DeployForm
        open={deployFormOpen}
        onOpenChange={setDeployFormOpen}
        onSuccess={() => refetch()}
      />
    </>
  );
}