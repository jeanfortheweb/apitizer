import xhr from 'xhr-mock';
import { Method, request } from '@apitizer/request';
import { endpoint } from '@apitizer/endpoint';
import { fetch } from '../fetch';
import { url, mock } from './helpers';
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
