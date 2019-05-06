'use babel';

import { CompositeDisposable } from 'atom';
import LabcoatViewElement from './labcoat-view-element';
import {$} from 'atom-space-pen-views';

var panelView = null;

export default class LabcoatView {
  constructor (serializedState) {
    this.subscriptions = new CompositeDisposable();

    this.getTitle = () => 'Labcoat';

    this.apiUrl = 'https://gitlab.ccel.org/api/v4/';
  }

  attach () {
    $(document).on('errorOccurred', this, this.showErrorMessage);

    var rightDock = atom.workspace.getRightDock();
    var activePane = rightDock.paneContainer.getActivePane();

    this.panel = activePane.addItem(this);
    this.document = document;
    this.element = document.createElement('div');
    this.element.classList.add('labcoat');

    var apiToken = atom.config.get('labcoat.gitlabAPI');
    if (apiToken == undefined) {
      this.showErrorMessage('No API Token set!');
    } else {
      $.get(
        this.apiUrl + 'todos', {'Private-Token': apiToken},
        function (data) {
          console.log(this);
          console.log(data);
          this.processAPIRequest(data, this);
        }
      ).fail(this.showErrorMessage.bind(null, this));
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

  processAPIRequest (context, var1, var2) {
    for (var variable in this.response) {
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

  showErrorMessage(context, data) {
    var apiError = context.document.createElement('span');
    apiError.textContent = data.responseJSON.message;
    apiError.classList.add('api-error');
    context.element.appendChild(apiError);
  }
}
