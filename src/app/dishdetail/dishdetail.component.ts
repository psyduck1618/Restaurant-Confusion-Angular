import { Component, OnInit ,ViewChild,Inject} from '@angular/core';
import {Params ,ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import { Dish } from '../shared/dish';
import {DishService} from '../services/dish.service';
import { from } from 'rxjs';
import  { switchMap } from 'rxjs/operators';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import { Comment  } from '../shared/comment';
import { DISHES } from '../shared/dishes';
import { Subscription } from 'rxjs';
//import { trigger, state, style, animate, transition } from '@angular/animations';
import { visibility ,flyInOut,expand} from '../animations/app.animation';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      visibility(),
      expand()
    ]
 
})
export class DishdetailComponent implements OnInit {
//data binding
//@Input()
feedbackForm1:FormGroup;
feedback1: Comment;
errMess: string;
  dish: Dish;
  dishIds:string[];
  prev:string;
  next:string;
  visibility = 'shown';
@ViewChild('fform1') feedbackFormDirective; // reset frm in template
dishcopy :Dish;
formErrors1= {
  'author':'',
  'rating': '',
  'comment':''
};
  validationMessages1 =  {
    'author' : {
      'required': 'First name is required.',
      'minlength':'First name must be at least 2 characters long',
      'maxlength':'First name cannot be more than 25 characters'
    },
    'rating' : {
      'required': 'Last name is required.',
      },
    'comment':{
      'required':'Comment REQUIRED'
    }
  };


  constructor(private dishService:DishService,
    private route :ActivatedRoute,
    private location:Location,
    private fb1:FormBuilder,
    @Inject('BaseURL') private BaseURL) { 
      this.createForm1();
    }
   
    
    


  ngOnInit() {

   
    //let id= this.route.snapshot.params['id'];
    //this.dishService.getDish(id)
    this.dishService.getDishIds()
    .subscribe((dishIds)=>this.dishIds = dishIds);
    this.feedbackForm1.get('author');
    this.route.params
    .pipe(switchMap((params:Params)=>{this.visibility = 'hidden'; return this.dishService.getDish(params['id']);}))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
    errmess => this.errMess = <any>errmess);
  }
  setPrevNext(dishId:string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index -1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  goBack():void{
    this.location.back();

  }
  createForm1(){
    this.feedbackForm1 = this.fb1.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      rating: ['', [Validators.required ] ],
      comment: ['', [Validators.required] ],
    });
    this.feedbackForm1.valueChanges
  .subscribe(data=>this.onValueChanged(data));
  this.onValueChanged();//re set 
 
  }
  onValueChanged(data?:any){
    if(!this.feedbackForm1){return;}
    const form = this.feedbackForm1;
    for (const field in this.formErrors1){
      if(this.formErrors1.hasOwnProperty(field)){
        // clear previous errror meeassage ( ifany )
        this.formErrors1[field]  = ' ';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages1[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors1[field] += messages[key] + ' ';
            }
          }
        }
      }

    }
  }
  

  onSubmit(){
   
    this.feedback1 = this.feedbackForm1.value;
    const date = new Date();
    this.feedback1.date = date.toISOString()
    this.feedbackForm1.reset({
      author: '',
      rating: '',
      comment: '',
     
    });
    
    //this.dish.comments.push(this.feedback1); //push after submit
    this.dishcopy.comments.push(this.feedback1);
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });

    this.feedbackFormDirective.resetForm({
      author: '',
      rating: 5,
      comment: ''
    });
          
}
}
