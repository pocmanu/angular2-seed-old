import {Component, View, ViewEncapsulation} from 'angular2/angular2';

@Component({
  selector: 'md-checkbox',
  inputs: ['checked', 'disabled', '_id'],
  properties: ['uid'],
  host: {
    'role': 'checkbox',
    '(keydown)': 'onKeydown($event)'
  }
})
@View({
  templateUrl: './components/angular2-material/checkbox.html',
  directives: [],
  encapsulation: ViewEncapsulation.None
})
export class MdCheckbox {
  /** Whether this checkbox is checked. */
  checked: boolean;

  /** Whether this checkbox is disabled. */
  disabled_: boolean;

  constructor() {
    this.checked = false;
    this.disabled_ = false;
  }

  get disabled() {
    return this.disabled_;
  }
/*
  set disabled(value) {
    this.disabled_ = isPresent(value) && value !== false;
  }

  onKeydown(event: KeyboardEvent) {
    if (event.keyCode == KeyCodes.SPACE) {
      event.preventDefault();
      this.toggle(event);
    }
  }

  toggle(event) {
    if (this.disabled) {
      event.stopPropagation();
      return;
    }

    this.checked = !this.checked;
  }*/
}
