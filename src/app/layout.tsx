import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CaptureFlow AI",
  description: "캡처 이미지를 시간순 AI 노트로 변환합니다.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
