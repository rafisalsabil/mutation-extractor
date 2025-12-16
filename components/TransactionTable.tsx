"use client";

import { useState } from "react";
// Table implementation using standard HTML tables for simplicity


// Re-writing without external table library for simplicity and robustness in this environment.

import { Transaction } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { ChevronLeft, ChevronRight, ArrowUpDown, Search } from "lucide-react";

interface TransactionTableProps {
    data: Transaction[];
}

export function TransactionTable({ data }: TransactionTableProps) {
    const [sortField, setSortField] = useState<keyof Transaction>('no');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [filterBank, setFilterBank] = useState<string>('All');
    const [filterType, setFilterType] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Derive unique banks
    const banks = Array.from(new Set(data.map(t => t.bank)));

    // Filter
    const filteredData = data.filter(item => {
        const matchesBank = filterBank === 'All' || item.bank === filterBank;
        const matchesType = filterType === 'All' || item.type === filterType;
        return matchesBank && matchesType;
    });

    // Sort
    const sortedData = [...filteredData].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    // Paginate
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const currentData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSort = (field: keyof Transaction) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <h3 className="text-lg font-semibold text-text-primary">Extracted Transactions</h3>
                <div className="flex gap-2">
                    <select
                        title="Filter by Bank"
                        className="h-9 rounded-md border border-input px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={filterBank}
                        onChange={(e) => { setFilterBank(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="All">All Banks</option>
                        {banks.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                    <select
                        title="Filter by Type"
                        className="h-9 rounded-md border border-input px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={filterType}
                        onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="All">All Types</option>
                        <option value="Credit">Credit</option>
                        <option value="Debit">Debit</option>
                    </select>
                </div>
            </div>

            <div className="rounded-xl border border-border bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#F8FAFC] text-text-secondary uppercase text-xs font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('no')}>
                                    <div className="flex items-center gap-1">No <ArrowUpDown className="h-3 w-3" /></div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('bank')}>
                                    <div className="flex items-center gap-1">Bank From <ArrowUpDown className="h-3 w-3" /></div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('type')}>
                                    <div className="flex items-center gap-1">Type <ArrowUpDown className="h-3 w-3" /></div>
                                </th>
                                <th className="px-6 py-4 text-right cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('amount')}>
                                    <div className="flex items-center justify-end gap-1">Amount <ArrowUpDown className="h-3 w-3" /></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {currentData.length > 0 ? currentData.map((row) => (
                                <tr key={row.no} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-text-secondary">{row.no}</td>
                                    <td className="px-6 py-4 font-medium text-text-primary">{row.bank}</td>
                                    <td className="px-6 py-4">
                                        <Badge type={row.type}>{row.type}</Badge>
                                    </td>
                                    <td className={cn(
                                        "px-6 py-4 text-right font-medium",
                                        row.type === 'Credit' ? 'text-success' : 'text-error'
                                    )}>
                                        {formatCurrency(row.amount)}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-text-secondary">
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-[#F8FAFC]">
                    <div className="text-xs text-text-secondary">
                        Showing <span className="font-medium">{currentData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, sortedData.length)}</span> of <span className="font-medium">{sortedData.length}</span> results
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
