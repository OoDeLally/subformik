import { Field, FormikErrors, useFormikContext } from 'formik';
import * as React from 'react';
import { SubFormik } from 'subformik';
import * as Yup from 'yup';

export interface Book {
  title: string;
  year: number;
}

const schema = Yup.object({
  title: Yup.string().min(1),
  year: Yup.number().min(1000),
});

const validate = ({ title, year }: Book): FormikErrors<Book> => {
  const errors: FormikErrors<Book> = {};
  const titleMaxLength = 25;
  const maxYear = 3000;
  if (title.length > titleMaxLength) {
    errors.title = `Max length is ${titleMaxLength}`;
  }
  if (year > maxYear) {
    errors.year = `Max length is ${maxYear}`;
  }
  return errors;
};

const labelStyle = {
  display: 'block',
};

const errorMessageStyle = {
  marginLeft: '1em',
  color: 'red',
};

export const BookSubFormik = ({ path }: { path: string }) => {
  return (
    <div style={{ marginBottom: '1em' }}>
      <SubFormik path={path} validationSchema={schema} validate={validate}>
        <Inner />
      </SubFormik>
    </div>
  );
};

const Inner = () => {
  const { errors } = useFormikContext<Book>();
  return (
    <>
      <label style={labelStyle}>
        Title: <Field name="title" />
        {errors.title && <span style={errorMessageStyle}>{errors.title}</span>}
      </label>
      <label style={labelStyle}>
        Year: <Field name="year" type="number" />
        {errors.year && <span style={errorMessageStyle}>{errors.year}</span>}
      </label>
    </>
  );
};
