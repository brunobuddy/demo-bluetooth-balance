import { Component, OnInit } from "@angular/core"

import { BluetoothService } from "./bluetooth.service"

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
  bluetoothAdapter = android.bluetooth.BluetoothAdapter.getDefaultAdapter()

  constructor(private bluetoothService: BluetoothService) {}

  async ngOnInit() {
    // Check if Bluetooth enabled.
    const isEnabled = await this.bluetoothService.isEnabled()

    if (!isEnabled) {
      console.log("## Error: Bluetooth is not enabled.")
      return
    }

    const balance: android.bluetooth.BluetoothDevice = this.bluetoothService.getBalance()

    if (!balance) {
      console.log("## Error: No balance.")
      return
    }

    console.log("## DEVICE " + balance)

    // Keep reading from connected balance.
    this.bluetoothService.notify(balance, (result: string) => {
      console.log("Result from Balance :", JSON.stringify(result))
    })

    const device: android.bluetooth.BluetoothDevice = this.bluetoothAdapter.getRemoteDevice(
      "00:04:3E:52:E5:78"
    )

    const socket: android.bluetooth.BluetoothSocket = device.createInsecureRfcommSocketToServiceRecord(
      java.util.UUID.fromString("00001101-0000-1000-8000-00805F9B34FB")
    )

    socket.connect()
    const inputStream: java.io.InputStream = socket.getInputStream()
    const outputStream: java.io.OutputStream = socket.getOutputStream()

    setInterval(() => {
      // Write
      try {
        const text = new java.lang.String("READ0D")
        const data = text.getBytes("UTF-8")

        data[4] = 13
        data[5] = 10

        outputStream.write(data)
        console.log("##WRITING :::")
      } catch (e) {
        console.log("## ERROR while writing stream", e)
      }

      setTimeout(() => {
        this.read(inputStream)
      }, 200)
    }, 1000)
  }

  write(command: string): void {
    this.bluetoothService.write(command)
  }

  read(inputStream) {
    console.log("## Reading ...")
    if (inputStream.available() > 0) {
      console.log("@@@ READ SOMETHING")
      const result = []
      while (inputStream.available() > 0) {
        result.push(inputStream.read())
      }

      // Format and push response to BluetoothService.
      const formattedResult = result
        .map<string>(value => {
          return String.fromCharCode(value)
        })
        .join("")
      ;(<any>global).postMessage(formattedResult)
    }
  }
}
