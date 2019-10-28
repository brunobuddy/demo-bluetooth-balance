import { Injectable } from '@angular/core'

@Injectable()
export class SocketService {
  socket: android.bluetooth.BluetoothSocket

  constructor() {}
}
