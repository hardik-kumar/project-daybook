export interface Transaction{
      _id?: String
      type: String,
      desc: String,
      amount: number,
      date: String,
      category: String,
      tags: String[],
      amountExclusion : boolean,
      accountId: number
}