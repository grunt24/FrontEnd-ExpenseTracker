import { useState } from "react";
import { Table, Layout, Form, Input, Button, Upload, message, Alert, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExpenses, createExpense } from "../../api/expenseService";

const { Content } = Layout;
const { Option } = Select;

const Expense = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [backendError, setBackendError] = useState(null);

  const { data: expenses, isLoading, isError } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });

const expenseNames = [...new Set(expenses?.map(expense => expense.expenseName))];

  const mutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      message.success("Expense created successfully!");
      form.resetFields();
      queryClient.invalidateQueries(["expenses"]);
      setBackendError(null);
    },
    onError: (error) => {
      if (error.response && error.response.data) {
        setBackendError(error.response.data.message);
      } else {
        setBackendError("Failed to create expense.");
      }
      message.error("Failed to create expense");
    },
  });

  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append("ExpenseName", values.expenseName);
    formData.append("ExpenseDetails", values.expenseDetails);
    formData.append("Cost", values.cost);

    if (values.image && values.image.length > 0) {
      formData.append("ExpenseImage", values.image[0].originFileObj);
    }

    mutation.mutate(formData);
  };

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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <Content>
      <div className="pageTitle">
        <h4>Expenses</h4>
      </div>

      {backendError && (
        <Alert
          message="Error"
          description={backendError}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginBottom: 24 }}>
        <Form.Item
          name="expenseName"
          label="Expense Name"
          rules={[{ required: true, message: "Please select an expense name" }]}
        >
          <Select
            showSearch
            placeholder="Select an expense name"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {expenseNames.map((name) => (
              <Option key={name} value={name}>
                {name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="expenseDetails"
          label="Details"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="cost"
          label="Cost"
          rules={[{ required: true, message: "Please enter a cost" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="image"
          label="Upload or Capture Image (optional)"
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList}
        >
          <Upload
            accept="image/*"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
            capture="environment"
          >
            <Button icon={<UploadOutlined />}>Capture/Upload</Button>
          </Upload>
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={mutation.isLoading}>
          Submit Expense
        </Button>
      </Form>

      <Table
        columns={columns}
        dataSource={expenses}
        rowKey="id"
        scroll={{ x: 800, y: 1000 }}
      />
    </Content>
  );
};

export default Expense;
