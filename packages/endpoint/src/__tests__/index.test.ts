import { endpoint } from '..';
import { query } from '@apitizer/query';

function url(path?: string): string {
  return path ? ['http://foo.com', path].join('/') : 'http://foo.com';
}

describe('endpoint', () => {
  it('should setup an endpoint instance', () => {
    const api = endpoint('');

    expect(api).toBeDefined();
    expect(api.many).toBeDefined();
    expect(api.one).toBeDefined();
    expect(api.query).toBeDefined();
    expect(api.get).toBeDefined();
  });
});

describe('many, one', () => {
  const api = endpoint(url());

  it.each`
    setup                             | url
    ${api}                            | ${url()}
    ${api.many('foo')}                | ${url('foo')}
    ${api.one('foo', 34).many('bar')} | ${url('foo/34/bar')}
  `('should produce url $url', async ({ setup, url }) => {
    expect(await setup.get()).toEqual(url);
  });
});

describe('query', () => {
  const api = endpoint(url());

  it.each`
    setup                                                            | url
    ${api.many('foo').query(query => query.param('active', 'true'))} | ${url('foo?active=true')}
    ${api
  .many('foo')
  .query(query({ active: 'true' }))
  .many('bar')
  .query(query => query.param('email', 'foo@bar.com'))} | ${url('foo/bar?active=true&email=foo%40bar.com')}
  `('should procude url $url', async ({ setup, url }) => {
    expect(setup.get()).toEqual(url);
  });

  it('should exlude the query string', () => {
    expect(api.query(query => query.param('foo', 'bar')).get(true)).toEqual(
      url()
    );
  });

  it('should accept an initial query', () => {
    expect(endpoint('http://foo.bar', query({ bar: 'baz' })).get()).toEqual(
      'http://foo.bar?bar=baz'
    );
  });
});

it('should produce the expected template', () => {
  const factory = jest.fn((endpoint, a, b) => endpoint.one('a', a).one('b', b));
  const template = endpoint('http://foo.bar').template(factory);

  expect(template(1, 2).get()).toEqual('http://foo.bar/a/1/b/2');
  expect(factory).toHaveBeenCalledTimes(1);
});
