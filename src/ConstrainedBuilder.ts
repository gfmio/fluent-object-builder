import type { RequiredSubset } from './helpers';

interface ConstrainedBuilderBase<T extends object, CurrentKeys extends keyof T> {
  /** Sets the key `K` to value `V` and returns a new `ConstrainedBuilder` with updated types */
  set<K extends keyof T>(key: K, value: T[K]): ConstrainedBuilder<T, CurrentKeys | K>;
  /** Returns the current value for the key `K` */
  get<K extends CurrentKeys>(key: K): T[K];
  get(key: string | number | symbol): undefined;
  /** Removes the current value for the key `K` and returns a new `UnconstrainedBuilder` with updated types */
  unset<K extends CurrentKeys>(key: K): ConstrainedBuilder<T, Exclude<CurrentKeys, K>>;
}

type ConstrainedBuilderVariadic<T extends object, CurrentKeys extends keyof T> = {
  [K in keyof Required<T>]: (value: Required<T>[K]) => ConstrainedBuilder<T, CurrentKeys | K>;
};

/** Provides the build method for the ConstrainedBuilder, but only if all required properties have been set */
type BuildIfAllRequiredKeysPresent<T extends object, CurrentKeys extends keyof T> = Pick<
  T,
  CurrentKeys
> extends RequiredSubset<T>
  ? {
      /** Returns the object */
      build(): Pick<T, CurrentKeys>;
    }
  : {
      build: never;
    };

/** A builder that will only keys and values matching type `T` and only allows for returning the object once all required properties have been set */
export type ConstrainedBuilder<T extends object, CurrentKeys extends keyof T> = ConstrainedBuilderVariadic<
  T,
  CurrentKeys
> &
  BuildIfAllRequiredKeysPresent<T, CurrentKeys> &
  ConstrainedBuilderBase<T, CurrentKeys>;
