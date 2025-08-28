import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { 
  Box, 
  Typography, 
  Avatar, 
  Chip, 
  Stack,
  Divider,
  IconButton,
  TextField,
  Button,
  Card,
  CardContent,
  Alert
} from "@mui/material";
import { 
  Add as AddIcon, 
  Remove as RemoveIcon, 
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  Edit as EditIcon,
  ArrowBack as BackIcon,
  Update as UpdateIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  LocationOn as LocationIcon
} from "@mui/icons-material";
import { Customer } from "../../types/customer.type";
import { TITLES } from "../../constants";
import { normalizeUrl } from "../../utils/helpers";
import Layout from "../shared/Layout";
import PageHeader from "../shared/PageHeader";
import ImageUpload from "../shared/ImageUpload";

interface EditCustomerV2Props {
  onBack: () => void;
  onUpdateCustomer: (customer: Customer) => Promise<void>;
  customer: Customer;
}

// Form data type for React Hook Form - using object structure for field arrays
interface FormData {
  name: string;
  emails: Array<{ value: string }>;
  phoneNumbers: Array<{ value: string }>;
  whatsappNumbers: Array<{ value: string }>;
  websiteUrls: Array<{ value: string }>;
  companyLogo: string;
  description: string;
  facebookUrls: Array<{ value: string }>;
  instagramUrls: Array<{ value: string }>;
  youtubeUrls: Array<{ value: string }>;
  locationUrls: Array<{ value: string }>;
}

// Form validation rules
const validationRules = {
  name: {
    required: 'Customer name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' },
    maxLength: { value: 100, message: 'Name cannot exceed 100 characters' }
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    }
  },
  phone: {
    pattern: {
      value: /^[+]?[1-9][\d\s\-()]{7,15}$/,
      message: 'Please enter a valid phone number'
    }
  },
  url: {
    pattern: {
      value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i,
      message: 'Please enter a valid URL'
    }
  },
  description: {
    maxLength: { value: 500, message: 'Description cannot exceed 500 characters' }
  }
};

const EditCustomerV2: React.FC<EditCustomerV2Props> = ({ onBack, onUpdateCustomer, customer }) => {
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Convert customer data to form format
  const getDefaultValues = (customer: Customer): FormData => ({
    name: customer.name || '',
    emails: customer.emails?.length ? customer.emails.map(email => ({ value: email })) : [{ value: '' }],
    phoneNumbers: customer.phoneNumbers?.length ? customer.phoneNumbers.map(phone => ({ value: phone })) : [{ value: '' }],
    whatsappNumbers: customer.whatsappNumbers?.length ? customer.whatsappNumbers.map(whatsapp => ({ value: whatsapp })) : [{ value: '' }],
    websiteUrls: customer.websiteUrls?.length ? customer.websiteUrls.map(url => ({ value: url })) : [{ value: '' }],
    companyLogo: customer.companyLogo || '',
    description: customer.description || '',
    facebookUrls: customer.facebookUrls?.length ? customer.facebookUrls.map(url => ({ value: url })) : [{ value: '' }],
    instagramUrls: customer.instagramUrls?.length ? customer.instagramUrls.map(url => ({ value: url })) : [{ value: '' }],
    youtubeUrls: customer.youtubeUrls?.length ? customer.youtubeUrls.map(url => ({ value: url })) : [{ value: '' }],
    locationUrls: customer.locationUrls?.length ? customer.locationUrls.map(url => ({ value: url })) : [{ value: '' }]
  });

  const form = useForm<FormData>({
    defaultValues: getDefaultValues(customer),
    mode: 'onChange'
  });

  const { 
    control, 
    handleSubmit, 
    watch, 
    formState: { errors, isSubmitting, isValid },
    reset
  } = form;

  // Update form when customer prop changes
  useEffect(() => {
    reset(getDefaultValues(customer));
  }, [customer, reset]);

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail
  } = useFieldArray<FormData>({ control, name: 'emails' });

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone
  } = useFieldArray<FormData>({ control, name: 'phoneNumbers' });

  const {
    fields: whatsappFields,
    append: appendWhatsapp,
    remove: removeWhatsapp
  } = useFieldArray<FormData>({ control, name: 'whatsappNumbers' });

  const {
    fields: websiteFields,
    append: appendWebsite,
    remove: removeWebsite
  } = useFieldArray<FormData>({ control, name: 'websiteUrls' });

  const {
    fields: facebookFields,
    append: appendFacebook,
    remove: removeFacebook
  } = useFieldArray<FormData>({ control, name: 'facebookUrls' });

  const {
    fields: instagramFields,
    append: appendInstagram,
    remove: removeInstagram
  } = useFieldArray<FormData>({ control, name: 'instagramUrls' });

  const {
    fields: youtubeFields,
    append: appendYoutube,
    remove: removeYoutube
  } = useFieldArray<FormData>({ control, name: 'youtubeUrls' });

  const {
    fields: locationFields,
    append: appendLocation,
    remove: removeLocation
  } = useFieldArray<FormData>({ control, name: 'locationUrls' });

  // Watch form values for live preview
  const watchedValues = watch();

  const getInitials = (name: string) => {
    if (!name) return customer.name?.charAt(0)?.toUpperCase() || 'C';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    
    try {
      // Clean up data by removing empty strings and convert to Customer
      const updatedCustomer: Customer = {
        id: customer.id,
        name: data.name.trim(),
        emails: data.emails.map(item => item.value).filter(email => email.trim() !== ''),
        phoneNumbers: data.phoneNumbers.map(item => item.value).filter(phone => phone.trim() !== ''),
        whatsappNumbers: data.whatsappNumbers.map(item => item.value).filter(whatsapp => whatsapp.trim() !== ''),
        websiteUrls: data.websiteUrls.map(item => normalizeUrl(item.value)).filter(url => url.trim() !== ''),
        companyLogo: normalizeUrl(data.companyLogo),
        description: data.description.trim(),
        facebookUrls: data.facebookUrls.map(item => normalizeUrl(item.value)).filter(url => url.trim() !== ''),
        instagramUrls: data.instagramUrls.map(item => normalizeUrl(item.value)).filter(url => url.trim() !== ''),
        youtubeUrls: data.youtubeUrls.map(item => normalizeUrl(item.value)).filter(url => url.trim() !== ''),
        locationUrls: data.locationUrls.map(item => item.value).filter(location => location.trim() !== '')
      };
      
      await onUpdateCustomer(updatedCustomer);
      onBack();
    } catch (err: any) {
      setApiError(err.message || 'Failed to update customer. Please try again.');
    }
  };

  return (
    <Layout title="Edit Customer">
      <Box className="max-w-7xl mx-auto p-6">
        <PageHeader
          title={`${TITLES.EDIT_CUSTOMER}: ${customer.name}`}
          subtitle="Update customer information and add new contact details"
          showBackButton
          onBack={onBack}
        />

        <Alert severity="info" className="mb-6">
          <Typography variant="body2">
            <strong>Edit Mode:</strong> You can modify existing information and add new contact details. 
            Use the <strong>+</strong> buttons to add more fields as needed.
          </Typography>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Preview - Sticky Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6" elevation={3}>
              <CardContent className="p-6">
                <Typography variant="h6" className="mb-4 text-gray-700 font-semibold flex items-center">
                  <EditIcon className="mr-2" />
                  Live Preview
                </Typography>
                
                <Stack spacing={4} alignItems="center" className="text-center">
                  <Avatar
                    src={watchedValues.companyLogo || customer.companyLogo}
                    className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 text-white text-xl"
                    sx={{ width: 80, height: 80 }}
                  >
                    {getInitials(watchedValues.name)}
                  </Avatar>
                  
                  <Box>
                    <Typography variant="h6" className="font-semibold text-gray-800">
                      {watchedValues.name || customer.name}
                    </Typography>
                    {(watchedValues.description || customer.description) && (
                      <Typography variant="body2" className="text-gray-600 mt-1">
                        {watchedValues.description || customer.description}
                      </Typography>
                    )}
                  </Box>
                  
                  <Box className="w-full space-y-2">
                    {watchedValues.emails?.filter(item => item?.value?.trim()).map((item, index) => (
                      <Chip 
                        key={`email-${index}`}
                        label={item.value} 
                        size="small" 
                        variant="filled"
                        color="primary"
                        className="mx-1"
                      />
                    ))}
                    {watchedValues.phoneNumbers?.filter(item => item?.value?.trim()).map((item, index) => (
                      <Chip 
                        key={`phone-${index}`}
                        label={item.value} 
                        size="small" 
                        variant="filled"
                        color="success"
                        className="mx-1"
                      />
                    ))}
                    {watchedValues.whatsappNumbers?.filter(item => item?.value?.trim()).map((item, index) => (
                      <Chip 
                        key={`whatsapp-${index}`}
                        label={`WhatsApp: ${item.value}`} 
                        size="small" 
                        variant="filled"
                        color="info"
                        className="mx-1"
                      />
                    ))}
                  </Box>

                  <Chip 
                    label="Existing Customer" 
                    size="small" 
                    color="secondary"
                    variant="outlined"
                  />
                </Stack>
              </CardContent>
            </Card>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card elevation={3}>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={6}>
                    {/* Basic Information */}
                    <Box>
                      <Typography variant="h5" className="mb-6 text-gray-800 font-semibold flex items-center">
                        <PersonIcon className="mr-2 text-blue-600" />
                        Basic Information
                      </Typography>
                      
                      <Stack spacing={4}>
                        <Controller
                          name="name"
                          control={control}
                          rules={validationRules.name}
                          render={({ field, fieldState: { error } }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Customer Name *"
                              placeholder="Enter full customer or company name"
                              error={!!error}
                              helperText={error?.message}
                              variant="outlined"
                            />
                          )}
                        />
                        
                        <Controller
                          name="companyLogo"
                          control={control}
                          rules={validationRules.url}
                          render={({ field, fieldState: { error } }) => (
                            <ImageUpload
                              value={field.value}
                              onChange={field.onChange}
                              label="Company Logo"
                              helperText="Upload an image file or provide a URL"
                              error={!!error}
                              errorMessage={error?.message}
                            />
                          )}
                        />
                        
                        <Controller
                          name="description"
                          control={control}
                          rules={validationRules.description}
                          render={({ field, fieldState: { error } }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Description"
                              placeholder="Brief description about the customer or company"
                              multiline
                              rows={3}
                              error={!!error}
                              helperText={error?.message || `${field.value?.length || 0}/500 characters`}
                              variant="outlined"
                            />
                          )}
                        />
                      </Stack>
                    </Box>

                    <Divider />

                    {/* Contact Information */}
                    <Box>
                      <Typography variant="h5" className="mb-6 text-gray-800 font-semibold flex items-center">
                        <EmailIcon className="mr-2 text-green-600" />
                        Contact Information
                      </Typography>
                      
                      <Stack spacing={6}>
                        <Box>
                          <Typography variant="h6" className="mb-4 text-gray-800 font-medium flex items-center">
                            <EmailIcon className="mr-2" />
                            Email Addresses
                            <Chip 
                              label={emailFields.filter(field => watchedValues.emails?.[emailFields.indexOf(field)]?.value?.trim()).length} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                              className="ml-2"
                            />
                          </Typography>
                          {emailFields.map((field, index) => (
                            <Box key={field.id} className="mb-3">
                              <Stack direction="row" spacing={2} alignItems="flex-start">
                                <Controller
                                  name={`emails.${index}.value`}
                                  control={control}
                                  rules={index === 0 ? validationRules.email : { pattern: validationRules.email.pattern }}
                                  render={({ field: inputField, fieldState: { error } }) => (
                                    <TextField
                                      {...inputField}
                                      fullWidth
                                      label={`Email ${index + 1}${index === 0 ? ' *' : ''}`}
                                      placeholder="email@example.com"
                                      type="email"
                                      error={!!error}
                                      helperText={error?.message}
                                      variant="outlined"
                                      size="small"
                                    />
                                  )}
                                />
                                {emailFields.length > 1 && (
                                  <IconButton onClick={() => removeEmail(index)} color="error" size="small">
                                    <RemoveIcon />
                                  </IconButton>
                                )}
                              </Stack>
                            </Box>
                          ))}
                          {emailFields.length < 5 && (
                            <Button
                              startIcon={<AddIcon />}
                              onClick={() => appendEmail({ value: '' })}
                              variant="outlined"
                              size="small"
                            >
                              Add Email
                            </Button>
                          )}
                        </Box>
                        
                        <Box>
                          <Typography variant="h6" className="mb-4 text-gray-800 font-medium flex items-center">
                            <PhoneIcon className="mr-2" />
                            Phone Numbers
                            <Chip 
                              label={phoneFields.filter(field => watchedValues.phoneNumbers?.[phoneFields.indexOf(field)]?.value?.trim()).length} 
                              size="small" 
                              color="success" 
                              variant="outlined"
                              className="ml-2"
                            />
                          </Typography>
                          {phoneFields.map((field, index) => (
                            <Box key={field.id} className="mb-3">
                              <Stack direction="row" spacing={2} alignItems="flex-start">
                                <Controller
                                  name={`phoneNumbers.${index}.value`}
                                  control={control}
                                  rules={validationRules.phone}
                                  render={({ field: inputField, fieldState: { error } }) => (
                                    <TextField
                                      {...inputField}
                                      fullWidth
                                      label={`Phone ${index + 1}`}
                                      placeholder="+1 (555) 123-4567"
                                      type="tel"
                                      error={!!error}
                                      helperText={error?.message}
                                      variant="outlined"
                                      size="small"
                                    />
                                  )}
                                />
                                {phoneFields.length > 1 && (
                                  <IconButton onClick={() => removePhone(index)} color="error" size="small">
                                    <RemoveIcon />
                                  </IconButton>
                                )}
                              </Stack>
                            </Box>
                          ))}
                          {phoneFields.length < 3 && (
                            <Button
                              startIcon={<AddIcon />}
                              onClick={() => appendPhone({ value: '' })}
                              variant="outlined"
                              size="small"
                            >
                              Add Phone
                            </Button>
                          )}
                        </Box>
                        
                        <Box>
                          <Typography variant="h6" className="mb-4 text-gray-800 font-medium flex items-center">
                            <PhoneIcon className="mr-2" />
                            WhatsApp Numbers
                            <Chip 
                              label={whatsappFields.filter(field => watchedValues.whatsappNumbers?.[whatsappFields.indexOf(field)]?.value?.trim()).length} 
                              size="small" 
                              color="info" 
                              variant="outlined"
                              className="ml-2"
                            />
                          </Typography>
                          {whatsappFields.map((field, index) => (
                            <Box key={field.id} className="mb-3">
                              <Stack direction="row" spacing={2} alignItems="flex-start">
                                <Controller
                                  name={`whatsappNumbers.${index}.value`}
                                  control={control}
                                  rules={validationRules.phone}
                                  render={({ field: inputField, fieldState: { error } }) => (
                                    <TextField
                                      {...inputField}
                                      fullWidth
                                      label={`WhatsApp ${index + 1}`}
                                      placeholder="+1 (555) 123-4567"
                                      type="tel"
                                      error={!!error}
                                      helperText={error?.message}
                                      variant="outlined"
                                      size="small"
                                    />
                                  )}
                                />
                                {whatsappFields.length > 1 && (
                                  <IconButton onClick={() => removeWhatsapp(index)} color="error" size="small">
                                    <RemoveIcon />
                                  </IconButton>
                                )}
                              </Stack>
                            </Box>
                          ))}
                          {whatsappFields.length < 3 && (
                            <Button
                              startIcon={<AddIcon />}
                              onClick={() => appendWhatsapp({ value: '' })}
                              variant="outlined"
                              size="small"
                            >
                              Add WhatsApp
                            </Button>
                          )}
                        </Box>
                      </Stack>
                    </Box>

                    <Divider />

                    {/* Online Presence */}
                    <Box>
                      <Typography variant="h5" className="mb-6 text-gray-800 font-semibold flex items-center">
                        <WebsiteIcon className="mr-2 text-purple-600" />
                        Online Presence
                      </Typography>
                      
                      <Stack spacing={6}>
                        <Box>
                          <Typography variant="h6" className="mb-4 text-gray-800 font-medium flex items-center">
                            <WebsiteIcon className="mr-2" />
                            Website URLs
                          </Typography>
                          {websiteFields.map((field, index) => (
                            <Box key={field.id} className="mb-3">
                              <Stack direction="row" spacing={2} alignItems="flex-start">
                                <Controller
                                  name={`websiteUrls.${index}.value`}
                                  control={control}
                                  rules={validationRules.url}
                                  render={({ field: inputField, fieldState: { error } }) => (
                                    <TextField
                                      {...inputField}
                                      fullWidth
                                      label={`Website URL ${index + 1}`}
                                      placeholder="https://www.example.com"
                                      type="url"
                                      error={!!error}
                                      helperText={error?.message}
                                      variant="outlined"
                                      size="small"
                                    />
                                  )}
                                />
                                {websiteFields.length > 1 && (
                                  <IconButton onClick={() => removeWebsite(index)} color="error" size="small">
                                    <RemoveIcon />
                                  </IconButton>
                                )}
                              </Stack>
                            </Box>
                          ))}
                          {websiteFields.length < 3 && (
                            <Button
                              startIcon={<AddIcon />}
                              onClick={() => appendWebsite({ value: '' })}
                              variant="outlined"
                              size="small"
                            >
                              Add Website
                            </Button>
                          )}
                        </Box>
                        
                        <Box>
                          <Typography variant="h6" className="mb-4 text-gray-800 font-medium flex items-center">
                            <FacebookIcon className="mr-2 text-blue-600" />
                            Facebook URLs
                          </Typography>
                          {facebookFields.map((field, index) => (
                            <Box key={field.id} className="mb-3">
                              <Stack direction="row" spacing={2} alignItems="flex-start">
                                <Controller
                                  name={`facebookUrls.${index}.value`}
                                  control={control}
                                  rules={validationRules.url}
                                  render={({ field: inputField, fieldState: { error } }) => (
                                    <TextField
                                      {...inputField}
                                      fullWidth
                                      label={`Facebook URL ${index + 1}`}
                                      placeholder="https://facebook.com/username"
                                      type="url"
                                      error={!!error}
                                      helperText={error?.message}
                                      variant="outlined"
                                      size="small"
                                    />
                                  )}
                                />
                                {facebookFields.length > 1 && (
                                  <IconButton onClick={() => removeFacebook(index)} color="error" size="small">
                                    <RemoveIcon />
                                  </IconButton>
                                )}
                              </Stack>
                            </Box>
                          ))}
                          {facebookFields.length < 2 && (
                            <Button
                              startIcon={<AddIcon />}
                              onClick={() => appendFacebook({ value: '' })}
                              variant="outlined"
                              size="small"
                            >
                              Add Facebook
                            </Button>
                          )}
                        </Box>
                        
                        <Box>
                          <Typography variant="h6" className="mb-4 text-gray-800 font-medium flex items-center">
                            <InstagramIcon className="mr-2 text-pink-600" />
                            Instagram URLs
                          </Typography>
                          {instagramFields.map((field, index) => (
                            <Box key={field.id} className="mb-3">
                              <Stack direction="row" spacing={2} alignItems="flex-start">
                                <Controller
                                  name={`instagramUrls.${index}.value`}
                                  control={control}
                                  rules={validationRules.url}
                                  render={({ field: inputField, fieldState: { error } }) => (
                                    <TextField
                                      {...inputField}
                                      fullWidth
                                      label={`Instagram URL ${index + 1}`}
                                      placeholder="https://instagram.com/username"
                                      type="url"
                                      error={!!error}
                                      helperText={error?.message}
                                      variant="outlined"
                                      size="small"
                                    />
                                  )}
                                />
                                {instagramFields.length > 1 && (
                                  <IconButton onClick={() => removeInstagram(index)} color="error" size="small">
                                    <RemoveIcon />
                                  </IconButton>
                                )}
                              </Stack>
                            </Box>
                          ))}
                          {instagramFields.length < 2 && (
                            <Button
                              startIcon={<AddIcon />}
                              onClick={() => appendInstagram({ value: '' })}
                              variant="outlined"
                              size="small"
                            >
                              Add Instagram
                            </Button>
                          )}
                        </Box>
                        
                        <Box>
                          <Typography variant="h6" className="mb-4 text-gray-800 font-medium flex items-center">
                            <YouTubeIcon className="mr-2 text-red-600" />
                            YouTube URLs
                          </Typography>
                          {youtubeFields.map((field, index) => (
                            <Box key={field.id} className="mb-3">
                              <Stack direction="row" spacing={2} alignItems="flex-start">
                                <Controller
                                  name={`youtubeUrls.${index}.value`}
                                  control={control}
                                  rules={validationRules.url}
                                  render={({ field: inputField, fieldState: { error } }) => (
                                    <TextField
                                      {...inputField}
                                      fullWidth
                                      label={`YouTube URL ${index + 1}`}
                                      placeholder="https://youtube.com/channel/..."
                                      type="url"
                                      error={!!error}
                                      helperText={error?.message}
                                      variant="outlined"
                                      size="small"
                                    />
                                  )}
                                />
                                {youtubeFields.length > 1 && (
                                  <IconButton onClick={() => removeYoutube(index)} color="error" size="small">
                                    <RemoveIcon />
                                  </IconButton>
                                )}
                              </Stack>
                            </Box>
                          ))}
                          {youtubeFields.length < 2 && (
                            <Button
                              startIcon={<AddIcon />}
                              onClick={() => appendYoutube({ value: '' })}
                              variant="outlined"
                              size="small"
                            >
                              Add YouTube
                            </Button>
                          )}
                        </Box>
                        
                        <Box>
                          <Typography variant="h6" className="mb-4 text-gray-800 font-medium flex items-center">
                            <LocationIcon className="mr-2 text-green-600" />
                            Locations
                          </Typography>
                          {locationFields.map((field, index) => (
                            <Box key={field.id} className="mb-3">
                              <Stack direction="row" spacing={2} alignItems="flex-start">
                                <Controller
                                  name={`locationUrls.${index}.value`}
                                  control={control}
                                  render={({ field: inputField, fieldState: { error } }) => (
                                    <TextField
                                      {...inputField}
                                      fullWidth
                                      label={`Location ${index + 1}`}
                                      placeholder="Address or Google Maps URL"
                                      error={!!error}
                                      helperText={error?.message}
                                      variant="outlined"
                                      size="small"
                                    />
                                  )}
                                />
                                {locationFields.length > 1 && (
                                  <IconButton onClick={() => removeLocation(index)} color="error" size="small">
                                    <RemoveIcon />
                                  </IconButton>
                                )}
                              </Stack>
                            </Box>
                          ))}
                          {locationFields.length < 3 && (
                            <Button
                              startIcon={<AddIcon />}
                              onClick={() => appendLocation({ value: '' })}
                              variant="outlined"
                              size="small"
                            >
                              Add Location
                            </Button>
                          )}
                        </Box>
                      </Stack>
                    </Box>

                    {/* Validation Errors */}
                    {Object.keys(errors).length > 0 && (
                      <Alert severity="warning" className="mb-4">
                        <Typography variant="body2" className="font-medium">
                          Please fix the following errors:
                        </Typography>
                        <ul className="mt-2 text-sm">
                          {Object.entries(errors).map(([field, error]) => (
                            <li key={field}>• {error?.message}</li>
                          ))}
                        </ul>
                      </Alert>
                    )}

                    {/* API Error Display */}
                    {apiError && (
                      <Alert severity="error" className="mb-4">
                        {apiError}
                      </Alert>
                    )}

                    {/* Action Buttons */}
                    <Box className="flex justify-end space-x-4 pt-4">
                      <Button
                        onClick={onBack}
                        variant="outlined"
                        size="large"
                        startIcon={<BackIcon />}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<UpdateIcon />}
                        disabled={isSubmitting || !isValid}
                        sx={{ minWidth: 140 }}
                      >
                        {isSubmitting ? 'Updating...' : 'Update Customer'}
                      </Button>
                    </Box>
                  </Stack>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </Box>
    </Layout>
  );
};

export default EditCustomerV2;
