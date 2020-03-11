/* eslint-disable @typescript-eslint/no-use-before-define */
export type Params = Record<string, string | undefined>;
export interface Query {
  param(name: string, value: string | undefined): Query;
  params(params: Record<string, string | undefined>): Query;
  clear(): Query;
  empty(): boolean;
  get(): string;
}

function param(params: Params) {
  return (name: string, value: string | undefined): Query =>
    query({ ...params, [name]: value });
}

function params(params: Params) {
  return (newParams: Params): Query => query({ ...params, ...newParams });
}

function clear() {
  return (): Query => query({});
}

function empty(params: Params) {
  return (): boolean =>
    Object.keys(params).length === 0 ||
    Object.entries(params).every(([, value]) => value === undefined);
}

function get(params: Params) {
  return (): string => {
    const queryString = Object.entries(params)
      .filter(
        (pair: [string, string | undefined]): pair is [string, string] =>
          pair[1] !== undefined
      )
      .map(([key, value]) =>
        [encodeURIComponent(key), encodeURIComponent(value)].join('=')
      )
      .join('&');

    return queryString;
  };
}

export function query(initial: Params = {}): Query {
  return Object.freeze<Query>({
    param: param(initial),
    params: params(initial),
    clear: clear(),
    empty: empty(initial),
    get: get(initial)
  });
}
