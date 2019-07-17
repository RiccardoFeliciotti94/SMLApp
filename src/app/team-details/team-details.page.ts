import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http, RequestOptions, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.page.html',
  styleUrls: ['./team-details.page.scss'],
})
export class TeamDetailsPage implements OnInit {

  teamStats : any;
  matches : any;
  wins : any;
  losses : any;
  draws : any;

  constructor(private route: ActivatedRoute, private http: Http) {
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );

    let options = new RequestOptions({ headers: headers });
    
    let d = {
      username: this.route.snapshot.paramMap.get('team')
    };
    this.http.post('http://riccardohosts.ddns.net:8080/getTeamScore.php',d,options).pipe(map(res => res.json()))
      .subscribe(res => {
        this.teamStats = res[0];
        this.matches = this.teamStats.PartiteGiocate;
        this.wins = this.teamStats.Vittorie;
        this.losses = this.teamStats.Sconfitte;
        this.draws = this.teamStats.Pareggi;
    });
  }

  ngOnInit() {
  }

}
