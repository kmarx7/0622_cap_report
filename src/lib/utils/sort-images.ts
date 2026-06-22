import type { UploadedImage } from "@/types/image";

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
