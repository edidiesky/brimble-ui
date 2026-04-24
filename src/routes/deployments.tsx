import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/deployments")({
  component: DeploymentsPage,
});

function DeploymentsPage() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold">Deployments</h1>
      <p className="text-muted-foreground text-sm mt-1">Coming soon</p>
    </div>
  );
}