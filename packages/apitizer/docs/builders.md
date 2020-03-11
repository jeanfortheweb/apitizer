# Builders <!-- omit in toc -->

- [Endpoint](#endpoint)
  - [Basic Usage](#basic-usage)
  - [Endpoints are Immutable](#endpoints-are-immutable)
  - [Creating a Request](#creating-a-request)
  - [Performing a Request](#performing-a-request)
  - [Include Type Information](#include-type-information)

## Endpoint

A chainable builder utility which allows to generate a rest api request by using semantic method chaining. The API is completely written in a pure functional fashion, always producing immutable results.

### Basic Usage

Creating and using an `endpoint` is rather simple:

```ts
import { endpoint } from 'apitizer';

const api = endpoint('http://foo.com')
  .many('bars')
  .one(1)
  .query({ relations: 'yes' });

console.log(api.url()); // http://foo.com/bars/1?relations=yes
console.log(api.post()); // a request builder
console.log(api.post().get()); // { url: 'http://foo.com/bars/1?relations=yes', method: 'POST' ... }
```

### Endpoints are Immutable

When chaining a method onto an endpoint, it will **always** result in a new endpoint object:

```ts
import { endpoint } from 'apitizer';

const base = endpoint('http://foo.com');
const bars = base.many('bars');
const singleBar = bars.one(1).query({ relations: 'yes' });

console.log(base === bars); // false
console.log(bars === bar); // false
console.log(bar === bar); // true, of course
```

This means, that you can build several endpoint instances which act as
base for deeper endpoints:

```ts
import { endpoint } from 'apitizer';

const api = endpoint('http://foo.com/v1').configure(request =>
  request.header('authorization', 'Bearer xyz')
);

const tasks = api.many('tasks');
const taskOne = tasks.one(1);
const aktiveTasks = tasks.query({ status: 'active' });
const users = api.many('users');

console.log(api.url()); // http://foo.com/v1
console.log(tasks.url()); // http://foo.com/v1/tasks
console.log(taskOne.url()); // http://foo.com/v1/tasks/1
console.log(activeTasks.url()); // http://foo.com/v1/tasks?active=yes
console.log(users.url()); // http://foo.com/v1/users
```

### Creating a Request

When calling `get`, `post`, `put`, `patch` or `delete` on an endpoint instance, a request builder is returned. This request builder is based on
your request intention (GET, POST, PUT, PATCH or DELETE), the url and query
of the current endpoint, as also any pre-configuration applied using `configure` on an endpoint.

To get the actual request object, just call `get` on the request builder:

```ts
import { endpoint } from 'apitizer';

const request = endpoint('http://foo.com/v1')
  .configure(request => request.header('authorization', 'Bearer xyz'))
  .many('bars')
  .post({ name: 'Foo' })
  .get();

console.log(request); // { url: '', method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer xyz', responseType: 'json' } }
```

    Both, the "content-type" header, as the "responseType" property are optionated defaults of a request, which can be overriden at any point.

### Performing a Request

To actual perform a request, you can to pass the request builder to a side effect. Currently, only the `fetch` side effect is supported. See [fetch]('./side-effects.md#fetch) for more information.

### Include Type Information

At any level of an endpoint, generic types can be passed to define what is sent to an endpoint, as also what is returned:

```ts
import { endpoint } from 'apitizer';

const api = endpoint('http://foo.com/v1').configure(request =>
  request.header('authorization', 'Bearer xyz')
);

interface User {
  readonly id: number;
  fistName: string;
  lastName: string;
}

interface UserData {
  fistName: string;
  lastName: string;
  passwotd?: string;
}

const users = api.many<User>('users'); // Endpoint<User, User>;
const users = api.many<User, UserData>('users'); // Endpoint<User, UserData>;
```

This type information is passed to the result builder as also, in the end to side effects, allowing you to use advanced typings on your remote sources.

If a type differs, you can always override them. This is supported by almost every method of an endpoint:

```ts
import { endpoint } from 'apitizer';

const api = endpoint('http://foo.com/v1').configure(request =>
  request.header('authorization', 'Bearer xyz')
);

interface User {
  readonly id: number;
  fistName: string;
  lastName: string;
}

interface UserData {
  fistName: string;
  lastName: string;
}

interface PasswordData {
  password: string;
}

const users = api.many<User, UserData>('users'); // Endpoint<User, UserData>

const resetPassword = users.one(1).patch<PasswordData>({ password: '123' }); // Endpoint<User, PasswordData>

const resetPassword = users.one(1).patch<boolean, PasswordData>({
  password: '123'
}); // Endpoint<boolean, PasswordData>
```
