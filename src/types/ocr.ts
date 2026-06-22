export type OCRResult = {
  imageId: string;
  rawText: string;
  cleanedText: string;
  detectedTimestamps: string[];
  confidence?: number;
};

export type OCRProgress = {
  imageId: string;
  progress: number;
  status: string;
};
