import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Avatar, 
  Box,
  Chip,
  Stack
} from '@mui/material';
import { Edit, Visibility, Phone, Email, Language } from '@mui/icons-material';
import { Customer } from '../../types/customer.type';

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onView: (id: string) => void;
}

/**
 * Responsive CustomerCard component following Single Responsibility Principle
 * Responsible only for displaying customer information in a card format
 */
const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onEdit, onView }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <CardContent className="flex-grow p-4 sm:p-6">
        {/* Header with Avatar and Name */}
        <Box className="flex items-start space-x-3 mb-4">
          <Avatar
            src={customer.companyLogo}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 text-white"
          >
            {!customer.companyLogo && getInitials(customer.name)}
          </Avatar>
          
          <Box className="flex-grow min-w-0">
            <Typography 
              variant="h6" 
              component="h3" 
              className="text-lg sm:text-xl font-semibold text-gray-900 truncate mb-1"
            >
              {customer.name}
            </Typography>
            
            {customer.description && (
              <Typography 
                variant="body2" 
                className="text-gray-600 text-sm line-clamp-2"
              >
                {customer.description}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Contact Information */}
        <Stack spacing={2} className="mb-4">
          <Box className="flex items-center space-x-2 text-gray-600">
            <Email className="w-4 h-4 flex-shrink-0" />
            <Typography 
              variant="body2" 
              className="text-sm truncate"
            >
              {customer.emails?.[0] || 'No email'}
            </Typography>
          </Box>
          
          <Box className="flex items-center space-x-2 text-gray-600">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <Typography 
              variant="body2" 
              className="text-sm"
            >
              {customer.phoneNumbers?.[0] || 'No phone'}
            </Typography>
          </Box>
          
          {customer.websiteUrls?.[0] && (
            <Box className="flex items-center space-x-2 text-gray-600">
              <Language className="w-4 h-4 flex-shrink-0" />
              <Typography 
                variant="body2" 
                className="text-sm truncate"
                component="a"
                href={customer.websiteUrls[0]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {customer.websiteUrls[0]}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Status or Tags (if we had them) */}
        <Box className="flex flex-wrap gap-1">
          <Chip 
            label="Active" 
            size="small" 
            color="success" 
            variant="outlined"
            className="text-xs"
          />
        </Box>
      </CardContent>

      {/* Action Buttons */}
      <CardActions className="p-4 pt-0 sm:p-6 sm:pt-0">
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={1} 
          className="w-full"
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<Visibility />}
            onClick={() => onView(customer.id)}
            className="flex-1"
          >
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">View</span>
          </Button>
          
          <Button
            size="small"
            variant="contained"
            startIcon={<Edit />}
            onClick={() => onEdit(customer)}
            className="flex-1"
          >
            <span className="hidden sm:inline">Edit</span>
            <span className="sm:hidden">Edit</span>
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default CustomerCard;
