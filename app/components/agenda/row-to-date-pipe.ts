import {Pipe, PipeTransform, DatePipe} from 'angular2/angular2';

@Pipe({
	name: 'rowToDate'
})
export class RowToDatePipe implements PipeTransform {
	private _datePipe: DatePipe = new DatePipe();
	public transform = (v, args): string => {
		if (args.length > 1) {
			let minutes = (v - 1) * args[0];
			let date = new Date(args[1]).setTime(args[1].getTime() + minutes * 60000)
			return this._datePipe.transform(date, ['HH:mm']);
		}
		return '';
	}
}
