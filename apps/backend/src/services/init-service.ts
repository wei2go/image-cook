import { normaliseEntityName } from '@image-cook/shared';
import { firestoreService } from './firestore-service';
import { listFiles, getPublicUrl } from './storage-manager';
import type { EntityData, EntityTrackingDoc } from '@image-cook/shared';

export async function initEntitiesFromStorage(
  entityData: EntityData[],
  category: string
): Promise<EntityTrackingDoc[]> {
  const files = await listFiles(`generated/${category}/`);
  const entities: EntityTrackingDoc[] = [];

  for (const data of entityData) {
    const normalisedName = normaliseEntityName(data.name);

    // Match pattern: {normalisedName}-{model}-v{version}.png
    const pattern = new RegExp(`${normalisedName}-(\\w+)-v(\\d+)\\.png$`);
    const generatedImages = files
      .filter(f => pattern.test(f))
      .map(storagePath => {
        const match = storagePath.match(pattern)!;
        return {
          url: getPublicUrl(storagePath),
          model: match[1],
          version: parseInt(match[2]),
          storagePath
        };
      });

    const entity: EntityTrackingDoc = {
      id: normalisedName,
      name: data.name,
      description: data.description,
      category,
      generatedImages,
      selectedImage: null,
      lastUpdated: new Date().toISOString()
    };

    await firestoreService.createEntity(normalisedName, entity);
    entities.push(entity);
  }

  return entities;
}
