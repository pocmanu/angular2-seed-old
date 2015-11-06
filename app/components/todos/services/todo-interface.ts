import {PersistentItem} from '../../../services/service_factory';

export interface ITodo extends PersistentItem {
  text: string;
  done: boolean;
}
