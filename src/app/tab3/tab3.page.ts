import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {


  constructor(private router: Router, private socket: Socket, private data: DataServiceService) {}

  joinChat() {
    this.socket.connect();
    this.socket.emit('set-nickname', this.data.username);
    this.router.navigate(['bid-room', { nickname: this.data.username }]);
  }

  isAstaDisp(){
    return false;
  }

}
