import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Customer } from "../../types/customer.type";
import { initialCustomers } from "../../utils/customerData";
import { TITLES, DETAIL_LABELS, MESSAGES, BUTTON_LABELS } from "../../constants";
import "../shared/Form.css";
import Button from '@mui/material/Button'

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError(MESSAGES.PAGE_NOT_FOUND);
      setIsLoading(false);
      return;
    }

    try {
      const foundCustomer = initialCustomers.find(
        (customerItem) => customerItem.id === id
      );
      
      if (foundCustomer) {
        setSelectedCustomer(foundCustomer);
        setError(null);
      } else {
        setError(MESSAGES.PAGE_NOT_FOUND);
      }
    } catch (err) {
      console.error("Error loading customer details:", err);
      setError(MESSAGES.LOAD_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const handleBackToList = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="customer-form">
        <h1>{MESSAGES.LOADING}</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-form">
        <h1 className="text-3xl font-bold underline">{MESSAGES.ERROR_TITLE}</h1>
        <p className="error-message">{error}</p>
        <div >
          <Button 
            onClick={handleBackToList}
            variant="outlined"
          >
            {BUTTON_LABELS.BACK}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-form">
      <div className="form-header">
        <h1 className="text-3xl font-bold underline">{TITLES.CUSTOMER_DETAILS}</h1>
        <button 
          onClick={handleBackToList}
          className="form-button secondary"
        >
          {BUTTON_LABELS.BACK}
        </button>
      </div>
      
      {selectedCustomer && (
        <div className="customer-details-container">
          <div className="detail-item">
            <strong>{DETAIL_LABELS.NAME}</strong> 
            <span>{selectedCustomer.name}</span>
          </div>
          <div className="detail-item">
            <strong>{DETAIL_LABELS.EMAIL}</strong> 
            <span>
              <a href={`mailto:${selectedCustomer.email}`} className="website-link">
                {selectedCustomer.email}
              </a>
            </span>
          </div>
          <div className="detail-item">
            <strong>{DETAIL_LABELS.PHONE}</strong> 
            <span>
              <a href={`tel:${selectedCustomer.phoneNumber}`} className="website-link">
                {selectedCustomer.phoneNumber}
              </a>
            </span>
          </div>
          <div className="detail-item">
            <strong>{DETAIL_LABELS.WHATSAPP}</strong> 
            <span>
              <a 
                href={`https://wa.me/${selectedCustomer.whatsappNumber.replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="website-link"
              >
                {selectedCustomer.whatsappNumber}
              </a>
            </span>
          </div>
          <div className="detail-item">
            <strong>{DETAIL_LABELS.WEBSITE}</strong>
            <span>
              {selectedCustomer.websiteUrl ? (
                <a
                  href={selectedCustomer.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="website-link"
                >
                  {selectedCustomer.websiteUrl}
                </a>
              ) : (
                MESSAGES.NOT_PROVIDED
              )}
            </span>
          </div>
          <div className="detail-item">
            <strong>{DETAIL_LABELS.COMPANY_LOGO}</strong>
            <span>
              {selectedCustomer.companyLogo ? (
                <img
                  src={selectedCustomer.companyLogo}
                  alt={`${selectedCustomer.name} logo`}
                  className="customer-logo"
                  loading="lazy"
                />
              ) : (
                MESSAGES.NO_LOGO
              )}
            </span>
          </div>
          <div className="detail-item">
            <strong>{DETAIL_LABELS.DESCRIPTION}</strong> 
            <span>{selectedCustomer.description}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
