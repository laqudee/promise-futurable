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
