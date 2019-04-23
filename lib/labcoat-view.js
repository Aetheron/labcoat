'use babel';

import { CompositeDisposable } from 'atom';
import LabcoatViewElement from './labcoat-view-element';

export default class LabcoatView {
  constructor (serializedState) {
    this.subscriptions = new CompositeDisposable();

    this.getTitle = () => 'Labcoat';

    var api_url = 'https://gitlab.ccel.org/api/v4/';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', api_url + 'todos', true);
    xhr.setRequestHeader(
      'Private-Token',
      atom.config.get('labcoat.gitlabAPI')
    );
    xhr.send();
    xhr.addEventListener("readystatechange", this.processAPIRequest, false);

    this.element = document.createElement('div');
    this.element.classList.add('labcoat');

    const webViewTitle = document.createElement('div');
    webViewTitle.innerHTML = `
        <div style="
        background-color: #1a3652;
        font-size: 14px;
        font-family: &quot;Helvetica Neue&quot;;
        ">Todos</div>
    `;
    webViewTitle.classList.add('webViewTitle');
    this.element.appendChild(webViewTitle);
  }

  attach () {
      var rightDock = atom.workspace.getRightDock();
      var activePane = rightDock.paneContainer.getActivePane();

      this.panel = activePane.addItem(this);
  }

  // Returns an object that can be retrieved when package is activated
  serialize () {}

  // Tear down any state and detach
  destroy () {
    this.element.remove();
  }

  getElement () {
    return this.element;
  }

  processAPIRequest (e) {
    
  }
}
