import {Component, View, Inject, ViewEncapsulation, NgFor} from 'angular2/angular2';
import {FORM_DIRECTIVES} from 'angular2/angular2';
import {TodosService, ITodo} from './services/todos-service';
import {MdButton, MdCheckbox} from '../angular2-material/angular2-material';

export {TodosService} from './services/todos-service';

@Component({
  selector: 'todos'
})
@View({
  templateUrl: './components/todos/todos.html',
  encapsulation: ViewEncapsulation.None,
  directives: [FORM_DIRECTIVES, MdButton, MdCheckbox, NgFor]
})
export class Todos {

  todosService: TodosService;
  todos: Array<ITodo> = [];

  constructor( @Inject(TodosService) todosService: TodosService) {
    this.todosService = todosService;
    this.todosService.observer(this);
    this.todosService.getAllTodos().then(
      (todos) => { this.todos = todos; }
    );
    //this.todos = [{"title":"waf"}, {"title":"wef"}, {"title":"wif"}];
  }

  addTodo = (formValue: any) => {
    var newTodo = { title: formValue.todoText, done: false };
    this.todosService.addTodo(newTodo);
  };

  removeTodo = (todoId) => {
    this.todosService.removeTodo(todoId);
  };

  updateTodo = (todoData) => {
    this.todosService.updateTodo(todoData);
  };

  next = (updatedTodos) => {
    this.todos = updatedTodos;
  };
}
