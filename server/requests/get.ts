import { Service } from 'typedi'
import Axios from 'axios'
import Cheerio from 'cheerio'
import { JsonController, Get, QueryParams } from 'routing-controllers'

interface PageQuery {
  url: string
}

async function getGlobalVars (url: string) {
  const vm = require('vm')
  const { data: jsText } = await Axios.get(url)
  const script = new vm.Script(jsText)
  const context = {}
  script.runInNewContext(context)
  console.log(context)
}

getGlobalVars('http://edu-fe.ks3-cn-beijing.ksyun.com/libs/vue-router.3.0.2.min.js')

// async function getGlobalVars (url) {
//   const { data: jsText } = await Axios.get(url)
//   const fail = (msg, other = {}) => ({
//     result: [],
//     // jsText,
//     msg,
//     ...other
//   })
//   // !function(e,t)
//   // 获取第一个变量
//   const match = jsText.match(/!function\((\w),(\w)/)
//   if (!match) {
//     return fail('can not match "!function(e,t)"')
//   }
//   const g = match[1]
//   const f = match[2]
//   if (!g || !f) {
//     return fail('can not match "g" and "f"', { g, f })
//   }
//   // e.amd?define(e):t.VueRouter=e()}(t
//   const match2 = jsText.match(new RegExp(`:${g}.(\\w+)=${f}\\(\\)`))
//   if (!match2) {
//     return fail('can not match "e.amd?define(e):t.VueRouter=e()}(t"')
//   }
//   const v = match2[1]
//   if (!v) {
//     return fail('can not match "v"')
//   }
//   return {
//     result: [v]
//   }
// }

@Service()
@JsonController('/requests/get')
export class RequestsGetController {
  @Get('/page')
  async getPageInfo (@QueryParams() query: PageQuery) {
    const { data: htmlText } = await Axios.get(query.url)
    const $ = Cheerio.load(htmlText)
    // 获取链接的protocol
    // 自动补全链接
    // 获取js文件中的全局变量
    return {
      scripts: $('script[src]').map((_, el) => $(el).attr('src')).get(),
      prefetch: $('link[rel=prefetch]').map((_, el) => $(el).attr('href')).get(),
      preload: $('link[rel=preload]').map((_, el) => $(el).attr('href')).get(),
      styles: $('link[rel=stylesheet]').map((_, el) => $(el).attr('href')).get()
    }
  }
}
