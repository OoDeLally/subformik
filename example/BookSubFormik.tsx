import { Field } from 'formik';
import * as React from 'react';
import { SubFormik } from 'subformik';

export const BookSubFormik = ({ path }: { path: string }) => {
  return (
    <div>
      <SubFormik path={path}>
        <Field name="title" />
        <Field name="year" type="number" />
      </SubFormik>
    </div>
  );
};
