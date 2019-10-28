import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptModule } from 'nativescript-angular/nativescript.module'

import { AppComponent } from './app.component'
import { WorkerService } from './worker.service'
import { BluetoothService } from './bluetooth.service'
import { SocketService } from './socket.service'

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [NativeScriptModule],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [WorkerService, BluetoothService, SocketService]
})
export class AppModule {}
