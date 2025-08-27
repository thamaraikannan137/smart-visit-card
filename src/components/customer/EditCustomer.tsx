import React, { useEffect } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { Customer } from "../../types/customer.type";
import { FORM_FIELDS, FORM_LABELS, BUTTON_LABELS, TITLES } from "../../constants";
import { normalizeUrl } from "../../utils/helpers";
import FormField from "../shared/FormField";
import "../shared/Form.css";

interface EditCustomerProps {
  onBack: () => void;
  onUpdateCustomer: (customer: Customer) => void;
  customer: Customer;
}
const EditCustomer: React.FC<EditCustomerProps> = ({ onBack, onUpdateCustomer, customer }) => {
  const { register, handleSubmit } = useForm<FieldValues>({
    defaultValues: customer
  });
  useEffect(() => {
      
  },[])
  const onSubmit = (formData: FieldValues) => {
    const updatedCustomer: Customer = {
      id: customer.id,
      name: formData[FORM_FIELDS.NAME] || '',
      email: formData[FORM_FIELDS.EMAIL] || '',
      phoneNumber: formData[FORM_FIELDS.PHONE_NUMBER] || '',
      whatsappNumber: formData[FORM_FIELDS.WHATSAPP_NUMBER] || '',
      websiteUrl: normalizeUrl(formData[FORM_FIELDS.WEBSITE_URL] || ''),
      companyLogo: normalizeUrl(formData[FORM_FIELDS.COMPANY_LOGO] || ''),
      description: formData[FORM_FIELDS.DESCRIPTION] || ''
    };
    onUpdateCustomer(updatedCustomer);
    onBack();
  }
  return (
    <div className="customer-form">
      <h1>{TITLES.EDIT_CUSTOMER}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label={FORM_LABELS.NAME}
          name={FORM_FIELDS.NAME}
          type="text"
          register={register}
          required
        />
        <FormField
          label={FORM_LABELS.EMAIL}
          name={FORM_FIELDS.EMAIL}
          type="email"
          register={register}
          required
        />
        <FormField
          label={FORM_LABELS.PHONE_NUMBER}
          name={FORM_FIELDS.PHONE_NUMBER}
          type="tel"
          register={register}
          required
        />
        <FormField
          label={FORM_LABELS.WHATSAPP_NUMBER}
          name={FORM_FIELDS.WHATSAPP_NUMBER}
          type="tel"
          register={register}
        />
        <FormField
          label={FORM_LABELS.WEBSITE_URL}
          name={FORM_FIELDS.WEBSITE_URL}
          type="url"
          placeholder="www.example.com or https://example.com"
          register={register}
        />
        <FormField
          label={FORM_LABELS.COMPANY_LOGO}
          name={FORM_FIELDS.COMPANY_LOGO}
          type="url"
          placeholder="https://example.com/logo.png"
          register={register}
        />
        <FormField
          label={FORM_LABELS.DESCRIPTION}
          name={FORM_FIELDS.DESCRIPTION}
          type="textarea"
          rows={3}
          register={register}
        />
        <div className="form-buttons">
          <button type="button" className="form-button secondary" onClick={onBack}>
            {BUTTON_LABELS.BACK}
          </button>
          <button type="submit" className="form-button primary">
            {BUTTON_LABELS.SUBMIT}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCustomer;
