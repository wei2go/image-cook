export interface GeneratedImage {
  url: string;
  model: string;
  version: number;
  storagePath: string;
}

export interface SelectedImage {
  url: string;
  model: string;
  version: number;
  storagePath: string;
}

export interface EntityTrackingDoc {
  id: string;
  name: string;
  description: string;
  category: string;
  generatedImages: GeneratedImage[];
  selectedImage: SelectedImage | null;
  lastUpdated: string;
}

export interface EntityData {
  id: number;
  name: string;
  description: string;
}
