import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (message) {
      <div class="alert alert-danger d-flex align-items-center" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
        <div>
          <strong>Erreur !</strong> {{ message }}
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
      margin: 1rem 0;
    }
  `]
})
export class ErrorMessageComponent {
  @Input() message: string | null = null;
}
