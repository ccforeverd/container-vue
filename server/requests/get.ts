import vm from 'vm'
import { JSDOM } from 'jsdom'
import { Service } from 'typedi'
import Axios from 'axios'
import Cheerio from 'cheerio'
import { JsonController, Get, QueryParam } from 'routing-controllers'
import { log } from '../utils/log'

async function getGlobalVars (url: URL) {
  const { data: jsText } = await Axios.get(url.toString())
  const script = new vm.Script(jsText)
  const { window: context } = new JSDOM('', {
    url,
    referrer: `${url.protocol}//${url.host}`,
    contentType: 'text/html',
    includeNodeLocations: true,
    storageQuota: 10000000
  })
  const originKeys = Object.keys(context)
  context.console.log = () => 1
  try {
    script.runInNewContext(context)
    await new Promise(resolve => setTimeout(resolve, 300))
  } catch (e) {
    log('getGlobalVars', `WE GOT ERROR IN ${url.toString()}`)
    return []
  }
  const newKeys = Object.keys(context)
  const newContext = newKeys
    .filter(key => !originKeys.includes(key))
    .reduce((result, key) => {
      result[key] = context[key]
      return result
    }, {})
  // TODO 销毁vm
  return Object.keys(newContext)
    .map(key => [key, newContext[key].version])
}

@Service()
@JsonController('/requests/get')
export class RequestsGetController {
  @Get('/page')
  async getPageInfo (@QueryParam('url') queryUrl: string) {
    // 自动补全链接
    // 获取js文件中的全局变量
    const url = new URL(decodeURIComponent(queryUrl))
    const { data: htmlText } = await Axios.get(url.toString())
    const $ = Cheerio.load(htmlText)
    const mapUrl = (attr, options = { vars: false }) => (_, el) => {
      const formattedUrl = new URL($(el).attr(attr), url)
      if (options.vars) {
        return getGlobalVars(formattedUrl).then(vars => ({
          url: formattedUrl.toString(),
          vars
        }))
      }
      return formattedUrl.toString()
    }
    return {
      scripts: await Promise.all($('script[src]').map(mapUrl('src', { vars: true })).get()),
      prefetch: $('link[rel=prefetch]').map(mapUrl('href')).get(),
      preload: $('link[rel=preload]').map(mapUrl('href')).get(),
      styles: $('link[rel=stylesheet]').map(mapUrl('href')).get()
    }
  }
}
