import type { EntityTrackingDoc } from "@image-cook/shared";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8531";

export async function fetchEntities(
  category?: string,
): Promise<EntityTrackingDoc[]> {
  const url = category
    ? `${API_BASE}/entities?category=${category}`
    : `${API_BASE}/entities`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch entities");
  const data = await res.json();
  return data.entities;
}

export async function approveImage(
  entityId: string,
  model: string,
  version: number,
) {
  const res = await fetch(`${API_BASE}/images/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entityId, model, version }),
  });
  if (!res.ok) throw new Error("Failed to approve image");
}

export async function deselectImage(entityId: string) {
  const res = await fetch(`${API_BASE}/images/deselect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entityId }),
  });
  if (!res.ok) throw new Error("Failed to deselect image");
}
