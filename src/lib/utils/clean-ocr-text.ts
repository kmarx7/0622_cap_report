import { extractTimestamps } from "./extract-timestamps";

/** Normalizes OCR noise and removes repeated or non-informative lines. */
export function cleanOCRText(text: string): string {
  const seen = new Set<string>();

  return text
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/[\t ]+/g, " ").trim())
    .filter((line) => {
      if (!line || (line.length < 2 && extractTimestamps(line).length === 0)) return false;
      const key = line.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join("\n")
    .trim();
}

/** Removes timestamp labels so summaries focus on the surrounding content. */
export function removeTimestamps(text: string): string {
  return extractTimestamps(text)
    .reduce((result, timestamp) => result.replaceAll(timestamp, ""), text)
    .replace(/[\t ]+/g, " ")
    .replace(/^\s+|\s+$/gm, "")
    .trim();
}
