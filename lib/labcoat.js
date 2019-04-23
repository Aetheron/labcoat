'use babel';

import LabcoatView from './labcoat-view';
import { CompositeDisposable } from 'atom';

export default {
  labcoatView: null,
  subscriptions: null,

  activate (state) {
    this.labcoatView = new LabcoatView();

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'labcoat:toggle': () => this.toggle()
    }));

    this.labcoatView.attach();
  },

  deactivate () {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.labcoatView.destroy();

    if (this.labcoatView) {
      this.labcoatView.detach();
    }
    this.labcoatView = null;
  },

  serialize () {
    return {
      labcoatViewState: this.labcoatView.serialize()
    };
  },

  toggle () {
    console.log('Labcoat was toggled!');
  }
};
