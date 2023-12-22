import AggregateError from 'es-aggregate-error'
import Futurable from './Futurable'

export function resolve<T>(value: T): Futurable<T> {
  return new Futurable<T>((resolve) => {
    resolve(value)
  })
}

export function reject<T>(reason?: T): Futurable<T> {
  return new Futurable<T>((_, reject) => {
    reject(reason)
  })
}

export function race<T>(futures: FuturableArgument<T>): Futurable<T> {
  return new Futurable<T>((resolve, reject) => {
    futures.forEach((future) => {
      Futurable.resolve(future).then(
        (value) => {
          resolve(value)
        },
        (reason) => {
          reject(reason)
        }
      )
    })
  })
}

export function all<T>(futures: FuturableArgument<T>): Futurable<T> {
  return new Futurable<T>((resolve, reject) => {
    const result = <any>[]
    let count = 0
    const len = futures.length

    futures.forEach((future, index) => {
      Futurable.resolve(future).then(
        (value) => {
          count++
          result[index] = value

          if (len === count) {
            resolve(result)
          }
        },
        (reason) => {
          reject(reason)
        }
      )
    })
  })
}

// static any
export function any<T>(futures: FuturableArgument<T>): Futurable<T> {
  return new Futurable<T>((resolve, reject) => {
    const errors = <any>[]
    const len = futures.length

    futures.forEach((future) => {
      Futurable.resolve(future).then(
        (value) => {
          resolve(value)
        },
        (reason) => {
          errors.push(new Error(reason))
          if (errors.length === len) {
            const error = new AggregateError(errors)
            reject(error)
          }
        }
      )
    })
  })
}

// static allSettled
export function allSettled<T>(futures: FuturableArgument<T>): Futurable<T> {
  const handleResolve = (value: T | Futurable<T>) => ({ status: 'fulfilled', value })
  const handleReject = (reason?: any) => ({ status: 'rejected', reason })

  const allSettledList: Futurable<any>[] = futures.map((future) => {
    return Futurable.resolve(future).then(handleResolve, handleReject)
  })

  return Futurable.all(allSettledList)
}
