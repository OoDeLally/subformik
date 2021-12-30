/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormikConfig } from 'formik';
import React, {
  Dispatch,
  ReactElement,
  RefObject,
  useContext,
  useMemo,
  useRef,
} from 'react';

type FormConfig<Values> = Pick<
  FormikConfig<Values>,
  'validate' | 'validationSchema'
>;

type SubFormId = number;

type SubFormConfig<Values> = {
  id: SubFormId;
  path: string;
} & FormConfig<Values>;

interface SubFormikRootReactContextValue<RootValues> {
  // States
  rootForm: FormConfig<RootValues>;
  subFormsRef: RefObject<SubFormConfig<unknown>[]>;

  // Methods
  registerSubForm: Dispatch<SubFormConfig<any>>;
  unregisterSubForm: Dispatch<SubFormId>;
}

const SubFormikRootReactContext = React.createContext<
  SubFormikRootReactContextValue<any>
>(null!);

interface SubFormikRootContextProps<Values> {
  validateRootValue: FormikConfig<Values>['validate'];
  rootValueValidationSchema: FormikConfig<Values>['validationSchema'];
  children: ReactElement;
}

export function useSubFormikRootContext<
  Values
>(): SubFormikRootReactContextValue<Values> {
  const context = useContext(SubFormikRootReactContext);
  if (!context) {
    throw Error(
      `Missing SubFormikRootReactContext. Did you forget to wrap your form into a SubFormikRoot component?`
    );
  }
  return context;
}

export function SubFormikRootContext<Values>({
  validateRootValue,
  rootValueValidationSchema,
  children,
}: SubFormikRootContextProps<Values>): ReactElement {
  const subFormsRef = useRef<SubFormConfig<unknown>[]>([]);
  const contextValue = useMemo(
    () => ({
      rootForm: {
        validate: validateRootValue,
        validationSchema: rootValueValidationSchema,
      },
      subFormsRef,
      registerSubForm: (subConfig: SubFormConfig<unknown>) => {
        subFormsRef.current = [...subFormsRef.current, subConfig];
      },
      unregisterSubForm: (subformId: SubFormId) => {
        subFormsRef.current = subFormsRef.current.filter(
          (form) => form.id !== subformId
        );
      },
    }),
    [validateRootValue, rootValueValidationSchema]
  );

  return (
    <SubFormikRootReactContext.Provider value={contextValue}>
      {children}
    </SubFormikRootReactContext.Provider>
  );
}
