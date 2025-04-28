
export type TransactionCategory =
  | "food"
  | "transportation"
  | "utilities"
  | "entertainment"
  | "shopping"
  | "healthcare"
  | "housing"
  | "other";

export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  category: TransactionCategory;
}

export interface CategoryBudget {
  category: TransactionCategory;
  amount: number;
}

