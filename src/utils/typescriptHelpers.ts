export type ExtractFunctionReturnType<T extends (...args: any[]) => any> =
  NonNullable<Awaited<ReturnType<T>>>;

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
