import Vue from 'vue'
import CryptoJS from 'crypto-js'
import { generateSecretKey } from '../../../common/generateSecretKey'

const SECRET_KEY = generateSecretKey()

export const encrypt = (message: string): string => CryptoJS.AES.encrypt(
  message,
  SECRET_KEY,
  {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }
).toString()

export type encryptFunc = (message: string) => string

export type enctyptJsonFunc = (data: Object) => string

Vue.prototype.$encrypt = function (message: string): string {
  return encrypt(message)
}

Vue.prototype.$encryptJson = function (data: Object): string {
  return encrypt(JSON.stringify(data))
}
