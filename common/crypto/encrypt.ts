
import CryptoJS from 'crypto-js'

export function encrypt (message: string, secretKey: string): string {
  return CryptoJS.AES.encrypt(
    message,
    secretKey,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  ).toString()
}
