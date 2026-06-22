export type TimelineItem = {
  imageId: string;
  order: number;
  timestamp?: string;
  text: string;
};

export type SummaryMode = "lecture" | "meeting" | "general" | "evidence";

export type SummarizeInput = {
  items: TimelineItem[];
  mode: SummaryMode;
};

export type SummaryResult = {
  title: string;
  summary: string;
  timeline: {
    timestamp?: string;
    title: string;
    content: string;
  }[];
  keyPoints: string[];
  fullNotes: string;
  markdown: string;
};

export type SummarizeOutput = SummaryResult;
