'use babel';

import LabcoatView from './labcoat-view';
import { CompositeDisposable } from 'atom';

export default {

  labcoatView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.labcoatView = new LabcoatView(state.labcoatViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.labcoatView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'labcoat:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.labcoatView.destroy();
  },

  serialize() {
    return {
      labcoatViewState: this.labcoatView.serialize()
    };
  },

  toggle() {
    console.log('Labcoat was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
