"use client";

import { useState } from "react";
import Image from "next/image";
import type { EntityTrackingDoc, GeneratedImage } from "@image-cook/shared";
import { ImageThumbnail } from "./ImageThumbnail";

interface Props {
  entity: EntityTrackingDoc;
  pendingSelection?: { model: string; version: number };
  onToggleSelect: (model: string, version: number) => void;
  onDeselect: () => void;
}

export function EntityCard({
  entity,
  pendingSelection,
  onToggleSelect,
  onDeselect,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(!entity.selectedImage);
  const hasSelection = !!entity.selectedImage;

  return (
    <div
      className={`border border-gray-300 rounded-lg p-4 bg-white shadow-sm`}
      data-testid="entity-card"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{entity.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{entity.description}</p>
        </div>
        {hasSelection && (
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
            ✓ Selected
          </span>
        )}
      </div>

      {/* Collapsed: show winner */}
      {hasSelection && !isExpanded && entity.selectedImage && (
        <div className="mt-3">
          <div className="relative w-32 h-32 rounded-lg border-2 border-green-500 overflow-hidden">
            <Image
              src={`${entity.selectedImage.url}${entity.selectedImage.url.includes("?") ? "&" : "?"}cb=${entity.id}-${entity.selectedImage.model}-${entity.selectedImage.version}`}
              alt={entity.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100px, 128px"
            />
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            View all variations
          </button>
        </div>
      )}

      {/* Expanded: show all variations */}
      {isExpanded && (
        <>
          {hasSelection && (
            <button
              onClick={() => setIsExpanded(false)}
              className="mb-3 text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Collapse
            </button>
          )}

          <div className="grid grid-cols-2 gap-3">
            {entity.generatedImages.map((img: GeneratedImage) => {
              // Check if this image is selected (either saved or pending)
              const isPendingSelected =
                pendingSelection?.model === img.model &&
                pendingSelection?.version === img.version;
              const isSavedSelected =
                entity.selectedImage?.model === img.model &&
                entity.selectedImage?.version === img.version;

              return (
                <ImageThumbnail
                  key={`${img.model}-v${img.version}`}
                  image={img}
                  isPendingSelected={isPendingSelected}
                  isSavedSelected={isSavedSelected}
                  onClick={() => onToggleSelect(img.model, img.version)}
                />
              );
            })}
          </div>

          {hasSelection && (
            <button
              onClick={onDeselect}
              className="mt-4 w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm font-medium"
            >
              Select Again
            </button>
          )}
        </>
      )}
    </div>
  );
}
