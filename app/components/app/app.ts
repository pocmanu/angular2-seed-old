import {Component, ViewEncapsulation} from 'angular2/angular2';
import {
  RouteConfig,
  ROUTER_DIRECTIVES
} from 'angular2/router';
// import {HTTP_PROVIDERS} from 'http/http';

import {HomeCmp} from '../home/home';
import {AboutCmp} from '../about/about';
import {NameList} from '../../services/name_list';
import {ServiceFactory} from '../../services/service_factory';
import {Todos} from '../todos/todos';
import {HoodieProvider} from '../../services/hoodie_provider';
import {Schedule} from '../schedule/schedule';
import {SideNav} from '../side-nav/sidenav';
import {CalendarService} from '../agenda/calendar-service';

@Component({
  selector: 'app',
  viewProviders: [NameList, HoodieProvider, ServiceFactory, CalendarService],
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
