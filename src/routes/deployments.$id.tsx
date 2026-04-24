import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/deployments/$id")({
  component: DeploymentDetailPage,
});

function DeploymentDetailPage() {
  const { id } = Route.useParams();
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold">Deployment</h1>
      <p className="text-muted-foreground text-sm mt-1">{id}</p>
    </div>
  );
}