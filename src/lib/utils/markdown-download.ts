/** Downloads Markdown in the browser without uploading content to a server. */
export function downloadMarkdown(markdown: string, filename = "captureflow-notes.md"): void {
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
