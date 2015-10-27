import {Component, View, NgFor, EventEmitter, FORM_DIRECTIVES} from 'angular2/angular2';
import {MdCheckbox} from '../../angular2-material/angular2-material';

@Component({
  selector: 'todos-list',
  properties: ['todos'],
  events: ['update', 'remove']
})
@View({
  templateUrl: './components/todos/todos-list/todos-list.html',
  directives: [FORM_DIRECTIVES, NgFor, MdCheckbox]
})
export class TodosList {

  update = new EventEmitter();
  remove = new EventEmitter();

  constructor() {
    // nothing yet
  }

  toggleCompletion = (todoData) => {
    this.update.next(todoData);
  };

  removeTodo = (todoId) => {
    this.remove.next(todoId);
  };
}
