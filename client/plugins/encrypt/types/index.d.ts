import { encryptFunc, enctyptJsonFunc } from '../index'

declare module 'vue/types/vue' {
  interface Vue {
    $encrypt: encryptFunc
    $encryptJson: enctyptJsonFunc
  }
}
