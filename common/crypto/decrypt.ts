
import CryptoJS from 'crypto-js'

export function decrypt (message: string, secretKey: string) :string {
  return CryptoJS.AES.decrypt(
    message,
    secretKey,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  ).toString(CryptoJS.enc.Utf8)
}
