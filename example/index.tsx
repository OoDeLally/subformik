import { Field, Form, useFormikContext } from 'formik';
import * as React from 'react';
import { useState } from 'react';
import 'react-app-polyfill/ie11';
import * as ReactDOM from 'react-dom';
import { SubFormikRoot } from 'subformik';
import { BookSubFormik } from './BookSubFormik';

interface Book {
  title: string;
  year: number;
}

interface FormValue {
  authorName: string;
  books: Book[];
}

const initialValues: FormValue = {
  authorName: 'Harper Lee',
  books: [
    {
      title: 'To kill a mockingbird',
      year: 1960,
    },
    {
      title: 'Go Set a Watchman',
      year: 2015,
    },
  ],
};

const App = () => {
  const [submittedValue, setSubmittedValue] = useState<FormValue>();

  return (
    <div>
      <SubFormikRoot initialValues={initialValues} onSubmit={setSubmittedValue}>
        <FormInner />
      </SubFormikRoot>
      {submittedValue && (
        <div>
          Last submitted value:
          <pre>{JSON.stringify(submittedValue, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const FormInner = () => {
  const { values } = useFormikContext<FormValue>();
  const { books } = values;
  return (
    <Form>
      <Field name="authorName" />
      {books.map((book, bookIndex) => (
        <BookSubFormik key={bookIndex} path={`books[${bookIndex}]`} />
      ))}
      <div>
        Current value:
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </div>
      <button type="submit">Submit</button>
    </Form>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
