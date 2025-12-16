export interface Transaction {
    no: number;
    bank: string;
    amount: number;
    type: 'Credit' | 'Debit';
    date: string;
    description: string;
}

export interface BankStats {
    name: string;
    txCount: number;
    creditAmount: number;
    debitAmount: number;
}

export interface ExtractionSummary {
    totalTransactions: number;
    totalCredit: number;
    totalDebit: number;
    netAmount: number;
    lastUploaded: string;
    banks: BankStats[];
}

export interface ExtractionResult {
    summary: ExtractionSummary;
    transactions: Transaction[];
}
