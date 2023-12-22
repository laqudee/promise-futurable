import Futurable from '../Futurable'

Futurable.race([
  new Futurable((resolve, reject) => setTimeout(() => resolve(100), 1000)),
  new Futurable((resolve, reject) => setTimeout(() => reject(new Error('Whoops!')), 2000)),
  new Futurable((resolve, reject) => setTimeout(() => resolve(300), 3000))
]).then((val) => console.log('val: ', val))
