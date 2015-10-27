import {EventEmitter, Inject} from 'angular2/angular2';
import {ITodo} from './todo-interface';
import {HoodieProvider} from '../../../services/hoodie-provider';

export {ITodo} from './todo-interface';

export class TodosService {
  todosCache = <Array<ITodo>>[];
  update = new EventEmitter();
  store;
  hoodie;

  constructor( @Inject(HoodieProvider) provider) {

    this.hoodie = provider.getHoodie();
    this.store = this.hoodie.store('todo');
    this.hoodie.account.on('signout', () => { this.todosCache = []; this.update.next(this.todosCache); });
    this.hoodie.account.on('signin reauthenticated', this.onInit);
    this.hoodie.account.on('signin', () => { console.log('sign in'); });
    this.hoodie.account.on('error:unauthenticated', () => { console.log('error:unauthenticated'); });
    this.hoodie.account.on('reauthenticated', () => { console.log('reauthenticated' + ' / ' + this.hoodie.account.hasValidSession()); });
    if (!this.hoodie.account.hasValidSession()) {
      console.log('trying to reauthenticate');
      this.hoodie.account.authenticate()
        .then(() => {
          console.log('re-authentication successful', this.hoodie.account.hasValidSession());
          this.onInit();
        })
        .fail(() => {
          this.todosCache = [];
          this.update.next(this.todosCache);
          console.log('re-authentication failed', this.hoodie);
          console.log('check connection', this.hoodie.checkConnection());
          console.log('is connected', this.hoodie.isConnected());
          console.log('remote', this.hoodie.remote());
        });
    }
  }

  onInit = () => {
    this.getAllTodos().then((todos) => {
      this.update.next(todos);
      this.store.off('add remove update');
      this.store.on('add', this.onAdd);
      this.store.on('remove', this.onRemove);
      this.store.on('update', this.onUpdate);
    });
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

  getAllTodos = () => {
    return this.hoodie.store.findAll(/*(doc) => { return doc.type === 'todo' && !doc.done; }*/)
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
}
