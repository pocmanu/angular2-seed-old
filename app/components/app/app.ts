import {Component, ViewEncapsulation} from 'angular2/angular2';
import {
  RouteConfig,
  ROUTER_DIRECTIVES
} from 'angular2/router';
// import {HTTP_BINDINGS} from 'http/http';

import {HomeCmp} from '../home/home';
import {AboutCmp} from '../about/about';
import {Todos, TodosService} from '../todos/todos';
import {Schedule, ScheduleService} from '../schedule/schedule';
import {SideNav} from '../side-nav/sidenav';
import {NameList} from '../../services/name_list';
import {HoodieProvider} from '../../services/hoodie-provider';

@Component({
  selector: 'app',
  viewBindings: [NameList, TodosService, HoodieProvider, ScheduleService],
  templateUrl: './components/app/app.html',
  styleUrls: ['./components/app/app.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, SideNav]
})
@RouteConfig([
  { path: '/', component: HomeCmp, as: 'Home' },
  { path: '/about', component: AboutCmp, as: 'About' },
  { path: '/todos', component: Todos, as: 'Todos' },
  { path: '/schedule', component: Schedule, as: 'Schedule' }
])
export class AppCmp {}