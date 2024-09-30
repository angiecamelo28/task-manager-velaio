import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Router, Event as RouterEvent, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent  {
  @Output() action = new EventEmitter<any>();
  @Input() namePage: string | undefined;
  @Input() name: string | undefined;
  @Input() description: string | undefined;
  @Input() subComponent: boolean = false;
  @Input() nameComponent: string | undefined;


  constructor(private router: Router) {
  }


  goTo() {
    this.action.emit();
  }


}
