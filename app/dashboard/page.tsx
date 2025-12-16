"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { TransactionTable } from "@/components/TransactionTable";
import { ExtractionCharts } from "@/components/ExtractionCharts";
import { Button } from "@/components/Button";
import { ExtractionResult } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Upload, Download, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();
    const [data, setData] = useState<ExtractionResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load data from local storage
        const stored = localStorage.getItem('extractionResult');
        if (stored) {
            try {
                setData(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse data", e);
            }
        }
        setLoading(false);
    }, []);

    const handleExport = () => {
        if (!data) return;
        const csvContent = "data:text/csv;charset=utf-8,"
            + "No,Bank,Description,Type,Amount\n"
            + data.transactions.map(r => `${r.no},${r.bank},"${r.description}",${r.type},${r.amount}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "mutation_extraction.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!loading && !data) {
        return (
            <div className="min-h-screen bg-page">
                <Header />
                <main className="container mx-auto px-4 py-12 text-center">
                    <h2 className="text-xl font-semibold mb-4">No extraction data found</h2>
                    <Button onClick={() => router.push('/')}>Go to Upload</Button>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-page pb-20 font-sans">
            <Header />

            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Top Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
                        <p className="text-text-secondary text-sm mt-1">
                            {loading ? "Loading data..." : `Last extracted: ${new Date(data?.summary.lastUploaded || Date.now()).toLocaleString()}`}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" className="bg-white border border-border" onClick={handleExport} disabled={loading || !data}>
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                        <Button onClick={() => router.push('/')}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload New File
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Transactions"
                        value={data?.summary.totalTransactions.toString() || "0"}
                        loading={loading}
                        icon={<div className="p-2 bg-blue-50 rounded-lg text-primary"><Upload className="h-4 w-4 rotate-90" /></div>}
                    />
                    <StatsCard
                        title="Net Amount"
                        value={formatCurrency(data?.summary.netAmount || 0)}
                        loading={loading}
                        subValue="Credit - Debit"
                        icon={<div className="p-2 bg-purple-50 rounded-lg text-purple-600"><ArrowUpRight className="h-4 w-4" /></div>}
                    />
                    <StatsCard
                        title="Total Credit"
                        value={formatCurrency(data?.summary.totalCredit || 0)}
                        loading={loading}
                        badge="Credit"
                        badgeColor="Credit"
                        icon={<div className="p-2 bg-green-50 rounded-lg text-success"><ArrowUpRight className="h-4 w-4" /></div>}
                    />
                    <StatsCard
                        title="Total Debit"
                        value={formatCurrency(data?.summary.totalDebit || 0)}
                        loading={loading}
                        badge="Debit"
                        badgeColor="Debit"
                        icon={<div className="p-2 bg-red-50 rounded-lg text-error"><ArrowDownLeft className="h-4 w-4" /></div>}
                    />
                </div>

                {/* Charts Section */}
                {data && <ExtractionCharts banks={data.summary.banks} />}

                {/* Table Section */}
                {data && <TransactionTable data={data.transactions} />}

            </main>
        </div>
    );
}
