import { firestoreService } from './firestore-service';
import { downloadFile, uploadWinnerImage, deleteFile } from './storage-manager';
import { compressImageToJpeg } from '../utils/image-processing';
import type { SelectedImage } from '@image-cook/shared';

export async function approveImage(
  entityId: string,
  model: string,
  version: number
): Promise<SelectedImage> {
  const entity = await firestoreService.getEntity(entityId);
  if (!entity) throw new Error('Entity not found');

  const genImage = entity.generatedImages.find(
    img => img.model === model && img.version === version
  );
  if (!genImage) throw new Error('Generated image not found');

  // Download, compress, upload
  const buffer = await downloadFile(genImage.storagePath);
  const compressed = await compressImageToJpeg(buffer);
  const { storagePath, publicUrl } = await uploadWinnerImage(
    compressed,
    entity.name,
    entity.category
  );

  const selectedImage: SelectedImage = {
    url: publicUrl,
    model,
    version,
    storagePath
  };

  await firestoreService.updateEntity(entityId, {
    selectedImage,
    lastUpdated: new Date().toISOString()
  });

  return selectedImage;
}

export async function deselectImage(entityId: string): Promise<void> {
  const entity = await firestoreService.getEntity(entityId);
  if (!entity?.selectedImage) return;

  await deleteFile(entity.selectedImage.storagePath);
  await firestoreService.updateEntity(entityId, {
    selectedImage: null,
    lastUpdated: new Date().toISOString()
  });
}
