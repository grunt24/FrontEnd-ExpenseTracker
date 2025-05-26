import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExpenses, createExpense } from "../../api/expenseService";
import moment from "moment";
import M from "materialize-css";
const Expense = () => {
  const [formData, setFormData] = useState({
    expenseName: "",
    expenseDetails: "",
    cost: "",
    image: null,
  });
  const [backendError, setBackendError] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: expenses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });

  const expenseNames = [
    ...new Set(expenses?.map((expense) => expense.expenseName)),
  ];

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  useEffect(() => {
    M.FormSelect.init(document.querySelectorAll("select"));
  }, [expenseNames]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div className="container">
      <h4>Expenses</h4>

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

        {formData.expenseName === "other" && (
          <div className="input-field">
            <input
              type="text"
              name="expenseName"
              value={formData.expenseName}
              onChange={handleChange}
              required
            />
            <label>New Expense Name</label>
          </div>
        )}

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
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            required
          />
          <label>Cost</label>
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

      <table className="striped responsive-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Details</th>
            <th>Cost</th>
            <th>Date Created</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Expense;
