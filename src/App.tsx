import React from 'react';
import './App.css';
import CustomerList from './components/customer/CustomerList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomerDetails from './components/customer/CustomerDetails';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<CustomerList />} />
          <Route path="/page/:id" element={<CustomerDetails />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
