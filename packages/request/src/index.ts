/* eslint-disable @typescript-eslint/no-explicit-any */
import { Endpoint, endpoint as api } from '@apitizer/endpoint';

export type MaybeHeaders = Record<string, string | undefined>;
export type Headers = Record<string, string>;
export type MaybeHeaderPair = [string, string | undefined];
export type HeaderPair = [string, string];

/**
 * Defines an abstract shape of a request configuration.
 */
export interface RequestConfiguration<Resource = any, Data = Resource> {
  url?: string;
  data?: Data;
  user?: string;
  async?: boolean;
  method?: Method;
  headers?: Headers;
  timeout?: number;
  password?: string;
  hasContent?: boolean;
  crossDomain?: boolean;
  withCredentials?: boolean;
  responseType?: ResponseType;
}

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
   * Sets the endpoint for the request.
   *
   * @param endpoint Endpoint.
   */
  endpoint<EndpointResource, EndpointData = EndpointResource>(
    endpoint: Endpoint<EndpointResource, EndpointData>
  ): Request<EndpointResource, EndpointData>;

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
   * Gets the actual request configuration.
   */
  get(): RequestConfiguration<Resource, Data>;

  /**
   * Gets the actual request configuration transformed by the given
   * transformer
   *
   * @param transformer Transformer
   */
  get<T>(
    transformer: (configuration: RequestConfiguration<Resource, Data>) => T
  ): T;
}

function hasValue(pair: MaybeHeaderPair): pair is HeaderPair {
  return typeof pair[1] === 'string';
}

function reduce(params: Headers, [name, value]: HeaderPair): Headers {
  return { ...params, [name]: value };
}

function sanitize(headers: MaybeHeaders): Headers {
  return Object.entries(headers)
    .filter(hasValue)
    .reduce(reduce, {});
}

function defaults(): RequestConfiguration {
  return {
    responseType: ResponseType.JSON,
    method: Method.GET,
    headers: {
      'content-type': 'application/json'
    }
  };
}

function clone(configration: RequestConfiguration): RequestConfiguration {
  return {
    ...configration,
    headers: {
      ...configration.headers
    }
  };
}

function set<Property extends keyof RequestConfiguration>(
  configration: RequestConfiguration,
  property: Property,
  value: RequestConfiguration[Property]
): RequestConfiguration {
  return clone({
    ...configration,
    [property]: value
  });
}

function create<Resource, Data = Resource>(
  endpoint: Endpoint = api(''),
  configuration: RequestConfiguration<Resource, Data> = defaults()
): Request<Resource, Data> {
  return Object.freeze<Request<Resource, Data>>({
    endpoint: (endpoint: Endpoint): Request =>
      create(endpoint, clone(configuration)),

    method: (method: Method): Request =>
      create(endpoint, set(configuration, 'method', method)),

    responseType: (responseType: ResponseType): Request =>
      create(endpoint, set(configuration, 'responseType', responseType)),

    data: (data: any): Request =>
      create(endpoint, set(configuration, 'data', data)),

    header: (name: string, value: string | undefined): Request =>
      create(
        endpoint,
        set(
          configuration,
          'headers',
          sanitize({
            ...configuration.headers,
            [name]: value
          })
        )
      ),

    headers: (headers: Record<string, string | undefined>): Request =>
      create(
        endpoint,
        set(
          configuration,
          'headers',
          sanitize({ ...configuration.headers, ...headers })
        )
      ),

    user: (user: string | undefined): Request =>
      create(endpoint, set(configuration, 'user', user)),

    password: (password: string | undefined): Request =>
      create(endpoint, set(configuration, 'password', password)),

    withCredentials: (withCredentials: boolean): Request =>
      create(endpoint, set(configuration, 'withCredentials', withCredentials)),

    get: (
      transformer?: (configuration: RequestConfiguration) => any
    ): RequestConfiguration =>
      transformer
        ? transformer(set(configuration, 'url', endpoint.get()))
        : set(configuration, 'url', endpoint.get())
  });
}

function alias(method: Method) {
  return function<Resource, Data = Resource>(
    endpoint: Endpoint<Resource, Data> = api(''),
    configuration: RequestConfiguration<Resource, Data> = defaults()
  ): Request<Resource, Data> {
    return create(endpoint, set(configuration, 'method', method));
  };
}

export const request = Object.assign(create, {
  get: alias(Method.GET),
  post: alias(Method.POST),
  put: alias(Method.PUT),
  patch: alias(Method.PATCH),
  delete: alias(Method.DELETE)
});
