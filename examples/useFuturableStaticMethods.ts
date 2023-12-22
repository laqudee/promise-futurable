import Futurable from '../src/Futurable'

/**
 * @description Use Futurable.resolve API
 */
Futurable.resolve(5).then((val) => {
  console.log('resolve-val: ', val)
})

/**
 * @description Use Futurable.reject API
 */
Futurable.reject(new Error('Whoops!')).catch((err) => {
  console.error('reject-err: ', err)
})

/**
 * @description Use Futurable.race API
 */
Futurable.race([
  new Futurable((resolve, reject) => setTimeout(() => resolve(100), 1000)),
  new Futurable((resolve, reject) => setTimeout(() => reject(new Error('Whoops!')), 2000)),
  new Futurable((resolve, reject) => setTimeout(() => resolve(300), 3000)),
  2
])
  .then((val) => console.log('val: ', val))
  .catch((err) => {
    console.error('race-err: ', err)
  })

/**
 * @description Use Futurable.all API
 */
Futurable.all([
  new Futurable((resolve) => setTimeout(() => resolve(1), 3000)), // 1
  new Futurable((resolve) => setTimeout(() => resolve(2), 2000)), // 2
  new Futurable((resolve) => setTimeout(() => resolve(3), 1000)), // 3
  4
  // Futurable.reject(new Error("rejected"))
])
  .then((values) => {
    console.log('values: ', values) // [1, 2, 3, 4]
  })
  .catch((err) => {
    console.error('err: ', err)
  })

/**
 * @description Use Futurable.any API
 *
 */
Futurable.any([
  new Futurable((resolve, reject) => setTimeout(() => reject(new Error('Whoops!')), 1000)),
  new Futurable((resolve, reject) => setTimeout(() => resolve(1), 2000)),
  new Futurable((resolve, reject) => setTimeout(() => resolve(3), 3000))
]).then((val) => {
  console.log('any-success-val: ', val)
}) // 1

Futurable.any([
  new Futurable((resolve, reject) => setTimeout(() => reject(new Error('Ouch!')), 1000)),
  new Futurable((resolve, reject) => setTimeout(() => reject(new Error('Error!')), 2000))
]).catch((error) => {
  // console.log('any-all reject-error: ', error);
  console.log('name:', error.constructor.name) // AggregateError
  console.log(error.errors[0]) // Error: Ouch!
  console.log(error.errors[1]) // Error: Error!
})

/**
 * @description Use Futurable.allSettled API
 */
Futurable.allSettled([
  new Futurable((resolve) => setTimeout(() => resolve(1), 3000)), // 1
  new Futurable((resolve) => setTimeout(() => resolve(2), 2000)), // 2
  new Futurable((resolve) => setTimeout(() => resolve(3), 1000)), // 3
  4,
  Futurable.reject('rejected')
]).then((values) => {
  console.log('values: ', values) // [1, 2, 3, 4, "reject"]
})
