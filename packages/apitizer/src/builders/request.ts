/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { AjaxRequest } from 'rxjs/ajax';

/**
 * `TypedAjaxRequest` is identical to an ordinary `AjaxRequest` by **rxjs**,
 * it just transports type information for the request and response body.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TypedAjaxRequest<Resource = any, Data = Resource>
  extends AjaxRequest {}

/**
 * Request Method.
 */
export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

/**
 * Response Type.
 */
export enum ResponseType {
  JSON = 'json',
  TEXT = 'text',
  BLOB = 'blob'
}

/**
 * Defines a request builder.
 */
export interface Request<Resource = any, Data = Resource> {
  /**
   * Sets the url for the request.
   *
   * @param url URL.
   */
  url(url: string): Request<Resource, Data>;

  /**
   * Sets the request method.
   *
   * @see Method
   * @param method Method.
   */
  method(method: Method): Request<Resource, Data>;

  /**
   * Sets the response type.
   *
   * @see ResponseType
   * @param responseType Response type.
   */
  responseType(responseType: ResponseType): Request<Resource, Data>;

  /**
   * Sets the data (body).
   *
   * @param body Body.
   */
  data(body: Data): Request<Resource, Data>;

  /**
   * Sets the value of a specific header.
   * Undefined as value will delete the current header value.
   *
   * @param name Name.
   * @param value Value.
   */
  header(name: string, value: string | undefined): Request<Resource, Data>;

  /**
   * Sets a group of headers and their values.
   * Undefined values will delete the corresponding header value.
   *
   * @param headers Headers.
   */
  headers(headers: Record<string, string | undefined>): Request<Resource, Data>;

  /**
   * Sets the user.
   *
   * @param user User.
   */
  user(user: string | undefined): Request<Resource, Data>;

  /**
   * Sets the password.
   *
   * @param password Password.
   */
  password(password: string | undefined): Request<Resource, Data>;

  /**
   * Sets the credentials flags.
   *
   * @param withCredentials Credentials flag.
   */
  withCredentials(withCredentials: boolean): Request<Resource, Data>;

  /**
   * Gets the actual request object.
   */
  get(): TypedAjaxRequest<Resource, Data>;
}

function url(configuration: TypedAjaxRequest) {
  return (url: string): Request => request({ ...configuration, url });
}

function method(configuration: TypedAjaxRequest) {
  return (method: Method): Request => request({ ...configuration, method });
}

function responseType(configuration: TypedAjaxRequest) {
  return (responseType: ResponseType): Request =>
    request({ ...configuration, responseType });
}

function data(configuration: TypedAjaxRequest) {
  return (data: any): Request => request({ ...configuration, body: data });
}

function header(configuration: TypedAjaxRequest) {
  return (name: string, value: string | undefined): Request =>
    request({
      ...configuration,
      headers: { ...configuration.headers, [name]: value }
    });
}

function headers(configuration: TypedAjaxRequest) {
  return (headers: Record<string, string | undefined>): Request =>
    request({
      ...configuration,
      headers: { ...configuration.headers, ...headers }
    });
}

function user(configuration: TypedAjaxRequest) {
  return (user: string | undefined): Request =>
    request({ ...configuration, user });
}

function password(configuration: TypedAjaxRequest) {
  return (password: string | undefined): Request =>
    request({ ...configuration, password });
}

function withCredentials(configuration: TypedAjaxRequest) {
  return (withCredentials: boolean): Request =>
    request({ ...configuration, withCredentials });
}

function get(configration: TypedAjaxRequest) {
  return (): TypedAjaxRequest => ({
    ...configration,
    headers: { ...configration.headers }
  });
}

export function request<Resource, Data = Resource>(
  configuration: TypedAjaxRequest<Resource, Data> = {
    responseType: ResponseType.JSON,
    method: Method.GET,
    headers: {
      'content-type': 'application/json'
    }
  }
): Request<Resource, Data> {
  return Object.freeze<Request<Resource, Data>>({
    url: url(configuration),
    method: method(configuration),
    responseType: responseType(configuration),
    data: data(configuration),
    header: header(configuration),
    headers: headers(configuration),
    user: user(configuration),
    password: password(configuration),
    withCredentials: withCredentials(configuration),
    get: get(configuration)
  });
}
