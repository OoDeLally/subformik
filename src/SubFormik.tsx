/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, FormikConfig, FormikErrors, useFormikContext } from 'formik';
import { chain, get } from 'lodash';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { generateUniqueId } from './helpers/generateUniqueId';
import { useSubFormikRootContext } from './subFormikRootContext';

type FormikConfigKeys =
  | 'children'
  | 'onReset'
  | 'validationSchema'
  | 'validate'
  | 'innerRef';

interface SubFormikProps<Values>
  extends Pick<FormikConfig<Values>, FormikConfigKeys> {
  path: string;
}

type ParentFormValue = unknown;

export function SubFormik<Values>({
  path,
  onReset,
  validationSchema,
  validate,
  innerRef,
  children,
}: SubFormikProps<Values>): ReactElement {
  const subformId = useRef(generateUniqueId()).current;
  const {
    values: rootValues,
    errors: rootErrors,
    setFieldValue,
    submitForm,
    isInitialValid,
  } = useFormikContext<ParentFormValue>();
  const { registerSubForm, unregisterSubForm } = useSubFormikRootContext();
  const value = get(rootValues, path);
  const error = useMemo<FormikErrors<Values>>(
    () =>
      chain(rootErrors)
        .pickBy((_val, key) => key.startsWith(path))
        .mapKeys((_val, key) => key.substring(path.length + 1))
        .value() as any as FormikErrors<Values>,
    [rootErrors, path]
  );
  // console.log("error", error);
  // console.log("value", value);

  const handleChange = useCallback(
    (newValue: Values) => {
      setFieldValue(path, newValue);
    },
    [path, setFieldValue]
  );

  useEffect(() => {
    registerSubForm({ id: subformId, path, validate, validationSchema });
    return () => {
      unregisterSubForm(subformId);
    };
  }, [
    path,
    registerSubForm,
    subformId,
    unregisterSubForm,
    validate,
    validationSchema,
  ]);

  return (
    <Formik
      initialValues={value}
      initialErrors={error}
      enableReinitialize={true}
      onSubmit={submitForm}
      onReset={onReset}
      innerRef={innerRef}
      validateOnChange={false} // Controlled by SubFormikRoot
      validateOnBlur={false} // Controlled by SubFormikRoot
      validateOnMount={false} // Controlled by SubFormikRoot
      isInitialValid={isInitialValid}
    >
      <FormInner onChange={handleChange}>{children}</FormInner>
    </Formik>
  );
}

interface FormInnerProps<Values>
  extends Pick<FormikConfig<Values>, 'children'> {
  onChange: (newValue: Values) => void;
}

function FormInner<Values>({ children, onChange }: FormInnerProps<Values>) {
  const { values } = useFormikContext<Values>();
  useLayoutEffect(() => {
    onChange(values);
  }, [onChange, values]);
  return <>{children}</>;
}
