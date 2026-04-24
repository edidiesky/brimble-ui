import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GitBranch, Rocket, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/CustomToast";
import { createDeployment } from "@/api/deployemnt";
import { slideRight } from "@/lib/framer";
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
    <AnimatePresence mode="wait">
      {open && (
        <>
          {/* Backdrop for the form */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            onClick={() => !loading && onOpenChange(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />

          {/* Slide-in panel */}
          <motion.div
            variants={slideRight}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed top-0 right-0 z-50 h-full w-full max-w-120 bg-background border-l border-border shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 h-18 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
                  <Rocket className="h-4 w-4 text-background" />
                </div>
                <div>
                  <h2 className="text-[14px] font-semibold text-foreground">
                    New Deployment
                  </h2>
                  <p className="text-xs text-muted-foreground">brimble-paas</p>
                </div>
              </div>
              <button
                onClick={() => !loading && onOpenChange(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Body */}
            <div
              className="flex-1 overflow-y-auto px-6 py-6"
              style={{ height: "calc(100vh - 72px - 80px)" }}
            >
              <form
                id="deploy-form"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
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

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
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

                <div className="rounded-lg border border-border bg-muted/40 px-4 py-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Brimble will clone your repository, detect the framework,
                    run{" "}
                    <code className="font-mono bg-muted rounded px-1">
                      npm install
                    </code>{" "}
                    and{" "}
                    <code className="font-mono bg-muted rounded px-1">
                      npm run build
                    </code>
                    , then serve the output via Caddy on a unique URL.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Pipeline steps
                  </p>
                  {[
                    "Clone repository",
                    "Build image with Railpack",
                    "Start container",
                    "Register Caddy route",
                  ].map((step, i) => (
                    <div
                      key={step}
                      className="flex items-center gap-3 rounded-md border border-border px-3 py-2"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm text-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="border-t border-border h-20 px-6 flex items-center justify-between shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => !loading && onOpenChange(false)}
                disabled={loading}
                className="text-[13px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="deploy-form"
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
                    Deploy now
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
