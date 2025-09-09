import * as React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, CheckboxWithLabel } from 'formik-mui';
import { Button, Box, Stack, Typography, MenuItem } from '@mui/material';

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'date'
  | 'textarea';

export interface Option {
  label: string;
  value: string | number | boolean;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  options?: Option[];      // for select
  minLength?: number;
  maxLength?: number;
  pattern?: string;        // regex as string, e.g. "^[A-Z].+$"
  min?: number;            // for number
  max?: number;            // for number
  defaultValue?: any;
}

export interface FormConfig {
  title?: string;
  submitLabel?: string;
  fields: FieldConfig[];
  initialValues?: Record<string, any>;
}

export interface JsonFormProps {
  config: FormConfig;
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  width?: number; // px
}

function buildYupSchema(fields: FieldConfig[]) {
  const shape: Record<string, Yup.AnySchema> = {};

  fields.forEach((f) => {
    const label = f.label || f.name;
    let v: Yup.AnySchema;

    switch (f.type) {
      case 'number':
        v = Yup.number().typeError(`${label} must be a number`);
        if (typeof f.min === 'number')
          v = (v as Yup.NumberSchema).min(f.min, `${label} must be ≥ ${f.min}`);
        if (typeof f.max === 'number')
          v = (v as Yup.NumberSchema).max(f.max, `${label} must be ≤ ${f.max}`);
        break;
      case 'email':
        v = Yup.string().email('Invalid email address');
        if (f.minLength) v = (v as Yup.StringSchema).min(f.minLength);
        if (f.maxLength) v = (v as Yup.StringSchema).max(f.maxLength);
        if (f.pattern)
          v = (v as Yup.StringSchema).matches(
            new RegExp(f.pattern),
            `${label} is invalid`
          );
        break;
      case 'password':
      case 'text':
      case 'textarea':
      case 'date':
      default:
        v = Yup.string();
        if (f.minLength) v = (v as Yup.StringSchema).min(f.minLength);
        if (f.maxLength) v = (v as Yup.StringSchema).max(f.maxLength);
        if (f.pattern)
          v = (v as Yup.StringSchema).matches(
            new RegExp(f.pattern),
            `${label} is invalid`
          );
    }

    if (f.required) v = v.required('Required');
    shape[f.name] = v;
  });

  return Yup.object().shape(shape);
}

function deriveInitialValues(fields: FieldConfig[]) {
  return fields.reduce<Record<string, any>>((acc, f) => {
    if (typeof f.defaultValue !== 'undefined') acc[f.name] = f.defaultValue;
    else if (f.type === 'checkbox') acc[f.name] = false;
    else acc[f.name] = '';
    return acc;
  }, {});
}

export default function DynamicForm({ config, onSubmit, width = 420 }: JsonFormProps) {
  const { fields, title, submitLabel = 'Submit', initialValues } = config;
  const validationSchema = React.useMemo(() => buildYupSchema(fields), [fields]);
  const initValues = React.useMemo(
    () => initialValues || deriveInitialValues(fields),
    [initialValues, fields]
  );

  return (
    <Formik
      initialValues={initValues}
      validationSchema={validationSchema}
      onSubmit={async (values, helpers) => {
        await onSubmit(values);
        helpers.setSubmitting(false);
      }}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form>
          <Stack spacing={2} sx={{ width }}>
            {title && <Typography variant="h6">{title}</Typography>}

            {fields.map((f) => {
              if (f.type === 'checkbox') {
                return (
                  <Field
                    key={f.name}
                    type="checkbox"
                    name={f.name}
                    component={CheckboxWithLabel}
                    Label={{ label: f.label }}
                  />
                );
              }

              if (f.type === 'select') {
                return (
                  <Field
                    key={f.name}
                    component={TextField}
                    name={f.name}
                    label={f.label}
                    helperText={f.helperText}
                    placeholder={f.placeholder}
                    select
                    fullWidth
                  >
                    {f.options?.map((opt) => (
                      <MenuItem key={String(opt.value)} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Field>
                );
              }

              if (f.type === 'date') {
                return (
                  <Field
                    key={f.name}
                    component={TextField}
                    name={f.name}
                    label={f.label}
                    type="date"
                    helperText={f.helperText}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                );
              }

              return (
                <Field
                  key={f.name}
                  component={TextField}
                  name={f.name}
                  label={f.label}
                  type={f.type === 'textarea' ? 'text' : f.type}
                  helperText={f.helperText}
                  placeholder={f.placeholder}
                  fullWidth
                  multiline={f.type === 'textarea'}
                  minRows={f.type === 'textarea' ? 3 : undefined}
                />
              );
            })}

            <Box>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {submitLabel}
              </Button>
            </Box>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
