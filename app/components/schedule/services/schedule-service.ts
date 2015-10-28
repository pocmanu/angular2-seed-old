import {EventEmitter, Inject} from 'angular2/angular2';
import {ISchedule} from './schedule-interface';
import {HoodieProvider} from '../../../services/hoodie-provider';

export {ISchedule} from './schedule-interface';

export class ScheduleService {
  scheduleCache = <Array<ISchedule>>[];
  store;
  hoodie;

  constructor( @Inject(HoodieProvider) provider) {

  }

  onInit = () => {
    /*this.getAllTodos().then((todos) => {
      this.update.next(todos);
      this.store.off('add remove update');
      this.store.on('add', this.onAdd);
      this.store.on('remove', this.onRemove);
      this.store.on('update', this.onUpdate);
    });*/
  };

  addTodo = (todoData: any) => {
    this.store.add(todoData);
  };

  removeTodo = (todoId: any) => {
    this.store.remove(todoId);
  };

  updateTodo = (todoData: any) => {
    this.store.update(todoData.id, todoData);
  };
/*
  getAllTodos = () => {
    return this.hoodie.store.findAll()
      .then(docs => {
        this.todosCache = docs;
        return this.todosCache;
      });
  };

  onAdd = (todo: ITodo) => {
    this.todosCache.unshift(todo);
    this.update.next(this.todosCache);
  };

  onRemove = (todo: ITodo) => {
    this.todosCache.splice(this.findItemIndexById(this.todosCache, todo.id), 1);
    this.update.next(this.todosCache);
  };

  onUpdate = (changeName, object) => {
    console.log('service reacting to change in database : ' + changeName);
    console.log(object);
  };

  findItemIndexById = (collection: Array<any>, id: string) => {
    for (var i = 0, len = collection.length; i < len; i++) {
      if (collection[i].id === id) {
        return i;
      }
    }
    return null;
  };
*/
}
