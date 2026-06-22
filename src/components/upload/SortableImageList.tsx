"use client";

import Image from "next/image";
import { DndContext, closestCenter, type DragEndEvent, MouseSensor, TouchSensor, KeyboardSensor, useSensor, useSensors } from "@dnd-kit/core";
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
      className={`flex min-w-0 items-center gap-2 rounded-xl border bg-white p-2.5 sm:gap-3 sm:p-3 ${isDragging ? "z-10 border-blue-400 shadow-lg" : "border-slate-200"}`}
    >
      <button type="button" aria-label={`${image.name} 순서 변경`} className="grid size-11 shrink-0 touch-none place-items-center rounded-lg text-slate-400 hover:bg-slate-100 active:cursor-grabbing active:bg-blue-50 active:text-blue-600" {...attributes} {...listeners}>
        <GripVertical className="size-6" />
      </button>
      <span className="hidden size-7 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 min-[390px]:grid">{index + 1}</span>
      <Image src={image.previewUrl} alt={image.name} width={64} height={64} unoptimized className="size-12 shrink-0 rounded-lg object-cover sm:size-16" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">{image.name}</p>
        <p className="mt-0.5 text-xs text-slate-500 sm:mt-1">{index + 1}번째 · {(image.file.size / 1024 / 1024).toFixed(2)} MB</p>
      </div>
      <Button type="button" variant="ghost" size="sm" className="size-11 shrink-0 px-0" aria-label={`${image.name} 삭제`} onClick={() => onRemove(image.id)} disabled={disabled}>
        <Trash2 className="size-4" />
      </Button>
    </li>
  );
}

export function SortableImageList({ images, onReorder, onRemove, disabled }: SortableImageListProps) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
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
