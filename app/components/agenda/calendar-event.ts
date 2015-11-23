import {Component, ViewEncapsulation, Input} from 'angular2/angular2';
import {ICalendarEvent} from './calendar-event-interface';

@Component({
	selector: 'calendar-event',
	template: '',
	encapsulation: ViewEncapsulation.None,
	directives: []
})
export class CalendarEvent {

	@Input('_id') public id: string;
	@Input() public title: string;
	@Input() public start: Date;
	@Input() public duration: number;
}
