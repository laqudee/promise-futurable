import { describe, test, expect, it } from 'vitest'
import Futurable from '../src/Futurable'

describe('Futurable<constructor>', () => {
  test(`returns a promise-like object, that resolves it's chain after invoking <resolve>`, () =>
    new Promise<void>((done) => {
      new Futurable<string>((resolve) => {
        setTimeout(() => {
          resolve('testing')
        }, 20)
      }).then((val) => {
        expect(val).toBe('testing')
        done()
      })
    }))

  test('is always asynchronous', () => {
    let value = 'no'
    new Futurable<string>((resolve) => {
      value = 'yes;'
      resolve(value)
    })
    expect(value).toBe('no')
  })

  it('resolves with the returned value', () =>
    new Promise<void>((done) => {
      new Futurable<string>((resolve) => {
        resolve('testing')
      }).then((val) => {
        expect(val).toBe('testing')
        done()
      })
    }))

  it('resolves a Futurable before calling <then>', () =>
    new Promise<void>((done) => {
      new Futurable<string>((resolve) => {
        resolve(new Futurable((resolve) => resolve('testing')))
      }).then((val) => {
        expect(val).toBe('testing')
        done()
      })
    }))

  test('resolves a Futurable before calling <catch>', () =>
    new Promise<void>((done) => {
      new Futurable<string>((resolve) => {
        resolve(new Futurable((_, reject) => reject('failure')))
      }).catch((val) => {
        expect(val).toBe('failure')
        done()
      })
    }))

  test('catches errors from <reject>', () =>
    new Promise<void>((done) => {
      const error = new Error('why u fail?')

      new Futurable<Error>((_, reject) => {
        return reject(error)
      }).catch((err: Error) => {
        expect(err).toBe(error)
        done()
      })
    }))

  test('catches errors from <throw>', () =>
    new Promise<void>((done) => {
      const error = new Error('error')

      new Futurable(() => {
        throw error
      }).catch((err) => {
        expect(err).toBe(error)
        done()
      })
    }))

  test('does not change state anymore after promise is fulfilled', () =>
    new Promise<void>((done) => {
      new Futurable<string>((resolve, reject) => {
        resolve('success')
        reject('failure')
      })
        .catch(() => {
          throw 'should not be called'
        })
        .then((val) => {
          expect(val).toBe('success')
          done()
        })
    }))

  test('does not change state anymore after promise is rejected', () =>
    new Promise<void>((done) => {
      new Futurable((resolve, reject) => {
        reject('failure')
        resolve('success')
      })
        .then(() => {
          throw 'should not be called'
        })
        .catch((err) => {
          expect(err).toBe('failure')
          done()
        })
    }))
})

describe('Futurable chaining', () => {
  test('resolves chained <then>', () =>
    new Promise<void>((done) => {
      new Futurable<number>((resolve) => {
        resolve(0)
      })
        .then((value) => value + 1)
        .then((value) => value + 1)
        .then((value) => value + 1)
        .then((value) => {
          // console.log('value: ', value);
          expect(value).toBe(3)
          done()
        })
    }))

  test('resolves <then> chain after <catch>', () => {
    new Futurable<number>(() => {
      throw new Error('why u fail?')
    })
      .catch(() => {
        return 'testing'
      })
      .then((value) => {
        expect(value).toBe('testing')
      })
  })

  test('catches errors thrown in <then>', () => {
    const error = new Error('why u fail?')

    new Futurable((resolve) => {
      resolve(new Error('error')) // throw error
    })
      .then(() => {
        throw error
      })
      .catch((err) => {
        expect(err).toBe(error)
      })
  })

  test('catches errors thrown in <catch>', () => {
    const error = new Error('Final error')

    new Futurable((_, reject) => {
      reject(new Error('Initial error'))
    })
      .catch(() => {
        throw error
      })
      .catch((err) => {
        expect(err).toBe(error)
      })
  })

  test('short-circuits <then> chain on error', () => {
    const error = new Error('Why u fail?')

    new Futurable(() => {
      throw error
    })
      .then(() => {
        throw new Error('should not be called')
      })
      .catch((err) => {
        // console.error('err: ', err);

        expect(err).toBe(error)
      })
  })

  it('passes value through undefined <then>', () => {
    new Futurable((resolve) => {
      resolve('testing')
    })
      .then()
      .then((value) => {
        // console.log('value: ', value);
        expect(value).toBe('testing')
      })
  })

  it('passes value through undefined <catch>', () =>
    new Promise<void>((done) => {
      const error = new Error('Why u fail?')

      new Futurable((_, reject) => {
        reject(error)
      })
        .catch()
        .catch((err) => {
          expect(err).toBe(error)
          done()
        })
    }))
})

describe('Futurable <finally>', () => {
  test('it is called when Futurable is resolved', () => {
    new Futurable((resolve) => resolve('success')).finally(() => {
      expect(true).toBeCalled()
    })
  })

  test('it is called when Futurable is rejected', () => {
    new Futurable((_, reject) => reject('failure')).finally(() => {
      expect(true).toBeCalled()
    })
  })

  it('it preserves a resolved promise state', () =>
    new Promise<void>((done) => {
      let finallyCalledTimes = 0

      new Futurable((resolve) => resolve('success'))
        .finally(() => {
          finallyCalledTimes += 1
        })
        .then((value) => {
          expect(value).toBe('success')
          expect(finallyCalledTimes).toBe(1)
          done()
        })
    }))

  test('it preserves a rejected promise state', () =>
    new Promise<void>((done) => {
      let finallyCalledTimes = 0

      new Futurable((_, reject) => reject('fail'))
        .finally(() => {
          finallyCalledTimes += 1
        })
        .catch((reason) => {
          expect(reason).toBe('fail')
          expect(finallyCalledTimes).toBe(1)
          done()
        })
    }))
})

describe('Futurable is thenable', () => {
  test('is resolves native Promise', () =>
    new Promise<void>((done) => {
      new Futurable<number>((resolve) => resolve(1))
        .then((value) => new Promise((resolve) => resolve(value + 1)))
        .then((value) => {
          // console.log('value: ', value);
          expect(value).toBe(2)
          done()
        })
    }))

  test('is can be resolved by native Promise', () =>
    new Promise<void>((done) => {
      new Promise<number>((resolve) => resolve(1))
        .then((value) => new Futurable((resolve) => resolve(value + 1)))
        .then((value) => {
          expect(value).toBe(2)
          done()
        })
    }))
})
