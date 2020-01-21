import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { BEEconDict } from './beecon-protocol';
import { BEEconCMD, BEEconJobResult } from './beecon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  job: BEEconCMD;
  payload:string;

  cmds = BEEconDict.commands.slice();
  title = 'hivertracker-cross-domain-tester';
  addresses = [
    {selected: true, value: '1'},
    {selected: true, value: '2'},
    {selected: true, value: '3'},
    {selected: true, value: '01:00:00:00:00:41'},
    {selected: true, value: '00:00:00:00:03:38'},
    {selected: true, value: '00:00:00:00:03:35'}
  ];

  //
  // Authorized messages
  RECEIVE_MSG = [
    'hivetracker:receive',
  ];

  results: BEEconJobResult[];

  constructor(
    private $ngZone: NgZone,
    private $cdr: ChangeDetectorRef,
  ){
    if(window['addresses'] && window['addresses'].lenght) {
      this.addresses = window['addresses'].map(a => {
        return {selected: true, value: a};
      });
    }
    this.job = BEEconDict.commands[0];
    this.results = [];
  }
  //
  // ANGULAR API
  ngOnInit() {
    //
    // HiveTracker CROSS-DOMAIN COMMUNICATION
    fromEvent(window, 'message').pipe(
      map(($event: any)  => {
        try{
          const data = JSON.parse($event.data);
          console.log('---- CHILD callback', $event.data);
          return data;
        } catch (e) {
          return {};
        }
      }),
      filter(result => ( this.RECEIVE_MSG.indexOf(result.action) > -1 )),
      map(result => result.value)
    ).subscribe( (jobResults: BEEconJobResult[]) => {
      this.results = jobResults;
      console.log('---- CHILD callback', this.results);
      // this.$ngZone.run(() => {
      //   this.$cdr.markForCheck();
      // });

    });

  }


  //
  // PUBLIC API
  toggle(address) {
    const add = this.addresses.find( add => add.value === address );
    add.selected = ! add.selected;

  }

  //
  // CROSS DOMAIN POST MESSAGE
  // https://developer.mozilla.org/fr/docs/Web/API/Window/postMessage
  sendMessage(message, job, addresses) {
    // 
    // Use payload value from user input
    const payload = (this.payload)?this.payload.split(/[,:|]/).map(val => parseInt(val, 16)) : [];
    const data = {
      action: message,
      addresses: (addresses),
      run: (Object.assign({}, job, {payload: (payload)}) as BEEconCMD)
    };
    window.parent.postMessage(JSON.stringify(data), '*');
  }

  testJob() {
    const addresses = this.addresses.filter(add => add.selected ).map(elem => elem.value);
    this.sendMessage('hivetracker:job', this.job, addresses);
  }

}
