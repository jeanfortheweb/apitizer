export type MaybeParams = Record<string, string | undefined>;
export type Params = Record<string, string>;
export type MaybeParamPair = [string, string | undefined];
export type ParamPair = [string, string];

/**
 * Defines a query builder.
 */
export interface Query {
  /**
   * Sets a single query parameter.
   * Setting a parameter to undefined or null deletes the parameter.
   *
   * @param name Parameter.
   * @param value Value.
   */
  param(name: string, value: string | undefined): Query;

  /**
   * Sets a group of query parameters.
   * Setting a parameter to undefined or null deletes the parameter.
   *
   * @param params Parameters.
   */
  params(params: Record<string, string | undefined>): Query;

  /**
   * Removes all current set parameters.
   */
  clear(): Query;

  /**
   * Checks if the builder contains any parameters.
   */
  empty(): boolean;

  /**
   * Returns the query as a string.
   */
  get(): string;
}

function hasValue(pair: MaybeParamPair): pair is ParamPair {
  return typeof pair[1] === 'string';
}

function reduce(params: Params, [name, value]: ParamPair): Params {
  return { ...params, [name]: value };
}

function sanitize(params: MaybeParams): Params {
  return Object.entries(params)
    .filter(hasValue)
    .reduce(reduce, {});
}

function encode([key, value]: ParamPair): string {
  return [encodeURIComponent(key), encodeURIComponent(value)].join('=');
}

export function query(params: Params = {}): Query {
  return Object.freeze<Query>({
    param: (name: string, value: string | undefined): Query =>
      query(sanitize({ ...params, [name]: value })),

    params: (newParams: Params): Query =>
      query(sanitize({ ...params, ...newParams })),

    clear: (): Query => query({}),

    empty: (): boolean => Object.keys(params).length === 0,

    get: (): string =>
      Object.entries(params)
        .map(encode)
        .join('&')
  });
}
