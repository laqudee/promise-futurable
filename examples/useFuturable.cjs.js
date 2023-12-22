const Futurable = require("../dist/index.cjs.js")

new Futurable((resolve) => {
  setTimeout(() => {
    resolve('testing')
  }, 20)
}).then((val) => {
  console.log('cjs:val: ', val)
})
