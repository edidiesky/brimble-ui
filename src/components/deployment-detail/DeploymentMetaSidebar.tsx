import { ExternalLink, GitBranch, GitCommit, Clock, Server } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { StatusBadge } from "@/components/deployments/StatusBadge";
import type { IDeployment } from "@/types";

interface MetaRowProps {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

function MetaRow({ label, icon, children }: MetaRowProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className="text-[12px] text-foreground">{children}</div>
    </div>
  );
}

interface DeploymentMetaSidebarProps {
  deployment: IDeployment;
}

export function DeploymentMetaSidebar({ deployment }: DeploymentMetaSidebarProps) {
  return (
    <div className="space-y-4 sticky top-0 rounded-xl border border-border p-4">
      <MetaRow label="Status">
        <div className="flex items-center gap-2">
          <StatusBadge status={deployment.status} />
          {deployment.attempts > 1 && (
            <span className="text-[11px] text-muted-foreground">
              {deployment.attempts} attempts
            </span>
          )}
        </div>
      </MetaRow>

      {deployment.url && (
        <MetaRow label="Domains">
          <a
            href={deployment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline underline-offset-2 text-foreground"
          >
            {deployment.url.replace("http://", "")}
            <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
          </a>
        </MetaRow>
      )}

      <MetaRow label="Source" icon={<GitBranch className="h-3 w-3" />}>
        <div className="space-y-0.5">
          <p className="font-medium">main</p>
          <a
            href={deployment.sourceRef}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground truncate"
          >
            <GitCommit className="h-3 w-3 shrink-0" />
            <span className="truncate">{deployment.sourceRef}</span>
          </a>
        </div>
      </MetaRow>

      <MetaRow label="Created" icon={<Clock className="h-3 w-3" />}>
        <p>{format(new Date(deployment.createdAt), "MMM d, yyyy HH:mm")}</p>
        <p className="text-muted-foreground text-[11px]">
          {formatDistanceToNow(new Date(deployment.createdAt), { addSuffix: true })}
        </p>
      </MetaRow>

      {deployment.hostPort && (
        <MetaRow label="Port" icon={<Server className="h-3 w-3" />}>
          <span className="font-mono">:{deployment.hostPort}</span>
        </MetaRow>
      )}

      {deployment.imageTag && (
        <MetaRow label="Image">
          <span className="font-mono text-[11px] break-all text-muted-foreground">
            {deployment.imageTag}
          </span>
        </MetaRow>
      )}
    </div>
  );
}