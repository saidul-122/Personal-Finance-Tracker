
import React from "react";
import { useTransactions } from "@/context/TransactionContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { startOfMonth, endOfMonth } from "date-fns";

const BudgetChart = () => {
  const { transactions, budgets } = useTransactions();

  const currentMonthData = React.useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const currentMonthTransactions = transactions.filter(
      (t) => t.date >= monthStart && t.date <= monthEnd
    );

    const categoryTotals = currentMonthTransactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    return budgets.map((budget) => ({
      category: budget.category.charAt(0).toUpperCase() + budget.category.slice(1),
      budget: budget.amount,
      spent: categoryTotals[budget.category] || 0,
    }));
  }, [transactions, budgets]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-2 shadow-md rounded-lg border">
          <p className="font-semibold">{label}</p>
          <p className="text-muted-foreground">Budget: ${payload[0].value.toFixed(2)}</p>
          <p className="text-muted-foreground">Spent: ${payload[1].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Actual Spending</CardTitle>
        <CardDescription>Current month's spending compared to budget</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {currentMonthData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Set budgets to see comparison
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={currentMonthData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="budget" fill="#8884d8" name="Budget" />
              <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetChart;
