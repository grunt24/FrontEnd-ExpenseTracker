import React, { useState, useEffect } from "react";
import PasswordModal from "../../components/modal/PasswordModal";
import { totalExpenses, getExpenses } from "../../api/expenseService";
import Expense from "../Expense/Expense";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [expenseTotalCount, setExpenseTotalCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("day");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: expenses, isLoading } = useQuery({
    queryKey: ["expenses", timeRange],
    queryFn: () => getExpenses(timeRange),
    placeholderData: [],
  });

  useEffect(() => {
    const fetchExpenseTotalCount = async () => {
      try {
        const data = await totalExpenses();
        setExpenseTotalCount(data.expenseTotalCount);
      } catch (err) {
        console.error("Failed to fetch expense total count", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseTotalCount();
  }, []);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handlePasswordSubmit = () => {
    setIsAuthenticated(true);
    setIsModalOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPasswordSubmit={handlePasswordSubmit}
      />
    );
  }

  if (loading || isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          // color: '26a69a'
          // alignItems: "center",
        }}
      >
        <h3>Dashboard</h3>
      </div>

      <p>Alabang Total Expenses: <span style={{color: 'red'}}>₱ {expenseTotalCount}</span></p>
      <div>
        <label htmlFor="timeRange">Select Time Range: </label>
        <select
          id="timeRange"
          value={timeRange}
          onChange={handleTimeRangeChange}
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={expenses}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="cost" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <div
        className="divider"
      ></div>

      <Expense />
    </div>
  );
};

export default Dashboard;
