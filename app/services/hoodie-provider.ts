import {EventEmitter} from 'angular2/angular2';

export class HoodieProvider {

	hoodie = new Hoodie();

	connected = new EventEmitter();

	constructor() {
		this.hoodie.account.on('signin', () => { console.log('signin'); this.connected.next(true); });
		this.hoodie.account.on('authenticated', () => { console.log('reauthenticated'); this.connected.next(true); });
		this.hoodie.account.on('signout error:unauthenticated', () => { this.connected.next(false); });
		if (!this.hoodie.account.hasValidSession()) {
			console.log('trying to reauthenticate');
			this.hoodie.account.authenticate()
				.then(() => {
					console.log('re-authentication successful', this.hoodie.account.hasValidSession());
					this.connected.next(true);
				})
				.fail(() => {
					console.log('re-authentication failed', this.hoodie);
					console.log('check connection', this.hoodie.checkConnection());
					console.log('is connected', this.hoodie.isConnected());
					console.log('remote', this.hoodie.remote());
					this.connected.next(false);
				});
		}
	}

	getHoodie = () => {
		return this.hoodie;
	};

	isConnected = () => {
		return this.hoodie.account.username && this.hoodie.account.hasValidSession();
	}

	signOut = () => {
		return this.hoodie.account.signOut();
	}

	signIn = (username: string, password: string) => {
		return this.hoodie.account.signIn(username, password);
	}

	signUp = (username: string, password: string) => {
		return this.hoodie.account.signUp(username, password);
	}

	observer = (obs) => {
		this.connected.observer(obs);
	}
}
