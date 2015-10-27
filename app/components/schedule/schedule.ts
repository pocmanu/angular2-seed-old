import {Component, View, ViewEncapsulation, Inject, NgFor} from 'angular2/angular2';
import {NgGrid, NgGridItem} from '../angular2-grid/NgGrid';
import {ScheduleService} from './services/schedule-service';

export {ScheduleService} from './services/schedule-service';

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
