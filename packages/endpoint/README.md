# @apitizer/endpoint <!-- omit in toc -->

The **endpoint** package of **apitizer** aims for a chainable and flat api to generate restful api urls in a semantic way.
It's designed to follow functional principles and has a high support for generic types.

## Installation <!-- omit in toc -->

The **endpoint** package has a peer dependency on the **query** package:

```bash
yarn add @apitizer/endpoint @apitizer/query
```

or

```bash
npm install @apitizer/endpoint @apitizer/query
```

## Documentation <!-- omit in toc -->

- [Creating an Endpoint](#creating-an-endpoint)
- [Reaching for a List of a Resource](#reaching-for-a-list-of-a-resource)
- [Reaching for a single Resource](#reaching-for-a-single-resource)
- [Setting the Query](#setting-the-query)
- [Retieve the actual URL.](#retieve-the-actual-url)
- [Setting Initial Values](#setting-initial-values)
- [Templates](#templates)

### Creating an Endpoint

An endpoint is created using the `endpoint()` factory exported by **@apitizer/endpoint**.

```ts
import { endpoint } from '@apitizer/endpoint';

const api = endpoint('http://myapi.com');
```

The returned object gives access to several chainable method to create a restful api url in a semantic way. These are namely `many`, `one` and `query`. The actual url can be retrieved by calling `get`.

Whenever a method is chained, a new immutable instance of `endpoint()` is created.

### Reaching for a List of a Resource

Produces a deeper nested url pointing to a resource which is intended to return an array of items.

```ts
// ...

// Endpoint<User[], UserData>
const users = api.many<User, UserData>('users');

// http://myapi.com/users
const url = users.get();
```

### Reaching for a single Resource

Produces a deeper nested url pointing to a resource which is intended to return a single resource which is identfiable.

```ts
// ...

// Endpoint<User, UserData>
const userWithIdOne = api.one<User, UserData>('users', 1);

// http://myapi.com/users/1
const url = users.get();
```

### Setting the Query

Sets query parameters on the current url. If you pass an instance
of a `Query` using the `query()` factory from **@apitizer/query**, all previously set query parameters derived from parents are discarded.

```ts
// ...
import { query } from '@apitizer/query';

// Always Endpoint<User[], UserData>
const activeUsers = users.query(query().param('active', 'yes'));
const activeUsers = users.query(query({ active: 'yes' }));
const activeUsers = users.query(query().params({ active: 'yes' }));

// http://myapi.com/users?active=yes
const url = activeUsers.get();
```

However, query parameters from parents can be carried on by passing a callback which will receive the query of the parent to generate a new query:

```ts
// ...

// Always Endpoint<User[], UserData>
const activeUsers = users.query(query => query.param('active', 'yes'));

const activeUsersWithFirstName = activeUsers.query(query =>
  query.param('firstName', 'John')
);

// http://myapi.com/users?active=yes&firstName=John
const url = activeUsersWithFirstName.get();
```

### Retieve the actual URL.

To retrieve the actual url string, the `get` method is called.

```ts
// ...

// http://myapi.com/users?active=yes&firstName=John
const url = activeUsersWithFirstName.get();

// Omit query parameters
// http://myapi.com/users
const url = activeUsersWithFirstName.get(true);
```

### Setting Initial Values

The `endpoint` factory can be called with an initial query beside of the initial url.

```ts
// ...

const withToken = query({ token: '123' });
const api = endpoint<User, UserData>('http://myapi.com', withToken);
```

### Templates

Since it's often required to create deeper api urls based on certain parameters, the `template()` method can be used to create a template function based on a factory function to create these.

The parameter typing as the endpoint typing will be transported to the actual template function.

```ts
// ...

const getUserCommentsEndpoint = api.template((endpoint, id: number) =>
  endpoint.one('users', id).many<Comment, CommentData>('comments')
);

// Endpoint<Comment[], CommentData>
const commentsForUser = getUserCommentsEndpoint(1);

// http://myapi.com/users/1/comments
commentsForUser.get();
```
