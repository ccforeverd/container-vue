// 加密解密

// 1. 只有value
// 2. key和value
// 3. json字符串
// 4. 路由params中的值
// 5. 路由query中的__data__字段

// 参考: https://github.com/brix/crypto-js

import { KoaMiddlewareInterface } from 'routing-controllers'

export function useEncrypt (options = {}) {
  console.log(options)
  return class Encrypt implements KoaMiddlewareInterface {
    use (context: any, next: (err?: any) => Promise<any>): Promise<any> {
      console.log('before', Object.keys(context))
      return next().then(() => {
        console.log('after')
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}

export function useDecrypt (options = {}) {
  console.log(options)
  return class Decrypt implements KoaMiddlewareInterface {
    use (context: any, next: (err?: any) => Promise<any>): Promise<any> {
      console.log('before', Object.keys(context))
      return next().then(() => {
        console.log('after')
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
