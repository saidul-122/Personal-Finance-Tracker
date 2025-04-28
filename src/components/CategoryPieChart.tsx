
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useTransactions } from "@/context/TransactionContext";
import { TransactionCategory } from "@/types/transaction";

const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  food: "#FF6B6B",
  transportation: "#4ECDC4",
  utilities: "#45B7D1",
  entertainment: "#96CEB4",
  shopping: "#FFEEAD",
  healthcare: "#D4A5A5",
  housing: "#9B97B2",
  other: "#A8A8A8",
};

const formatAmount = (amount: number) => {
  return `$${amount.toFixed(2)}`;
};

const CategoryPieChart: React.FC = () => {
  const { transactions } = useTransactions();

  const categoryData = React.useMemo(() => {
    const categoryTotals = transactions.reduce((acc, transaction) => {
      const { category, amount } = transaction;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as Record<TransactionCategory, number>);

    return Object.entries(categoryTotals)
      .filter(([_, amount]) => amount > 0)
      .map(([category, amount]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: amount,
        color: CATEGORY_COLORS[category as TransactionCategory],
      }));
  }, [transactions]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-2 shadow-md rounded-lg border">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-muted-foreground">
            {formatAmount(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>
          Distribution of expenses across categories
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {transactions.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Add transactions to see category breakdown
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) =>
                  `${name}: ${formatAmount(value)}`
                }
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;
