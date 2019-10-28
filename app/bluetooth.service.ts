import { Injectable } from '@angular/core'
import { WorkerService } from './worker.service'

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  bluetoothAdapter: android.bluetooth.BluetoothAdapter
  socket: android.bluetooth.BluetoothSocket
  balance: android.bluetooth.BluetoothDevice

  outputStream: java.io.OutputStream

  constructor(private workerService: WorkerService) {
    this.bluetoothAdapter = android.bluetooth.BluetoothAdapter.getDefaultAdapter()
  }

  isEnabled(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        console.log(
          '## Bluetooth is enabled',
          this.bluetoothAdapter.isEnabled()
        )
        resolve(this.bluetoothAdapter && this.bluetoothAdapter.isEnabled())
      } catch (err) {
        reject(err)
      }
    })
  }

  notify(
    device: android.bluetooth.BluetoothDevice,
    callback: (data: any) => void
  ): void {
    console.log('## From Notify', device)
    const worker: Worker = this.workerService.initBluetoothWorker()
    worker.postMessage('// Launch worker')
    worker.onmessage = m => {
      console.log(m)
    }
  }

  write(command: string): void {
    this.balance = this.getBalance()
    this.socket = this.balance.createInsecureRfcommSocketToServiceRecord(
      java.util.UUID.fromString('00001101-0000-1000-8000-00805F9B34FB')
    )

    this.socket.connect()
    this.outputStream = this.socket.getOutputStream()

    try {
      const text = new java.lang.String(command)
      const data = text.getBytes('UTF-8')

      this.outputStream.write(data)
      console.log('WRITING :::')
    } catch (e) {
      console.log('ERROR while writing stream', e)
    }
  }

  getDevices() {
    return this.bluetoothAdapter.getBondedDevices().toArray()
  }

  getBalance(): android.bluetooth.BluetoothDevice {
    const device: android.bluetooth.BluetoothDevice = this.bluetoothAdapter.getRemoteDevice(
      '00:04:3E:52:E5:78'
    )
    return device
  }
}
