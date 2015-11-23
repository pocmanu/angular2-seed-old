import {EventEmitter} from 'angular2/angular2';

export interface PersistentItem {
  id: string;
}

export class AbstractService<T extends PersistentItem> {

  private cache = <Array<T>>[];
  private updateEmitter = new EventEmitter();
  private store;

  constructor(private storeName: string, private hoodie: any) {

    this.store = hoodie.store(storeName);
    this.hoodie.account.on('signout error:unauthenticated', () => {
      this.cache = [];
      this.updateEmitter.next(this.cache);
    });
    this.hoodie.account.on('signin reauthenticated', this.onInit);
    this.hoodie.account.authenticate().then(() => { this.onInit(); });
  }

  public onInit = () => {
    this.getAll().then((items) => {
      console.log('items for store : ' + this.storeName, items);
      this.updateEmitter.next(items);
      this.store.off('add remove update');
      this.store.on('add', this.onAdd);
      this.store.on('remove', this.onRemove);
      this.store.on('update', this.onUpdate);
    });
  };

  public addItem = (itemData: any) => {
    this.store.add(itemData);
  };

  public removeItem = (itemId: any) => {
    this.store.remove(itemId);
  };

  public updateItem = (itemData: any) => {
    this.store.update(itemData.id, itemData);
  };

  public getAll = () => {
    return this.hoodie.store.findAll(this.storeName)
      .then(docs => {
        this.cache = docs;
        return this.cache;
      });
  };

  public observer = (obs) => {
    this.updateEmitter.observer(obs);
  };

  private onAdd = (item: T) => {
    this.cache.unshift(item);
    this.updateEmitter.next(this.cache);
  };

  private onRemove = (item: T) => {
    this.cache.splice(this.findItemIndexById(this.cache, item.id), 1);
    this.updateEmitter.next(this.cache);
  };

  private onUpdate = (changeName, object) => {
    console.log('service reacting to change in database : ' + changeName);
    console.log(object);
  };

  private findItemIndexById = (collection: Array<any>, id: string) => {
    for (var i = 0, len = collection.length; i < len; i++) {
      if (collection[i].id === id) {
        return i;
      }
    }
    return null;
  };
}
