import { Injectable } from '@angular/core'

// add if building with webpack
import * as BluetoothWorker from 'nativescript-worker-loader!./workers/bluetooth.worker'

@Injectable()
export class WorkerService {
  initBluetoothWorker() {
    const worker = new BluetoothWorker()

    return worker
  }
}
