import Futurable from "../src/Futurable"

/**
 * @description is always asynchronous
 */
new Futurable<string>((resolve) => {
  setTimeout(() => {
    resolve('testing')
  }, 20)
}).then((val) => {
  console.log('val: ', val)
})

/**
 * @description resolves with the returned value
 */
let value = 'no'
new Futurable<string>((resolve) => {
  value = 'yes;'
  resolve(value)
})
console.log('value: ', value);

/**
 * @description resolves a Futurable before calling <then>
 */
new Futurable<string>((resolve) => {
  resolve(new Futurable((resolve) => resolve('testing')))
}).then((val) => {
  console.log('val: ', val)
})

const error = new Error('why u fail?')
new Futurable<Error>((_, reject) => {
  return reject(error)
}).catch((err: Error) => {
  console.log('err: ', err);
})

/**
 * @description resolves chained <then>
 */
new Futurable<number>((resolve) => {
  resolve(0)
})
  .then((value) => value + 1)
  .then((value) => value + 1)
  .then((value) => value + 1)
  .then((value) => {
    console.log('value: ', value);
  })

/**
 * @description is resolves native Promise
 */
new Futurable<number>((resolve) => resolve(1))
  .then((value) => new Promise((resolve) => resolve(value + 1)))
  .then((value) => {
    console.log('value: ', value);
  })


/**
 * @description is can be resolved by native Promise
 */
new Promise<number>((resolve) => resolve(1))
  .then((value) => new Futurable((resolve) => resolve(value + 1)))
  .then((value) => {
    console.log('promise-value: ', value);
  })
