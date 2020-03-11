/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MaybeCallback } from '../types';
import { Request, Method, request } from './request';
import { query as _query, Query } from './query';

export interface Settings {
  request: Request;
  query: Query;
}

/**
 * Defines an endpoint builder.
 */
export interface Endpoint<Resource = any, Data = Resource> {
  /**
   * Allows to pre-configure ajax request on the current endpoint.
   * This configuration settings are applied automatically when `get`, `post`, `put`, `patch` or `delete`
   * are called to generate an ajax configuration.
   *
   * If a configuration object is passed, the currently stored configuration is discarded.
   *
   * If a callback is passed, the callback will receive the currenty stored pre-configuration to merge
   * and return it with it's own modifications.
   *
   * @see get
   * @see post
   * @see put
   * @see patch
   * @see delete
   *
   * @param configuration  Configuration or callback.
   */
  configure(configuration: MaybeCallback<Request>): Endpoint<Resource, Data>;

  /**
   * Returns the URL of the current endpoint.
   *
   * @param withoutQuery Excludes any existing query params.
   */
  url(withoutQuery?: boolean): string;

  /**
   * Creates a deeper nested endpoint based on the current endpoint.
   *
   * @param path Path to the deeper endpoint.
   */
  many<InnerResource = Resource, InnerData = Data>(
    path: string
  ): Endpoint<InnerResource, InnerData>;

  /**
   * Creates a deeper nested endpoint based on the current endpoint,
   * pointing to a single identifiable resource.
   *
   * @param id ID of the resource.
   */
  one<InnerResource = Resource, InnerData = Data>(
    id: number | string
  ): Endpoint<InnerResource, InnerData>;

  /**
   * Sets query parameters for the current endpoint.
   *
   * If a query object is passed, the currently stored query is discarded.
   *
   * If a callback is passed, the callback will receive the currenty stored query to merge
   * and return it with it's own modifications.
   *
   * @param query Query or callback
   */
  query(query: MaybeCallback<Query>): Endpoint<Resource, Data>;

  /**
   * Generates a GET request configuration for the current endpoint.
   *
   * Optionally, an ajax configuration can be passed which will be mergen with the pre-configuration
   * as with the defaults of a GET request.
   *
   * @see configure
   */
  get<OverrideResource = Resource>(): Request<OverrideResource, Data>;

  /**
   * Generates a POST request configuration for the current endpoint.
   *
   * Optionally, an ajax configuration can be passed which will be mergen with the pre-configuration
   * as with the defaults of a POST request.
   *
   * @see configure
   * @param data Data.
   */
  post(data: Data): Request<Resource, Data>;

  /**
   * Generates a POST request configuration for the current endpoint.
   *
   * Optionally, an ajax configuration can be passed which will be mergen with the pre-configuration
   * as with the defaults of a POST request.
   *
   * @see configure
   *
   * @param data Data.
   */
  post<OverrideData = Data>(
    data: OverrideData
  ): Request<Resource, OverrideData>;

  /**
   * Generates a POST request configuration for the current endpoint.
   *
   * Optionally, an ajax configuration can be passed which will be mergen with the pre-configuration
   * as with the defaults of a POST request.
   *
   * @see configure
   *
   * @param data Data.
   */
  post<OverrideResource = Resource, OverrideData = Data>(
    data: OverrideData
  ): Request<OverrideResource, OverrideData>;

  /**
   * Generates a PUT request configuration for the current endpoint.
   *
   * Optionally, an ajax configuration can be passed which will be mergen with the pre-configuration
   * as with the defaults of a PUT request.
   *
   * @see configure
   * @param data Data.
   */
  put(data: Data): Request<Resource, Data>;

  /**
   * Generates a PUT request configuration for the current endpoint.
   *
   * Optionally, an ajax configuration can be passed which will be mergen with the pre-configuration
   * as with the defaults of a PUT request.
   *
   * @see configure
   * @param data Data.
   */
  put<OverrideData = Data>(data: OverrideData): Request<Resource, OverrideData>;

  /**
   * Generates a PUT request configuration for the current endpoint.
   *
   * Optionally, an ajax configuration can be passed which will be mergen with the pre-configuration
   * as with the defaults of a PUT request.
   *
   * @see configure
   * @param data Data.
   */
  put<OverrideResource = Resource, OverrideData = Data>(
    data: OverrideData
  ): Request<OverrideResource, OverrideData>;

  /**
   * Generates a PATCH request configuration for the current endpoint.
   *
   * Optionally, an ajax configuration can be passed which will be mergen with the pre-configuration
   * as with the defaults of a PATCH request.
   *
   * @see configure
   */
  patch(): Request<Resource, Data>;

  /**
   * Generates a PATCH request configuration for the current endpoint.
   *
   * Optionally, an ajax configuration can be passed which will be mergen with the pre-configuration
   * as with the defaults of a PATCH request.
   *
   * @see configure
   * @param data Data.
   */
  patch<OverrideData = Data>(data: OverrideData): Request<Resource, Data>;

  /**
   * Generates a PATCH request configuration for the current endpoint.
   *
   * Optionally, an ajax configuration can be passed which will be mergen with the pre-configuration
   * as with the defaults of a PATCH request.
   *
   * @see configure
   * @param data Data.
   */
  patch<OverrideResource = Resource, OverrideData = Data>(
    data: OverrideData
  ): Request<OverrideResource, OverrideData>;

  /**
   * Generates a DELETE request configuration for the current endpoint.
   *
   * Optionally, an ajax configuration can be passed which will be mergen with the pre-configuration
   * as with the defaults of a DELETE request.
   *
   * @see configure
   */
  delete<OverrideResource = Resource>(): Request<OverrideResource, Data>;

  /**
   * Generates a DELETE request configuration for the current endpoint.
   *
   * Optionally, an ajax configuration can be passed which will be mergen with the pre-configuration
   * as with the defaults of a DELETE request.
   *
   * @see configure
   */
  request<OverrideResource = Resource>(): Request<OverrideResource, Data>;
}

function configure(url: string, settings: Settings) {
  return (value: MaybeCallback<Request>): Endpoint =>
    endpoint(url, {
      ...settings,
      request: typeof value === 'function' ? value(settings.request) : value
    });
}

function _url(url: string, settings: Settings) {
  return (withoutQuery = false): string => {
    if (withoutQuery === false && settings.query.empty() === false) {
      return [url, settings.query.get()].join('?');
    }

    return url;
  };
}

function many(url: string, settings: Settings) {
  return (path: string): Endpoint => endpoint([url, path].join('/'), settings);
}

function one(url: string, settings: Settings) {
  return (id: number | string): Endpoint =>
    endpoint([url, id].join('/'), settings);
}

function query(url: string, settings: Settings) {
  return (value: MaybeCallback<Query>): Endpoint =>
    endpoint(url, {
      ...settings,
      query: typeof value === 'function' ? value(settings.query) : value
    });
}

function get(url: string, settings: Settings) {
  return (): Request => settings.request.url(url).method(Method.GET);
}

function post(url: string, settings: Settings) {
  return (data: any): Request =>
    settings.request
      .url(url)
      .method(Method.POST)
      .data(data);
}

function put(url: string, settings: Settings) {
  return (data: any): Request =>
    settings.request
      .url(url)
      .method(Method.PUT)
      .data(data);
}

function patch(url: string, settings: Settings) {
  return (data?: any): Request =>
    settings.request
      .url(url)
      .method(Method.PATCH)
      .data(data);
}

function _delete(url: string, settings: Settings) {
  return (): Request => settings.request.url(url).method(Method.DELETE);
}

function _request(url: string, settings: Settings) {
  return (): Request => settings.request.url(url);
}

/**
 * Creates a new endpoint.
 *
 * @see Endpoint
 * @param url URL of the endpoint.
 * @param settings Initial settings.
 */
export function endpoint<Resource = any, Data = Resource>(
  url: string,
  settings: Partial<Settings> = {}
): Endpoint<Resource, Data> {
  const normalizedSettings: Settings = {
    query: settings.query || _query(),
    request: settings.request || request()
  };

  return Object.freeze<Endpoint<Resource, Data>>({
    configure: configure(url, normalizedSettings),
    url: _url(url, normalizedSettings),
    many: many(url, normalizedSettings),
    one: one(url, normalizedSettings),
    query: query(url, normalizedSettings),
    get: get(_url(url, normalizedSettings)(), normalizedSettings),
    post: post(_url(url, normalizedSettings)(), normalizedSettings),
    put: put(_url(url, normalizedSettings)(), normalizedSettings),
    patch: patch(_url(url, normalizedSettings)(), normalizedSettings),
    delete: _delete(_url(url, normalizedSettings)(), normalizedSettings),
    request: _request(_url(url, normalizedSettings)(), normalizedSettings)
  });
}
