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
  createJenkinsApp (options: JenkinsOptions = {}) {
    const {
      username = '',
      token = '',
      protocol = 'http',
      host = 'ci-edu.kingsoft.net'
    } = options

    return jenkinsApi.init(`${protocol}://${username}:${token}@${host}`)
  }
}
