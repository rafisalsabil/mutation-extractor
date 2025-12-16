import Link from "next/link";
import { Button } from "./Button";
import { LayoutDashboard } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
                        M
                    </div>
                    <span className="hidden sm:inline-block tracking-tight">Mutation Extractor</span>
                </Link>

                <nav className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
