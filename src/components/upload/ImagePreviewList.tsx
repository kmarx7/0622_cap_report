import type { UploadedImage } from "@/types/image";
import { SortableImageList } from "./SortableImageList";

type ImagePreviewListProps = {
  images: UploadedImage[];
  onReorder: (activeId: string, overId: string) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
};

export function ImagePreviewList(props: ImagePreviewListProps) {
  return <SortableImageList {...props} />;
}
