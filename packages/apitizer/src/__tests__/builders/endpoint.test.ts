import { endpoint } from '../..';
import { AjaxRequest } from 'rxjs/ajax';
import { request, ResponseType } from '../../builders/request';
import { query } from '../../builders/query';

function url(path?: string): string {
  return path ? ['http://foo.com', path].join('/') : 'http://foo.com';
}

function configuration(configuration: AjaxRequest): AjaxRequest {
  return {
    responseType: 'json',
    ...configuration,
    headers: {
      'content-type': 'application/json',
      ...configuration?.headers
    }
  };
}

const api = endpoint(url());

describe('endpoint', () => {
  it('should setup an endpoint instance', () => {
    const api = endpoint('');

    expect(api).toBeDefined();
    expect(api.configure).toBeDefined();
    expect(api.delete).toBeDefined();
    expect(api.get).toBeDefined();
    expect(api.many).toBeDefined();
    expect(api.one).toBeDefined();
    expect(api.patch).toBeDefined();
    expect(api.post).toBeDefined();
    expect(api.put).toBeDefined();
    expect(api.query).toBeDefined();
    expect(api.request).toBeDefined();
    expect(api.many).toBeDefined();
    expect(api.url).toBeDefined();
  });
});

describe('configure', () => {
  it.each`
    setup                                                       | configuration
    ${api.configure(request().responseType(ResponseType.TEXT))} | ${configuration({ responseType: 'text' })}
    ${api
  .configure(request().header('bar', 'foo'))
  .many('foo')
  .configure(request => request.header('foo', 'bar'))} | ${configuration({ headers: { bar: 'foo', foo: 'bar' } })}
    ${api
  .configure(request().header('foo', 'bar'))
  .many('foo')
  .configure(request().headers({ bar: 'bar', foo: 'baz' }))} | ${configuration({ headers: { bar: 'bar', foo: 'baz' } })}
  `(
    'should apply configuration $configuration',
    async ({ setup, configuration: { headers, ...configuration } }) => {
      const request = setup.get().get();

      expect(request.headers).toEqual(headers);
      expect(request.responseType).toEqual(configuration.responseType);
    }
  );
});

describe('many, one', () => {
  it.each`
    setup              | url
    ${api}             | ${url()}
    ${api.many('foo')} | ${url('foo')}
    ${api
  .many('foo')
  .one(34)
  .many('bar')} | ${url('foo/34/bar')}
  `('should produce url $url', async ({ setup, url }) => {
    expect(await setup.url()).toEqual(url);
  });
});

describe('query', () => {
  it.each`
    setup                                                            | url
    ${api.many('foo').query(query => query.param('active', 'true'))} | ${url('foo?active=true')}
    ${api
  .many('foo')
  .query(query({ active: 'true' }))
  .many('bar')
  .query(query => query.param('email', 'foo@bar.com'))} | ${url('foo/bar?active=true&email=foo%40bar.com')}
  `('should procude url $url', async ({ setup, url }) => {
    expect(setup.url()).toEqual(url);
  });

  it('should exlude the query string', () => {
    expect(api.query(query => query.param('foo', 'bar')).url(true)).toEqual(
      url()
    );
  });

  it('should accept an initial query', () => {
    expect(
      endpoint('http://foo.bar', { query: query({ bar: 'baz' }) }).url()
    ).toEqual('http://foo.bar?bar=baz');
  });
});
