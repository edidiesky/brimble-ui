import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDeploymentLogs } from "@/api/logs";
import type { IDeploymentLog, LogPhase, DeploymentStatus } from "@/types";

const PHASES: LogPhase[] = ["clone", "build", "run", "register", "system"];

const PHASE_LABELS: Record<LogPhase, string> = {
  clone: "Clone Repository",
  build: "Build Image",
  run: "Start Container",
  register: "Register Route",
  system: "System",
};

function phaseStatus(
  logs: IDeploymentLog[],
  phase: LogPhase,
  deployStatus: DeploymentStatus
): "success" | "error" | "running" | "pending" {
  const hasLogs = logs.some((l) => l.phase === phase);
  if (!hasLogs) return "pending";
  const hasError = logs.some(
    (l) => l.phase === phase && l.line.toLowerCase().includes("failed")
  );
  if (hasError && deployStatus === "failed") return "error";
  if (deployStatus === "building" || deployStatus === "deploying") return "running";
  return "success";
}

function PhaseIcon({ status }: { status: ReturnType<typeof phaseStatus> }) {
  if (status === "success") return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
  if (status === "error") return <XCircle className="h-4 w-4 text-red-500 shrink-0" />;
  if (status === "running") return <Loader2 className="h-4 w-4 text-yellow-500 shrink-0 animate-spin" />;
  return <div className="h-4 w-4 rounded-full border border-muted-foreground/30 shrink-0" />;
}

interface PhaseGroupProps {
  phase: LogPhase;
  logs: IDeploymentLog[];
  deployStatus: DeploymentStatus;
}

function PhaseGroup({ phase, logs, deployStatus }: PhaseGroupProps) {
  const phaseLogs = logs.filter((l) => l.phase === phase);
  const status = phaseStatus(logs, phase, deployStatus);
  const [open, setOpen] = useState(status === "error" || status === "running");

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 w-full px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
      >
        <PhaseIcon status={status} />
        <span className="flex-1 text-[13px] font-medium text-foreground">
          {PHASE_LABELS[phase]}
        </span>
        <span className="text-[11px] text-muted-foreground mr-2">
          {phaseLogs.length} lines
        </span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {open && phaseLogs.length > 0 && (
        <div className="bg-zinc-950 px-4 py-3 font-mono text-[11px] leading-5 max-h-75 overflow-y-auto">
          {phaseLogs.map((log) => (
            <div key={log.seq} className="flex gap-3 group">
              <span className="w-8 shrink-0 text-right text-zinc-700 select-none group-hover:text-zinc-600">
                {log.seq}
              </span>
              <span className="text-zinc-200 break-all whitespace-pre-wrap flex-1">
                {log.line}
              </span>
            </div>
          ))}
        </div>
      )}

      {open && phaseLogs.length === 0 && (
        <div className="bg-zinc-950 px-4 py-3 text-[11px] text-zinc-600 font-mono">
          No logs for this phase.
        </div>
      )}
    </div>
  );
}

interface BuildLogsTabProps {
  deploymentId: string;
  deployStatus: DeploymentStatus;
}

export function BuildLogsTab({ deploymentId, deployStatus }: BuildLogsTabProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["deployment-logs", deploymentId],
    queryFn: () => getDeploymentLogs({ deploymentId, limit: 500 }),
    refetchInterval: deployStatus === "building" || deployStatus === "deploying" ? 3000 : false,
  });

  const logs = data?.data ?? [];
  const totalLines = data?.totalCount ?? 0;

  return (
    <div className="p-6 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[13px] font-semibold text-foreground">Build Logs</h3>
        {!isLoading && (
          <span className="text-[11px] text-muted-foreground">{totalLines} lines</span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {PHASES.map((phase) => (
            <PhaseGroup
              key={phase}
              phase={phase}
              logs={logs}
              deployStatus={deployStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}