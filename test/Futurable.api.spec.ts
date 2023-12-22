import { describe, test, expect, it } from 'vitest'
import Futurable from '../src/Futurable'

describe('the Futurable resolve/reject an use', () => {
  test('Futurable.resolve test', () => {
    Futurable.resolve(5)
      .then((val) => {
        expect(val).toBe(5)
      })
      .catch(() => {
        throw new Error('should not be called')
      })
  })

  test('Futurable.resolve test 2', () => {
    Futurable.resolve(
      new Futurable<string>((resolve) => {
        resolve('done')
      })
    ).then((val) => {
      expect(val).toBe('done')
    })
  })

  test('Futurable.reject test', () => {
    Futurable.reject(5).catch((val) => {
      expect(val).toBe(5)
    })

    const error = new Error('fail')
    Futurable.reject(new Error('fail')).catch((val) => {
      expect(val).toBe(error)
    })
  })
})

describe('Futurable all/any/race/allSettle api test', () => {
  it('Futurable.race test', () =>
    new Promise<void>((done) => {
      Futurable.race([
        new Futurable((resolve, reject) => setTimeout(() => resolve('first success'), 1000)),
        new Futurable((resolve, reject) => setTimeout(() => reject(new Error('Whoops!')), 2000)),
        new Futurable((resolve, reject) => setTimeout(() => resolve(300), 3000))
      ]).then((val) => {
        console.log('race-val: ', val);
        expect(val).toBe('first success')
        done()
      })
    }))
})
