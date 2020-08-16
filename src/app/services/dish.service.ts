import { Injectable } from '@angular/core';
import {Dish} from '../shared/dish';
//import {DISHES} from '../shared/dishes';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { baseURL} from '../shared/baseurl';
import {Observable, of } from 'rxjs';
import { delay,map,catchError} from 'rxjs/operators';
import {ProcessHTTPMsgService} from './process-httpmsg.service';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private http: HttpClient,
    private processHTTPMsgService : ProcessHTTPMsgService) { }

  getDishes():Observable<Dish[]>{
   // return of(DISHES).pipe(delay(2000));
   return this.http.get<Dish[]>(baseURL + 'dishes')
   .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getDish(id:string):Observable<Dish>{
    //return of(DISHES.filter((dish) => (dish.id === id))[0]).pipe(delay(2000));
    return this.http.get<Dish>(baseURL + 'dishes/' +id);  
  }

    getFeaturedDish():Observable<Dish>{
      //return of(DISHES.filter((dish) => dish.featured)[0]).pipe(delay(2000));
      return this.http.get<Dish>(baseURL + 'dishes?featured=true')
      .pipe(map(dishes=>dishes[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));; 
      //before obser
          // getFeaturedDish():Promise<Dish>{
   //return of(DISHES.filter((dish) => dish.featured)[0]).pipe(delay(2000)).toPromise();
}

getDishIds(): Observable<string[] | any>{
 // return of(DISHES.map(dish => dish.id));
 return this.getDishes().pipe(map(dishes => dishes.map(dish => dish.id)))
 .pipe(catchError(error=>error));
  }

  putDish(dish:Dish): Observable<Dish>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json'

      })
    };
    //dish incomming
    return this.http.put<Dish>(baseURL + 'dishes/' + dish.id,dish,httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));

  }
}
