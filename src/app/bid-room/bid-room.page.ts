import { Component, OnInit  } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { ActivatedRoute  } from '@angular/router';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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

  constructor(private socket: Socket, private route: ActivatedRoute, private router: Router, public alertController: AlertController) {
    
    this.nickname = this.route.snapshot.data['user'];
    this.getMessages().subscribe(message => {
      if(message['from'] != this.nickname){
        this.score2 += message['text'];
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
      if(this.index == 0){
        this.nickname = data['usr'];
        this.nickname2 = data['usr2'];
      }
      else{
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
        this.showToast('User joined: ' + user);
        this.index = data['index'];
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
  sendMessage1() {
    this.socket.emit('add-message', { text: 1 });
    this.money -= 1;
    this.score += 1;
  }
  sendMessage2() {
    this.socket.emit('add-message', { text: 2 });
    this.money -= 2;
    this.score += 2;
  }
  sendMessage3() {
    this.socket.emit('add-message', { text: 3 });
    this.money= this.money-3;
    this.score += 3;
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
