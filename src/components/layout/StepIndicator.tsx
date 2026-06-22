import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const steps = ["Upload", "Arrange", "Extract", "Organize", "Export"];

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <nav aria-label="진행 단계" className="overflow-x-auto pb-2">
      <ol className="flex min-w-[560px] items-center">
        {steps.map((step, index) => {
          const number = index + 1;
          const completed = number < currentStep;
          const active = number === currentStep;
          return (
            <li key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-full border text-xs font-bold",
                    completed && "border-blue-600 bg-blue-600 text-white",
                    active && "border-blue-600 bg-blue-50 text-blue-700",
                    !completed && !active && "border-slate-200 bg-white text-slate-400",
                  )}
                >
                  {completed ? <Check className="size-4" /> : number}
                </span>
                <span className={cn("text-sm font-medium", active ? "text-blue-700" : "text-slate-500")}>{step}</span>
              </div>
              {number < steps.length && <span className={cn("mx-3 h-px flex-1", completed ? "bg-blue-500" : "bg-slate-200")} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
