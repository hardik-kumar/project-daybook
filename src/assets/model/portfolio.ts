export interface Portfolio{
    _id?: string;
    month: number;
    year: number;
    accountId: number[];
    lendAccount : string[];
}

export interface AccountCategories{
    id: number,
    name: string;
}