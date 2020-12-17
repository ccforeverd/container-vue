import Vue from 'vue'
import { encrypt as useEnctypt } from '../../../common/crypto/encrypt'
import { generateSecretKey } from '../../../common/crypto/generateSecretKey'

const SECRET_KEY = generateSecretKey()

export function encrypt (message) {
  return useEnctypt(message, SECRET_KEY)
}

export type encryptFunc = (message: string) => string

export type enctyptJsonFunc = (data: Object) => string

Vue.prototype.$encrypt = function (message: string): string {
  return encrypt(message)
}

Vue.prototype.$encryptJson = function (data: Object): string {
  return encrypt(JSON.stringify(data))
}
