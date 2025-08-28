import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme, ToggleButton, ToggleButtonGroup, CircularProgress, Alert } from "@mui/material";
import { ViewList, ViewModule } from "@mui/icons-material";
import CustomerTable from "./CustomerTable";
import { CustomerActionType, Customer, CustomerCreateRequest } from "../../types/customer.type";
import { customerService } from "../../services/CustomerService";
import AddCustomerV2 from "./AddCustomerV2";
import EditCustomerV2 from "./EditCustomerV2";
import { TITLES } from "../../constants";
import Layout from "../shared/Layout";
import PageHeader from "../shared/PageHeader";
import CustomerCard from "../shared/CustomerCard";
import { useNavigate } from "react-router-dom";

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentAction, setCurrentAction] = useState<CustomerActionType>(CustomerActionType.LIST);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Load customers from API
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Auto-switch to grid view on mobile
  useEffect(() => {
    if (isMobile) {
      setViewMode('grid');
    }
  }, [isMobile]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerService.getAll();
      setCustomers(response.customers);
    } catch (err: any) {
      setError(err.message || 'Failed to load customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleViewCustomer = (id: string) => {
    navigate(`/page/${id}`);
  };

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: 'table' | 'grid',
  ) => {
    if (newViewMode !== null && !isMobile) {
      setViewMode(newViewMode);
    }
  };

  const handleAddCustomer = async (customerData: CustomerCreateRequest) => {
    try {
      const newCustomer = await customerService.add(customerData);
      setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
      return newCustomer;
    } catch (err: any) {
      console.error('Error adding customer:', err);
      throw err; // Re-throw to let the form handle the error
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      await customerService.delete(customerId);
      setCustomers(prevCustomers => 
        prevCustomers.filter(customer => customer.id !== customerId)
      );
    } catch (err: any) {
      console.error('Error deleting customer:', err);
      setError(err.message || 'Failed to delete customer');
    }
  };

  const handleUpdateCustomer = async (updatedCustomer: Customer): Promise<void> => {
    try {
      const updated = await customerService.update(updatedCustomer.id, updatedCustomer);
      if (updated) {
        setCustomers(prevCustomers => 
          prevCustomers.map(customer => 
            customer.id === updatedCustomer.id ? updated : customer
          )
        );
      }
    } catch (err: any) {
      console.error('Error updating customer:', err);
      throw err; // Re-throw to let the form handle the error
    }
  };
  if (currentAction === CustomerActionType.ADD) {
    return (
      <Layout title="Add New Customer">
        <AddCustomerV2
          onBack={handleBackToList}
          onAddCustomer={handleAddCustomer}
        />
      </Layout>
    );
  }

  if (currentAction === CustomerActionType.EDIT && selectedCustomer) {
    return (
      <Layout title="Edit Customer">
        <EditCustomerV2
          onBack={handleBackToList}
          customer={selectedCustomer}
          onUpdateCustomer={handleUpdateCustomer}
        />
      </Layout>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <Layout title="Customer Management">
        <Box className="flex justify-center items-center min-h-96">
          <CircularProgress size={60} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Customer Management">
      <PageHeader
        title={TITLES.CUSTOMER_LIST}
        subtitle={`Manage your ${customers.length} customer${customers.length !== 1 ? 's' : ''}`}
        showAddButton
        addButtonText="Add Customer"
        onAdd={handleShowAddForm}
      />

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          className="mb-4"
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* View Mode Toggle - Hidden on mobile */}
      {!isMobile && (
        <Box className="mb-6 flex justify-end">
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
          >
            <ToggleButton value="grid" aria-label="grid view">
              <ViewModule />
            </ToggleButton>
            <ToggleButton value="table" aria-label="table view">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      {/* Content based on view mode */}
      {customers.length === 0 ? (
        <Box className="text-center py-12">
          <p className="text-gray-500 text-lg">No customers found</p>
          <p className="text-gray-400 mt-2">Add your first customer to get started</p>
        </Box>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {customers.map((customer) => (
            <div key={customer.id}>
              <CustomerCard
                customer={customer}
                onEdit={handleEditCustomer}
                onView={handleViewCustomer}
              />
            </div>
          ))}
        </div>
      ) : (
        <Box className="overflow-x-auto">
          <CustomerTable 
            customers={customers}
            onAddCustomer={handleShowAddForm}
            onDeleteCustomer={handleDeleteCustomer}
            onEditCustomer={handleEditCustomer}
          />
        </Box>
      )}
    </Layout>
  );
};

export default CustomerList;
