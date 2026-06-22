import Link from "next/link";
import { ScanText } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-950">
          <span className="grid size-9 place-items-center rounded-xl bg-blue-600 text-white">
            <ScanText className="size-5" />
          </span>
          CaptureFlow AI
        </Link>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Local MVP</span>
      </div>
    </header>
  );
}
