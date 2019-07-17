import { Component } from '@angular/core';
import {Http, Headers, RequestOptions}  from '@angular/http';
import { map } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  username = "";
  teamArray = [];

  constructor(private http: Http, private route: ActivatedRoute, private router: Router, public data: DataServiceService) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state){
        this.username = this.router.getCurrentNavigation().extras.state.user;
        data.username = this.username;
        this.buildListViewSquadre();
      }
    });
  }

  buildListViewSquadre(){
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );

    let options = new RequestOptions({ headers: headers });
    console.log(this.username);
    let data = {
      username: this.username
    };

    this.http.post('http://riccardohosts.ddns.net:8080/getSquadre.php',data,options).pipe(map(res => res.json()))
    .subscribe(res => {
      this.teamArray = res;
    });
  }

  clickSquadra(team){
    this.router.navigate(['team-details',{team: team}]);
  }
}
  
