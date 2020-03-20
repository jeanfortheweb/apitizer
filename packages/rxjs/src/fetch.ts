/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, of } from 'rxjs';
import { ajax, AjaxRequest } from 'rxjs/ajax';
import { map, mergeMap } from 'rxjs/operators';
import { Request, RequestConfiguration } from '@apitizer/request';

export interface MaybeBlueprint<Resource, Data> {
  (...args: any): Request<Resource, Data>;
}

export interface Blueprint<Args extends any[], Resource = any> {
  (...args: Args): Observable<Resource>;
}

export interface BlueprintFactory<
  Args extends any[],
  InputResource,
  InputData,
  OutputResource,
  OutputData
> {
  (
    request$: Observable<Request<InputResource, InputData>>,
    ...args: Args
  ): Observable<Request<OutputResource, OutputData>>;
}

interface FetchFacade {
  <Resource, Data = Resource>(
    request: Request<Resource, Data> | Observable<Request<Resource, Data>>
  ): Observable<Resource>;

  blueprint<
    Args extends any[],
    InputResource,
    InputData,
    OutputResource,
    OutputData
  >(
    request:
      | Request<InputResource, InputData>
      | MaybeBlueprint<InputResource, InputData>,
    factory: BlueprintFactory<
      Args,
      InputResource,
      InputData,
      OutputResource,
      OutputData
    >
  ): Blueprint<Args, OutputResource>;
}

/**
 * Transforms the apitizer request configuration into a rxjs ajax request.
 *
 * @param configuration
 */
function transform(configuration: RequestConfiguration): AjaxRequest {
  return {
    ...configuration,
    body: configuration.data
  };
}

/**
 * Setups a simple request.
 *
 * Internally, an rxjs ajax request is triggered, returning an observable which already
 * maps to the response body.
 *
 * @param request Request configuration.
 */
function create<Resource, Data = Resource>(
  request: Request<Resource, Data> | Observable<Request<Resource, Data>>
): Observable<Resource> {
  return (request instanceof Observable ? request : of(request)).pipe(
    mergeMap(request => ajax(request.get(transform))),
    map(({ response }) => response)
  );
}

function blueprint<
  Args extends any[],
  InputResource,
  InputData,
  OutputResource,
  OutputData
>(
  request: Request<InputResource, InputData>,
  factory: BlueprintFactory<
    Args,
    InputResource,
    InputData,
    OutputResource,
    OutputData
  >
): Blueprint<Args, OutputResource> {
  return (...args: Args): Observable<OutputResource> =>
    create(factory(of(request), ...(args as Args)));
}

export const fetch: FetchFacade = Object.assign(create, {
  blueprint
});
