"use client";

import Image from "next/image";
import { DndContext, closestCenter, type DragEndEvent, PointerSensor, KeyboardSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UploadedImage } from "@/types/image";

type SortableImageListProps = {
  images: UploadedImage[];
  onReorder: (activeId: string, overId: string) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
};

function SortableImage({ image, index, onRemove, disabled }: { image: UploadedImage; index: number; onRemove: (id: string) => void; disabled?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id, disabled });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 rounded-xl border bg-white p-3 ${isDragging ? "z-10 border-blue-400 shadow-lg" : "border-slate-200"}`}
    >
      <button type="button" aria-label={`${image.name} 순서 변경`} className="cursor-grab touch-none text-slate-400 active:cursor-grabbing" {...attributes} {...listeners}>
        <GripVertical className="size-5" />
      </button>
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{index + 1}</span>
      <Image src={image.previewUrl} alt={image.name} width={64} height={64} unoptimized className="size-16 rounded-lg object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">{image.name}</p>
        <p className="mt-1 text-xs text-slate-500">{(image.file.size / 1024 / 1024).toFixed(2)} MB</p>
      </div>
      <Button type="button" variant="ghost" size="sm" aria-label={`${image.name} 삭제`} onClick={() => onRemove(image.id)} disabled={disabled}>
        <Trash2 className="size-4" />
      </Button>
    </li>
  );
}

export function SortableImageList({ images, onReorder, onRemove, disabled }: SortableImageListProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) onReorder(String(active.id), String(over.id));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images.map((image) => image.id)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-2">
          {images.map((image, index) => <SortableImage key={image.id} image={image} index={index} onRemove={onRemove} disabled={disabled} />)}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
