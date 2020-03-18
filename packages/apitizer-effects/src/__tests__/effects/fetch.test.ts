import xhr from 'xhr-mock';
import { Method, endpoint } from 'apitizer';
import { fetch } from '../../effects/fetch';
import { url, mock } from '../helpers';
import { of } from 'rxjs';

beforeAll(() => {
  xhr.setup();
});

afterAll(() => {
  xhr.teardown();
});

afterEach(() => {
  xhr.reset();
});

const api = endpoint(url());

describe('post', () => {
  it.each`
    setup              | url           | body               | response
    ${api}             | ${url()}      | ${{ name: 'foo' }} | ${{ id: 1, name: 'foo' }}
    ${api.many('foo')} | ${url('foo')} | ${{ name: 'foo' }} | ${{ id: 1, name: 'foo' }}
  `(
    'should perform POST $url with body $body and response $response',
    async ({ setup, url, body, response }) => {
      mock({ body, response, method: 'POST' });

      expect(setup.url()).toEqual(url);
      expect(await fetch(setup.post(body)).toPromise()).toEqual(response);
    }
  );
});

describe('get', () => {
  it.each`
    setup                      | url              | response
    ${api.many('foo')}         | ${url('foo')}    | ${[{ id: 1, name: 'foo' }]}
    ${api.many('foo').one(58)} | ${url('foo/58')} | ${{ id: 58, name: 'foo' }}
  `(
    'should perform GET $url with response $response',
    async ({ setup, url, response }) => {
      mock({ response, method: 'GET' });

      expect(setup.url()).toEqual(url);
      expect(await fetch(setup.get()).toPromise()).toEqual(response);
    }
  );
});

describe('put', () => {
  it.each`
    setup                          | url                  | body               | response
    ${api.many('bar').one(55)}     | ${url('bar/55')}     | ${{ name: 'foo' }} | ${{ id: 55, name: 'foo' }}
    ${api.many('bar/foo').one(89)} | ${url('bar/foo/89')} | ${{ name: 'foo' }} | ${{ id: 89, name: 'foo' }}
  `(
    'should perform PUT $url with body $body and response $response',
    async ({ setup, url, body, response }) => {
      mock({ body, response, method: 'PUT' });

      expect(setup.url()).toEqual(url);
      expect(await fetch(setup.put(body)).toPromise()).toEqual(response);
    }
  );
});

describe('patch', () => {
  it.each`
    setup                          | url                  | body               | response
    ${api.many('bar').one(55)}     | ${url('bar/55')}     | ${{ name: 'foo' }} | ${{ id: 55, name: 'foo' }}
    ${api.many('bar/foo').one(89)} | ${url('bar/foo/89')} | ${{ name: 'foo' }} | ${{ id: 89, name: 'foo' }}
  `(
    'should perform PATCH $url with body $body and response $response',
    async ({ setup, url, body, response }) => {
      mock({ body, response, method: 'PATCH' });

      expect(setup.url()).toEqual(url);
      expect(await fetch(setup.patch(body)).toPromise()).toEqual(response);
    }
  );
});

describe('delete', () => {
  it.each`
    setup                          | url                  | response
    ${api.many('bar').one(55)}     | ${url('bar/55')}     | ${{ id: 55, name: 'foo' }}
    ${api.many('bar/foo').one(89)} | ${url('bar/foo/89')} | ${{ id: 89, name: 'foo' }}
  `(
    'should perform DELETE $url with body $body and response $response',
    async ({ setup, url, response }) => {
      mock({ response, method: 'DELETE' });

      expect(setup.url()).toEqual(url);
      expect(await fetch(setup.delete()).toPromise()).toEqual(response);
    }
  );
});

describe('request', () => {
  it.each`
    setup                          | method    | url                  | response
    ${api.many('bar')}             | ${'POST'} | ${url('bar')}        | ${{ id: 55, name: 'foo' }}
    ${api.many('bar/foo').one(89)} | ${'GET'}  | ${url('bar/foo/89')} | ${{ id: 89, name: 'foo' }}
  `(
    'should perform custom request on $url with body $body and response $response',
    async ({ setup, url, method, response }) => {
      mock({ response, method });

      expect(setup.url()).toEqual(url);
      expect(await fetch(setup.request().method(method)).toPromise()).toEqual(
        response
      );
    }
  );
});

describe('from observable', () => {
  it('should setup a fetch from an observable', async () => {
    const response = { id: 100, name: 'foo' };
    const method = Method.GET;

    mock({ response, method });

    expect(
      await fetch(
        of(
          api
            .many('bar')
            .one(100)
            .request()
            .method(method)
        )
      ).toPromise()
    ).toEqual(response);
  });
});
