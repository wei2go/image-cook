"use client";

import { useState, useMemo } from "react";
import { useEntities } from "../hooks/useEntities";
import { approveImage, deselectImage } from "../lib/api";
import { EntityCard } from "./EntityCard";

export function EntityList() {
  const { entities, isLoading, error, refresh } = useEntities("enemy");
  const [pendingSelections, setPendingSelections] = useState<
    Map<string, { model: string; version: number }>
  >(new Map());
  const [isProcessing, setIsProcessing] = useState(false);

  // Track selections (in-memory + pending)
  const selectionsCount = useMemo(() => {
    return (
      entities.filter((e) => e.selectedImage).length + pendingSelections.size
    );
  }, [entities, pendingSelections]);

  const handleToggleSelect = (
    entityId: string,
    model: string,
    version: number,
    hasSelection: boolean,
  ) => {
    if (hasSelection) {
      return; // Doesn't allow users to toggle selection if already has selection in DB. Users can click "Select Again" to do so.
    }

    setPendingSelections((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(entityId);

      // If clicking the same image, deselect it (remove from pending)
      if (existing?.model === model && existing?.version === version) {
        newMap.delete(entityId);
      } else {
        // Otherwise, select this image
        newMap.set(entityId, { model, version });
      }

      return newMap;
    });
  };

  const handleDeselect = async (entityId: string) => {
    setIsProcessing(true);
    try {
      await deselectImage(entityId);
      await refresh();
    } catch (err) {
      alert("Failed to deselect");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAll = async () => {
    if (pendingSelections.size === 0) return;

    setIsProcessing(true);
    try {
      // Call approve API for each pending selection
      await Promise.all(
        Array.from(pendingSelections.entries()).map(
          ([entityId, { model, version }]) =>
            approveImage(entityId, model, version),
        ),
      );

      setPendingSelections(new Map());
      await refresh();
    } catch (err) {
      alert("Some selections failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading entities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Error loading entities</p>
          <button
            onClick={refresh}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Floating confirm button */}
      {pendingSelections.size > 0 && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={handleConfirmAll}
            disabled={isProcessing}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold"
          >
            {isProcessing
              ? "Processing..."
              : `Confirm ${pendingSelections.size} Selection${pendingSelections.size > 1 ? "s" : ""}`}
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Image Cook</h1>
          <p className="mt-2 text-sm text-gray-600">
            Select your favorite entity images • Total: {entities.length} •
            Selected: {selectionsCount}
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div
          data-testid="entity-list"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {entities.map((entity) => {
            const pending = pendingSelections.get(entity.id);
            const hasSelection = !!entity.selectedImage;

            return (
              <EntityCard
                key={entity.id}
                entity={entity}
                pendingSelection={pending}
                onToggleSelect={(model, version) =>
                  handleToggleSelect(entity.id, model, version, hasSelection)
                }
                onDeselect={() => handleDeselect(entity.id)}
              />
            );
          })}
        </div>
      </main>
    </>
  );
}
