import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTransactions } from "@/context/TransactionContext";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Transaction, TransactionCategory } from "@/types/transaction";

const transactionCategories: { label: string; value: TransactionCategory }[] = [
  { label: "Food", value: "food" },
  { label: "Transportation", value: "transportation" },
  { label: "Utilities", value: "utilities" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Shopping", value: "shopping" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Housing", value: "housing" },
  { label: "Other", value: "other" },
];

const transactionSchema = z.object({
  amount: z.coerce
    .number()
    .min(0.01, { message: "Amount must be greater than 0" }),
  date: z.date({
    required_error: "Please select a date",
  }),
  description: z
    .string()
    .min(3, { message: "Description is too short" })
    .max(100),
  category: z.enum(["food", "transportation", "utilities", "entertainment", "shopping", "healthcare", "housing", "other"], {
    required_error: "Please select a category",
  }),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  transaction?: Transaction;
  onComplete?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onComplete,
}) => {
  const { addTransaction, updateTransaction } = useTransactions();
  const isEditing = !!transaction;

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: transaction?.amount || 0,
      date: transaction?.date || new Date(),
      description: transaction?.description || "",
      category: transaction?.category || "other",
    },
  });

  const onSubmit = (values: TransactionFormValues) => {
    try {
      if (isEditing && transaction) {
        updateTransaction({
          ...transaction,
          ...values,
        });
      } else {
        addTransaction(values as Omit<Transaction, "id">);
      }
      form.reset();
      if (onComplete) onComplete();
    } catch (error) {
      toast.error("Failed to save transaction");
      console.error(error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Transaction" : "Add Transaction"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
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
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter transaction description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Brief description of the transaction
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {isEditing ? "Update Transaction" : "Add Transaction"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
