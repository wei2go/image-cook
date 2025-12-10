import type { EntityTrackingDoc } from "@image-cook/shared";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8531";

/**
 * Get the API base URL depending on the environment
 * - Server-side: uses API_BASE_URL from env
 * - Client-side: uses relative path (proxied via Next.js rewrites)
 */
export function getApiUrl(path: string): string {
  // Check if we're on the server
  const isServer = typeof window === 'undefined';

  if (isServer) {
    // Server-side: use absolute URL from env
    const baseUrl = process.env.API_BASE_URL;
    if (!baseUrl) {
      throw new Error('API_BASE_URL environment variable is not set');
    }
    return `${baseUrl}${path}`;
  }

  // Client-side: use relative path (will be proxied by Next.js rewrites)
  return `/api${path}`;
}

export async function fetchEntities(
  category?: string,
): Promise<EntityTrackingDoc[]> {
  const url = category
    ? getApiUrl(`/entities?category=${category}`)
    : getApiUrl(`/entities`);
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
  const res = await fetch(getApiUrl(`/images/approve`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entityId, model, version }),
  });
  if (!res.ok) throw new Error("Failed to approve image");
}

export async function deselectImage(entityId: string) {
  const res = await fetch(getApiUrl(`/images/deselect`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entityId }),
  });
  if (!res.ok) throw new Error("Failed to deselect image");
}
