import React from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'textarea';
  placeholder?: string;
  rows?: number;
  register: UseFormRegister<any>;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  rows,
  register,
  required = false
}) => {
  const commonProps = {
    ...register(name, { required }),
    placeholder
  };

  return (
    <div className="form-field">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          rows={rows || 3}
          className="form-textarea"
          {...commonProps}
        />
      ) : (
        <input
          id={name}
          type={type}
          className="form-input"
          {...commonProps}
        />
      )}
    </div>
  );
};

export default FormField;
