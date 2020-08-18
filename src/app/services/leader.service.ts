import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import {LEADERS} from '../shared/leaders';
import {Observable, of } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { baseURL} from '../shared/baseurl';
import {ProcessHTTPMsgService} from './process-httpmsg.service';
import { Http } from '@angular/http';
import { delay,map,catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient,
    private processHTTPMsgService : ProcessHTTPMsgService) { }
 
  getLeaders(): Observable<Leader[]> {
    //return of(LEADERS).pipe(delay(2000));
    return this.http.get<Leader[]>(baseURL + 'leadership')
    .pipe(catchError(this.processHTTPMsgService.handleError));

    //Promise.resolve(LEADERS);
  }
  getFeaturedLeader(): Observable<Leader> {
   // return of(LEADERS.filter((leader) => (leader.featured))[0]).pipe(delay(2000)); 
   return this.http.get<Leader>(baseURL + 'leadership?featured=true')
      .pipe(map(leaders=>leaders[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));;   
    //Promise.resolve(LEADERS.filter((leader) => leader.featured)[0]);
  }
}
