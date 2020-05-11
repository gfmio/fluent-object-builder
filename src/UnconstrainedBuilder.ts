import type { OmitAndSimplify } from './helpers';

interface UnconstrainedBuilderBase<Current extends object> {
  /** Sets the key `K` to value `V` and returns a new `UnconstrainedBuilder` with updated types */
  set<K extends keyof Current, V>(key: K, value: V): UnconstrainedBuilder<OmitAndSimplify<Current, K> & Record<K, V>>;
  set<K extends string | number | symbol, V>(key: K, value: V): UnconstrainedBuilder<Current & Record<K, V>>;
  /** Returns the current value for the key `K` */
  get<K extends keyof Current>(key: K): Current[K];
  get<K extends string | number | symbol>(key: K): undefined;
  /** Removes the current value for the key `K` and returns a new `UnconstrainedBuilder` with updated types */
  unset<K extends keyof Current>(key: K): UnconstrainedBuilder<OmitAndSimplify<Current, K>>;
  unset<K extends string | number | symbol>(key: K): UnconstrainedBuilder<Current>;
  /** Returns the `Current` object */
  build(): Current;
}

type UnconstrainedBuilderVariadic<Current extends object> = {
  [K in keyof Current]: {
    /** Sets the key `K` to value `V` and returns a new `UnconstrainedBuilder` with updated types */
    <V>(value: V): UnconstrainedBuilder<OmitAndSimplify<Current, K> & Record<K, V>>;
    /** Returns the current value for the key `K` */
    (): Current[K];
  };
} &
  {
    [P in string | number | symbol]: {
      /** Sets the key `K` to value `V` and returns a new `UnconstrainedBuilder` with updated types */
      <K extends P, V>(value: V): UnconstrainedBuilder<Current & Record<K, V>>;
      /** Returns the current value for the key `P` */
      (): undefined;
    };
  };

/**
 * An unconstrained builder provides a fluent interface for building objects with no constraints to its keys or values.
 *
 * It will accept any mix of keys and values, remember and update its `Current` type and offer
 */
export type UnconstrainedBuilder<Current extends object> = UnconstrainedBuilderVariadic<Current> &
  UnconstrainedBuilderBase<Current>;
