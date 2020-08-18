import { Injectable } from '@angular/core';

import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';
import { Observable, of } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { baseURL} from '../shared/baseurl';
import {ProcessHTTPMsgService} from './process-httpmsg.service';
import { Http } from '@angular/http';
import { delay,map,catchError} from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient,
    private processHTTPMsgService : ProcessHTTPMsgService) { }

  getPromotions():Observable<Promotion[]> {
    //return of(PROMOTIONS).pipe(delay(2000));
    return this.http.get<Promotion[]>(baseURL + 'promotions')
    .pipe(catchError(this.processHTTPMsgService.handleError));
    //Promise.resolve(PROMOTIONS);
  }

  getPromotion(id: string): Observable <Promotion> {
   // return of(PROMOTIONS.filter((promotion) => (promotion.id === id))[0]).pipe(delay(2000));
   return this.http.get<Promotion>(baseURL + 'promotions/' +id);  
    //Promise.resolve(PROMOTIONS.filter((promo) => (promo.id === id))[0]);
  }

  getFeaturedPromotion(): Observable <Promotion> {
   // return of(PROMOTIONS.filter((promotion) => promotion.featured)[0]).pipe(delay(2000));
   return this.http.get<Promotion>(baseURL + 'promotions?featured=true')
      .pipe(map(promotions=>promotions[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));; 
    //Promise.resolve(PROMOTIONS.filter((promotion) => promotion.featured)[0]);
  }
}
//.then for promise ,.subscribe for observables