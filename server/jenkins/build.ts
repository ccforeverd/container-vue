
import { Service } from 'typedi'
import { JsonController, Get, QueryParams } from 'routing-controllers'
import {
  CreateJenkinsApp,
  JenkinsBuildOptions
} from './create'

@Service()
@JsonController('/jenkins/build')
export class JenkinsBuildController extends CreateJenkinsApp {
  @Get('/info')
  getBuildInfo (@QueryParams() query: JenkinsBuildOptions) {
    return new Promise((resolve, reject) => {
      const jenkinsApp = this.createJenkinsApp(query)
      const jobname = encodeURI(query.jobname)
      const buildnumber = query.buildnumber
      jenkinsApp.build_info(jobname, buildnumber, (err: Error, data) => {
        if (err) {
          return reject(err)
        }
        resolve(data)
      })
    })
  }

  @Get('/console')
  getBuildConsole (@QueryParams() query: JenkinsBuildOptions) {
    return new Promise((resolve, reject) => {
      const jenkinsApp = this.createJenkinsApp(query)
      const jobname = encodeURI(query.jobname)
      const buildnumber = query.buildnumber
      jenkinsApp.console_output(jobname, buildnumber, (err: Error, data) => {
        if (err) {
          return reject(err)
        }
        resolve(data.body)
      })
    })
  }
}
