import 'reflect-metadata'
// import { Nuxt, Builder } from 'nuxt'
import { Nuxt } from '@nuxt/core'
import { Builder } from '@nuxt/builder'
import { createKoaServer, useContainer } from 'routing-controllers'
import { Container } from 'typedi'

import nuxtConfig from '../client/nuxt.config'
import { log } from './utils/log'
import { getAvailablePort } from './utils/getAvaliablePort'

import { JenkinsJobsController, JenkinsBuildController } from './jenkins'
import { RequestsGetController } from './requests'

useContainer(Container)

const start = async () => {
  const nuxtApp = new Nuxt(nuxtConfig)
  const nuxtBuilder = new Builder(nuxtApp)
  const port = await getAvailablePort(4000)
  const app = createKoaServer({
    routePrefix: '/api',
    controllers: [
      JenkinsJobsController,
      JenkinsBuildController,
      RequestsGetController
    ]
  })

  if (process.env.DEV_MODE !== 'server') {
    await nuxtApp.ready()
    await nuxtBuilder.build()
  }

  app
    .use((ctx) => {
      if (ctx.request.url.indexOf('/api') !== 0) {
        ctx.status = 200
        ctx.respond = false
        ctx.req.ctx = ctx
        nuxtApp.render(ctx.req, ctx.res)
      }
    })
    .listen(port, '0.0.0.0')

  log('server', `Server started at 0.0.0.0:${port}`)

  process.on('unhandledRejection', () => 1)
}

start()
