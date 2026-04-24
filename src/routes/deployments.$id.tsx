import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { TopHeader } from "@/components/layout/TopHeader";
import { StatusBadge } from "@/components/deployments/StatusBadge";
import { LogStream } from "@/components/logs/LogStream";
import { Skeleton } from "@/components/ui/skeleton";
import { getDeployment } from "@/api/deployemnt";

export const Route = createFileRoute("/deployments/$id")({
  component: DeploymentDetailPage,
});

function DeploymentDetailPage() {
  const { id } = Route.useParams();

  const { data: deployment, isLoading, refetch } = useQuery({
    queryKey: ["deployment", id],
    queryFn: () => getDeployment(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "building" || status === "deploying" || status === "pending") {
        return 3000;
      }
      return false;
    },
  });

  // const isActive =
  //   deployment?.status === "building" ||
  //   deployment?.status === "deploying" ||
  //   deployment?.status === "pending";

  return (
    <div className="flex flex-col min-h-full">
      <TopHeader
        title={deployment?.name ?? id.slice(0, 9).toUpperCase()}
        subtitle={deployment ? `${deployment.sourceRef}` : undefined}
        actions={
          <button
            onClick={() => refetch()}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-muted transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        }
      />

      <div className="flex-1 p-6 space-y-6 max-w-4xl">
        {/* Back */}
        <Link
          to="/deployments"
          className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All deployments
        </Link>

        {/* Summary card */}
        {isLoading ? (
          <div className="rounded-xl border border-border p-5 space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        ) : deployment ? (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <StatusBadge status={deployment.status} />
                  {deployment.attempts > 1 && (
                    <span className="text-[11px] text-muted-foreground">
                      {deployment.attempts} attempts
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">
                      Deployment ID
                    </p>
                    <p className="font-mono text-[12px] text-foreground">
                      {deployment.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">
                      Created
                    </p>
                    <p className="text-[12px] text-foreground">
                      {format(new Date(deployment.createdAt), "MMM d, yyyy HH:mm")}{" "}
                      <span className="text-muted-foreground">
                        ({formatDistanceToNow(new Date(deployment.createdAt), { addSuffix: true })})
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">
                      Source
                    </p>
                    <a
                      href={deployment.sourceRef}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-foreground hover:underline underline-offset-2 flex items-center gap-1 truncate"
                    >
                      {deployment.sourceRef}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>

                  {deployment.hostPort && (
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">
                        Port
                      </p>
                      <p className="font-mono text-[12px] text-foreground">
                        :{deployment.hostPort}
                      </p>
                    </div>
                  )}
                </div>

                {deployment.url && (
                  <div className="pt-1">
                    <a
                      href={deployment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[12px] font-medium hover:bg-muted transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {deployment.url}
                    </a>
                  </div>
                )}

                {deployment.lastError && deployment.status === "failed" && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                    <p className="text-[11px] font-medium text-red-600 uppercase tracking-wider mb-0.5">
                      Last error
                    </p>
                    <p className="text-[12px] text-red-700 font-mono">
                      {deployment.lastError}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* Log stream */}
        <div>
          <h3 className="text-[13px] font-semibold text-foreground mb-3">
            Build Logs
          </h3>
          <LogStream
            deploymentId={id}
            enabled={true}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}