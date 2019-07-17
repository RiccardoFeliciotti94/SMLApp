import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import {Http, Headers, RequestOptions}  from '@angular/http';
import { map } from 'rxjs/operators';import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  
  option = "Giocatori";
  alertInput = ["Giocatori"];
  arrayRank = [];

  constructor(private http: Http, public data: DataServiceService, public alertController: AlertController) {
    this.buildRankOptions();
    this.buildRankTable();
  }

  buildRankTable(){
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );

    let options = new RequestOptions({ headers: headers });
    
    if(this.option == "Giocatori"){
      let d = {
        username: this.data.username
      };
      this.http.post('http://riccardohosts.ddns.net:8080/getPlayerRanks.php',d,options).pipe(map(res => res.json()))
        .subscribe(res => {
          this.arrayRank = res;
      });
    }
    else{
      let d = {
        username: this.option
      };
      this.http.post('http://riccardohosts.ddns.net:8080/getRankTeams.php',d,options).pipe(map(res => res.json()))
        .subscribe(res => {
          this.arrayRank = res;
      });
    }
  }

  async presentAlertRadio() {
    var options = {
      header: 'Radio',
      inputs: [],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
             this.option=JSON.stringify(data).replace('"',"").replace('"',"");
             this.buildRankTable();
          }
        }
      ]
    };
    for(let i=0; i< this.alertInput.length; i++) {
      options.inputs.push({ name : this.alertInput[i]['torneoNome'], value: this.alertInput[i]['torneoNome'], label: this.alertInput[i]['torneoNome'], type: 'radio' });
    }
    options.inputs.push({ name : "Giocatori", value: "Giocatori", label: "Giocatori", type: 'radio' })
    const alert = await this.alertController.create(options);

    await alert.present();
  }

  buildRankOptions(){
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );

    let options = new RequestOptions({ headers: headers });
    let d = {
      username: this.data.username
    };

    this.http.post('http://riccardohosts.ddns.net:8080/getAlertOptions.php',d,options).pipe(map(res => res.json()))
    .subscribe(res => {
      this.alertInput = res;
    });
  }
}
