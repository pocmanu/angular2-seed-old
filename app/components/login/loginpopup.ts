import {Component, View, Inject} from 'angular2/angular2';
import {FORM_DIRECTIVES} from 'angular2/angular2';
import {HoodieProvider} from '../../services/hoodie-provider';

@Component({
  selector: 'login-popup',
  inputs: ['_id']
})
@View({
  templateUrl: './components/login/loginpopup.html',
  directives: [FORM_DIRECTIVES]
})
export class LoginPopup {

  hoodie;

  constructor(@Inject(HoodieProvider) provider) {
    this.hoodie = provider.getHoodie();
  }

  signIn=(formValue: any) => {
    this.hoodie.account.signIn(formValue.username, formValue.password).then(
      () => {
        console.log('success');
        Materialize.toast('Connection successful', 4000);
      }
    );
  };
}
