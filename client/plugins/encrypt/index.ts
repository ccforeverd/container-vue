import Vue from 'vue'
import CryptoJS from 'crypto-js'
import { generateSecretKey } from '../../../common/generateSecretKey'

const SECRET_KEY = generateSecretKey()

export const encrypt = (message: string) => CryptoJS.AES.encrypt(
  message,
  CryptoJS.enc.Utf8.parse(SECRET_KEY),
  {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }
).toString()

Vue.prototype.$encrypt = function (message: string) {
  return encrypt(message)
}

Vue.prototype.$encryptJson = function (data: any) {
  return encrypt(JSON.stringify(data))
}
