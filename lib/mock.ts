import { ExtractionResult, Transaction, BankStats } from "@/types";

const BANKS = ['BCA', 'Mandiri', 'BNI', 'BRI'];

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateTransactions(count: number): Transaction[] {
    return Array.from({ length: count }).map((_, i) => {
        const isCredit = Math.random() > 0.4; // 60% credit
        const amount = randomInt(50000, 5000000);
        const bank = BANKS[randomInt(0, BANKS.length - 1)];

        return {
            no: i + 1,
            bank,
            amount,
            type: isCredit ? 'Credit' : 'Debit',
            date: new Date().toISOString(),
            description: `Transfer ${isCredit ? 'from' : 'to'} ${Math.random().toString(36).substring(7).toUpperCase()}`,
        };
    });
}

export function mockExtraction(): Promise<ExtractionResult> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const txs = generateTransactions(25);

            const totalCredit = txs.filter(t => t.type === 'Credit').reduce((acc, curr) => acc + curr.amount, 0);
            const totalDebit = txs.filter(t => t.type === 'Debit').reduce((acc, curr) => acc + curr.amount, 0);

            const bankStats: BankStats[] = BANKS.map(bank => {
                const bankTxs = txs.filter(t => t.bank === bank);
                return {
                    name: bank,
                    txCount: bankTxs.length,
                    creditAmount: bankTxs.filter(t => t.type === 'Credit').reduce((a, c) => a + c.amount, 0),
                    debitAmount: bankTxs.filter(t => t.type === 'Debit').reduce((a, c) => a + c.amount, 0),
                };
            }).filter(b => b.txCount > 0);

            resolve({
                summary: {
                    totalTransactions: txs.length,
                    totalCredit,
                    totalDebit,
                    netAmount: totalCredit - totalDebit,
                    lastUploaded: new Date().toISOString(),
                    banks: bankStats,
                },
                transactions: txs,
            });
        }, 2500); // Simulate processing time
    });
}
