export type UploadedImage = {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  uploadOrder: number;
  detectedTimestamp?: string;
  userOrder: number;
};
