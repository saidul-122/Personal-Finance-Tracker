
import React, { createContext, useContext, useState, useEffect } from "react";
import { Transaction, CategoryBudget, TransactionCategory } from "@/types/transaction";
import { toast } from "sonner";

interface TransactionContextType {
  transactions: Transaction[];
  budgets: CategoryBudget[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  setBudget: (budget: CategoryBudget) => void;
  getBudget: (category: TransactionCategory) => number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);

  // Load transactions and budgets from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    const savedBudgets = localStorage.getItem("budgets");
    
    if (savedTransactions) {
      try {
        const parsedTransactions = JSON.parse(savedTransactions);
        const processedTransactions = parsedTransactions.map((t: any) => ({
          ...t,
          date: new Date(t.date)
        }));
        setTransactions(processedTransactions);
      } catch (error) {
        console.error("Failed to parse transactions from localStorage:", error);
        toast.error("Failed to load saved transactions");
      }
    }

    if (savedBudgets) {
      try {
        const parsedBudgets = JSON.parse(savedBudgets);
        setBudgets(parsedBudgets);
      } catch (error) {
        console.error("Failed to parse budgets from localStorage:", error);
        toast.error("Failed to load saved budgets");
      }
    }
  }, []);

  // Save transactions and budgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions([...transactions, newTransaction]);
    toast.success("Transaction added");
  };

  const updateTransaction = (transaction: Transaction) => {
    setTransactions(
      transactions.map((t) => (t.id === transaction.id ? transaction : t))
    );
    toast.success("Transaction updated");
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    toast.success("Transaction deleted");
  };

  const setBudget = (budget: CategoryBudget) => {
    const existingBudgetIndex = budgets.findIndex(b => b.category === budget.category);
    if (existingBudgetIndex >= 0) {
      const newBudgets = [...budgets];
      newBudgets[existingBudgetIndex] = budget;
      setBudgets(newBudgets);
    } else {
      setBudgets([...budgets, budget]);
    }
    toast.success("Budget updated");
  };

  const getBudget = (category: TransactionCategory) => {
    return budgets.find(b => b.category === category)?.amount || 0;
  };

  return (
    <TransactionContext.Provider 
      value={{ 
        transactions, 
        budgets, 
        addTransaction, 
        updateTransaction, 
        deleteTransaction,
        setBudget,
        getBudget
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
