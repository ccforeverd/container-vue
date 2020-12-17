import 'reflect-metadata'
import { createKoaServer, useContainer } from 'routing-controllers'
import { Container } from 'typedi'

import { log } from './utils/log'
import { getAvailablePort } from './utils/getAvaliablePort'

import * as controllers from './controllers'

import { createNuxtApp } from '~/createNuxtApp'

useContainer(Container)

const start = async () => {
  const port = await getAvailablePort(4000)
  const app = createKoaServer({
    routePrefix: '/api',
    controllers: Object.values(controllers)
  })
  const nuxtApp = await createNuxtApp({
    skipBuild: process.env.DEV_MODE === 'server',
    ignoreUrl: /^\/api\//
  })

  app
    .use(nuxtApp.koaMiddleware())
    .listen(port, '0.0.0.0')

  log('server', `Server started at 0.0.0.0:${port}`)
}

start()
