# Futurable Static Methods

## Futurable.all

Let’s say we want many promises to execute in parallel and wait until all of them are ready.

`Promise.all` takes an iterable (usually, an array of promises) and returns a new promise.

The new promise resolves when all listed promises are resolved, and the array of their results becomes its result.

Please note that the order of the resulting array members is the same as in its source promises. Even though the first promise takes the longest time to resolve, it’s still first in the array of results.

A common trick is to map an array of job data into an array of promises, and then wrap that into `Promise.all`.

If any of the promises is rejected, the promise returned by `Promise.all` immediately rejects with that error.

## FUturable.allSettled

Promise.allSettled just waits for all promises to settle, regardless of the result. The resulting array has:

- `{status:"fulfilled", value:result}` for successful responses,
- `{status:"rejected", reason:error}` for errors.
  For example, we’d like to fetch the information about multiple users. Even if one request fails, we’re still interested in the others.

## Futurable.any

Similar to `Promise.race`, but waits only for the first fulfilled promise and gets its result. If all of the given promises are rejected, then the returned promise is rejected with `AggregateError` – a special error object that stores all promise errors in its errors property.

## Futurable.race

Similar to `Promise.all`, but waits only for the first settled promise and gets its result (or error).

## Futurable.resolve

`Promise.resolve(value)` creates a resolved promise with the result value.

## Futurable.reject

Promise.reject(error) creates a rejected promise with error.

## Summary

There are 6 static methods of Promise class:

- Promise.all(promises) – waits for all promises to resolve and returns an array of their results. If any of the given promises rejects, it becomes the error of Promise.all, and all other results are ignored.

- `Promise.allSettled(promises)` (recently added method) – waits for all promises to settle and returns their results as an array of objects with:

  - status: "fulfilled" or "rejected"
  - value (if fulfilled) or reason (if rejected).

- `Promise.race(promises)` – waits for the first promise to settle, and its result/error becomes the outcome.

- `Promise.any(promises)` (recently added method) – waits for the first promise to fulfill, and its result becomes the outcome. If all of the given promises are rejected, AggregateError becomes the error of Promise.any.

- `Promise.resolve(value)` – makes a resolved promise with the given value.

- `Promise.reject(error)` – makes a rejected promise with the given error.

Of all these, `Promise.all` is probably the most common in practice.
