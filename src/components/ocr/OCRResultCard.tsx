import { Clock3, FileText } from "lucide-react";
import type { UploadedImage } from "@/types/image";
import type { OCRResult } from "@/types/ocr";

export function OCRResultCard({ image, result }: { image: UploadedImage; result: OCRResult }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900"><FileText className="size-4 text-blue-600" />{image.name}</h3>
        {typeof result.confidence === "number" && <span className="text-xs text-slate-500">신뢰도 {result.confidence.toFixed(0)}%</span>}
      </div>
      {result.detectedTimestamps.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {result.detectedTimestamps.map((timestamp) => <span key={timestamp} className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700"><Clock3 className="size-3" />{timestamp}</span>)}
        </div>
      )}
      <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap font-sans text-sm leading-6 text-slate-700">{result.cleanedText || "인식된 텍스트가 없습니다."}</pre>
    </article>
  );
}
