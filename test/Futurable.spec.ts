import { describe, test, expect, it } from 'vitest'
import Futurable from '../src/Futurable'

describe('Futurable<constructor>', () => {
  test(`returns a promise-like object, that resolves it's chain after invoking <resolve>`, () =>
    new Promise<void>((done) => {
      new Futurable<string>((resolve) => {
        setTimeout(() => {
          resolve("testing")
        }, 20)
      }).then((val) => {
        expect(val).toBe("testing")
        done()
      })
    }))

  test("is always asynchronous", () => {
    let value = "no"
    new Futurable<string>((resolve) => {
      value = "yes;"
      resolve(value)
    })
    expect(value).toBe("no")
  })
})
