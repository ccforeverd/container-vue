// 加密解密

// 1. 只有value (type=value)
// 2. key和value (type=key)
// 3. json字符串 (type=json)
// 4. 路由params中的值 (type=params)
// 5. 路由query中的 __data__ 字段 (type=query)

// 参考: https://github.com/brix/crypto-js

import CryptoJS from 'crypto-js'
import { KoaMiddlewareInterface } from 'routing-controllers'
import { generateSecretKey } from '@/common/generateSecretKey'

const secretKey = generateSecretKey()

type decryptTypes = 'value' | 'key' | 'json' | 'params' | 'query'
interface DecryptOptions {
  order: Array<decryptTypes>
}

// 解密
export function useDecrypt (options: DecryptOptions) {
  return class Decrypt implements KoaMiddlewareInterface {
    use (context: any, next: (err?: any) => Promise<any>): Promise<any> {
      const [basePath, queryString] = context.request.url.split('?')
      const query = new URLSearchParams(queryString)

      options.order.forEach((type) => {
        switch (type) {
          case 'query':
            if (query.has('__data__')) {
              // console.log('---' + this.parse(query.get('__data__') || '') + '---')
              // console.log(typeof this.parse(query.get('__data__') || ''))
              const data = JSON.parse(String(this.parse(query.get('__data__') || '')))
              // console.log(data)
              Object.entries(data).forEach(([key, value]) => query.set(key, String(value)))
              query.delete('__data__')
              context.request.url = [basePath, query.toString()].join('?')
            }
            break
        }
      })

      return next()
    }

    parse (message: string): string {
      return CryptoJS.AES.decrypt(
        message,
        secretKey,
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        }
      ).toString(CryptoJS.enc.Utf8)
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
