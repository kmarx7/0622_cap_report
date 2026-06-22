import { OCRResultCard } from "./OCRResultCard";
import type { UploadedImage } from "@/types/image";
import type { OCRResult } from "@/types/ocr";

export function OCRPanel({ images, results }: { images: UploadedImage[]; results: Record<string, OCRResult> }) {
  if (Object.keys(results).length === 0) return <p className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">OCR을 실행하면 이미지별 추출 결과가 여기에 표시됩니다.</p>;
  return <div className="space-y-3">{images.map((image) => results[image.id] ? <OCRResultCard key={image.id} image={image} result={results[image.id]} /> : null)}</div>;
}
