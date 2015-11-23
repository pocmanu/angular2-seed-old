import {Component, ViewEncapsulation, NgFor} from 'angular2/angular2';
import {NgGrid, NgGridItem} from '../angular2-grid/NgGrid';
import {Agenda} from '../agenda/agenda';
import {CalendarEvent} from '../agenda/calendar-event';
import {ICalendarEvent} from '../agenda/calendar-event-interface';
import {ServiceFactory, AbstractService} from '../../services/service_factory';

@Component({
  selector: 'schedule',
  templateUrl: './components/schedule/schedule.html',
  encapsulation: ViewEncapsulation.None,
  directives: [NgGrid, NgGridItem, NgFor, Agenda, CalendarEvent]
})
export class Schedule {

  constructor( private factory: ServiceFactory) {
    this._eventsService = factory.getService<ICalendarEvent>('schedule-event');
    this._eventsService.observer(this);
    this._eventsService.getAll().then(
      (events) => { this.next(events); }
    );
  }

  public next = (newEvents: any): void => {
    this._events = newEvents.map(this._calEventFromStored);
    if (this._events.length === 0) {
      this._events=[{id:'1', title: 'wif', start: new Date(2015, 11, 17, 8, 0, 0, 0), duration:20}];
    }
  };

  public updateEvent = (event) => {
    console.log(event);
  };

  public addEvent = (event: any): void => {
    event.title = ['waf', 'wef', 'wif', 'wof', 'wuf'][Math.floor(Math.random() * 5)];
    console.log('event to add', event);
    this._eventsService.addItem(event);
  };

  private _eventsService: AbstractService<ICalendarEvent>;
  private _events: Array<ICalendarEvent> = [];

  private _calEventFromStored = (hoodieItem: any): ICalendarEvent => {
    let calEvent: ICalendarEvent = {id: hoodieItem.id, title: hoodieItem.title, start: null, duration: hoodieItem.duration};
    calEvent.start = new Date(Date.parse(hoodieItem.start));
    return calEvent;
  };
}
