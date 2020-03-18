// import { OutMessage, InMessage, stream } from '..';

import xhr, { delay } from 'xhr-mock';
import { MockFunction } from 'xhr-mock/lib/types';
import { AjaxRequest } from 'rxjs/ajax';

export interface MockOptions<Body, Response> {
  body?: Body;
  method?: string;
  response: Response;
  status?: number;
  headers?: Record<string, string>;
  delay?: number;
}

export function mock<Body, Response>(
  options: MockOptions<Body, Response>
): void {
  xhr.reset();

  let fn: MockFunction = (request, response) => {
    const body = JSON.parse(request.body());
    const headers = request.headers();
    const method = request.method();

    if (options.body) {
      expect(body).toEqual(options.body);
    }

    if (options.headers) {
      expect(headers).toEqual(options.headers);
    }

    if (options.method) {
      expect(method.toUpperCase()).toEqual(options.method.toUpperCase());
    }

    return response.status(options.status || 200).body(options.response);
  };

  if (options.delay) {
    fn = delay(fn, options.delay);
  }

  xhr.use(fn);
}

/* interface InOut {
  options: MockOptions<any, any>;
  input: InMessage[];
  output: OutMessage[];
}

async function expectStreamOutput(
  receive: Observable<OutMessage>,
  messages: OutMessage[]
): Promise<void> {
  return new Promise(resolve => {
    let index = 0;

    receive.subscribe(message => {
      expect(message).toEqual(messages[index]);

      if (index < messages.length) {
        index++;
      }

      if (index === messages.length) {
        resolve();
      }
    });
  });
}

export async function expectStream(
  target: ReturnType<typeof stream>,
  ...inout: InOut[]
): Promise<void> {
  const [send, receive] = target;

  for (const { input, output, options } of inout) {
    mock(options);

    const behavior = new ReplaySubject<OutMessage>(100);
    receive.subscribe(behavior);

    for (const message of input) {
      send(message);
    }

    await expectStreamOutput(behavior, output);
  }
}
*/
export function url(path?: string): string {
  return path ? ['http://foo.com', path].join('/') : 'http://foo.com';
}

export function configuration(configuration: AjaxRequest): AjaxRequest {
  return {
    responseType: 'json',
    ...configuration,
    headers: {
      'content-type': 'application/json',
      ...configuration?.headers
    }
  };
}
