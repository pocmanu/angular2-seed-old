import {Component, View, ViewEncapsulation, NgFor} from 'angular2/angular2';
import {FORM_DIRECTIVES} from 'angular2/angular2';
import {ITodo} from './services/todo-interface';
import {MdButton, MdCheckbox} from '../angular2-material/angular2-material';
import {ServiceFactory, AbstractService} from '../../services/service_factory';

@Component({
  selector: 'todos'
})
@View({
  templateUrl: './components/todos/todos.html',
  encapsulation: ViewEncapsulation.None,
  directives: [FORM_DIRECTIVES, MdButton, MdCheckbox, NgFor]
})
export class Todos {

  todosService: AbstractService<ITodo>;
  todos: Array<ITodo> = [];

  constructor( private factory: ServiceFactory) {
    this.todosService = factory.getService<ITodo>('todo');
    this.todosService.observer(this);
    this.todosService.getAll().then(
      (todos) => { this.todos = todos; }
    );
  }

  addTodo = (formValue: any) => {
    var newTodo = { title: formValue.todoText, done: false };
    this.todosService.addItem(newTodo);
  };

  removeTodo = (todoId) => {
    this.todosService.removeItem(todoId);
  };

  updateTodo = (todoData) => {
    this.todosService.updateItem(todoData);
  };

  next = (updatedTodos) => {
    this.todos = updatedTodos;
  };
}
