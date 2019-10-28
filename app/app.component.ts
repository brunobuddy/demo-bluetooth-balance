import { Component, OnInit } from '@angular/core'

import { BluetoothService } from './bluetooth.service'

@Component({
  template: `
    <StackLayout class="p-20">
      <Label text="Test Bluetooth" class="h1"></Label>
      <Label text="Check output" class="font-italic"></Label>
      <StackLayout>
        <Button text="READDA" (tap)="write('READDA')"></Button>
        <Button text="READAD" (tap)="write('READAD')"></Button>><Button
          text="READ00"
          (tap)="write('READ00')"
        ></Button>
        <Button text="READ0D" (tap)="write('READ0D')"></Button>
        <Button text="READ0A" (tap)="write('READ0A')"></Button>
        <Button text="READ0D0A" (tap)="write('READ0D0A')"></Button>
        <Button text="READ0A0D" (tap)="write('READ0A0D')"></Button>
      </StackLayout>
    </StackLayout>
  `
})
export class AppComponent implements OnInit {
  constructor(private bluetoothService: BluetoothService) {}

  async ngOnInit() {
    // Check if Bluetooth enabled.
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

    // Keep reading from connected balance.
    this.bluetoothService.notify(balance, (result: string) => {
      console.log('Result from Balance :', JSON.stringify(result))
    })
  }

  write(command: string): void {
    this.bluetoothService.write(command)
  }
}
