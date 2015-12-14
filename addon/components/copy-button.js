import Ember from 'ember';
import layout from '../templates/components/copy-button';
/* global Clipboard */

const { get, set } = Ember;

export default Ember.Component.extend({
  layout: layout,
  tagName: 'button',
  classNames: ['copy-btn'],
  attributeBindings: [
    'clipboardText:data-clipboard-text',
    'clipboardTarget:data-clipboard-target',
    'clipboardAction:data-clipboard-action',
    'buttonType:type',
    'aria-label:aria-label'
  ],

  /**
   * @property {Array} clipboardEvents - events supported by clipboard.js
   */
  clipboardEvents: ['success', 'error'],

  /**
   * @property {String} buttonType - type attribute for button element
   */
  buttonType: 'button',

  didInsertElement() {
  let clipboard = new Clipboard(`#${this.get('elementId')}`, {
    text: function() {
      var html_signature = document.querySelector(arguments[0].dataset.clipboardText).innerHTML;
      return html_signature;
    }
  });

  set(this, 'clipboard', clipboard);

  get(this, 'clipboardEvents').forEach(action => {
    clipboard.on(action, Ember.run.bind(this, function(e) {
      try {
        this.sendAction(action, e);
      }
      catch(error) {
        Ember.Logger.debug(error.message);
      }
    }));
  });
},

  willDestroyElement() {
    get(this, 'clipboard').destroy();
  }
});
