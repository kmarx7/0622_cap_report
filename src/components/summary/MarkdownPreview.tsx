export function MarkdownPreview({ markdown }: { markdown: string }) {
  return <pre className="max-h-[520px] overflow-auto rounded-xl bg-slate-950 p-5 whitespace-pre-wrap text-sm leading-6 text-slate-100">{markdown}</pre>;
}
