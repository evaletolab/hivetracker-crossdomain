import { Component } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { BEEconDict } from './beecon-protocol';
import { BEEconCMD } from './bluetooth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  job: BEEconCMD;
  payload: string;

  cmds = BEEconDict.commands.slice();
  title = 'hivertracker-iframe-com';
  addresses = [
    {selected: true, value: '1'},
    {selected: true, value: '2'},
    {selected: true, value: '3'},
    {selected: true, value: '01:00:00:00:00:41'},
    {selected: true, value: '00:00:00:00:03:38'},
    {selected: true, value: '00:00:00:00:03:35'}
  ];

  RECEIVE_MSG = [
    'hivetracker:receive',
  ]

  receive;

  constructor(){
    if(window['addresses'] && window['addresses'].lenght) {
      this.addresses = window['addresses'].map(a => {
        return {selected: true, value: a};
      });
    }
    this.job = BEEconDict.commands[0];
  }

  toggle(address) {
    const add = this.addresses.find( add => add.value === address );
    add.selected = ! add.selected;

  }

  //
  // CROSS DOMAIN POST MESSAGE
  // https://developer.mozilla.org/fr/docs/Web/API/Window/postMessage
  sendMessage(message, job, addresses) {
    const data = {
      action: message,
      addresses: (addresses),
      run: job
    };
    window.parent.postMessage(JSON.stringify(data), '*');
  }

  testJob() {
    const addresses = this.addresses.filter(add => add.selected ).map(elem=>elem.value);
    this.sendMessage('hivetracker:job', this.job, addresses);
  }

  testSend() {

  }

  ngOnInit() {
    if ( !window.addEventListener ) {
      alert('ERROR: CROSS DOMAIN COMMUNICATION LIMITATION (event)');
      return;
    }

    if ( !window.parent ) {
      alert('ERROR: CROSS DOMAIN COMMUNICATION LIMITATION (parent)');
      return;
    }



    //
    // CROSS-DOMAIN COMMUNICATION
    // DATA FORMAT { msg : MESSAGE_NAME, data: CONTENT}
    fromEvent(window, 'message').pipe(
      filter(($event: any) => (typeof $event.data === 'string' && $event.data[0] === '{' )),
      map(($event: any)  => {
        try{
          const data = JSON.parse($event.data);
          console.log('---- CHILD callback',$event.origin);
          console.log('---- CHILD callback',$event.data);
          if ( this.RECEIVE_MSG.indexOf(data.action) === -1 ) {
            return;
          }

          //
          // ASK CLOSE 
          // this.sendMessage('hivertracker:close');
          return data;
        } catch (e) {
          console.log('ERROR postMessage', $event);
          return {};
        }
      })
    ).subscribe( message => {
      this.receive = message;
    });

  }
}
