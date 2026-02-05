import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card h-100 skeleton-card border-0">
      <div class="card-header skeleton-header">
        <div class="skeleton-title"></div>
      </div>
      <div class="card-body">
        <div class="skeleton-line mb-3"></div>
        <div class="skeleton-line mb-3" style="width: 80%;"></div>
        <div class="skeleton-line" style="width: 60%;"></div>
      </div>
      <div class="card-footer bg-transparent border-0 p-3">
        <div class="skeleton-button"></div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-card {
      background: var(--card-bg);
      animation: pulse 1.5s ease-in-out infinite;
    }

    .skeleton-header {
      background: linear-gradient(90deg, #2A2A2A 25%, #333 50%, #2A2A2A 75%);
      background-size: 200% 100%;
      animation: shimmer 2s infinite;
      height: 60px;
      border: none;
    }

    .skeleton-title {
      height: 24px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      width: 70%;
      margin: 18px;
    }

    .skeleton-line {
      height: 16px;
      background: linear-gradient(90deg, #1F1F1F 25%, #2A2A2A 50%, #1F1F1F 75%);
      background-size: 200% 100%;
      animation: shimmer 2s infinite;
      border-radius: 4px;
      width: 100%;
    }

    .skeleton-button {
      height: 40px;
      background: linear-gradient(90deg, #1F1F1F 25%, #2A2A2A 50%, #1F1F1F 75%);
      background-size: 200% 100%;
      animation: shimmer 2s infinite;
      border-radius: 0.375rem;
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.8;
      }
    }
  `]
})
export class SkeletonCardComponent {}
