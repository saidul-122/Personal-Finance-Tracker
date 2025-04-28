
import React, { useState } from "react";
import { Transaction } from "@/types/transaction";
import { useTransactions } from "@/context/TransactionContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import TransactionForm from "./TransactionForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

const TransactionList: React.FC = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction;
    direction: "ascending" | "descending";
  }>({
    key: "date",
    direction: "descending",
  });

  const handleEdit = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
  };

  const handleSort = (key: keyof Transaction) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>View and manage your transactions</CardDescription>
        <div className="mt-2">
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found. Add a transaction to get started.
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("amount")}
                  >
                    Amount{" "}
                    {sortConfig.key === "amount" &&
                      (sortConfig.direction === "ascending" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    Date{" "}
                    {sortConfig.key === "date" &&
                      (sortConfig.direction === "ascending" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(transaction.date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(transaction)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Transaction
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this transaction?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(transaction.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Make changes to your transaction here.
            </DialogDescription>
          </DialogHeader>
          {editTransaction && (
            <TransactionForm
              transaction={editTransaction}
              onComplete={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TransactionList;
