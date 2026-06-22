import type { OCRProgress, OCRResult } from "@/types/ocr";

export type OCRProgressCallback = (progress: OCRProgress) => void;

export interface OCRProvider {
  readonly name: string;
  recognize(imageId: string, file: File, onProgress?: OCRProgressCallback): Promise<OCRResult>;
}
