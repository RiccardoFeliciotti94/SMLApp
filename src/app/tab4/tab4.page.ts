import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DataServiceService } from '../data-service.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  matchesArray : any;

  constructor(private http: Http, public data: DataServiceService, public router: Router) {

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );

    let options = new RequestOptions({ headers: headers });
    let d = {
      username: data.username
    };

    this.http.post('http://riccardohosts.ddns.net:8080/getMatches.php',d,options).pipe(map(res => res.json()))
    .subscribe(res => {
      this.matchesArray = res;
    });
  }

  onClickMatch(id){
    this.router.navigate(['match-details', {Id : id}]);
  }

  ngOnInit() {
  }

}
