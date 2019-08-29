import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { interval, Subscription } from 'rxjs';

import { AlphaVantageService } from '../alpha-vantage.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnDestroy {
  @Input() currency: string;
  rate: string;
  subscription: Subscription;
  
  private lastValidRate = new BehaviorSubject<string>(this.rate);

  constructor(private alphaVantageService: AlphaVantageService) {

  }

  ngOnInit() {
    const source = interval(60000);
    this.subscription = source.subscribe(val => this.fetchData());
  }
  
  storeLastValidRate(newRate){
    this.lastValidRate.next(newRate);
  }
  
  getLastValidRate() {
    return this.lastValidRate.getValue();
  }

  fetchData() {
    this.alphaVantageService.get(this.currency).subscribe(result => {
      if (result['Realtime Currency Exchange Rate']) {
        this.rate = result['Realtime Currency Exchange Rate']['5. Exchange Rate'];
        this.storeLastValidRate(this.rate);
      }
    },
    error => {
      console.log(error) ;
      this.rate = this.getLastValidRate();
    }
    );
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }

}
