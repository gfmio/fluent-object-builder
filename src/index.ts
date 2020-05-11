import type { ConstrainedBuilder } from './ConstrainedBuilder';
import type { UnconstrainedBuilder } from './UnconstrainedBuilder';

const innerBuilder = <T extends object, CurrentKeys extends keyof T>(
  values: Pick<T, CurrentKeys>,
): ConstrainedBuilder<T, CurrentKeys> => {
  return new Proxy<any>({} as any, {
    get: <K extends keyof T>(_: any, p: K | 'set' | 'get' | 'unset' | 'build') => {
      if (p === 'set') {
        return <P extends keyof T>(property: P, value: T[P]) =>
          innerBuilder<T, CurrentKeys>({
            ...values,
            [property]: value,
          });
      }
      if (p === 'get') {
        return <P extends CurrentKeys>(property: P) => values[property];
      }
      if (p === 'unset') {
        return <P extends CurrentKeys>(property: P) => {
          const newValues = {
            ...values,
          };
          delete newValues[property];
          return innerBuilder(newValues);
        };
      }
      if (p === 'build') {
        return () => ({ ...values });
      }
      return (value: T[K]) =>
        innerBuilder({
          ...values,
          [p]: value,
        });
    },
  });
};

/** Returns a new unconstrained builder */
export default function builder(): UnconstrainedBuilder<{}>;
/** Returns a new constrained builder that will only accept keys and values matching `T` */
export default function builder<T extends object>(): ConstrainedBuilder<T, never>;
export default function builder() {
  return innerBuilder({}) as any;
}
