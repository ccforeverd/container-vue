import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { match } from 'path-to-regexp'

export default function ({ $axios }: { $axios: NuxtAxiosInstance }) {
  const matchFuncs = [
    match('/jenkins/jobs/(.*)')
  ]

  $axios.onRequest((config) => {
    console.log(111, config.url, matchFuncs.some(f => f(config.url || '')))
  })
}
