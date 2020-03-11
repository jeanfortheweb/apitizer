export type MaybeCallback<T> = T | Callback<T>;
export type Callback<T> = (value: T) => T;
