import { Context } from '@nuxt/types'
import { match } from 'path-to-regexp'
import { encrypt } from '../encrypt'

export default function ({ $axios }: Context) {
  const matchFuncs = [
    match('/jenkins/jobs/(.*)')
  ]

  $axios.setBaseURL('/api')
  $axios.defaults.timeout = 5000

  $axios.onRequest((config) => {
    if (matchFuncs.some(f => f(config.url || ''))) {
      if (config.method === 'get') {
        config.params = {
          __data__: encrypt(JSON.stringify(config.params))
        }
      }
    }
  })

  $axios.onError((error) => {
    // console.log('$axios.onError', error)
    // console.log(error.code)
    // console.log(error.message)
    // console.log(Object(error))
    // nuxtError({
    //   statusCode: error.response?.status,
    //   message: error.message
    // })
    if (error.code === 'ECONNABORTED') {
      switch (true) {
        case error.message.includes('timeout'):
          throw new Error('Timeout.')
      }
    }
    return Promise.resolve(false)
  })
}
