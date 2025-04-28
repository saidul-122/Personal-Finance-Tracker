
import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTransactions } from "@/context/TransactionContext";
import { format, subMonths, isSameMonth, startOfMonth, getMonth } from "date-fns";

const MonthlyExpenseChart: React.FC = () => {
  const { transactions } = useTransactions();

  const monthlyData = useMemo(() => {
    const today = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const month = subMonths(today, i);
      const monthName = format(month, "MMM");
      const monthYear = format(month, "MMM yyyy");
      
      return {
        month: startOfMonth(month),
        monthName,
        monthYear,
        total: 0,
      };
    }).reverse();

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      const monthIndex = last6Months.findIndex((m) =>
        isSameMonth(m.month, transactionDate)
      );
      
      if (monthIndex !== -1) {
        last6Months[monthIndex].total += transaction.amount;
      }
    });

    return last6Months.map((item) => ({
      month: item.monthName,
      monthYear: item.monthYear,
      total: Number(item.total.toFixed(2)),
    }));
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-md rounded border">
          <p className="font-medium">{payload[0].payload.monthYear}</p>
          <p className="text-finance-blue">
            Total: ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>
          Your spending trends over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {transactions.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Add transactions to see your monthly expense chart
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="total"
                fill="#0ea5e9"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyExpenseChart;
