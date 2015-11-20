import {EventEmitter} from 'angular2/angular2';
import {ICalendarEvent} from './calendar-event-interface';

export class CalendarService {

	public calendarEventUpdate = new EventEmitter();

	private _calendarEvents: Array<ICalendarEvent> = [
		{ id: '1', title: 'waf', start: new Date(2015, 11, 17, 8, 0, 0, 0),  end: new Date(2015, 11, 17, 8, 15, 0, 0) },
		{ id: '2', title: 'wef', start: new Date(2015, 11, 17, 15, 0, 0, 0), end: new Date(2015, 11, 17, 15, 30, 0, 0) },
		{ id: '3', title: 'wuf', start: new Date(2015, 11, 17, 8, 0, 0, 0),  end: new Date(2015, 11, 17, 9, 30, 0, 0) }
		];

	public getCalendarEvents = (): Array<ICalendarEvent> => {
		setTimeout(() => {
			console.log('pouf');
			//this.updateEvent({id:'1', end: new Date(2015, 11, 17, 17, 15, 0, 0)});
			this._calendarEvents.push({ id: '4', title: 'wif', start: new Date(2015, 11, 17, 12, 0, 0, 0),  end: new Date(2015, 11, 17, 12, 30, 0, 0)});
			this.calendarEventUpdate.next(this._calendarEvents);
		},5000);
		return this._calendarEvents;
	};

	public updateEvent = (updateData: any): void => {
		//let event = this._calendarEvents.find((ev: ICalendarEvent) => { return ev.id === updateData.id; });
		let event = this._calendarEvents.pop();
		if (event) {
			if (updateData.start) event.start = updateData.start;
			if (updateData.end)   event.end   = updateData.end;
		}
		this._calendarEvents.push(event);
	};

	public addEvent = (event: ICalendarEvent): void => {
		this._calendarEvents.push(event);
		this.calendarEventUpdate.next(this._calendarEvents);
	}
}
