import React from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import { Link, Outlet } from "react-router-dom";

const { Header, Content, Sider, Footer } = Layout;

const PageLayout = () => {
  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          className="header"
          style={{ display: "flex", alignItems: "center" }}
        >
          <div className="logo" />
          {/* <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            style={{ flex: 1 }}
          >
            <Menu.Item key="1">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/expense">Expense</Link>
            </Menu.Item>
          </Menu> */}
        </Header>

        <Layout style={{ padding: "0 24px" }}>
          <Sider className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              style={{ height: "100%", borderRight: 0 }}
            >
              <Menu.Item key="1">
                <Link to="/dashboard">Dashboard</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/">Home</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/expense">Expense</Link>
              </Menu.Item>
            </Menu>
          </Sider>

          <Layout style={{ padding: "0 24px", width: "1023px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Expense</Breadcrumb.Item>
            </Breadcrumb>

            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: "#fff",
              }}
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>

        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </div>
  );
};

export default PageLayout;
