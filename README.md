# fluent-object-builder

This package provides a strongly typed, purely functional object builder with a fluent interface.

## Install

```sh
# With NPM
npm install --save fluent-object-builder

# With yarn
yarn add fluent-object-builder
```

## Usage

The library exports a single method `builder()` to create a builder. If you pass no type argument, the builder is unconstrained, i.e. you can pass any property. If you you do pass a type argument `T`, the builder is constrained to properties and values of `T` and the build method will only be available once all properties are set.

```ts
import builder from 'fluent-object-builder';

// Constrained builder

interface MyType {
  s: string;
  n: number;
  b?: boolean;
}

const obj = builder<MyType>().s('abc').n(0).b(false).build();

// TypeError, because n is not set
const obj2 = builder<MyType>().s('abc').b(true).build();

// No TypeError, because b is optional
const obj3 = builder<MyType>().s('abc').n(0).build();

// You can also use the get, set and unset methods instead of the fluent interface
const builder4 = builder<MyType>().set('n', 0);
const obj4 = builder4.set('s', builder.get('n').toString()).unset('n').set('n', 1).build();

// Unconstrained builder

const obj4 = builder().set('x', 1).set('y', 2).build();
// Object type is Record<'x', number> & Record<'y', number>

// When using an unconstrained builder with the fluent interface, you need to
// specify the key and value type using the type arguments for the TypeScript
// compiler to correctly identify the types
const builder5 = builder().x<'x', 1>('x', 1);
// Afterwards, you don't need to use the type arguments again
const obj5 = builder5.set('y', builder5.get('x') + 1).build();
```

## License

[MIT](LICENSE)
