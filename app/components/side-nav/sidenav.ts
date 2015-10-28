import {Component, View, ViewEncapsulation, Inject, NgIf, OnInit} from 'angular2/angular2';
import {HoodieProvider} from '../../services/hoodie-provider';
import {LoginPopup} from '../login/loginpopup';

@Component({
  selector: 'side-nav'
})
@View({
  templateUrl: './components/side-nav/sidenav.html',
  encapsulation: ViewEncapsulation.None,
  directives: [NgIf, LoginPopup]
})
export class SideNav implements OnInit {

  hoodie;
  connected: boolean = false;

  constructor( @Inject(HoodieProvider) provider) {
    this.hoodie = provider.getHoodie();
    this.hoodie.account.on('signin', () => { console.log('signin'); this.connected = true; });
    this.hoodie.account.on('authenticated', () => { console.log('reauthenticated'); this.connected = true; });
    this.hoodie.account.on('signout error:unauthenticated', () => { this.connected = false; });
    if (!this.hoodie.account.hasValidSession()) {
      console.log('trying to reauthenticate');
      this.hoodie.account.authenticate()
        .then(() => {
          console.log('re-authentication successful', this.hoodie.account.hasValidSession());
          this.onInit();
        })
        .fail(() => {
          console.log('re-authentication failed', this.hoodie);
          console.log('check connection', this.hoodie.checkConnection());
          console.log('is connected', this.hoodie.isConnected());
          console.log('remote', this.hoodie.remote());
        });
    }
  }

  onInit() {
    this.connected = this.hoodie.account.username && this.hoodie.account.hasValidSession();
    $('.button-collapse').sideNav();
    $('.modal-trigger').leanModal();
  }

  signOut = () => {
    this.hoodie.account.signOut().then(() => {
      Materialize.toast('Successfully disconnected', 4000);
      console.log('disconnected');
    });
  };

  signIn = () => {
    $('#login-popup').openModal();
  };
}
