import { Observable, of } from 'rxjs';
import { ajax, AjaxRequest } from 'rxjs/ajax';
import { map, mergeMap } from 'rxjs/operators';
import { Request, RequestConfiguration } from '@apitizer/request';

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
export function fetch<Resource, Data = Resource>(
  request: Request<Resource, Data> | Observable<Request<Resource, Data>>
): Observable<Resource> {
  return (request instanceof Observable ? request : of(request)).pipe(
    mergeMap(request => ajax(request.get(transform))),
    map(({ response }) => response)
  );
}
