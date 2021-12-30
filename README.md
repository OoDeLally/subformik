# SubFormik - Nested reusable forms for Formik

Demo is available here: [Demo](FIXME).

## Rationale

Vanilla Formik stores the form's state as a unique object.
When the form's state is highly structured, it starts to be hard to maintain nested states, because fields must access their own little state from the state's root e.g. `<Field name="user[3].books[2].title" />`.
In addition, it makes it tedious to create reusable forms.

SubFormik brings the simplicity, flexibility and reusability of having subforms which only have to care about their own state and validation.

## Setup

```bash
npm i subformik
```

In vanilla Formik, you would have something like that:

```tsx
<Formik validateSchema={completeFormSchema}>
  <Form>
    <Field name="city" />
    <Field name="user[3].age" />
  </Form>
</Formik>
```

With SubFormik, just replace `<Formik>` by `<SubFormikRoot>`:


```tsx
<SubFormikRoot validateSchema={rootValueSchema}>
  <Form>
    <Field name="city" />
    <SubFormik path="user[3]" validateSchema={userSchema}>
      <Field name="age" />
    </SubFormik>
  </Form>
</SubFormikRoot>
```

You can see that `<Field name="age" />` is local to its closest `SubFormik` context.


`<SubFormik />` creates a nested `<Formik />` context under the hood.
You can then use `useFormikContext()` exactly the same way you would do with vanilla Formik.


### Validation and error management

Every `<SubFormik />` registers their validation function/schema to a context exposed by `<SubFormikRoot />`.
The validation is done once for the whole form by `<SubFormikRoot />`, and all errors in the root and in the nested `<SubFormik />` are collected and aggregated to a unique error object of the following form:

```ts
# Example for the above setup.
{
  city: "City must be longer than 1 character",
  'user[3].age': 'Age cannot be negative',
}
```

However, if you fetch `const { errors } = useFormikContext()` from inside the nested `<SubFormik path="user[3]" />`, you will receive a different local error object with local keys:

```ts
# Example for the above setup.
{
  age: 'Age cannot be negative',
}
```

This design allows you to make subforms only care about their own state, their own validation strategy, and their own errors.


### Roadmap

Nothing specific for now.

It is very possible that a feature available with vanilla Formik is currently not with SubFormik.
If you think such feature can benefit everybody, feel free to ask for it, or propose a PR.
