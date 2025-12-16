import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepsProps {
    currentStep: number;
    steps: string[];
}

export function Steps({ currentStep, steps }: StepsProps) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 w-full h-[2px] bg-slate-100 -z-10" />
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isPending = index > currentStep;

                    return (
                        <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                            <div
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300",
                                    isCompleted && "border-primary bg-primary text-white",
                                    isCurrent && "border-primary text-primary",
                                    isPending && "border-slate-200 text-slate-300"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <span className="text-sm font-medium">{index + 1}</span>
                                )}
                            </div>
                            <span className={cn(
                                "hidden sm:block text-xs font-medium uppercase tracking-wider transition-colors duration-300",
                                (isCompleted || isCurrent) ? "text-primary" : "text-slate-300"
                            )}>
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
