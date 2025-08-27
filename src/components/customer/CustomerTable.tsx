import React, { useState } from "react";
import { Customer } from "../../types/customer.type";
import { BUTTON_LABELS, TITLES } from "../../constants";
import "./customerTable.style.css";

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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const handleViewCustomer = (customer: Customer) => {
    setIsViewModalOpen(true);
    setSelectedCustomer(customer);
  };

  const handleDeleteCustomer = (customerId: string) => {
    onDeleteCustomer(customerId);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedCustomer(undefined);
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
      {isViewModalOpen && selectedCustomer && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Customer Details</h2>
              <button className="close-button" onClick={handleCloseModal}>
                {BUTTON_LABELS.CLOSE}
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <strong>Name:</strong> {selectedCustomer.name}
              </div>
              <div className="detail-row">
                <strong>Email:</strong> {selectedCustomer.email}
              </div>
              <div className="detail-row">
                <strong>Phone:</strong> {selectedCustomer.phoneNumber}
              </div>
              <div className="detail-row">
                <strong>WhatsApp:</strong> {selectedCustomer.whatsappNumber}
              </div>
              <div className="detail-row">
                <strong>Website:</strong> 
                {selectedCustomer.websiteUrl ? (
                  <a href={selectedCustomer.websiteUrl} target="_blank" rel="noopener noreferrer">
                    {selectedCustomer.websiteUrl}
                  </a>
                ) : (
                  'Not provided'
                )}
              </div>
              <div className="detail-row">
                <strong>Company Logo:</strong>
                {selectedCustomer.companyLogo ? (
                  <img src={selectedCustomer.companyLogo} alt="Company Logo" className="modal-logo" />
                ) : (
                  'No logo provided'
                )}
              </div>
              <div className="detail-row">
                <strong>Description:</strong> {selectedCustomer.description}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTable;
