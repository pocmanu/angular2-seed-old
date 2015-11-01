import {Component, ViewEncapsulation} from 'angular2/angular2';
import {
  RouteConfig,
  ROUTER_DIRECTIVES
} from 'angular2/router';
// import {HTTP_PROVIDERS} from 'http/http';

import {HomeCmp} from '../home/home';
import {AboutCmp} from '../about/about';
import {NameList} from '../../services/name_list';
import {Todos, TodosService} from '../todos/todos';
import {HoodieProvider} from '../../services/hoodie-provider';

@Component({
  selector: 'app',
  viewProviders: [NameList, TodosService, HoodieProvider],
  templateUrl: './components/app/app.html',
  styleUrls: ['./components/app/app.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  { path: '/', component: HomeCmp, as: 'Home' },
  { path: '/about', component: AboutCmp, as: 'About' },
  { path: '/todos', component: Todos, as: 'Todos' }/*,
  { path: '/schedule', component: Schedule, as: 'Schedule' }*/
])
export class AppCmp {}
