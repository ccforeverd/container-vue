import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class PageIndex extends Vue {
  protected asyncData () {
    return {
    }
  }

  protected render () {
    return (
      <v-container>
        requests
      </v-container>
    )
  }
}
