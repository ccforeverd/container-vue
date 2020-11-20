import { Vue, Component, Ref } from 'nuxt-property-decorator'

interface PageScript {
  url: string
  vars: []
}

interface PageInfo {
  scripts?: PageScript[],
  prefetch?: string[],
  preload?: string[],
  styles?: string[]
}

@Component
export default class PageIndex extends Vue {
  private readonly sites = [
    'edu.wps.cn',
    'edu-m.wps.cn',
    'edu-activity.wps.cn',
    'edu.wps.cn:8080',
    'edu-m.wps.cn:8080',
    'edu-activity.wps.cn:8080'
  ]

  private formData = {
    protocol: 'http:',
    host: 'edu-m.wps.cn:8080'
  }

  private formError = ''
  private pageInfo: PageInfo = {}
  private enablePageInfo = false

  @Ref('form')
  private readonly form

  protected asyncData () {
    return {
    }
  }

  async getPageInfo () {
    this.formError = ''

    const valid = this.form.validate()
    if (!valid) {
      return
    }

    const url = `${this.formData.protocol}//${this.formData.host}`

    try {
      this.$nuxt.$loading.start()
      this.pageInfo = (await this.$axios.$get('/requests/get/page', { params: { url } }))
      this.enablePageInfo = true
    } catch (e) {
      if (e.response.status === 500) {
        this.formError = e.response.data || 'service error'
      }
      this.pageInfo = {}
      this.enablePageInfo = false
    } finally {
      this.$nuxt.$loading.finish()
    }
  }

  protected renderPanelHeader (label, text, textOpen) {
    return (
      <v-expansion-panel-header
        scopedSlots={{
          default: ({ open }) => (
            <v-row no-gutters>
              <v-col cols="4">{label}</v-col>
              <v-col cols="8" class="text--secondary">
                <v-fade-transition leave-absolute>
                  {
                    open
                      ? <span key="0">{textOpen}</span>
                      : <span key="1">{text}</span>
                  }
                </v-fade-transition>
              </v-col>
            </v-row>
          )
        }}
      />
    )
  }

  protected renderPanelContent (list, options = {
    type: 'default'
  }) {
    if (!list || !list.length) {
      return (
        <v-expansion-panel-content>
          <v-card>页面中没有该类资源</v-card>
        </v-expansion-panel-content>
      )
    }
    return (
      <v-expansion-panel-content>
        {
          list.map(item => (
            <v-list-item two-line={options.type === 'script'}>
              <v-list-item-content>
                <v-list-item-title>
                  {item.url || item}
                </v-list-item-title>
                {
                  options.type === 'script' && (
                    <v-list-item-subtitle>
                      {
                        item.vars.map(([name, version]) => (
                          name + (version ? ` (version:${version})` : '')
                        )).join(', ')
                      }
                    </v-list-item-subtitle>
                  )
                }
              </v-list-item-content>
            </v-list-item>
          ))
        }
      </v-expansion-panel-content>
    )
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
              <v-select
                vModel={this.formData.protocol}
                label="Protocol"
                items={['http:', 'https:']}
              />
              <v-select
                vModel={this.formData.host}
                rules={[v => !!v || 'Host is required']}
                label="Host"
                items={this.sites}
              />
              <v-btn
                color="success"
                onClick={this.getPageInfo}
              >
                  Get Page Info
              </v-btn>
              <v-alert
                value={!!this.formError}
                type="error"
                transition="scale-transition"
                style="margin-top: 14px;"
              >
                { this.formError }
              </v-alert>
            </v-form>
          </v-col>
          <v-col cols="12" sm="9">
            <v-card max-height="calc(100vh - 180px)" style="overflow: scroll;">
              <v-expansion-panels disabled={!this.enablePageInfo}>
                <v-expansion-panel>
                  {
                    this.renderPanelHeader('Scripts', 'script[src]', 'JS链接和全局变量')
                  }
                  {
                    this.renderPanelContent(this.pageInfo.scripts, { type: 'script' })
                  }
                </v-expansion-panel>
                <v-expansion-panel>
                  {
                    this.renderPanelHeader('Prefetch', 'link[rel=prefetch]', '预加载的文件')
                  }
                  {
                    this.renderPanelContent(this.pageInfo.prefetch)
                  }
                </v-expansion-panel>
                <v-expansion-panel>
                  {
                    this.renderPanelHeader('Preload', 'link[rel=preload]', '预加载的JS')
                  }
                  {
                    this.renderPanelContent(this.pageInfo.preload)
                  }
                </v-expansion-panel>
                <v-expansion-panel>
                  {
                    this.renderPanelHeader('Scripts', 'link[rel=stylesheet]', 'CSS资源文件')
                  }
                  {
                    this.renderPanelContent(this.pageInfo.styles)
                  }
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    )
  }
}
