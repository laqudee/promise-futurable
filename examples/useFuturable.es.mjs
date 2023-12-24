import Futurable from '../dist/index.es.js'

/**
 * @description is always asynchronous
 */
new Futurable((resolve) => {
  setTimeout(() => {
    resolve('testing')
  }, 20)
}).then((val) => {
  console.log('val: ', val)
})

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
