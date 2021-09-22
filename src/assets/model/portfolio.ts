export interface Portfolio{
    _id?: string;
    month: number;
    year: number;
    accountId: number[];
    lendAccounts : string[];
}