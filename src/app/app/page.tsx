"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownNarrowWide, Copy, Download, LoaderCircle, ScanText, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { StepIndicator } from "@/components/layout/StepIndicator";
import { OCRPanel } from "@/components/ocr/OCRPanel";
import { SummaryPanel } from "@/components/summary/SummaryPanel";
import { ImagePreviewList } from "@/components/upload/ImagePreviewList";
import { ImageUploader } from "@/components/upload/ImageUploader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MockSummarizer } from "@/lib/ai/mock-summarizer";
import { TesseractOCRProvider } from "@/lib/ocr/tesseract-provider";
import { downloadMarkdown } from "@/lib/utils/markdown-download";
import { autoSortImages, reorderImages, sortImages } from "@/lib/utils/sort-images";
import type { UploadedImage } from "@/types/image";
import type { OCRProgress, OCRResult } from "@/types/ocr";
import type { SummaryMode, SummaryResult, TimelineItem } from "@/types/summary";

const modes: { value: SummaryMode; label: string }[] = [
  { value: "general", label: "일반 정리" },
  { value: "lecture", label: "강의" },
  { value: "meeting", label: "회의" },
  { value: "evidence", label: "자료" },
];

export default function WorkspacePage() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [results, setResults] = useState<Record<string, OCRResult>>({});
  const [summary, setSummary] = useState<SummaryResult>();
  const [mode, setMode] = useState<SummaryMode>("general");
  const [progress, setProgress] = useState<OCRProgress>();
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [message, setMessage] = useState<string>();
  const imagesRef = useRef(images);

  useEffect(() => { imagesRef.current = images; }, [images]);
  useEffect(() => () => imagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl)), []);

  const orderedImages = useMemo(() => sortImages(images), [images]);
  const currentStep = summary ? 5 : Object.keys(results).length > 0 ? 4 : images.length > 0 ? 2 : 1;

  const addFiles = (files: File[]) => {
    setImages((current) => {
      const offset = current.length;
      const added = files.map((file, index): UploadedImage => ({
        id: crypto.randomUUID(), file, name: file.name, previewUrl: URL.createObjectURL(file), uploadOrder: offset + index, userOrder: offset + index,
      }));
      return [...current, ...added];
    });
    setSummary(undefined);
    setMessage(undefined);
  };

  const removeImage = (id: string) => {
    setImages((current) => {
      const target = current.find((image) => image.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((image) => image.id !== id).map((image, userOrder) => ({ ...image, userOrder }));
    });
    setResults((current) => { const next = { ...current }; delete next[id]; return next; });
    setSummary(undefined);
  };

  const handleReorder = (activeId: string, overId: string) => {
    setImages((current) => reorderImages(current, activeId, overId));
    setSummary(undefined);
  };

  const handleAutoSort = () => {
    setImages((current) => autoSortImages(current, results));
    setSummary(undefined);
    setMessage(
      Object.keys(results).length > 0
        ? "이미지 속 시간, 파일명, 파일 수정 시각 순으로 자동 정렬했습니다."
        : "파일명과 파일 수정 시각을 기준으로 자동 정렬했습니다. OCR 후 다시 실행하면 이미지 속 시간을 우선 적용합니다.",
    );
  };

  const runOCR = async () => {
    setIsExtracting(true); setMessage(undefined); setSummary(undefined);
    const provider = new TesseractOCRProvider();
    const nextResults: Record<string, OCRResult> = {};
    try {
      // Sequential processing keeps browser memory predictable for large image batches.
      for (const image of orderedImages) {
        setProgress({ imageId: image.id, progress: 0, status: "준비 중" });
        nextResults[image.id] = await provider.recognize(image.id, image.file, setProgress);
        setResults({ ...nextResults });
      }
      setImages((current) => autoSortImages(current, nextResults));
      setMessage(`${orderedImages.length}개 이미지의 텍스트 추출과 시간순 자동 정렬을 완료했습니다.`);
    } catch (error) {
      setMessage(error instanceof Error ? `OCR 오류: ${error.message}` : "OCR 처리 중 오류가 발생했습니다.");
    } finally { setIsExtracting(false); setProgress(undefined); }
  };

  const runSummary = async () => {
    setIsSummarizing(true); setMessage(undefined);
    try {
      const items: TimelineItem[] = orderedImages.flatMap((image, order) => {
        const result = results[image.id];
        return result ? [{ imageId: image.id, order, timestamp: result.detectedTimestamps[0], text: result.cleanedText }] : [];
      });
      setSummary(await new MockSummarizer().summarize({ items, mode }));
      setMessage("정리된 문서를 만들었습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "문서 정리 중 오류가 발생했습니다.");
    } finally { setIsSummarizing(false); }
  };

  const copyMarkdown = async () => {
    if (!summary) return;
    try { await navigator.clipboard.writeText(summary.markdown); setMessage("Markdown을 클립보드에 복사했습니다."); }
    catch { setMessage("복사 권한을 확인해 주세요."); }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50">
      <AppHeader />
      <div className="mx-auto w-full min-w-0 max-w-7xl px-3 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-6 sm:px-6 sm:py-8">
        <div className="mb-6 px-1 sm:mb-8 sm:px-0"><p className="text-sm font-bold text-blue-600">Capture workspace</p><h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">캡처 문서 만들기</h1><p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">이미지를 올리고 순서를 확인한 뒤 텍스트를 추출하세요.</p></div>
        <StepIndicator currentStep={currentStep} />
        {message && <div role="status" className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">{message}</div>}

        <div className="mt-6 grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="min-w-0 space-y-6">
            <Card className="p-4 sm:p-6"><div className="mb-5"><h2 className="text-lg font-bold">1. 이미지 업로드</h2><p className="mt-1 text-sm text-slate-500">캡처 파일은 서버에 저장되지 않습니다.</p></div><ImageUploader onFiles={addFiles} disabled={isExtracting} /></Card>
            <Card className="p-4 sm:p-6">
              <div className="mb-4 flex items-start justify-between gap-3"><div><h2 className="text-lg font-bold">2. 순서 정하기</h2><p className="mt-1 text-sm leading-5 text-slate-500">자동 정렬 후 핸들을 드래그해 순서를 보정하세요.</p></div><span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{images.length}장</span></div>
              <Button className="mb-4 w-full" type="button" variant="secondary" onClick={handleAutoSort} disabled={images.length < 2 || isExtracting}>
                <ArrowDownNarrowWide className="size-4" />시간순 자동 정렬
              </Button>
              {images.length > 0 ? <ImagePreviewList images={orderedImages} onReorder={handleReorder} onRemove={removeImage} disabled={isExtracting} /> : <p className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">업로드한 이미지가 없습니다.</p>}
              <Button className="mt-5 w-full" size="lg" onClick={runOCR} disabled={images.length === 0 || isExtracting}>
                {isExtracting ? <><LoaderCircle className="size-5 animate-spin" />OCR 처리 중 {progress ? `${Math.round(progress.progress * 100)}%` : ""}</> : <><ScanText className="size-5" />OCR 실행</>}
              </Button>
              {isExtracting && progress && <p className="mt-2 truncate text-center text-xs text-slate-500">{orderedImages.find((image) => image.id === progress.imageId)?.name} · {progress.status}</p>}
            </Card>
          </div>

          <div className="min-w-0 space-y-6">
            <Card className="p-4 sm:p-6"><div className="mb-5"><h2 className="text-lg font-bold">3. OCR 결과</h2><p className="mt-1 text-sm text-slate-500">감지한 시간 정보와 정제된 텍스트입니다.</p></div><OCRPanel images={orderedImages} results={results} /></Card>
            <Card className="p-4 sm:p-6">
              <div className="mb-5"><h2 className="text-lg font-bold">4. AI 문서 정리</h2><p className="mt-1 text-sm text-slate-500">현재는 API 키가 필요 없는 로컬 mock summarizer를 사용합니다.</p></div>
              <div className="mb-4 flex flex-wrap gap-2">{modes.map((item) => <button key={item.value} type="button" onClick={() => setMode(item.value)} className={`rounded-full px-3 py-2 text-sm font-semibold transition ${mode === item.value ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{item.label}</button>)}</div>
              <Button className="w-full" size="lg" onClick={runSummary} disabled={Object.keys(results).length === 0 || isExtracting || isSummarizing}>{isSummarizing ? <LoaderCircle className="size-5 animate-spin" /> : <Sparkles className="size-5" />}AI 정리 실행</Button>
            </Card>
            <Card className="p-4 sm:p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-bold">5. 최종 결과</h2><p className="mt-1 text-sm text-slate-500">복사하거나 Markdown 파일로 저장하세요.</p></div><div className="grid grid-cols-2 gap-2 sm:flex"><Button className="w-full" variant="secondary" size="sm" onClick={copyMarkdown} disabled={!summary}><Copy className="size-4" />복사</Button><Button className="w-full" variant="secondary" size="sm" onClick={() => summary && downloadMarkdown(summary.markdown)} disabled={!summary}><Download className="size-4" />다운로드</Button></div></div>
              <SummaryPanel result={summary} />
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
