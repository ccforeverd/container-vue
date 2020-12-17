import { Nuxt } from '@nuxt/core'
import { Builder } from '@nuxt/builder'
import { NuxtApp } from '@nuxt/types/app'

import nuxtConfig from '~/nuxt.config'

interface createdNuxtApp extends NuxtApp {
  koaMiddleware
}

interface createNuxtAppOptions {
  skipBuild?: boolean
  ignoreUrl?: RegExp | undefined
}

export async function createNuxtApp (options: createNuxtAppOptions = {
  skipBuild: false,
  ignoreUrl: undefined
}): Promise<createdNuxtApp> {
  const nuxtApp = new Nuxt(nuxtConfig)
  const nuxtBuilder = new Builder(nuxtApp)

  if (!options.skipBuild) {
    await nuxtApp.ready()
    await nuxtBuilder.build()
  }

  nuxtApp.koaMiddleware = () => (ctx) => {
    if (!options.ignoreUrl || !options.ignoreUrl.test(ctx.request.url)) {
      ctx.status = 200
      ctx.respond = false
      ctx.req.ctx = ctx
      nuxtApp.render(ctx.req, ctx.res)
    }
  }

  // 临时解决 nuxt-content 的经常性报错
  process.on('unhandledRejection', () => 1)

  return nuxtApp
}
