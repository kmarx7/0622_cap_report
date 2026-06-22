import type { SummarizeInput, SummarizeOutput } from "@/types/summary";

export interface Summarizer {
  readonly name: string;
  summarize(input: SummarizeInput): Promise<SummarizeOutput>;
}

// TODO: Add server-side OpenAI, Claude, and Gemini summarizer providers.
