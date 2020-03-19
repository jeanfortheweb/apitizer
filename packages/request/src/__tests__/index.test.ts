import { request, Method, ResponseType } from '..';
import { endpoint } from '@apitizer/endpoint';

it('should define the expected api', () => {
  const req = request();

  expect(req.endpoint).toBeDefined();
  expect(req.method).toBeDefined();
  expect(req.responseType).toBeDefined();
  expect(req.header).toBeDefined();
  expect(req.headers).toBeDefined();
  expect(req.withCredentials).toBeDefined();
  expect(req.user).toBeDefined();
  expect(req.password).toBeDefined();
  expect(req.get).toBeDefined();
});

it.each`
  setup                                        | property             | value
  ${request().endpoint(endpoint('foo'))}       | ${'url'}             | ${'foo'}
  ${request().method(Method.POST)}             | ${'method'}          | ${'POST'}
  ${request().data({ foo: 'bar' })}            | ${'data'}            | ${{ foo: 'bar' }}
  ${request().headers({ foo: 'bar' })}         | ${'headers'}         | ${{ foo: 'bar', 'content-type': 'application/json' }}
  ${request().header('foo', 'bar')}            | ${'headers'}         | ${{ foo: 'bar', 'content-type': 'application/json' }}
  ${request().withCredentials(true)}           | ${'withCredentials'} | ${true}
  ${request().user('foo')}                     | ${'user'}            | ${'foo'}
  ${request().password('bar')}                 | ${'password'}        | ${'bar'}
  ${request().responseType(ResponseType.TEXT)} | ${'responseType'}    | ${'text'}
`(`should set $property to $value`, ({ setup, property, value }) => {
  expect(setup.get()[property]).toEqual(value);
});

it('should produce a request configuration', () => {
  expect(request(endpoint('http://foo.com').one('bar', 1)).get()).toEqual({
    headers: {
      'content-type': 'application/json'
    },
    method: 'GET',
    responseType: 'json',
    url: 'http://foo.com/bar/1'
  });
});

it('should produce a custom request configuration using a transformer', () => {
  const transformer = jest.fn(configuration => ({ url: configuration.url }));
  const configuration = request(endpoint('http://foo.com').one('bar', 1)).get(
    transformer
  );

  expect(transformer).toHaveBeenCalled();
  expect(configuration).toEqual({
    url: 'http://foo.com/bar/1'
  });
});

it.each`
  alias       | method
  ${'get'}    | ${Method.GET}
  ${'post'}   | ${Method.POST}
  ${'put'}    | ${Method.PUT}
  ${'patch'}  | ${Method.PATCH}
  ${'delete'} | ${Method.DELETE}
`(
  'should create a $method request through request.$alias',
  ({ alias, method }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = request as any;

    expect(r[alias]().get()).toHaveProperty('method', method);
    expect(r[alias](endpoint('')).get()).toHaveProperty('method', method);
    expect(r[alias](endpoint(''), { method: Method.GET }).get()).toHaveProperty(
      'method',
      method
    );
  }
);
