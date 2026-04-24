import { createFileRoute } from "@tanstack/react-router";
import { DeploymentList } from "@/components/deployments/DeploymentList";
import { TopHeader } from "@/components/layout/TopHeader";

export const Route = createFileRoute("/deployments")({
  component: DeploymentsPage,
});

function DeploymentsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <TopHeader
        title="Deployments"
        subtitle="brimble-paas"
      />
      <DeploymentList />
    </div>
  );
}