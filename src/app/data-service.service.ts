import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  public username:string = "";
  public socket : any;

  constructor() { }
}
