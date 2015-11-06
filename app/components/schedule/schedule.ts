import {Component, View, ViewEncapsulation, NgFor} from 'angular2/angular2';
import {NgGrid, NgGridItem} from '../angular2-grid/NgGrid';

@Component({
  selector: 'schedule'
})
@View({
  templateUrl: './components/schedule/schedule.html',
  encapsulation: ViewEncapsulation.None,
  directives: [NgGrid, NgGridItem, NgFor]
})
export class Schedule {

  boxes = [];

  constructor() {
    this.boxes = [{title: 'waf', text: 'wef'}];
  }
}
