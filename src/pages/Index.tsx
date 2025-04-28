
import React from "react";
import Header from "@/components/Header";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlyExpenseChart from "@/components/MonthlyExpenseChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import BudgetForm from "@/components/BudgetForm";
import BudgetChart from "@/components/BudgetChart";
import { TransactionProvider } from "@/context/TransactionContext";

const Index = () => {
  return (
    <TransactionProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="container mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <TransactionForm />
              <BudgetForm />
            </div>
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <MonthlyExpenseChart />
                <CategoryPieChart />
              </div>
              <div className="mb-6">
                <BudgetChart />
              </div>
              <TransactionList />
            </div>
          </div>
        </div>
      </div>
    </TransactionProvider>
  );
};

export default Index;
