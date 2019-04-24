'use babel';

var labcoatView = null;
var subscriptions = null;

const LabcoatView = require('./labcoat-view');
const CompositeDisposable = require('atom').CompositeDisposable;

class Labcoat {
  activate (state) {
    labcoatView = new LabcoatView();

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    subscriptions.add(atom.commands.add('atom-workspace', {
      'labcoat:toggle': () => this.toggle()
    }));

    labcoatView.attach();
  }

  deactivate () {
    // this.modalPanel.destroy();
    subscriptions.dispose();
    labcoatView.destroy();

    if (labcoatView) {
      labcoatView.detach();
    }
    labcoatView = null;
  }

  serialize () {
    return {
      labcoatViewState: labcoatView.serialize()
    };
  }

  toggle () {
    console.log('Labcoat was toggled!');
  }
}

const lcpackage = new Labcoat();
module.exports = {
  config: {
    gitlabAPI: {
      title: 'GitLab Personal Access Token',
      description: 'A Personal Access Token you have generated in your GitLab User Settings. Must have `api` and `read-user` scope access.',
      type: 'string',
      default: ''
    }
  },

  activate: function () {
    lcpackage.activate();
  },

  deactivate: function () {
    lcpackage.deactivate();
  },

  serialize: function () {
    lcpackage.serialize();
  },

  toggle: function () {
    lcpackage.toggle();
  }
};
