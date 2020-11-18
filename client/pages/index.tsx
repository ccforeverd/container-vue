import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class PageIndex extends Vue {
  protected asyncData () {
    return {
    }
  }

  protected render () {
    return (
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
          <div class="text-center">
            {/* <logo /> */}
            {/* <vuetify-logo /> */}
          </div>
          <v-card>
            <v-card-title class="headline">
              Welcome to the Vuetify + Nuxt.js template
            </v-card-title>
            <v-card-text>
              <p>Vuetify is a progressive Material Design component framework for Vue.js. It was designed to empower developers to create amazing applications.</p>
              <p>
                For more information on Vuetify, check out the <a
                  href="https://vuetifyjs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  documentation
                </a>.
              </p>
              <p>
                If you have questions, please join the official <a
                  href="https://chat.vuetifyjs.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="chat"
                >
                  discord
                </a>.
              </p>
              <p>
                Find a bug? Report it on the github <a
                  href="https://github.com/vuetifyjs/vuetify/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="contribute"
                >
                  issue board
                </a>.
              </p>
              <p>Thank you for developing with Vuetify and I look forward to bringing more exciting features in the future.</p>
              <div class="text-xs-right">
                <em><small>&mdash; John Leider</small></em>
              </div>
              <hr class="my-3" />
              <a
                href="https://nuxtjs.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Nuxt Documentation
              </a>
              <br />
              <a
                href="https://github.com/nuxt/nuxt.js"
                target="_blank"
                rel="noopener noreferrer"
              >
                Nuxt GitHub
              </a>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                nuxt
                to="/inspire"
              >
                Continue
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    )
  }
}
