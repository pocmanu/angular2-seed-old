import {Component, View, Inject, NgIf, OnInit, NgClass} from 'angular2/angular2';
import {FORM_DIRECTIVES, FORM_BINDINGS, ControlGroup, Validators, Control, FormBuilder} from 'angular2/angular2';
import {HoodieProvider} from '../../services/hoodie-provider';

@Component({
  selector: 'login-popup',
  inputs: ['_id', 'signup'],
  viewBindings: [FORM_BINDINGS]
})
@View({
  templateUrl: './components/login/loginpopup.html',
  directives: [FORM_DIRECTIVES, NgIf, NgClass]
})
export class LoginPopup implements OnInit {

  hoodieProvider: HoodieProvider;
  formBuilder: FormBuilder;

  signup: boolean;

  form: ControlGroup;

  constructor( @Inject(HoodieProvider) provider, @Inject(FormBuilder) fb) {
    this.hoodieProvider = provider;
    this.formBuilder = fb;
  }

  onInit() {
    if (this.signup) {
      this.form = this.formBuilder.group({
        'username': ['', Validators.minLength(3)],
        'password': ['', Validators.required],
        'passwordcheck': ['', Validators.required]
      });
    } else {
      this.form = this.formBuilder.group({
        'username': ['', Validators.minLength(3)],
        'password': ['', Validators.required]
      });
    }
  };

  onSubmit = () => {
    if (this.signup) {
      this.signUp(this.form.value);
    } else {
      this.signIn(this.form.value);
    }
  };

  signIn = (formValue: any) => {
    this.hoodieProvider.signIn(formValue.username, formValue.password)
      .then(() => {
        Materialize.toast('Connection successful', 4000);
      })
      .catch(() => {
        Materialize.toast('Wrong login or password', 4000);
      });
  };

  signUp = (formValue: any) => {
    this.hoodieProvider.signUp(formValue.username, formValue.password)
      .then(() => {
        Materialize.toast('User successfully registered', 4000);
      })
      .catch(() => {
        Materialize.toast('A user already exists with this name', 4000);
      });
  };
}
