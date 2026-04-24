import { useState } from "react";
import { GitBranch, Rocket, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/CustomToast";
import { createDeployment } from "@/api/deployemnt";
import type { DeploymentSource } from "@/types";

interface DeployFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (deploymentId: string) => void;
}

export function DeployForm({ open, onOpenChange, onSuccess }: DeployFormProps) {
  const [sourceRef, setSourceRef] = useState("");
  const [name, setName] = useState("");
  const [sourceType] = useState<DeploymentSource>("git");
  const [loading, setLoading] = useState(false);

  const isValid = sourceRef.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    try {
      const result = await createDeployment({
        sourceType,
        sourceRef: sourceRef.trim(),
        name: name.trim() || undefined,
      });

      showToast("Deployment queued successfully", "success");
      onOpenChange(false);
      setSourceRef("");
      setName("");
      onSuccess?.(result.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create deployment";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <Rocket className="h-4 w-4 text-background" />
            </div>
            <DialogTitle>New Deployment</DialogTitle>
          </div>
          <DialogDescription>
            Enter a public Git repository URL to deploy. Brimble will clone,
            build, and serve it automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-foreground">
              Repository URL
            </label>
            <div className="relative">
              <GitBranch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="url"
                placeholder="https://github.com/user/repo"
                value={sourceRef}
                onChange={(e) => setSourceRef(e.target.value)}
                className="pl-8"
                autoFocus
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-foreground">
              Project name{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <Input
              type="text"
              placeholder="my-project"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Brimble will run{" "}
              <code className="font-mono bg-muted rounded px-1">
                npm install
              </code>{" "}
              and{" "}
              <code className="font-mono bg-muted rounded px-1">
                npm run build
              </code>{" "}
              then serve the output via Caddy.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="text-[13px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || loading}
              className="text-[13px] gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Rocket className="h-3.5 w-3.5" />
                  Deploy
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}