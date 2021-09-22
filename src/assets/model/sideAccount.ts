import { Transaction } from './transaction';

export interface SideAccount{
    _id?: string;
    accountName: string;
    previousBalance: number;
    finalBalance: number;
    previousId?: string;
    month: number;
    year: number;
    transactions : string[]; //Transaction id array
}

export interface SideAccountDTO{
    _id?: string;
    accountName: string;
    previousId?: string;
    finalBalance?: number;
    month: number;
    year: number;
    transactions : Transaction[];
}