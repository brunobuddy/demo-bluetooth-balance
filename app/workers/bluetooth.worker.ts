import 'tns-core-modules/globals'

const context: Worker = self as any

context.onmessage = (msg: MessageEvent) => {
  setTimeout(() => {
    console.log('## Message received in Bluetooth worker', msg.data)
    const bluetoothAdapter = android.bluetooth.BluetoothAdapter.getDefaultAdapter()

    const device: android.bluetooth.BluetoothDevice = bluetoothAdapter.getRemoteDevice(
      '00:04:3E:52:E5:78'
    )
    try {
      const socket: android.bluetooth.BluetoothSocket = device.createInsecureRfcommSocketToServiceRecord(
        java.util.UUID.fromString('00001101-0000-1000-8000-00805F9B34FB')
      )
      socket.connect()
      const inputStream: java.io.InputStream = socket.getInputStream()

      console.log('Reading ...')
      while (true) {
        if (inputStream.available() > 0) {
          console.log('@@@ READ SOMETHING')
          const result = []
          while (inputStream.available() > 0) {
            result.push(inputStream.read())
          }
          const formattedResult = result
            .map<string>(value => {
              return String.fromCharCode(value)
            })
            .join('')
          ;(<any>global).postMessage(formattedResult)
        }
      }
    } catch (e) {
      console.log('## Error on opening connection', e)
    }
    ;(<any>global).postMessage('TS Worker')
  }, 500)
}
