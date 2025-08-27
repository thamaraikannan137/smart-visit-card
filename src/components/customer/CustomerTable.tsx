import React from "react";
import { Customer } from "../../types/customer.type";
import { BUTTON_LABELS, TITLES } from "../../constants";
import "./customerTable.style.css";
import { useNavigate } from "react-router-dom";

interface CustomerTableProps {
  customers: Customer[];
  onAddCustomer: () => void;
  onDeleteCustomer: (customerId: string) => void;
  onEditCustomer: (customer: Customer) => void;
}
const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onAddCustomer,
  onDeleteCustomer,
  onEditCustomer
}) => {
  const navigate = useNavigate();
  const handleViewCustomer = (customer: Customer) => {
    navigate(`/page/${customer.id}`);
  };

  const handleDeleteCustomer = (customerId: string) => {
    onDeleteCustomer(customerId);
  };


  const handleEditCustomer = (customer: Customer) => {
    onEditCustomer(customer);
  };
  return (
    <div>
      <h1>{TITLES.CUSTOMER_TABLE}</h1>
      <div className="table-header">
        <button onClick={onAddCustomer} className="add-button">
          {BUTTON_LABELS.ADD_CUSTOMER}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>WhatsApp</th>
            <th>Website</th>
            <th>Logo</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer: Customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phoneNumber}</td>
              <td>{customer.whatsappNumber}</td>
              <td>
                {customer.websiteUrl ? (
                  <a href={customer.websiteUrl} target="_blank" rel="noopener noreferrer">
                    Visit
                  </a>
                ) : (
                  'N/A'
                )}
              </td>
              <td>
                {customer.companyLogo ? (
                  <img src={customer.companyLogo} alt="Logo" className="logo-thumbnail" />
                ) : (
                  'No Logo'
                )}
              </td>
              <td className="description-cell">{customer.description}</td>
              <td className="actions-cell">
                <button 
                  onClick={() => handleViewCustomer(customer)}
                  className="action-button view-button"
                >
                  {BUTTON_LABELS.VIEW}
                </button>
                <button 
                  onClick={() => handleEditCustomer(customer)}
                  className="action-button edit-button"
                >
                  {BUTTON_LABELS.EDIT}
                </button>
                <button
                  onClick={() => handleDeleteCustomer(customer.id)}
                  className="action-button delete-button"
                >
                  {BUTTON_LABELS.DELETE}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
