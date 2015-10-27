import {EventEmitter, Inject} from 'angular2/angular2';
import {ISchedule} from './schedule-interface';
import {HoodieProvider} from '../../../services/hoodie-provider';

export {ISchedule} from './schedule-interface';

export class ScheduleService {
  scheduleCache = <Array<ISchedule>>[];
  update = new EventEmitter();
  store;
  hoodie;

  constructor( @Inject(HoodieProvider) provider) {

    this.hoodie = provider.getHoodie();
    this.store = this.hoodie.store('schedule');
    this.hoodie.account.on('signout', () => { this.scheduleCache = []; this.update.next(this.scheduleCache); });
    if (!this.hoodie.account.hasValidSession()) {
      console.log('trying to reauthenticate');
      this.hoodie.account.authenticate()
        .then(() => { console.log(this.hoodie.account.hasValidSession()); /**this.onInit();*/ })
        .fail(() => { console.log(); });
    }
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
