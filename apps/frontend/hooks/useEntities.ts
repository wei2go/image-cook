'use client';

import { useState, useEffect } from 'react';
import { fetchEntities } from '../lib/api';
import type { EntityTrackingDoc } from '@image-cook/shared';

export function useEntities(category?: string) {
  const [entities, setEntities] = useState<EntityTrackingDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadEntities = async () => {
    try {
      setIsLoading(true);
      const data = await fetchEntities(category);
      setEntities(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntities();
  }, [category]);

  return { entities, isLoading, error, refresh: loadEntities };
}
