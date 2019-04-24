'use babel';

import { CompositeDisposable } from 'atom';
import LabcoatViewElement from './labcoat-view-element';

export default class LabcoatView {
  constructor (serializedState) {
    this.subscriptions = new CompositeDisposable();

    this.getTitle = () => 'Labcoat';

    this.apiUrl = 'https://gitlab.ccel.org/api/v4/';
  }

  attach () {
    var rightDock = atom.workspace.getRightDock();
    var activePane = rightDock.paneContainer.getActivePane();

    this.panel = activePane.addItem(this);

    this.element = document.createElement('div');
    this.element.classList.add('labcoat');

    var apiToken = atom.config.get('labcoat.gitlabAPI');
    if (apiToken == undefined) {
      const webViewTitle = document.createElement('div');
      webViewTitle.innerHTML = `
      <div style="
        background-color: red;
        font-size: 14px;
        font-family: 'Helvetica Neue';
        ">No API Token set!</div>
      `;
      webViewTitle.classList.add('webViewTitle');
      this.element.appendChild(webViewTitle);
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', this.apiUrl + 'todos', true);
      xhr.setRequestHeader('Private-Token', apiToken);
      xhr.send();
      xhr.addEventListener("readystatechange", this.processAPIRequest, false);

      const webViewTitle = document.createElement('div');
      webViewTitle.innerHTML = `
        <div style="
        background-color: #1a3652;
        font-size: 14px;
        font-family: 'Helvetica Neue';
        ">Todos</div>
      `;
      webViewTitle.classList.add('webViewTitle');
      this.element.appendChild(webViewTitle);
    }
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
    var test = 0;
    for (var variable in object) {
      const todoItem = document.createElement('div');
      todoItem.innerHTML = `
      <div style="
      background-color: #1a3652;
      font-size: 14px;
      font-family: 'Helvetica Neue';
      ">Todos</div>
      `;
      todoItem.classList.add('todoItem');
      this.element.appendChild(todoItem);
    }
  }
}
