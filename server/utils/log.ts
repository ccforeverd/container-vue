
export type logTypes = 'default'

export function stdout (name: string, type: logTypes, ...msg: any[]) {
  let prefix
  switch (type) {
    case 'default':
    default:
      prefix = `[EDU_CONSOLE: ${name}]`
  }
  // eslint-disable-next-line no-console
  return console.log(prefix, ...msg)
}

export function log (name: string, ...msg: any[]) {
  return stdout(name, 'default', ...msg)
}
