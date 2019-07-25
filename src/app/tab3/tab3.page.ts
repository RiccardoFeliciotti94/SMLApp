import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import {Http, Headers, RequestOptions}  from '@angular/http';
import { DataServiceService } from '../data-service.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  bool = true;
  astaId : any;

  constructor(private http: Http,private router: Router, private socket: Socket, private data: DataServiceService) {
    var headers = new Headers();

    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );

    let options = new RequestOptions({ headers: headers });
    this.http.post('http://riccardohosts.ddns.net:8080/getAstaId.php',options).pipe(map(res => res.json()))
    .subscribe(res => {
        this.astaId = res[0].Id;
        this.canJoin();
        console.log(this.astaId);
    });
  }

  canJoin(){
    var headers = new Headers();

      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );

      let options = new RequestOptions({ headers: headers });

      let data = {
        username: this.astaId
      };

      this.http.post('http://riccardohosts.ddns.net:8080/getSquIdUsrs.php',data,options).pipe(map(res => res.json()))
      .subscribe(res => {
        res.forEach(element => {
          if(this.data.username == element.Nickname) this.bool = false
        });
      });
  }

  joinChat() {
    this.socket.connect();
    this.socket.emit('set-nickname', this.data.username);
    this.router.navigate(['bid-room', { nickname: this.data.username }]);
    this.bool = true;
  }

  isAstaDisp(){
    
    return this.bool;
  }

}
