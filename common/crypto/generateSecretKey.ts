
const { cryptoConfig } = require('~~/config/crypto')

export function generateSecretKey (): string {
  return [...cryptoConfig.s].map(index => cryptoConfig.k[index]).join('=_=')
}
