import { describe, test, expect } from 'vitest'
import Futurable from '../src/Futurable'

describe('Futurable<constructor>', () => {
  test(`returns a promise-like object, that resolves it's chain after invoking <resolve>`, () =>
    new Promise<void>((done) => {
      done()
    }))
})
