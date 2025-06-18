import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createExpense,
  getPaginatedExpenses,
  deleteExpense,
} from "../../api/expenseService";
import moment from "moment";
import M from "materialize-css";
import { evaluate } from "mathjs";

const Expense = () => {
  const [formData, setFormData] = useState({
    expenseName: "",
    expenseDetails: "",
    cost: "",
    image: null,
  });

  const [costInput, setCostInput] = useState("");

  const [backendError, setBackendError] = useState(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const queryClient = useQueryClient();

  // Refetch expenses when page or itemsPerPage changes
  const { data, isLoading, isError } = useQuery({
    queryKey: ["expenses", page, itemsPerPage],
    queryFn: () => getPaginatedExpenses(page, itemsPerPage),
    keepPreviousData: true,
  });

  const expenses = useMemo(() => data?.items || [], [data]);
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const expenseNames = useMemo(() => {
    return [...new Set(expenses.map((expense) => expense.expenseName))];
  }, [expenses]);

  useEffect(() => {
    M.FormSelect.init(document.querySelectorAll("select"));
  }, [itemsPerPage]);

  const mutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      M.toast({ html: "Expense created successfully!", classes: "green" });
      setFormData({
        expenseName: "",
        expenseDetails: "",
        cost: "",
        image: null,
      });
      queryClient.invalidateQueries(["expenses"]);
      setBackendError(null);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create expense.";
      setBackendError(errorMessage);
      M.toast({ html: "Failed to create expense", classes: "red" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("ExpenseName", formData.expenseName);
    form.append("ExpenseDetails", formData.expenseDetails);
    form.append("Cost", formData.cost);
    if (formData.image) {
      form.append("ExpenseImage", formData.image);
    }
    mutation.mutate(form);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id);
        M.toast({ html: "Expense deleted successfully!", classes: "green" });
        queryClient.invalidateQueries(["expenses"]);
      } catch (error) {
        M.toast({ html: "Failed to delete expense", classes: "red" });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  const handleCostChange = (e) => {
    const input = e.target.value;
    setCostInput(input);

    try {
      const result = evaluate(input);
      if (!isNaN(result)) {
        setFormData((prev) => ({
          ...prev,
          cost: result,
        }));
      }
    } catch {
      // Invalid expression; don't update cost
      setFormData((prev) => ({
        ...prev,
        cost: "",
      }));
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div className="container col s12" style={{ marginTop: 50 }}>
      <h5>Add Expense</h5>

      {backendError && (
        <div className="card red lighten-2">
          <div className="card-content white-text">
            <span className="card-title">Error</span>
            <p>{backendError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <input
            type="text"
            name="expenseName"
            value={formData.expenseName}
            onChange={handleChange}
            list="expense-name-options"
            required
          />
          <label
            htmlFor="expenseName"
            className={formData.expenseName ? "active" : ""}
          >
            Expense Name
          </label>
          <datalist id="expense-name-options">
            {expenseNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        <div className="input-field">
          <input
            type="text"
            name="expenseDetails"
            value={formData.expenseDetails}
            onChange={handleChange}
          />
          <label>Details</label>
        </div>

        <div className="input-field">
          <input
            type="text"
            name="costInput"
            value={costInput}
            onChange={handleCostChange}
            required
          />
          <label className={costInput ? "active" : ""}>Cost (Calculator)</label>
          {formData.cost && !isNaN(formData.cost) && (
            <span className="helper-text">
              Evaluated Cost: ₱{parseFloat(formData.cost).toFixed(2)}
            </span>
          )}
        </div>

        <div className="file-field input-field">
          <div className="btn">
            <span>Upload Image</span>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
            />
          </div>
          <div className="file-path-wrapper">
            <input
              className="file-path validate"
              type="text"
              placeholder="Optional"
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn waves-effect waves-light"
          disabled={mutation.isLoading}
        >
          Submit Expense
        </button>
      </form>

      <div
      // style={{

      // }}
      ></div>

      <table
        className="striped highlight centered responsive-table"
        style={{ marginTop: 50, width: "100%" }}
      >
        <thead>
          <tr style={{ color: "#167168" }}>
            <th>Image</th>
            <th>Name</th>
            <th>Details</th>
            <th>Cost</th>
            <th>Date Created</th>
            <th>Actions</th> {/* New column for actions */}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>
                {expense.imagePath ? (
                  <img
                    src={expense.imagePath}
                    alt="Expense"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "No image"
                )}
              </td>
              <td>{expense.expenseName}</td>
              <td>{expense.expenseDetails}</td>
              <td>{`₱${expense.cost.toFixed(2)}`}</td>
              <td>
                {moment(expense.dateCreated).format("MMMM D, YYYY h:mm A")}
              </td>
              <td>
                <button
                  className="btn-small red"
                  onClick={() => handleDelete(expense.id)}
                >
                  <i className="material-icons">delete</i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="center-align" style={{ marginTop: "20px" }}>
        <button
          className="btn-small"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn-small"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Expense;
