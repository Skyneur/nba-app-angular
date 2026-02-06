import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Player } from '../../models/player.model';
import { NbaApiService } from '../../core/services/nba-api.service';

interface ComparePlayer extends Player {
  selected: boolean;
}

@Component({
  selector: 'app-player-compare',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './player-compare.component.html',
  styleUrls: ['./player-compare.component.css']
})
export class PlayerCompareComponent implements OnInit {
  selectedPlayers: Player[] = [];
  maxPlayers = 3;

  constructor() {
    const navigation = history.state;
    if (navigation.players) {
      this.selectedPlayers = navigation.players.slice(0, this.maxPlayers);
    }
  }

  ngOnInit(): void {}

  removePlayer(index: number): void {
    this.selectedPlayers.splice(index, 1);
  }

  canCompare(): boolean {
    return this.selectedPlayers.length >= 2;
  }

  getComparison(field: string): { player: Player; value: string; isHighest: boolean }[] {
    if (!this.canCompare()) return [];

    const values = this.selectedPlayers.map(p => {
      let value: string | number = '';
      switch (field) {
        case 'height':
          value = p.strHeight || 'N/A';
          break;
        case 'weight':
          value = p.strWeight || 'N/A';
          break;
        case 'position':
          value = p.strPosition || 'N/A';
          break;
        case 'team':
          value = p.strTeam || 'N/A';
          break;
        case 'nationality':
          value = p.strNationality || 'USA';
          break;
        case 'age':
          if (p.dateBorn) {
            const birthYear = new Date(p.dateBorn).getFullYear();
            const age = new Date().getFullYear() - birthYear;
            value = age;
          } else {
            value = 'N/A';
          }
          break;
      }
      return { player: p, value: String(value) };
    });

    return values.map(v => ({ ...v, isHighest: false }));
  }
}
