import axiosInstance from "./axiosIntance";

const subdirectory = "Expenses";

// Function to get expenses
export const getExpenses = async () => {
  const { data } = await axiosInstance.get(subdirectory);
  return data;
};

export const totalExpenses = async () => {
    const { data } = await axiosInstance.get(`${subdirectory}/total-expenses`);
  return data;
}

// Function to get an expense by ID
export const getExpenseById = async (id) => {
  const { data } = await axiosInstance.get(`${subdirectory}/${id}`);
  return data;
};

// Function to create a new expense
export const createExpense = async (newExpense) => {
  const { data } = await axiosInstance.post(subdirectory, newExpense);
  return data;
};

// Function to update an expense by ID
export const updateExpense = async (id, updatedExpense) => {
  const { data } = await axiosInstance.put(`${subdirectory}/${id}`, updatedExpense);
  return data;
};

// Function to delete an expense by ID
export const deleteExpense = async (id) => {
  const { data } = await axiosInstance.delete(`${subdirectory}/${id}`);
  return data;
};
