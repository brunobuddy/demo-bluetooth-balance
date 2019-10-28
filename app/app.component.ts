import { Component, OnInit } from '@angular/core'

import { BluetoothService } from './bluetooth.service'

@Component({
  template: `
    <StackLayout class="p-20">
      <Label text="Test Bluetooth" class="h1"></Label>
      <Label text="Check output" class="font-italic"></Label>
      <StackLayout>
        <Button text="Bluetooth write" (tap)="write()"></Button> </StackLayout
    ></StackLayout>
  `
})
export class AppComponent implements OnInit {
  private bluetoothWorker: Worker

  constructor(private bluetoothService: BluetoothService) {}

  async ngOnInit() {
    const isEnabled = await this.bluetoothService.isEnabled()

    if (!isEnabled) {
      console.log('## Error: Bluetooth is not enabled.')
      return
    }

    const balance: android.bluetooth.BluetoothDevice = this.bluetoothService.getBalance()

    if (!balance) {
      console.log('## Error: No balance.')
      return
    }

    console.log('## DEVICE ' + balance)

    this.bluetoothService.notify(balance, (result: string) => {
      console.log('Result from Balance :', JSON.stringify(result))
    })
  }

  write(): void {
    this.bluetoothService.write('test string')
  }
}
