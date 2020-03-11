import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, mergeMap } from 'rxjs/operators';
import { Request } from 'apitizer';

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
    mergeMap(configuration => ajax(configuration.get())),
    map(({ response }) => response)
  );
}
