import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import "./PageLayout.css";

const PageLayout = () => {
  return (
    <div>
      <Navbar />

      <div className="container">
        <div className="row" style={{ marginTop: "20px" }}>
          {/* Main Content */}
          <div className="col s12">
            <div className="card">
              <div className="card-content">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PageLayout;
