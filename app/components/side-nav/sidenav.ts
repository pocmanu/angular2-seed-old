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

  constructor( @Inject(HoodieProvider) provider) {
    this.hoodie = provider.getHoodie();
  }

  onInit() {
    console.log(this.hoodie.account);
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
