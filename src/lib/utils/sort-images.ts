import type { UploadedImage } from "@/types/image";
import type { OCRResult } from "@/types/ocr";

/** User order remains the MVP source of truth; automatic sorting can be added later. */
export function sortImages(images: UploadedImage[]): UploadedImage[] {
  return [...images].sort((a, b) => a.userOrder - b.userOrder);
}

export function reorderImages(images: UploadedImage[], activeId: string, overId: string): UploadedImage[] {
  const sorted = sortImages(images);
  const from = sorted.findIndex((image) => image.id === activeId);
  const to = sorted.findIndex((image) => image.id === overId);
  if (from < 0 || to < 0 || from === to) return sorted;
  const [moved] = sorted.splice(from, 1);
  sorted.splice(to, 0, moved);
  return sorted.map((image, userOrder) => ({ ...image, userOrder }));
}

type SortKey = {
  priority: number;
  value: number;
};

/** Converts OCR timestamps such as 01:23, 01:02:33, and 오후 3:45 into sortable values. */
function parseDetectedTimestamp(timestamp: string): number | undefined {
  const dateMatch = timestamp.match(/^(\d{4})[.-](\d{1,2})[.-](\d{1,2})$/);
  if (dateMatch) return Date.UTC(Number(dateMatch[1]), Number(dateMatch[2]) - 1, Number(dateMatch[3]));

  const meridiemMatch = timestamp.match(/^(오전|오후)\s*(\d{1,2}):(\d{2})$/);
  if (meridiemMatch) {
    const hour = Number(meridiemMatch[2]) % 12 + (meridiemMatch[1] === "오후" ? 12 : 0);
    return hour * 3600 + Number(meridiemMatch[3]) * 60;
  }

  const parts = timestamp.split(":").map(Number);
  if (parts.length === 3 && parts.every(Number.isFinite)) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2 && parts.every(Number.isFinite)) return parts[0] * 60 + parts[1];
  return undefined;
}

/** Reads common screenshot filename formats, including 20260622_093122 and 2026-06-22 09.31.22. */
function parseFilenameTimestamp(filename: string): number | undefined {
  const compact = filename.match(/(?:^|\D)(20\d{2})(\d{2})(\d{2})[ _.-]?(\d{2})?(\d{2})?(\d{2})?(?:\D|$)/);
  const separated = filename.match(/(?:^|\D)(20\d{2})[-_.](\d{1,2})[-_.](\d{1,2})(?:\D+(\d{1,2})[.:_-](\d{2})(?:[.:_-](\d{2}))?)?/);
  const match = compact ?? separated;
  if (!match) return undefined;

  const [, year, month, day, hour = "0", minute = "0", second = "0"] = match;
  const value = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second)).getTime();
  return Number.isNaN(value) ? undefined : value;
}

function automaticSortKey(image: UploadedImage, result?: OCRResult): SortKey {
  const detected = result?.detectedTimestamps
    .map(parseDetectedTimestamp)
    .find((value): value is number => value !== undefined);
  if (detected !== undefined) return { priority: 0, value: detected };

  const filenameTimestamp = parseFilenameTimestamp(image.name);
  if (filenameTimestamp !== undefined) return { priority: 1, value: filenameTimestamp };

  if (Number.isFinite(image.file.lastModified) && image.file.lastModified > 0) {
    return { priority: 2, value: image.file.lastModified };
  }
  return { priority: 3, value: image.uploadOrder };
}

/** Automatically orders captures while preserving user drag order as the final tie breaker. */
export function autoSortImages(images: UploadedImage[], results: Record<string, OCRResult>): UploadedImage[] {
  return [...images]
    .sort((a, b) => {
      const aKey = automaticSortKey(a, results[a.id]);
      const bKey = automaticSortKey(b, results[b.id]);
      return aKey.priority - bKey.priority || aKey.value - bKey.value || a.userOrder - b.userOrder;
    })
    .map((image, userOrder) => ({
      ...image,
      detectedTimestamp: results[image.id]?.detectedTimestamps[0],
      userOrder,
    }));
}
