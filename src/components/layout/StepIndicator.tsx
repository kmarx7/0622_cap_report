import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const steps = ["Upload", "Arrange", "Extract", "Organize", "Export"];

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <nav aria-label="진행 단계" className="w-full max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white px-3 py-4 shadow-sm sm:max-w-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:shadow-none">
      <ol className="relative grid w-full min-w-0 grid-cols-5 items-start">
        <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-4 h-px bg-slate-200" />
        {steps.map((step, index) => {
          const number = index + 1;
          const completed = number < currentStep;
          const active = number === currentStep;
          return (
            <li key={step} className="relative flex min-w-0 justify-center">
              <div className="flex min-w-0 flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full border text-xs font-bold",
                    completed && "border-blue-600 bg-blue-600 text-white",
                    active && "border-blue-600 bg-blue-50 text-blue-700",
                    !completed && !active && "border-slate-200 bg-white text-slate-400",
                  )}
                >
                  {completed ? <Check className="size-4" /> : number}
                </span>
                <span className={cn("text-[10px] font-semibold sm:text-sm sm:font-medium", active ? "text-blue-700" : "text-slate-500")}>{step}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
