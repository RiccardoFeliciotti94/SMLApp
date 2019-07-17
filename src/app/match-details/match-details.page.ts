import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestOptions, Http, Headers } from '@angular/http';
import { DataServiceService } from '../data-service.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.page.html',
  styleUrls: ['./match-details.page.scss'],
})
export class MatchDetailsPage implements OnInit {

  id : any;
  matchArray : any;
  arrayRank : any;

  constructor(private http: Http, public data: DataServiceService, private router : ActivatedRoute) {
    this.id = this.router.snapshot.paramMap.get('Id');

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );

    let options = new RequestOptions({ headers: headers });
    let d = {
      username: this.id
    };

    this.http.post('http://riccardohosts.ddns.net:8080/getMatchStats.php',d,options).pipe(map(res => res.json()))
    .subscribe(res => {
      this.matchArray = res;
    });
    this.http.post('http://riccardohosts.ddns.net:8080/getMatchRank.php',d,options).pipe(map(res => res.json()))
    .subscribe(res => {
      this.arrayRank = res;
    });
  }

  ngOnInit() {
  }

}
