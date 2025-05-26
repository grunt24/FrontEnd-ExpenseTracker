import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PageLayout from './components/PageLayout';
// import Expense from './pages/Expense/Expense';
import Dashboard from './pages/Dashboard/Dashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Dashboard/>} />
        {/* <Route path="expense" element={<Expense />} /> */}
        <Route path="dashboard" element={<Dashboard />} />

      </Route>
    </Routes>
  );
};

export default App;
