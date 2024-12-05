import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {
  @Input() message: string = ''; // Message to display
  visible: boolean = false; // Control visibility

  show(message: string) {
    this.message = message;
    this.visible = true;
    setTimeout(() => {
      this.hide();
    }, 3000); // Auto-hide after 3 seconds
  }

  hide() {
    this.visible = false;
  }
}
