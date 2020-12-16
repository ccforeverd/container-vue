
import { Service } from 'typedi'
import { JsonController, Get, QueryParams, UseBefore } from 'routing-controllers'
import { useDecrypt } from '../../middlewares/crypto'
import {
  CreateJenkinsApp,
  JenkinsOptions,
  JenkinsJobOptions
} from './create'

@Service()
@JsonController('/jenkins/jobs')
@UseBefore(useDecrypt({
  order: ['query']
}))
export class JenkinsJobsController extends CreateJenkinsApp {
  @Get('/all')
  getAllJobs (@QueryParams() query: JenkinsOptions) {
    return this.withJenkinsApp(query, (jenkinsApp, resolve, reject) => {
      jenkinsApp.all_jobs((err: Error, data) => {
        if (err) {
          return reject(err)
        }
        resolve(data)
      })
    })
    // return new Promise((resolve, reject) => {
    //   const jenkinsApp = this.createJenkinsApp(query)
    //   jenkinsApp.all_jobs((err: Error, data) => {
    //     if (err) {
    //       return reject(err)
    //     }
    //     resolve(data)
    //   })
    // })
  }

  @Get('/info')
  getJobInfo (@QueryParams() query: JenkinsJobOptions) {
    return this.withJenkinsApp(query, (jenkinsApp, resolve, reject) => {
      jenkinsApp.job_info(encodeURI(query.jobname), (err: Error, data) => {
        if (err) {
          return reject(err)
        }
        resolve(data)
      })
    })
  }

  @Get('/last/info')
  getLastCompletedBuildInfo (@QueryParams() query: JenkinsJobOptions) {
    return this.withJenkinsApp(query, (jenkinsApp, resolve, reject) => {
      jenkinsApp.last_completed_build_info(encodeURI(query.jobname), (err: Error, data) => {
        if (err) {
          return reject(err)
        }
        resolve(data)
      })
    })
  }

  @Get('/last/console')
  getLastBuildConsole (@QueryParams() query: JenkinsJobOptions) {
    return this.withJenkinsApp(query, (jenkinsApp, resolve, reject) => {
      const jobname = encodeURI(query.jobname)
      jenkinsApp.last_completed_build_info(jobname, (err: Error, info) => {
        if (err) {
          return reject(err)
        }
        const buildnumber = info.number || info.id
        jenkinsApp.console_output(jobname, buildnumber, (err: Error, data) => {
          if (err) {
            return reject(err)
          }
          resolve(data.body)
        })
      })
    })
  }
}
