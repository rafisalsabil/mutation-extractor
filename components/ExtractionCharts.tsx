import { BankStats } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";

interface ExtractionChartsProps {
    banks: BankStats[];
}

export function ExtractionCharts({ banks }: ExtractionChartsProps) {
    // Simple CSS implementation of charts
    const totalVolume = banks.reduce((a, b) => a + b.txCount, 0);
    const maxAmount = Math.max(...banks.flatMap(b => [b.creditAmount, b.debitAmount]));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Donut Representation (using stacked bar as simpler proxy or custom CSS pie) */}
            <Card>
                <CardHeader>
                    <CardTitle>Share of Transactions by Bank</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mt-4 space-y-4">
                        <div className="flex h-6 w-full rounded-full overflow-hidden">
                            {banks.map((bank, i) => {
                                const width = (bank.txCount / totalVolume) * 100;
                                const colors = ['bg-blue-500', 'bg-blue-400', 'bg-indigo-500', 'bg-sky-500'];
                                return (
                                    <div
                                        key={bank.name}
                                        style={{ width: `${width}%` }}
                                        className={`${colors[i % colors.length]} hover:opacity-80 transition-opacity relative group`}
                                    >
                                    </div>
                                )
                            })}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {banks.map((bank, i) => {
                                const colors = ['bg-blue-500', 'bg-blue-400', 'bg-indigo-500', 'bg-sky-500'];
                                return (
                                    <div key={bank.name} className="flex items-center gap-2">
                                        <div className={`h-3 w-3 rounded-full ${colors[i % colors.length]}`} />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-text-primary">{bank.name}</span>
                                            <span className="text-xs text-text-secondary">{((bank.txCount / totalVolume) * 100).toFixed(0)}% ({bank.txCount})</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Chart 2: Stacked Bar (Credit vs Debit) */}
            <Card>
                <CardHeader>
                    <CardTitle>Credit vs Debit by Bank</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 mt-2">
                        {banks.map(bank => {
                            const totalForBank = bank.creditAmount + bank.debitAmount;
                            const creditPct = (bank.creditAmount / maxAmount) * 100; // Relative to max for scaling bar
                            const debitPct = (bank.debitAmount / maxAmount) * 100;

                            return (
                                <div key={bank.name} className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="font-medium text-text-primary">{bank.name}</span>
                                    </div>
                                    <div className="flex h-3 gap-1">
                                        {/* Credit Bar */}
                                        <div
                                            style={{ width: `${Math.max(creditPct, 1)}%` }}
                                            className="bg-success rounded-sm opacity-90 hover:opacity-100 transition-all"
                                            title={`Credit: ${formatCurrency(bank.creditAmount)}`}
                                        />
                                        {/* Debit Bar */}
                                        <div
                                            style={{ width: `${Math.max(debitPct, 1)}%` }}
                                            className="bg-error rounded-sm opacity-90 hover:opacity-100 transition-all"
                                            title={`Debit: ${formatCurrency(bank.debitAmount)}`}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-text-secondary">
                                        <span>{formatCurrency(bank.creditAmount)}</span>
                                        <span>{formatCurrency(bank.debitAmount)}</span>
                                    </div>
                                </div>
                            )
                        })}
                        <div className="flex items-center gap-4 mt-2 justify-end">
                            <div className="flex items-center gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-success" />
                                <span className="text-xs text-text-secondary">Credit</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-error" />
                                <span className="text-xs text-text-secondary">Debit</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
