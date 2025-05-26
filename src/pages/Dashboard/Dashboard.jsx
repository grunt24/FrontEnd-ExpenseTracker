import React, { useEffect, useState } from "react";
import { totalExpenses } from "../../api/expenseService";
import Expense from "../Expense/Expense";

const Dashboard = () => {
  const [expenseTotalCount, setExpenseTotalCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenseTotalCount = async () => {
      try {
        const data = await totalExpenses();
        setExpenseTotalCount(data.expenseTotalCount);
      } catch (err) {
        setError("Failed to fetch expense total count");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseTotalCount();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Expenses: ${expenseTotalCount}</p>
      <Expense />
    </div>
  );
};

export default Dashboard;
