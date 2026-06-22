const TIMESTAMP_PATTERNS = [
  /\b(?:[01]?\d|2[0-3]):[0-5]\d:[0-5]\d\b/g,
  /\b(?:[0-5]?\d):[0-5]\d\b/g,
  /\b\d{4}[.-](?:0?[1-9]|1[0-2])[.-](?:0?[1-9]|[12]\d|3[01])\b/g,
  /\b(?:오전|오후)\s*(?:0?[1-9]|1[0-2]):[0-5]\d\b/g,
];

/** Extracts supported video, clock, and date expressions without duplicates. */
export function extractTimestamps(text: string): string[] {
  const matches = TIMESTAMP_PATTERNS.flatMap((pattern) => text.match(pattern) ?? []);
  return [...new Set(matches)];
}
