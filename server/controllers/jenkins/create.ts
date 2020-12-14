import jenkinsApi from 'jenkins-api'

export interface JenkinsOptions {
  readonly username?: string
  readonly token?: string
  readonly protocol?: string
  readonly host?: string
}

export interface JenkinsJobOptions extends JenkinsOptions {
  readonly jobname: string
}

export interface JenkinsBuildOptions extends JenkinsJobOptions {
  readonly buildnumber: string | number
}

export class CreateJenkinsApp {
  createJenkinsApp (options: JenkinsOptions) {
    const {
      username = '',
      token = '',
      protocol = 'http',
      host = 'ci-edu.kingsoft.net'
    } = options

    return jenkinsApi.init(`${protocol}://${username}:${token}@${host}`)
  }

  withJenkinsApp (
    options: JenkinsOptions,
    callback: (
      jenkinsApp: any,
      resolve: (value: unknown) => any,
      reject: (err: any) => any
    ) => any
  ) {
    return new Promise((resolve, reject) => {
      const jenkinsApp = this.createJenkinsApp(options)
      callback && callback(jenkinsApp, resolve, (err) => {
        reject(new Error('[Jenkins Error] ' + err).message)
      })
      return jenkinsApp
    })
  }
}
