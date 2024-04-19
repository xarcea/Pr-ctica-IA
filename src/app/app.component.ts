import { Component } from '@angular/core';
import { SharedStringService } from './shared-string.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'laberinto';
  mostrar = true;
  mensaje = '';
  sharedStringSubscription: Subscription;

  constructor(private sharedStringService: SharedStringService) {
    this.sharedStringSubscription = this.sharedStringService.sharedString$.subscribe(value => {
      this.mensaje = value;
    });
  }
}
