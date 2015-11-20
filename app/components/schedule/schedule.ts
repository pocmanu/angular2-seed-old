import {Component, ViewEncapsulation, NgFor} from 'angular2/angular2';
import {NgGrid, NgGridItem} from '../angular2-grid/NgGrid';
import {CalendarService} from '../agenda/calendar-service';
import {Agenda} from '../agenda/agenda';
import {CalendarEvent} from '../agenda/calendar-event';

@Component({
  selector: 'schedule',
  templateUrl: './components/schedule/schedule.html',
  encapsulation: ViewEncapsulation.None,
  directives: [NgGrid, NgGridItem, NgFor, Agenda, CalendarEvent],
  viewProviders: [CalendarService]
})
export class Schedule {

  boxes = [];
  calendarService: CalendarService

  constructor(calendarService: CalendarService) {
    this.boxes = calendarService.getCalendarEvents();
    this.calendarService = calendarService;
    calendarService.calendarEventUpdate.observer(this);
  }

  public next = (newEvents: any): void => {
    this.boxes = newEvents;
    console.log('pif', this.boxes);
  };

  public log = (event) => {
    console.log(event);
    this.calendarService.updateEvent(event);
  }
}
