// import { Context } from '@nuxt/types'
import colors from 'vuetify/es5/util/colors'

export default () => {
  let dark = true
  if (process.client) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    dark = mediaQuery.matches
    mediaQuery.addEventListener('change', (event) => {
      window.$nuxt.$vuetify.theme.dark = event.matches
    })
  }

  return {
    theme: {
      dark,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: colors.purple.base,
          secondary: colors.grey.darken1,
          accent: colors.shades.black,
          error: colors.red.accent3
        }
      }
    }
  }
}
