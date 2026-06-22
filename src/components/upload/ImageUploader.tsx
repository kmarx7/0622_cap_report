"use client";

import { useDropzone } from "react-dropzone";
import { ImagePlus, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ImageUploaderProps = {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
};

export function ImageUploader({ onFiles, disabled }: ImageUploaderProps) {
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] },
    multiple: true,
    disabled,
    onDropAccepted: onFiles,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "group cursor-pointer rounded-2xl border-2 border-dashed px-6 py-12 text-center transition",
          isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/60",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <input {...getInputProps()} />
        <span className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-white text-blue-600 shadow-sm">
          <ImagePlus className="size-6" />
        </span>
        <p className="font-semibold text-slate-900">이미지를 끌어놓거나 클릭해 선택하세요</p>
        <p className="mt-2 text-sm text-slate-500">JPG, PNG, WEBP · 여러 장 동시 업로드 가능</p>
        <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
          <ShieldCheck className="size-4" /> 브라우저 안에서만 처리됩니다
        </p>
      </div>
      {fileRejections.length > 0 && <p className="mt-2 text-sm text-red-600">지원하지 않는 파일이 제외되었습니다.</p>}
    </div>
  );
}
