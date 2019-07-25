import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import {Http, Headers, RequestOptions}  from '@angular/http';
import { AlertController } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';

import { map } from 'rxjs/operators';

@Component({
selector: 'app-login',
templateUrl: './login.page.html',
styleUrls: ['./login.page.scss'],
})


export class LoginPage implements OnInit {
  checkbox = {value : true};

  username = localStorage.Nickname;
  password = localStorage.Password;
  versione : any;
  
  private data:string;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private http: Http,
    public alertController: AlertController,
    private appVersion: AppVersion
  ) {
    this.appVersion.getVersionNumber().then(version => {
      this.versione = version;
    });
  }
  
  ngOnInit() {
  }
  login() {

    if(this.username==null || this.password==null){
      this.presentAlert();
    }
    else{
      var headers = new Headers();

      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );

      let options = new RequestOptions({ headers: headers });

      let data = {
        username: this.username,
        password: this.password
      };

      this.http.post('http://riccardohosts.ddns.net:8080/login.php',data,options).pipe(map(res => res.json()))
      .subscribe(res => {
        if(res=="Your Login success"){
          this.goHome();
          if(this.checkbox.value == true){
            localStorage.Nickname = this.username;
            localStorage.Password = this.password;
            localStorage.checkbox = this.checkbox.value;
          }
          else{
            localStorage.Nickname = "";
            localStorage.Password = "";
            localStorage.checkbox = false;
          }
        }
        else{
          this.presentAlert();
        }
      });
    }
    
  }
  checkboxChange(){
    this.checkbox.value = !this.checkbox.value;
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Errore',
      message: 'Dati immessi non validi',
      buttons: [
        {
          text:'OK'
        }
      ]
    });

    await alert.present();
  }

  goHome() {
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.username
      }
    };
    this.router.navigate( ['tabs/tab1'], navigationExtras );
  }
}