import { Vue, Component, Ref } from 'nuxt-property-decorator'

@Component({
  // DOCS: https://github.com/iendeavor/object-visualizer
  // DOCS: https://github.com/tylerkrupicka/vue-json-component
  // DOCS: https://github.com/chenfengjw163/vue-json-viewer
  // 避免服务端
  components: {
    'json-view': async () => (await import('vue-json-component')).JSONView
  }
})
export default class PageGitlab extends Vue {
  private formError: string = ''
  private formData: {
  } = {
  }

  @Ref('form')
  readonly form

  protected asyncData () {
    return {
      formData: {
      }
    }
  }

  // async getAllJobs () {
  //   this.formError = ''

  //   const valid = this.form.validate()
  //   if (!valid) {
  //     return
  //   }

  //   try {
  //     this.jobList = (await this.$axios.$get('/jenkins/jobs/all', { params: this.formData }))
  //       .map((item, index) => {
  //         item.index = index + 1
  //         return item
  //       })
  //   } catch (e) {
  //     if (e.response.status === 500) {
  //       this.formError = e.response.data || 'service error'
  //     }
  //     this.jobList = []
  //   }
  // }

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
                vModel={this.formData}
                rules={[v => !!v || 'Username is required']}
                label="Your Jenkins Username"
              />
              <v-text-field
                vModel={this.formData}
                rules={[v => !!v || 'Token is required']}
                label="Your Jenkins Token"
              />
              <v-btn
                color="success"
                onClick={this.$emit}
              >
                 Get All Jobs
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
          </v-col>
        </v-row>
      </v-container>
    )
  }
}
