import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Typography, 
  Avatar, 
  Box, 
  Stack,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from "@mui/material";
import { 
  Phone, 
  Email, 
  Language, 
  WhatsApp,
  Facebook,
  Instagram,
  YouTube,
  LocationOn
} from "@mui/icons-material";
import { Customer } from "../../types/customer.type";
import { customerService } from "../../services/CustomerService";
import { DETAIL_LABELS, MESSAGES } from "../../constants";
import Layout from "../shared/Layout";

// Contact item configuration for DRY principle
interface ContactConfig {
  key: keyof Customer;
  icon: React.ReactElement;
  label: string;
  type: string;
  color: string;
}

const CONTACT_CONFIGS: ContactConfig[] = [
  {
    key: 'emails',
    icon: <Email />,
    label: DETAIL_LABELS.EMAIL,
    type: 'email',
    color: '#1976d2'
  },
  {
    key: 'phoneNumbers',
    icon: <Phone />,
    label: DETAIL_LABELS.PHONE,
    type: 'phone',
    color: '#2e7d32'
  },
  {
    key: 'whatsappNumbers',
    icon: <WhatsApp />,
    label: DETAIL_LABELS.WHATSAPP,
    type: 'whatsapp',
    color: '#25d366'
  },
  {
    key: 'websiteUrls',
    icon: <Language />,
    label: DETAIL_LABELS.WEBSITE,
    type: 'website',
    color: '#7b1fa2'
  },
  {
    key: 'facebookUrls',
    icon: <Facebook />,
    label: DETAIL_LABELS.FACEBOOK,
    type: 'facebook',
    color: '#1877f2'
  },
  {
    key: 'instagramUrls',
    icon: <Instagram />,
    label: DETAIL_LABELS.INSTAGRAM,
    type: 'instagram',
    color: '#e1306c'
  },
  {
    key: 'youtubeUrls',
    icon: <YouTube />,
    label: DETAIL_LABELS.YOUTUBE,
    type: 'youtube',
    color: '#ff0000'
  },
  {
    key: 'locationUrls',
    icon: <LocationOn />,
    label: DETAIL_LABELS.LOCATION,
    type: 'location',
    color: '#ff9800'
  }
];

// Utility functions
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatUrl = (url: string, type: string): string => {
  if (!url) return '';
  
  const formatters: Record<string, (url: string) => string> = {
    email: (url) => `mailto:${url}`,
    phone: (url) => `tel:${url}`,
    whatsapp: (url) => `https://wa.me/${url.replace(/\D/g, '')}`,
    website: (url) => url.startsWith('http') ? url : `https://${url}`,
    facebook: (url) => url.startsWith('http') ? url : `https://facebook.com/${url}`,
    instagram: (url) => url.startsWith('http') ? url : `https://instagram.com/${url}`,
    youtube: (url) => url.startsWith('http') ? url : `https://youtube.com/${url}`,
    location: (url) => url.startsWith('http') ? url : `https://maps.google.com/?q=${encodeURIComponent(url)}`
  };
  
  return formatters[type]?.(url) || (url.startsWith('http') ? url : `https://${url}`);
};

const openLink = (url: string, type: string): void => {
  if (!url) return;
  const formattedUrl = formatUrl(url, type);
  window.open(formattedUrl, '_blank', 'noopener,noreferrer');
};

// Hook for customer data fetching
const useCustomer = (id: string | undefined) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) {
        setError(MESSAGES.PAGE_NOT_FOUND);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const foundCustomer = await customerService.getById(id);
        
        if (foundCustomer) {
          setCustomer(foundCustomer);
        } else {
          setError(MESSAGES.PAGE_NOT_FOUND);
        }
      } catch (err) {
        console.error("Error loading customer details:", err);
        setError(MESSAGES.LOAD_ERROR);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  return { customer, isLoading, error };
};

// Generate contact items from customer data
const generateContactItems = (customer: Customer) => {
  const items: Array<{
    icon: React.ReactElement;
    label: string;
    value: string;
    type: string;
    color: string;
  }> = [];

  CONTACT_CONFIGS.forEach(config => {
    const values = customer[config.key] as string[] | undefined;
    
    values?.forEach((value, index) => {
      if (value?.trim()) {
        items.push({
          icon: config.icon,
          label: values.length > 1 ? `${config.label} ${index + 1}` : config.label,
          value: value.trim(),
          type: config.type,
          color: config.color
        });
      }
    });
  });

  return items;
};

// Loading component
const LoadingState: React.FC = () => (
  <Layout title="Loading Customer">
    <Box className="flex items-center justify-center py-12">
      <Stack spacing={2} alignItems="center">
        <CircularProgress />
        <Typography variant="body1">{MESSAGES.LOADING}</Typography>
      </Stack>
    </Box>
  </Layout>
);

// Error component
const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <Layout title="Customer Not Found">
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Alert severity="error">{error}</Alert>
    </div>
  </Layout>
);

// Customer profile header component
const CustomerHeader: React.FC<{ customer: Customer }> = ({ customer }) => (
  <Box className="text-center mb-8">
    <Avatar
      src={customer.companyLogo}
      className="w-28 h-28 mx-auto mb-4 bg-blue-500 text-white text-2xl shadow-lg"
      sx={{ width: 112, height: 112 }}
    >
      {!customer.companyLogo && getInitials(customer.name)}
    </Avatar>
    
    <Typography variant="h4" className="font-bold mb-2 text-gray-800">
      {customer.name}
    </Typography>
    
    {customer.description && (
      <Typography variant="body1" className="text-gray-600 mb-4 max-w-md mx-auto">
        {customer.description}
      </Typography>
    )}
  </Box>
);

// Contact card component
const ContactCard: React.FC<{
  item: {
    icon: React.ReactElement;
    label: string;
    value: string;
    type: string;
    color: string;
  };
  onClick: () => void;
}> = ({ item, onClick }) => (
  <Card
    className="cursor-pointer group transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
    onClick={onClick}
    sx={{
      borderRadius: 3,
      border: `2px solid ${item.color}20`,
      '&:hover': {
        borderColor: item.color,
        transform: 'scale(1.05)',
        boxShadow: `0 8px 25px ${item.color}30`
      }
    }}
  >
    <CardContent className="p-6 text-center">
      <Box
        className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-3 transition-all duration-300"
        sx={{ 
          backgroundColor: item.color,
          color: 'white',
          '& svg': { fontSize: '2rem' }
        }}
      >
        {item.icon}
      </Box>
      
      <Typography 
        variant="body2" 
        className="font-medium transition-colors duration-200"
        sx={{ color: item.color }}
      >
        {item.label}
      </Typography>
    </CardContent>
  </Card>
);

// Main component
const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { customer, isLoading, error } = useCustomer(id);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!customer) return <ErrorState error={MESSAGES.PAGE_NOT_FOUND} />;

  const contactItems = generateContactItems(customer);

  return (
    <Layout title={customer.name}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <CustomerHeader customer={customer} />
        
        {contactItems.length > 0 && (
          <Box className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {contactItems.map((item, index) => (
              <ContactCard
                key={`${item.type}-${index}`}
                item={item}
                onClick={() => openLink(item.value, item.type)}
              />
            ))}
          </Box>
        )}
      </div>
    </Layout>
  );
};

export default CustomerDetails;