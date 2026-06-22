import { removeTimestamps } from "@/lib/utils/clean-ocr-text";
import type { Summarizer } from "./summarizer";
import type { SummarizeInput, SummarizeOutput } from "@/types/summary";

const MODE_LABELS = {
  lecture: "강의",
  meeting: "회의",
  general: "캡처",
  evidence: "자료",
} as const;

function firstSentence(text: string): string {
  return text.split(/[.!?。\n]/).find((part) => part.trim().length > 1)?.trim() ?? text.trim();
}

export class MockSummarizer implements Summarizer {
  readonly name = "Mock summarizer";

  /** Builds deterministic notes locally so the complete MVP works without API keys. */
  async summarize(input: SummarizeInput): Promise<SummarizeOutput> {
    const usableItems = input.items.filter((item) => item.text.trim());
    if (usableItems.length === 0) throw new Error("정리할 OCR 텍스트가 없습니다.");

    const timeline = usableItems.map((item, index) => {
      const content = removeTimestamps(item.text) || item.text;
      return {
        timestamp: item.timestamp,
        title: firstSentence(content).slice(0, 48) || `캡처 ${index + 1}`,
        content,
      };
    });
    const keyPoints = [...new Set(timeline.map((item) => firstSentence(item.content)).filter(Boolean))].slice(0, 7);
    const title = `${MODE_LABELS[input.mode]} 내용 정리`;
    const summary = `${usableItems.length}장의 캡처에서 추출한 내용을 순서대로 정리했습니다. 주요 흐름은 ${keyPoints.slice(0, 3).join(", ")}입니다.`;
    const fullNotes = timeline.map((item) => item.content).join("\n\n");
    const timelineMarkdown = timeline
      .map((item, index) => `### ${item.timestamp ?? `항목 ${index + 1}`}\n\n**${item.title}**\n\n${item.content}`)
      .join("\n\n");
    const markdown = `# ${title}\n\n## 전체 요약\n\n${summary}\n\n## 시간순 정리\n\n${timelineMarkdown}\n\n## 핵심 포인트\n\n${keyPoints.map((point) => `- ${point}`).join("\n")}\n\n## 전체 정리본\n\n${fullNotes}\n`;

    return { title, summary, timeline, keyPoints, fullNotes, markdown };
  }
}
