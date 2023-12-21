enum FuturableState {
  Pending,
  Resolved,
  Rejected
}

type Resolver<T> = {
  handleThen: (value: T) => void
  handleCatch: (reason?: any) => void
}

const runAsync = (callback: () => void) => {
  setTimeout(callback, 0)
}

const isThenable = (obj: any): obj is Futurable<any> => typeof obj?.then === 'function'

export default class Futurable<T> {
  private state = FuturableState.Pending
  private result?: any // resolved value or error
  private resolvers: Resolver<T>[] = []

  constructor(
    executor: (resolve: (value: T | Futurable<T>) => void, reject: (reason?: any) => void) => void
  ) {
    runAsync(() => {
      try {
        executor(this.resolve, this.reject)
      } catch (e) {
        this.reject(e)
      }
    })
  }

  private setResult = (value: any, state: FuturableState) => {
    runAsync(() => {
      if (this.state !== FuturableState.Pending) {
        return
      }

      if (isThenable(value)) {
        value.then(this.resolve, this.reject)
        return
      }

      this.state = state
      this.result = value
      this.executeResolvers()
    })
  }

  private resolve = (value: T | Futurable<T>) => {
    this.setResult(value, FuturableState.Resolved)
  }

  private reject = (reason?: any) => {
    this.setResult(reason, FuturableState.Rejected)
  }

  private executeResolvers = () => {
    if (this.state === FuturableState.Pending) {
      return
    }

    this.resolvers.forEach((resolver) => {
      if (this.state === FuturableState.Resolved) {
        resolver.handleThen(this.result)
      } else {
        resolver.handleCatch(this.result)
      }
    })

    this.resolvers = []
  }

  then = <R1 = T, R2 = never>(
    onFulfilled?: null | ((value: T) => R1 | Futurable<R1>),
    onRejected?: null | ((reason?: any) => R2 | Futurable<R2>)
  ) => {
    return new Futurable<R1 | R2>((resolve, reject) => {
      this.resolvers.push({
        handleThen: (value) => {
          if (!onFulfilled) {
            resolve(value as any)
          } else {
            try {
              resolve(onFulfilled(value) as R1 | Futurable<R1 | R2>)
            } catch (e) {
              reject(e)
            }
          }
        },
        handleCatch: (reason) => {
          if (!onRejected) {
            reject(reason)
          } else {
            try {
              resolve(onRejected(reason) as R2 | Futurable<R1 | R2>)
            } catch (e) {
              reject(e)
            }
          }
        }
      })
      this.executeResolvers()
    })
  }

  catch = <R = never>(onRejected?: (reason: any) => R | Futurable<R>) => {
    return this.then(undefined, onRejected)
  }

  finally = (onFinally: () => void): Futurable<T> => {
    return this.then(
      (value) => {
        onFinally()
        return value
      },
      (reason) => {
        onFinally()
        throw reason
      }
    )
  }
}
