# @apitizer/query

The **query** package of **apitizer** aims for a chainable and flat api to generate query strings a semantic way.
It's designed to follow functional principles.

The **query** package has no dependencies and can be used as standalone utility.

## Installation

```bash
yarn add @apitizer/query
```

or

```bash
npm install  @apitizer/query
```

## API Documentation

You can see the technical api documentation [here](./docs/README.md)

## Examples

```ts
import { query } from '@apitizer/query';

// creating a query
const empty = query();
const withInitialParams = query({ token: '123abc' });

// set params using param
const withStatus = query().param('status', 'active');
const withStatusAndName = withStatus.param('name', 'foo');

// set params using params
const withOrderAndDirection = query().params({
  by: 'status',
  direction: 'asc'
});

// unset a parameter
const withStatusWithoutName = withStatusAndName.param('name', undefined);

// clear params (delete all set params)
const cleared = withStatusAndName.clear();

// check if query is empty
console.log(cleared.empty()); // true
console.log(withStatusAndName.empty()); // false

// get the actual query string
console.log(empty.get()); // ""
console.log(withInitialParams.get()); // "token=123abc"
console.log(withStatus.get()); // "status=active"
console.log(withStatusAndName.get()); // "status=active&name=foo"
console.log(withOrderAndDirection.get()); // "by=status&order=asc"
console.log(withStatusWithoutName.get()); // "status=active"
console.log(cleared.get()); // ""
```
