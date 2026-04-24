import { client } from "./client";
import type {
  IDeployment,
  CreateDeploymentPayload,
  CreateDeploymentResponse,
} from "../types";

export async function listDeployments(): Promise<IDeployment[]> {
  return client.get<IDeployment[]>("/api/deployments");
}

export async function getDeployment(id: string): Promise<IDeployment> {
  return client.get<IDeployment>(`/api/deployments/${id}`);
}

export async function createDeployment(
  payload: CreateDeploymentPayload
): Promise<CreateDeploymentResponse> {
  return client.post<CreateDeploymentResponse>("/api/deployments", payload);
}