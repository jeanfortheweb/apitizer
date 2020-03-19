import { query } from '..';

it('should accept initial parameters', () => {
  expect(query({ foo: 'bar' }).get()).toEqual('foo=bar');
});

it('should set single parameters', () => {
  expect(
    query()
      .param('foo', 'bar')
      .get()
  ).toEqual('foo=bar');
});

it('should set multiple parameters', () => {
  expect(
    query()
      .params({
        foo: 'bar'
      })
      .get()
  ).toEqual('foo=bar');
});

it('should delete single parameters', () => {
  expect(
    query()
      .params({
        foo: 'bar'
      })
      .param('foo', undefined)
      .get()
  ).toEqual('');
});

it('should tell if its empty', () => {
  expect(
    query()
      .params({
        foo: 'bar'
      })
      .empty()
  ).toEqual(false);

  expect(query().empty()).toEqual(true);
});

it('should clear all entries', () => {
  expect(
    query({ foo: 'bar' })
      .clear()
      .empty()
  ).toEqual(true);
});
