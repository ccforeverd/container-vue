import { Vue, Component, Ref } from 'nuxt-property-decorator'
import { AxiosError } from 'axios'

@Component({
  // DOCS: https://github.com/iendeavor/object-visualizer
  // DOCS: https://github.com/tylerkrupicka/vue-json-component
  // DOCS: https://github.com/chenfengjw163/vue-json-viewer
  // 避免服务端
  components: {
    'json-view': async () => (await import('vue-json-component')).JSONView
  }
})
export default class PageJenkins extends Vue {
  private formError: string = ''
  private formData: {
    username: string
    token: string
  } = {
    username: '',
    token: ''
  }

  private jobHeaders: any[] = []
  private jobList: any[] = []
  private jobData: any = {}
  private buildData: any = {}
  private buildConsole: string = ''
  private dialogBuild: boolean = false
  private dialogJob: boolean = false

  @Ref('form')
  readonly form

  protected asyncData () {
    return {
      valid: true,
      formData: {
        username: 'zhangshuyao',
        token: process.env.CI_EDU_KINGSOFT_TOKEN
      },
      jobHeaders: [
        {
          text: '序号',
          align: 'center',
          value: 'index'
        },
        {
          text: '名称',
          align: 'start',
          value: 'name'
        },
        {
          text: '操作',
          align: 'center',
          value: 'operation'
        }
      ]
    }
  }

  async getAllJobs () {
    this.formError = ''

    const valid = this.form.validate()
    if (!valid) {
      return
    }

    try {
      this.jobList = (await this.$axios.$get('/jenkins/jobs/all', {
        params: this.formData
      })).map((item, index) => {
        item.index = index + 1
        return item
      })
    } catch (e) {
      this.makeError(e)
      this.jobList = []
    }
  }

  async viewJob (item) {
    try {
      this.jobData = await this.$axios.$get('/jenkins/jobs/info', {
        params: {
          jobname: item.name,
          ...this.formData
        }
      })
      this.dialogJob = true
    } catch (e) {
      this.makeError(e)
      this.jobData = {}
      this.dialogJob = false
    }
  }

  async viewLast (item) {
    try {
      const formData = {
        jobname: item.name,
        ...this.formData
      }
      this.buildData = await this.$axios.$get('/jenkins/jobs/last/info', {
        params: formData
      })
      this.buildConsole = await this.$axios.$get('/jenkins/jobs/last/console', {
        params: formData
      })
      this.dialogBuild = true
    } catch (e) {
      this.makeError(e)
      this.buildData = {}
      this.buildConsole = ''
      this.dialogBuild = false
    }
  }

  makeError (error: AxiosError) {
    if (error.response) {
      if (error.response.status >= 500) {
        this.formError = error.response.data || 'Server Error 500'
      }
    } else {
      this.formError = error.message || 'Client Error'
    }
  }

  protected render () {
    return (
      <v-container>
        <v-row>
          <v-col cols="12" sm="3">
            <v-form
              ref="form"
              lazy-validation
            >
              <v-text-field
                vModel={this.formData.username}
                rules={[v => !!v || 'Username is required']}
                label="Your Jenkins Username"
              />
              <v-text-field
                vModel={this.formData.token}
                rules={[v => !!v || 'Token is required']}
                label="Your Jenkins Token"
              />
              <v-btn
                class="my-2"
                color="success"
                onClick={this.getAllJobs}
                block
              >
                 Get All Jobs
              </v-btn>
              <v-alert
                class="my-2"
                value={!!this.formError}
                type="error"
                transition="scale-transition"
              >
                { this.formError }
              </v-alert>
            </v-form>
          </v-col>
          <v-col cols="12" sm="9">
            <v-data-table
              headers={this.jobHeaders}
              items={this.jobList}
              height="calc(100vh - 240px)"
              fixed-header
              disable-sort
              scopedSlots={{
                'item.operation': ({ item }) => (
                  <span>
                    <v-btn small onClick={() => this.viewJob(item)}>
                      查看信息
                    </v-btn>
                    <v-btn small onClick={() => this.viewLast(item)}>
                      查看最新构建
                    </v-btn>
                  </span>
                )
              }}
            />
          </v-col>
        </v-row>
        <v-dialog vModel={this.dialogJob} width="90%">
          <v-tabs>
            <v-tab>项目信息</v-tab>
            <v-tab>Json View</v-tab>
            <v-tab-item>
              <v-row>
                <v-col cols="3">
                  项目名称
                </v-col>
                <v-col>{ this.jobData.name }</v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  线上地址
                </v-col>
                <v-col>{ this.jobData.url }</v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  上次构建
                </v-col>
                <v-col>{ (this.jobData.lastBuild || {}).url }</v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-card light>
                <client-only>
                  <json-view data={this.jobData} />
                </client-only>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-dialog>
        <v-dialog vModel={this.dialogBuild}>
          <v-tabs>
            <v-tab>构建信息</v-tab>
            <v-tab>Json View</v-tab>
            <v-tab>Build Console</v-tab>
            <v-tab-item>
              <v-row>
                <v-col cols="3">
                  构建ID
                </v-col>
                <v-col>{ this.buildData.id }</v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  构建结果
                </v-col>
                <v-col>{ this.buildData.result }</v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  线上地址
                </v-col>
                <v-col>{ this.buildData.url }</v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-card light>
                <client-only>
                  <json-view data={this.buildData} />
                </client-only>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card light>
                <pre>{ this.buildConsole }</pre>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-dialog>
      </v-container>
    )
  }
}
