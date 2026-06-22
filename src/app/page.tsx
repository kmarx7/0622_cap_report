import Link from "next/link";
import { ArrowRight, Images, ScanText, Sparkles, ShieldCheck } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";

const features = [
  { icon: Images, title: "이미지 업로드", description: "여러 장의 스크린샷을 한 번에 올리고 원하는 순서로 간단히 정렬하세요." },
  { icon: ScanText, title: "OCR 문자 추출", description: "한글과 영문, 영상 타임스탬프를 브라우저에서 안전하게 추출합니다." },
  { icon: Sparkles, title: "AI 시간순 정리", description: "겹치는 내용을 정제하고 흐름이 있는 Markdown 문서로 변환합니다." },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0,transparent_42%)]">
      <AppHeader />
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-20 text-center sm:px-6 sm:pt-28">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm"><ShieldCheck className="size-4" />이미지는 브라우저 밖으로 전송되지 않습니다</div>
        <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">캡처 이미지를<br /><span className="text-blue-600">시간순 AI 노트로</span></h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">여러 장의 스크린샷을 업로드하면 이미지 속 문자와 자막을 추출하고, AI가 정리된 문서로 변환합니다.</p>
        <Link href="/app" className="mt-9 inline-flex h-13 items-center gap-2 rounded-xl bg-blue-600 px-7 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">시작하기 <ArrowRight className="size-5" /></Link>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-4 pb-24 sm:px-6 md:grid-cols-3">
        {features.map(({ icon: Icon, title, description }, index) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-start justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-600"><Icon className="size-6" /></span><span className="text-sm font-bold text-slate-300">0{index + 1}</span></div>
            <h2 className="mt-6 text-lg font-bold text-slate-950">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
