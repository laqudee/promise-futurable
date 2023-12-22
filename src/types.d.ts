type Resolver<T> = {
  handleThen: (value: T) => void
  handleCatch: (reason?: any) => void
}

// Futurable all api type
type FuturableArgument<T> = Array<Futurable<T> | T>
