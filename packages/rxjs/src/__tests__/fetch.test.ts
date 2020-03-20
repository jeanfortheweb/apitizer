import xhr from 'xhr-mock';
import { Method, request } from '@apitizer/request';
import { endpoint } from '@apitizer/endpoint';
import { fetch } from '../fetch';
import { url, mock } from './helpers';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

beforeAll(() => {
  xhr.setup();
});

afterAll(() => {
  xhr.teardown();
});

afterEach(() => {
  xhr.reset();
});

describe('fetch', () => {
  it('should take a request configuration resulting in a response', async () => {
    const response = { id: 100, name: 'foo' };
    const method = Method.GET;

    mock({ response, method });

    expect(
      await fetch(request(endpoint(url())).method(method)).toPromise()
    ).toEqual(response);
  });

  it('should take a request observable resulting in a response ', async () => {
    const response = { id: 100, name: 'foo' };
    const method = Method.GET;

    mock({ response, method });

    expect(
      await fetch(of(request(endpoint(url())).method(method))).toPromise()
    ).toEqual(response);
  });
});

describe('blueprint', () => {
  it('should setup a blueprint', async () => {
    const response = { id: 100, name: 'foo' };
    const method = Method.GET;
    const foo = fetch.blueprint(
      request(endpoint(url())),
      (request$, data: any) =>
        request$.pipe(map(request => request.method(method).data(data)))
    );

    mock({ response, method });

    expect(await foo({}).toPromise()).toEqual(response);
  });
});
