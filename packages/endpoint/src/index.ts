/* eslint-disable @typescript-eslint/no-explicit-any */
import { query as _query, Query } from '@apitizer/query';

export type MaybeCallback<T> = T | Callback<T>;
export type Callback<T> = (value: T) => T;

export interface Blueprint<
  Args extends any[],
  Resource = any,
  Data = Resource
> {
  (...args: Args): Endpoint<Resource, Data>;
}

export interface BlueprintFactory<
  Args extends any[],
  InputResource,
  InputData,
  OutputResource,
  OutputData
> {
  (endpoint: Endpoint<InputResource, InputData>, ...args: Args): Endpoint<
    OutputResource,
    OutputData
  >;
}

/**
 * Defines an endpoint builder.
 */
export interface Endpoint<Resource = any, Data = Resource> {
  /**
   * Returns the URL of the current endpoint.
   *
   * @param urlOnly When true, omits the output of query parameters.
   */
  get(urlOnly?: boolean): string;

  /**
   * Creates a deeper nested endpoint based on the current endpoint.
   *
   * @param path Path to the deeper endpoint.
   */
  many<InnerResource = Resource, InnerData = Data>(
    path: string
  ): Endpoint<InnerResource[], InnerData>;

  /**
   * Creates a deeper nested endpoint based on the current endpoint,
   * pointing to a single identifiable resource.
   *
   * @param path Path to the deeper endpoint.
   * @param id ID of the resource.
   */
  one<InnerResource = Resource, InnerData = Data>(
    path: string,
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
}

export interface EndpointFacade {
  <Resource = any, Data = Resource>(url: string, query?: Query): Endpoint<
    Resource,
    Data
  >;

  blueprint<
    Args extends any[],
    InputResource,
    InputData,
    OutputResource,
    OutputData
  >(
    endpoint: Endpoint<InputResource, InputData>,
    factory: BlueprintFactory<
      Args,
      InputResource,
      InputData,
      OutputResource,
      OutputData
    >
  ): Blueprint<Args, OutputResource, OutputData>;
}

/**
 * Creates a new endpoint.
 *
 * @see Endpoint
 * @param url URL of the endpoint.
 * @param settings Initial settings.
 */
export function create<Resource = any, Data = Resource>(
  url: string,
  query: Query = _query()
): Endpoint<Resource, Data> {
  return Object.freeze<Endpoint<Resource, Data>>({
    get: (urlOnly = false) =>
      urlOnly || query.empty() ? url : [url, query.get()].join('?'),

    many: path => create([url, path].join('/'), query),

    one: (path, id) => create([url, path, id].join('/'), query),

    query: value =>
      create(url, typeof value === 'function' ? value(query) : value)
  });
}

function blueprint<
  Args extends any[],
  InputResource,
  InputData,
  OutputResource,
  OutputData
>(
  endpoint: Endpoint<InputResource, InputData>,
  factory: BlueprintFactory<
    Args,
    InputResource,
    InputData,
    OutputResource,
    OutputData
  >
): Blueprint<Args, OutputResource, OutputData> {
  return (...args: Args): Endpoint<OutputResource, OutputData> =>
    factory(endpoint, ...args);
}

export const endpoint: EndpointFacade = Object.assign(create, { blueprint });
