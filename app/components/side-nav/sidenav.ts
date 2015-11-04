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

  connected: boolean = false;
  hoodieProvider : HoodieProvider;

  constructor( @Inject(HoodieProvider) provider) {
    this.hoodieProvider = provider;
    provider.observer(this);
  }

  onInit() {
    this.connected = this.hoodieProvider.isConnected();
    $('.button-collapse').sideNav();
    $('.modal-trigger').leanModal();
  };

  signOut = () => {
    this.hoodieProvider.signOut().then(() => {
      Materialize.toast('Successfully disconnected', 4000);
      console.log('disconnected');
    });
  };

  signUp = () => {
    $('#signup-popup').openModal();
  };

  signIn = () => {
    $('#login-popup').openModal();
  };

  next = (connectStatus) => {
    this.connected = connectStatus;
  }
}
