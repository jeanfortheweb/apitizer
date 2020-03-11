import { request, Method } from '../../builders';

describe('request', () => {
  it('should setup a request instance', () => {
    const api = request();

    expect(api.url).toBeDefined();
    expect(api.method).toBeDefined();
    expect(api.responseType).toBeDefined();
    expect(api.header).toBeDefined();
    expect(api.headers).toBeDefined();
    expect(api.withCredentials).toBeDefined();
    expect(api.user).toBeDefined();
    expect(api.password).toBeDefined();
    expect(api.get).toBeDefined();
  });
});

it.each`
  setup                                | property             | value
  ${request().url('foo')}              | ${'url'}             | ${'foo'}
  ${request().method(Method.POST)}     | ${'method'}          | ${'POST'}
  ${request().data({ foo: 'bar' })}    | ${'body'}            | ${{ foo: 'bar' }}
  ${request().headers({ foo: 'bar' })} | ${'headers'}         | ${{ foo: 'bar', 'content-type': 'application/json' }}
  ${request().header('foo', 'bar')}    | ${'headers'}         | ${{ foo: 'bar', 'content-type': 'application/json' }}
  ${request().withCredentials(true)}   | ${'withCredentials'} | ${true}
  ${request().user('foo')}             | ${'user'}            | ${'foo'}
  ${request().password('bar')}         | ${'password'}        | ${'bar'}
`(`should set $property to $value`, ({ setup, property, value }) => {
  expect(setup.get()[property]).toEqual(value);
});
