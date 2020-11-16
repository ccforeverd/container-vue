
import tcpPortUsed from 'tcp-port-used'

interface GetAvaliablePort {
  (startPort: number): Promise<number>
}

export const getAvailablePort: GetAvaliablePort = async (startPort = 4000) => {
  while (true) {
    const isUsed = await tcpPortUsed.check(startPort, '127.0.0.1')
    if (isUsed) {
      startPort++
    } else {
      return startPort
    }
  }
}

// export const getAvailablePorts = (startPort = 4000, length = 2) => {}
