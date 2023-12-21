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

class Futurable<T> {
  private state = FuturableState.Pending
}

export default Futurable
