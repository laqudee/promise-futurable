import Futurable from './Futurable'

export enum FuturableState {
  Pending,
  Resolved,
  Rejected
}

export const runAsync = (callback: () => void) => {
  setTimeout(callback, 0)
}

export const isThenable = (obj: any): obj is Futurable<any> => typeof obj?.then === 'function'
