import {Component, View, ViewEncapsulation, NgIf, OnInit} from 'angular2/angular2';
import {HoodieProvider} from '../../services/hoodie_provider';
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

  private connected: boolean = false;

  constructor(private hoodieProvider: HoodieProvider) {
    this.hoodieProvider.observer(this);
  }

  public onInit() {
    this.connected = this.hoodieProvider.isConnected();
    $('.button-collapse').sideNav();
    $('.modal-trigger').leanModal();
  };

  public signOut = () => {
    this.hoodieProvider.signOut().then(() => {
      Materialize.toast('Successfully disconnected', 4000);
      console.log('disconnected');
    });
  };

  public signUp = () => {
    $('#signup-popup').openModal();
  };

  public signIn = () => {
    $('#login-popup').openModal();
  };

  public next = (connectStatus) => {
    this.connected = connectStatus;
  };
}
