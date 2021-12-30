# SubFormik - Nested reusable forms for Formik

[Demo](https://codepen.io/OodeLally-Github/pen/vYedMNM).

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

A more complete working demo is available here: [Demo](https://codepen.io/OodeLally-Github/pen/vYedMNM).

### Validation and error management

All provided validation functions and schemas are run and the results are aggregated into a global error object:
```ts
const { errors } = useFormikContext() // done at the root level
{
  city: "City must be longer than 1 character",
  'user[3].age': 'Age cannot be negative',
}
```

Then re-dispatched to the subforms:

```ts
const { errors } = useFormikContext() // done at the `user` subform level
{
  age: 'Age cannot be negative',
}
```

This design allows you to make each subform only care about its own state, its own validation strategy, and its own errors.


### Roadmap

Nothing specific for now.

It is very possible that a feature available with vanilla Formik is currently not with SubFormik.
If you think such feature can benefit everybody, feel free to ask for it, or propose a PR.
