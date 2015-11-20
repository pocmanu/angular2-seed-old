import {Component, View, ViewEncapsulation, Input, NgFor, NgIf, Query, QueryList, Output, EventEmitter} from 'angular2/angular2';
import {NgGrid, NgGridItem} from '../angular2-grid/NgGrid';
import {CalendarEvent} from './calendar-event';
import {RowToDatePipe} from './row-to-date-pipe';

@Component({
	selector: 'agenda',
	templateUrl: './components/agenda/agenda.html',
	encapsulation: ViewEncapsulation.None,
	directives: [NgGrid, NgGridItem, NgFor, NgIf, CalendarEvent],
	pipes: [RowToDatePipe],
	outputs: ['eventChange']
})
export class Agenda {

	private _config: any = {
		rowToMin: 5,
		calStartTime: new Date(2015, 11, 17, 8, 0, 0, 0)
	};

	private eventChange: EventEmitter = new EventEmitter(); 

	private _startDate: Date = new Date(2015, 11, 15, 8, 0, 0, 0);

	private _eventTableConfig: any = {'margins': [0, 0], 'min_cols': 1, 'max_cols': 6, 'min_height': 15, 
                 'col_width': 130, 'row_height':7, 'cascade':'none', 'auto-resize': true,
				startDate: this._config.calStartDate};

	private _timelineConfig: any = {'margins': [0, 0], 'min_cols': 1, 'max_cols': 2, 'min_height': 15, 
                 'col_width': 33, 'row_height':7, 'cascade':'right', 'auto-resize': true, draggable: false, resizable: false};

	private _titleConfig: any = {'margins': [0, 0], 'min_cols': 1, 'max_cols': 6, 'min_height': 15, 
                 'col_width': 130, 'row_height':7, 'cascade':'none', 'auto-resize': true, draggable: false, resizable: false};

	private _titles: Array<any> = [
		{ title: 'Lundi', settings: { 'row': 1, 'sizex': 1, 'sizey': 3, 'draggable': false, 'resizable': false, 'fixed': true } },
		{ title: 'Mardi', settings: { 'row': 1, 'sizex': 1, 'sizey': 3, 'draggable': false, 'resizable': false, 'fixed': true } },
		{ title: 'Mercredi', settings: { 'row': 1, 'sizex': 1, 'sizey': 3, 'draggable': false, 'resizable': false, 'fixed': true } },
		{ title: 'Jeudi', settings: { 'row': 1, 'sizex': 1, 'sizey': 3, 'draggable': false, 'resizable': false, 'fixed': true } },
		{ title: 'Vendredi', settings: { 'row': 1, 'sizex': 1, 'sizey': 3, 'draggable': false, 'resizable': false, 'fixed': true } }
	];

	private _events: QueryList<CalendarEvent>;
	private _eventTableItems: Array<any>;
	private _timelineItems: Array<any>;

	constructor( @Query(CalendarEvent) events: QueryList<CalendarEvent>) {
		this._events = events;
		this.next(this._events);
		this._events.changes.observer(this);
	};

	public next = (changes) => {
		console.log('test');
		this._eventTableItems = this._extractEventTable(changes);
		this._timelineItems = this._extractTimeline(this._eventTableItems);
	};

	// conversion from CalendarEvent to EventTable item
	private _extractEventTable = (events: QueryList<CalendarEvent>): Array<TableEvent> => {
		let _eventToTableItem = (event): TableEvent => {
			let eventRow = this._computeRowsFromTimes(event.start) + 1;
			let eventSizey = this._computeRowsFromTimes(event.start, event.end);
			return { id: event.id, title: event.title, settings: { row: eventRow, col: event.col, sizex: event.sizex, sizey: eventSizey } };
		};
		return events.map(_eventToTableItem);
	};

	// extraction of Timeline items from EventTable items
	private _extractTimeline = (events: Array<any>, newTimelineEvent?: {row: number, sizey: number}): Array<any> => {
		let mapFun = (event: any): {row: number, sizey: number} => {
			return {row: event.settings.row, sizey: event.settings.sizey} ;
		};
		let reduceFun = (initial: Array<number>, current: {row: number, sizey: number}, index: number, array: Array<{row: number, sizey: number}>): Array<number> => {
			if (initial.indexOf(current.row) == -1) {
				initial.push(current.row);
			}
			if (initial.indexOf(current.row + current.sizey) == -1) {
				initial.push(current.row + current.sizey);
			}
			return initial;
		};
		let workingArray = events.map(mapFun);
		if (newTimelineEvent) {
			workingArray.push(newTimelineEvent);
		}
		let convertToItem = (row: number): {time: string, settings: any} => {
			return {time: '' + row, settings: {row: row, col:1, sizex:1, sizey: 3}};
		};
		return workingArray.reduce(reduceFun, []).map(convertToItem);
	};

	// helper method to get the row/size of an EventTable item from a CalendarEvent start/end date(s)
	private _computeRowsFromTimes = (start: Date, end?: Date): number => {
		let timeDiff: number;
		if (end) {
			timeDiff = end.getTime() - start.getTime();
		} else {
			timeDiff = start.getTime() - this._config.calStartTime.getTime();
		}
		return timeDiff / (this._config.rowToMin * 1000 * 60);
	};

	// helper method to get the start/end date(s) of a CalendarEvent from row/size an EventTable item
	private _computeTimeFromRows = (row: number, sizey?: number): Date => {
		let minutes: number;
		if (sizey) {
			minutes = (row + sizey - 1) * this._config.rowToMin;
		} else {
			minutes = (row - 1) * this._config.rowToMin;
		}
		let date = new Date(this._config.calStartTime);
		date.setTime(date.getTime() + minutes * 60000);
		return date;
	};

	public setTargetPosition = (pos: { col: number, row: number }) => {
		this._timelineItems = this._extractTimeline(this._eventTableItems, {row: pos.row, sizey: 3});
	};

	public dragStart = (event) => {
		event.settings.show_hours = true;
	};
	
	public dragStop = (event) => {
		event.settings.show_hours = false;
		this._timelineItems = this._extractTimeline(this._eventTableItems);
		this.eventChange.next({ 
			id: event.id, 
			start: this._computeTimeFromRows(event.settings.row), 
			end: this._computeTimeFromRows(event.settings.row, event.settings.sizey) 
		});
	};

	public resizeStart = (event) => {
		event.settings.show_hours = true;
	};
	
	public resizeStop = (event) => {
		event.settings.show_hours = false;
		this._timelineItems = this._extractTimeline(this._eventTableItems);
		this.eventChange.next({ id: event.id, end: this._computeTimeFromRows(event.settings.row) });
	};

	public onChange = (event, changes): void => {
		if (changes.col !== event.col || changes.row !== event.row) {
			event.settings.col = changes.col;
			event.settings.row = changes.row;
		}
		if (changes.sizex !== event.sizex || changes.sizey !== event.sizey) {
			event.settings.sizex = changes.sizex;
			event.settings.sizey = changes.sizey;
		}
	};

}
class AgendaEvent {
	id: string;
	settings: {row: number, col: number, sizex: number, sizey: number};
}
class TableEvent extends AgendaEvent {
	title: string;
}
class TimelineEvent extends AgendaEvent {
	time: Date;
}
