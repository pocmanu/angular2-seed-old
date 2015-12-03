import {Component, View, ViewEncapsulation, NgFor, NgIf, Query, QueryList, EventEmitter} from 'angular2/angular2';
import {NgGrid, NgGridItem} from '../angular2-grid/NgGrid';
import {CalendarEvent} from './calendar-event';
import {RowToDatePipe} from './row-to-date-pipe';

@Component({
	selector: 'agenda',
	templateUrl: './components/agenda/agenda.html',
	encapsulation: ViewEncapsulation.None,
	directives: [NgGrid, NgGridItem, NgFor, NgIf, CalendarEvent],
	pipes: [RowToDatePipe],
	outputs: ['eventChange', 'eventAdded']
})
export class Agenda {

	private _config: any = {
		rowToMin: 5,
		calStartTime: new Date(2015, 11, 17, 8, 0, 0, 0)
	};

	private eventChange: EventEmitter<any> = new EventEmitter();
	private eventAdded : EventEmitter<any> = new EventEmitter();

	private _startDate: Date = new Date(2015, 11, 15, 8, 0, 0, 0);

	private _eventTableConfig: any = {'margins': [0, 0], 'min_cols': 1, 'max_cols': 6, 'min_rows': 10, 'min_height': 15, 
                 'col_width': 130, 'row_height':7, 'cascade':'none', 'auto-resize': false};

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
	private _dropTargetPos: {row: number, col: number};

	constructor( @Query(CalendarEvent) events: QueryList<CalendarEvent>) {
		this._events = events;
		this.next(this._events);
		this._events.changes.subscribe(this.next);
	};

	public next = (changes: QueryList<CalendarEvent>) => {
		if (changes.length > 0 && changes.first.start) {
			this._eventTableItems = this._extractEventTable(changes);
			this._timelineItems = this._extractTimeline(this._eventTableItems);
		}
	};

	// conversion from CalendarEvent to EventTable item
	private _extractEventTable = (events: QueryList<CalendarEvent>): Array<TableEvent> => {
		let _eventToTableItem = (event): TableEvent => {
			return { id: event.id, title: event.title, settings: this._computeSettingsForEvent(event) };
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

	// helper method to get the position/size of an EventTable item from a CalendarEvent start/end date(s)
	private _computeSettingsForEvent = (event: CalendarEvent): IItemSettings => {
		let duration: number = event.duration;
		let settings: { row: number, col: number, sizex: number, sizey: number } = { row: 0, col: 0, sizex: 0, sizey: 0 };
		settings.col   = Math.trunc((event.start.getTime() - this._config.calStartTime.getTime()) / (1000 * 60 * 60 * 24)) + 1;
		settings.row   = Math.trunc((event.start.getTime() - this._config.calStartTime.getTime() - (settings.col - 1) * 1000 * 60 * 60 * 24) / (this._config.rowToMin * 1000 * 60)) + 1;
		settings.sizey = Math.trunc(duration / this._config.rowToMin);
		settings.sizex = 1;
		return settings;
	};

	// helper method to get the start/end date(s) of a CalendarEvent from row/size an EventTable item
	private _computeTimeFromRows = (settings: IItemSettings): {start: Date, duration: number} => {
		let startDate = new Date(this._config.calStartTime.getTime() + (settings.col - 1) * 1000 * 60 * 60 *24);
		startDate.setTime(startDate.getTime() + (settings.row - 1) * 60000);
		return {start: startDate, duration: settings.row * this._config.rowToMin};
	};

	public setTargetPosition = (pos: { col: number, row: number }) => {
		this._timelineItems = this._extractTimeline(this._eventTableItems, {row: pos.row, sizey: 3});
		this._dropTargetPos = pos;
	};

	public dragStart = (event) => {
		event.settings.show_hours = true;
	};
	
	public dragStop = (event) => {
		event.settings.show_hours = false;
		this._timelineItems = this._extractTimeline(this._eventTableItems);
		let calEventProperties = this._computeTimeFromRows(event.settings);
		this.eventChange.next({ 
			id: event.id, 
			start: calEventProperties.start, 
			duration: calEventProperties.duration
		});
	};

	public resizeStart = (event) => {
		event.settings.show_hours = true;
	};
	
	public resizeStop = (event) => {
		event.settings.show_hours = false;
		this._timelineItems = this._extractTimeline(this._eventTableItems);
		this.eventChange.next({ id: event.id, duration: this._computeTimeFromRows(event.settings).duration });
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

	public onDrop = (event): void => {
		let settings = {row: this._dropTargetPos.row, col: this._dropTargetPos.col, sizex: 1, sizey: 1}; //TODO size
		let newEventProperties = this._computeTimeFromRows(settings);
		this.eventAdded.next({start: newEventProperties.start, duration: newEventProperties.duration});
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
interface IItemSettings {
	col: number;
	row: number;
	sizex : number;
	sizey: number;
}
