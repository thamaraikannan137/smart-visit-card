import React, { useState } from "react";
import CustomerTable from "./CustomerTable";
import { CustomerActionType, Customer } from "../../types/customer.type";
import { initialCustomers } from "../../utils/customerData";
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";
import { TITLES } from "../../constants";

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [currentAction, setCurrentAction] = useState<CustomerActionType>(CustomerActionType.LIST);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const handleShowAddForm = () => {
    setCurrentAction(CustomerActionType.ADD);
  };

  const handleBackToList = () => {
    setCurrentAction(CustomerActionType.LIST);
    setSelectedCustomer(undefined);
  };

  const handleEditCustomer = (customer: Customer) => {
    setCurrentAction(CustomerActionType.EDIT);
    setSelectedCustomer(customer);
  };

  const handleAddCustomer = (customer: Customer) => {
    setCustomers(prevCustomers => [...prevCustomers, customer]);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(prevCustomers => 
      prevCustomers.filter(customer => customer.id !== customerId)
    );
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prevCustomers => 
      prevCustomers.map(customer => 
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
  };
  return (
    <div>
      {currentAction === CustomerActionType.ADD && (
        <AddCustomer
          onBack={handleBackToList}
          onAddCustomer={handleAddCustomer}
        />
      )}
      {currentAction === CustomerActionType.LIST && (
        <>
          <h3>{TITLES.CUSTOMER_LIST}</h3>
          <CustomerTable
            customers={customers}
            onAddCustomer={handleShowAddForm}
            onDeleteCustomer={handleDeleteCustomer}
            onEditCustomer={handleEditCustomer}
          />
        </>
      )}
      {currentAction === CustomerActionType.EDIT && selectedCustomer && (
        <EditCustomer
          onBack={handleBackToList}
          customer={selectedCustomer}
          onUpdateCustomer={handleUpdateCustomer}
        />
      )}
    </div>
  );
};

export default CustomerList;
