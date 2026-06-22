import { MarkdownPreview } from "./MarkdownPreview";
import type { SummaryResult } from "@/types/summary";

export function SummaryPanel({ result }: { result?: SummaryResult }) {
  if (!result) return <p className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">AI 정리를 실행하면 요약과 Markdown 문서가 표시됩니다.</p>;
  return (
    <div className="space-y-6">
      <div><p className="text-xs font-bold uppercase tracking-widest text-blue-600">Generated notes</p><h2 className="mt-2 text-2xl font-bold text-slate-950">{result.title}</h2><p className="mt-3 leading-7 text-slate-600">{result.summary}</p></div>
      <div className="grid gap-3 sm:grid-cols-2">{result.keyPoints.map((point) => <div key={point} className="rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-700">{point}</div>)}</div>
      <MarkdownPreview markdown={result.markdown} />
    </div>
  );
}
