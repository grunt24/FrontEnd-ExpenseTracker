import React from "react";
import { getExpenses } from "../../api/expenseService";
import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";

const Home = () => {
  const columns = [
    {
      title: "Image",
      dataIndex: "imagePath",
      render: (imagePath) =>
        imagePath ? (
          <img
            width={50}
            height={50}
            src={imagePath}
            alt="Expense"
            style={{ objectFit: "cover" }}
          />
        ) : (
          "No image"
        ),
    },
    {
      title: "Name",
      dataIndex: "expenseName",
    },
    {
      title: "Details",
      dataIndex: "expenseDetails",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      render: (cost) => `₱${cost.toFixed(2)}`,
    },
  ];

  const {
    data: expenses,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });

  if (isFetching) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <>
      <Table
        columns={columns}
        dataSource={expenses}
        rowKey="id"
        scroll={{ x: 800, y: 1000 }}
      />
    </>
  );
};

export default Home;
