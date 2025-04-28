
import React from "react";
import { useTransactions } from "@/context/TransactionContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TransactionCategory } from "@/types/transaction";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const budgetSchema = z.object({
  category: z.enum(["food", "transportation", "utilities", "entertainment", "shopping", "healthcare", "housing", "other"], {
    required_error: "Please select a category",
  }),
  amount: z.coerce.number().min(0, { message: "Budget must be positive" }),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

const transactionCategories = [
  { label: "Food", value: "food" },
  { label: "Transportation", value: "transportation" },
  { label: "Utilities", value: "utilities" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Shopping", value: "shopping" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Housing", value: "housing" },
  { label: "Other", value: "other" },
];

const BudgetForm: React.FC = () => {
  const { setBudget, getBudget } = useTransactions();

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: "other",
      amount: 0,
    },
  });

  const onSubmit = (values: BudgetFormValues) => {
    setBudget({
      category: values.category,
      amount: values.amount,
    });
    form.reset();
  };

  const onCategoryChange = (category: TransactionCategory) => {
    const currentBudget = getBudget(category);
    form.setValue("amount", currentBudget);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Category Budget</CardTitle>
        <CardDescription>Define monthly spending limits for each category</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(value: TransactionCategory) => {
                      field.onChange(value);
                      onCategoryChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {transactionCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Set Budget</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BudgetForm;
