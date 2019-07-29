import { Component, OnInit  } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { ActivatedRoute  } from '@angular/router';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { WrappedSocket } from 'ngx-socket-io/src/socket-io.service';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-bid-room',
  templateUrl: './bid-room.page.html',
  styleUrls: ['./bid-room.page.scss'],
})
export class BidRoomPage implements OnInit {
  nickname = '';
  nickname2 = '';
  score = 0;
  score2 = 0;
  player = '';
  money = 0;
  index = 0;
  timer = 0;
  dict = {}
  picture = "http://riccardohosts.ddns.net:8080/imgs/"
  giocRim : any;
  tempMoney = 0;

  constructor(private data: DataServiceService, private socket: Socket, private route: ActivatedRoute, private router: Router, public alertController: AlertController) {
    this.socket = this.data.socket;
    this.nickname = this.route.snapshot.data['user'];
    this.getMessages().subscribe(message => {
      if(message['from'] != this.nickname){
        this.score2 = message['text'];
      }
    });


    this.getFinish().subscribe(data => {
      this.dict = data['data'];
      this.presentAlert();
    });

    this.getWinners().subscribe(data => {
      if(this.score == this.score2){
        this.socket.emit('results', {usr: "skip", score: 0});
      }
      if(this.score > this.score2){
        this.socket.emit('results', {usr: this.nickname, score: this.score});
      }
      else if(this.score2 > this.score){
        this.socket.emit('results', {usr: this.nickname2, score: this.score2});
        this.money += this.score;
      }
      this.score = 0;
      this.score2 = 0;
    });

    this.getTimer().subscribe(message => {
      this.timer = message['countdown'];
    });

    this.getBidders().subscribe(data => {
      console.log(this.data.username+" "+this.index);
      if(this.index == 1){
        this.nickname = data['usr'];
        this.nickname2 = data['usr2'];
      }
      if(this.index == 0){
        this.nickname = data['usr2'];
        this.nickname2 = data['usr'];
      }
      this.money = data['money'];
    });
    
    this.getPlayer().subscribe(data =>{
      this.player = data['player'];
      this.picture = "http://riccardohosts.ddns.net:8080/imgs/";
      this.picture += this.player + ".png";
      this.giocRim = "";
      var a = data['players'];
      a.forEach(element => {
       if(element != this.player)this.giocRim += element+"\n"; 
      });
    });

    this.getUsers().subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.showToast('User left: ' + user);
        this.router.navigate(['blank']);
      } else {
        if(this.data.username == user){
          this.showToast('User joined: ' + user);
          this.index = data['index'];
        }
      }
    });
    
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Risultato Asta',
      subHeader: 'Ecco chi ti sei aggiudicato',
      message: this.dict[this.nickname]+"",
      buttons: [
        {
          text:'OK',
          handler: () => {
            this.socket.disconnect();
            this.router.navigate(['tabs']);
          }
        }
      ]
    });

    await alert.present();
  }
  highBid(){
    if(this.score > this.score2){
      return this.score;
    }
    if(this.score == this.score2){
      return this.score;
    }
    if(this.score2 > this.score){
      return this.score2;
    }
  }
  highBidBool(){
    if(this.score > this.score2){
      return true;
    }
    if(this.score == this.score2){
      return true;
    }
    if(this.score2 > this.score){
      return false;
    }
  }
  sendMessage1() {
    var s = this.highBid();
    this.socket.emit('add-message', { text: s+1 });
    if(this.highBidBool()) this.money -= 1;
    else{
      this.money -= Math.abs(this.score-this.score2) + 1;
    }
    this.score = s + 1;
  }
  sendMessage2() {
    var s = this.highBid();
    this.socket.emit('add-message', { text: s+2 });
    if(this.highBidBool()) this.money -= 2;
    else{
      this.money -= Math.abs(this.score-this.score2) + 2;
    }
    this.score = s + 2;
  }
  sendMessage3() {
    var s = this.highBid();
    this.socket.emit('add-message', { text: s+3 });
    if(this.highBidBool()) this.money -= 3;
    else{
      this.money -= Math.abs(this.score-this.score2) + 3;
    }    
    this.score = s + 3;
  }
 
  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  setTime(){
    let observable = new Observable(observer => {
      this.socket.on('timer', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getWinners(){
    let observable = new Observable(observer => {
      this.socket.on('winners', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getFinish(){
    let observable = new Observable(observer => {
      this.socket.on('finish', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getTimer(){
    let observable = new Observable(observer => {
      this.socket.on('timer', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getBidders() {
    let observable = new Observable(observer => {
      this.socket.on('set-bidders', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getPlayer() {
    let observable = new Observable(observer => {
      this.socket.on('player-load', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }
 
  getUsers() {
    let observable = new Observable(observer => {
      this.socket.on('users-changed', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }
 
  ionViewWillLeave() {
    this.socket.disconnect();
  }
 
  showToast(msg) {
    console.log(msg);
  }

  isLess3(){
    if(this.money < 3) return true;
    return false;
  }

  isLess2(){
    if(this.money < 2) return true;
    return false;
  }

  isLess1(){
    if(this.money < 1) return true;
    return false;
  }

  ngOnInit() {
  }

}
