import {Inject} from 'angular2/angular2';
import {HoodieProvider} from './hoodie_provider';
import {AbstractService, PersistentItem} from './abstract_service';

export {AbstractService, PersistentItem} from './abstract_service';

export class ServiceFactory {

	private _hoodieProvider: HoodieProvider;

	private serviceMap: Map<String, AbstractService<any>> = new Map<String, AbstractService<any>>();

	constructor( @Inject(HoodieProvider) hoodieProvider) {
		this._hoodieProvider = hoodieProvider;
	}

	public getService = <T extends PersistentItem>(serviceName: String): AbstractService<T> => {
		if (this.serviceMap.get(serviceName) == null) {
			this.serviceMap.set(serviceName, new AbstractService<T>(serviceName, this._hoodieProvider.getHoodie()));
		}
		return this.serviceMap.get(serviceName);
	}
}