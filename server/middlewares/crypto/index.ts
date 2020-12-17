// 加密解密

// 1. 只有value (type=value)
// 2. key和value (type=key)
// 3. json字符串 (type=json)
// 4. 路由params中的值 (type=params)
// 5. 路由query中的 __data__ 字段 (type=query)

// 参考: https://github.com/brix/crypto-js

import CryptoJS from 'crypto-js'
import { KoaMiddlewareInterface } from 'routing-controllers'
import { decrypt } from '~~/common/crypto/decrypt'
import { generateSecretKey } from '~~/common/crypto/generateSecretKey'

const secretKey = generateSecretKey()

type decryptTypes = 'query' | 'query-value' | 'value' | 'json' | 'params' | 'formData'

interface DecryptOptions {
  order: Array<decryptTypes>
  router?: string | string[]
  keys?: string[]
  queryKeys?: string[]
}

// 解密
export function useDecrypt (options: DecryptOptions) {
  return class Decrypt implements KoaMiddlewareInterface {
    use (context: any, next: (err?: any) => Promise<any>): Promise<any> {
      const [basePath, queryString] = context.request.url.split('?')
      const query = new URLSearchParams(queryString)

      options.order.forEach((type) => {
        switch (type) {
          // 处理query的__data__字段
          case 'query':
            if (query.has('__data__')) {
              const data = JSON.parse(decrypt(query.get('__data__') || '', secretKey))
              Object.entries(data).forEach(([key, value]) => query.set(key, String(value)))
              query.delete('__data__')
              context.request.url = [basePath, query.toString()].join('?')
            }
            break

          // 处理query里指定key的value
          // 需要传入指定的key
          case 'query-value':
            if (Array.isArray(options.queryKeys) && options.queryKeys.length > 0) {
              const keys = options.queryKeys.filter(query.has)
              if (keys.length > 0) {
                keys.forEach((key) => {
                  const value = decrypt(query.get(key) || '', secretKey)
                  query.set(key, value)
                })
                context.request.url = [basePath, query.toString()].join('?')
              }
            }
            break

          // 处理url里的params
          // 需要传入路由string
          case 'params':
            break

          // 处理post的body指定key的value(自动区分json还是formData)
          // 需要传入指定的key
          case 'value':
            break

          // 处理post的body(json格式)
          case 'json':
            break

          // 处理post的body(formData格式)
          case 'formData':
            break
        }
      })

      return next()
    }
  }
}

// 加密
export function useEncrypt (options = {}) {
  console.log(options)
  console.log(secretKey)
  return class Encrypt implements KoaMiddlewareInterface {
    use (context: any, next: (err?: any) => Promise<any>): Promise<any> {
      console.log('before', Object.keys(context))
      return next().then(() => {
        console.log('after')
      }).catch((error) => {
        console.log(error)
      })
    }

    parse (message: string): string {
      return CryptoJS.AES.encrypt(
        message,
        secretKey,
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        }
      ).toString()
    }
  }
}
