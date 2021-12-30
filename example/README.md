# SubFormik - Example

## Running the example

TSDX does not seem to handle peer dependencies, but we still need to make sure SubFormik is going to use the same Formik context as the parent app.
Therefore it is necessary to follow VERY carefully the following steps:


```bash

# Place yourself to subformik repo root. NOT in the example folder.
cd /path/to/subformik/repo/

rm -fr node_modules example/node_modules

# Forces yarn to add formik. This is necessary for the first compilation.
# As a side effect, it also does `yarn install`.
yarn add -P formik

# Now that we compiled it, we need to remove Formik, so that it uses the peer formik of the parent app.
rm -fr node_modules/formik/

# Go to example and run it
cd ./example
rm -fr node_modules
yarn install
rm -fr .parcel-cache # Optional, but it can help sometimes.
yarn start

```

## Troubleshooting

### (typescript) Error: SubFormikRoot.tsx: semantic error TS2307: Cannot find module 'formik' or its corresponding type declarations.

You probably did not follow the above steps, especially `yarn add -P formik`.


### Uncaught TypeError: Cannot destructure property 'values' of '_formik.useFormikContext(...)' as it is undefined.

You probably did not follow the above steps, especially `rm -fr node_modules/formik/`.
