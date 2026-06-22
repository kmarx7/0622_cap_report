import { createWorker, OEM } from "tesseract.js";
import { cleanOCRText } from "@/lib/utils/clean-ocr-text";
import { extractTimestamps } from "@/lib/utils/extract-timestamps";
import type { OCRProvider, OCRProgressCallback } from "./ocr-provider";
import type { OCRResult } from "@/types/ocr";

export class TesseractOCRProvider implements OCRProvider {
  readonly name = "Tesseract.js";

  /** Runs OCR locally in a Web Worker. The source image never leaves the browser. */
  async recognize(imageId: string, file: File, onProgress?: OCRProgressCallback): Promise<OCRResult> {
    const worker = await createWorker(["kor", "eng"], OEM.LSTM_ONLY, {
      logger: (message) => {
        onProgress?.({
          imageId,
          progress: typeof message.progress === "number" ? message.progress : 0,
          status: message.status,
        });
      },
    });

    try {
      const { data } = await worker.recognize(file);
      const cleanedText = cleanOCRText(data.text);
      return {
        imageId,
        rawText: data.text,
        cleanedText,
        detectedTimestamps: extractTimestamps(data.text),
        confidence: data.confidence,
      };
    } finally {
      await worker.terminate();
    }
  }
}

// TODO: Add Google Vision, Azure OCR, OpenAI Vision, and Gemini providers.
