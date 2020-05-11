/** Removes the properties K from T and if T is subsequently empty, it simplifies it to the empty object type */
export type OmitAndSimplify<T, K extends keyof any> = Exclude<keyof T, K> extends never
  ? {}
  : PickAndSimplify<T, Exclude<keyof T, K>>;

/** Extracts the properties K from T and if K is exactly keyof T is subsequently empty, it simplifies it to the empty object type */
export type PickAndSimplify<T, K extends keyof any> = Exclude<keyof T, K> extends never
  ? T
  : Pick<T, Extract<K, keyof T>>;

/** Returns the set of optional required properties of `T` */
export type RequiredProperties<T extends object> = Exclude<
  {
    [K in keyof T]: T extends Record<K, T[K]> ? K : never;
  }[keyof T],
  undefined
>;

/** Returns the set of optional optional properties of `T` */
export type OptionalProperties<T extends object> = Exclude<
  {
    [K in keyof T]: T extends Record<K, T[K]> ? never : K;
  }[keyof T],
  undefined
>;

/** Returns the object type with the subset of keys of `T` that are marked required */
export type RequiredSubset<T extends object> = PickAndSimplify<T, RequiredProperties<T>>;
/** Returns the object type with the subset of keys of `T` that are marked optional */
export type OptionalSubset<T extends object> = PickAndSimplify<T, OptionalProperties<T>>;
