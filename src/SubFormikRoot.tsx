/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, FormikConfig, FormikErrors, yupToFormErrors } from 'formik';
import { get, mapKeys } from 'lodash';
import React, { ReactElement, useCallback } from 'react';
import * as Yup from 'yup';
import {
  SubFormikRootContext,
  useSubFormikRootContext,
} from './subFormikRootContext';

export function SubFormikRoot<Values>({
  validate,
  validationSchema,
  children,
  ...otherProps
}: FormikConfig<Values>): ReactElement {
  return (
    <SubFormikRootContext
      validateRootValue={validate}
      rootValueValidationSchema={validationSchema}
    >
      <Inner formikProps={otherProps}>{children}</Inner>
    </SubFormikRootContext>
  );
}

interface InnerProps<Values> extends Pick<FormikConfig<Values>, 'children'> {
  formikProps: Omit<
    FormikConfig<Values>,
    'validate' | 'validateSchema' | 'children'
  >;
}

const validateSchema = async (
  schema: Yup.ObjectSchema<any>,
  values: unknown
): Promise<FormikErrors<unknown>> => {
  try {
    await schema.validate(values);
    return {};
  } catch (error) {
    if (error.name === 'ValidationError') {
      return yupToFormErrors(error);
    } else {
      // We throw any other errors
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(
          'Warning: An unhandled error was caught during validation in <SubFormikRoot validationSchema />',
          error
        );
      }
      throw error;
    }
  }
};

function Inner<Values>({
  formikProps,
  children,
}: InnerProps<Values>): ReactElement {
  const { rootForm, subFormsRef } = useSubFormikRootContext();
  const aggregatedValidate = useCallback(
    async (rootValues: Values) => {
      let allErrors: FormikErrors<any> = {};
      // All validationSchemas
      if (rootForm.validationSchema) {
        const errors = await validateSchema(
          rootForm.validationSchema,
          rootValues
        );
        allErrors = { ...allErrors, ...errors };
      }
      const subForms = subFormsRef.current || [];
      await Promise.all(
        subForms.map(async ({ path, validationSchema }) => {
          const value = get(rootValues, path);
          if (value !== undefined && value !== null) {
            if (validationSchema) {
              const errors = await validateSchema(validationSchema, value);
              allErrors = {
                ...allErrors,
                ...mapKeys(errors, (_val, key) => `${path}.${key}`),
              };
            }
          }
        })
      );
      // All validate functions
      if (rootForm.validate) {
        allErrors = {
          ...allErrors,
          ...((await rootForm.validate(rootValues)) || {}),
        };
      }
      await Promise.all(
        subForms.map(async ({ path, validate }) => {
          const value = get(rootValues, path);
          if (value !== undefined && value !== null) {
            if (validate) {
              const errors = (await validate(value)) || {};
              allErrors = {
                ...allErrors,
                ...mapKeys(errors, (_val, key) => `${path}.${key}`),
              };
            }
          }
        })
      );
      // console.log('allErrors', JSON.stringify(allErrors, null, 2));
      return allErrors;
    },
    [rootForm, subFormsRef]
  );

  return (
    <Formik validate={aggregatedValidate} {...formikProps}>
      {children}
    </Formik>
  );
}
