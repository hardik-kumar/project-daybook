export interface Transaction{
      _id?: string
      type: string,
      desc: string,
      amount: number,
      date: string,
      category: string,
      tags: string[],
      amountExclusion : boolean,
      accountId: number
}