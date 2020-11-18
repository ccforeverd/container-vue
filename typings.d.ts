import Vue, { VNode } from 'vue'

declare module '*.json'

declare module '*.scss' {
  const content: {[key: string]: string}
  export = content
}

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}

declare module '*.vue' {
  export default Vue
}
