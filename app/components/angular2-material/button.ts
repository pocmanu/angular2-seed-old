import {Component, View, ViewEncapsulation, OnChanges} from 'angular2/angular2';

//import {TimerWrapper} from 'angular2/src/core/facade/async';


// TODO(jelbourn): Ink ripples.
// TODO(jelbourn): Make the `isMouseDown` stuff done with one global listener.

@Component({
  selector: '[md-button]:not(a), [md-fab]:not(a), [md-raised-button]:not(a), md-button',
  host: {
    '(mousedown)': 'onMousedown()',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '[class.md-button-focus]': 'isKeyboardFocused'
  }
})
@View({
  templateUrl: './components/angular2-material/button.html',
  encapsulation: ViewEncapsulation.None
})
export class MdButton {
  /** Whether a mousedown has occured on this element in the last 100ms. */
  isMouseDown: boolean = false;

  /** Whether the button has focus from the keyboard (not the mouse). Used for class binding. */
  isKeyboardFocused: boolean = false;

  onMousedown() {
    // We only *show* the focus style when focus has come to the button via the keyboard.
    // The Material Design spec is silent on this topic, and without doing this, the
    // button continues to look :active after clicking.
    // @see http://marcysutton.com/button-focus-hell/
    this.isMouseDown = true;
    //TimerWrapper.setTimeout(() => {this.isMouseDown = false;}, 100);
  }

  onFocus() {
    this.isKeyboardFocused = !this.isMouseDown;
  }

  onBlur() {
    this.isKeyboardFocused = false;
  }
}


@Component({
  selector: 'a[md-button], a[md-raised-button], a[md-fab]',
  inputs: ['disabled'],
  host: {
    '(click)': 'onClick($event)',
    '(mousedown)': 'onMousedown()',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '[tabIndex]': 'tabIndex',
    '[class.md-button-focus]': 'isKeyboardFocused',
    '[attr.aria-disabled]': 'isAriaDisabled'
  }
})
@View({
  templateUrl: './components/angular2-material/button.html',
  encapsulation: ViewEncapsulation.None
})
export class MdAnchor extends MdButton implements OnChanges {
  tabIndex: number;
  disabled_: boolean;

  get disabled(): boolean {
    return this.disabled_;
  }

  set disabled(value) {
    // The presence of *any* disabled value makes the component disabled, *except* for false.
    this.disabled_ = this.disabled !== false;
  }

  onClick(event) {
    // A disabled anchor shouldn't navigate anywhere.
    if (this.disabled) {
      event.preventDefault();
    }
  }

  /** Invoked when a change is detected. */
  onChanges(_) {
    // A disabled anchor should not be in the tab flow.
    this.tabIndex = this.disabled ? -1 : 0;
  }

  /** Gets the aria-disabled value for the component, which must be a string for Dart. */
  get isAriaDisabled(): string {
    return this.disabled ? 'true' : 'false';
  }
}
