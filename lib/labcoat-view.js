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
    var rightDock = atom.workspace.getRightDock();
    var activePane = rightDock.paneContainer.getActivePane();

    this.panel = activePane.addItem(this);
    this.document = document;
    this.element = document.createElement('div');
    this.element.classList.add('labcoat');

    var apiToken = atom.config.get('labcoat.gitlabAPI');
    if (apiToken === undefined || apiToken === '') {
      this.showErrorMessage(this, 'No API Token set!');
    } else {
      $.ajax({
        url: this.apiUrl + 'todos',
        type: 'GET',
        success: this.processAPIRequest.bind(null, this),
        error: this.handleAPIError.bind(null, this),
        headers: {'Private-Token': apiToken}
      });
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

  processAPIRequest (context, data) {
    const todoHeader = context.document.createElement('div');
    todoHeader.innerHTML = '<div>Todos</div>';
    todoHeader.classList.add('todoHeader');
    context.element.appendChild(todoHeader);

    const todoTable = context.document.createElement('table');
    todoTable.classList.add('todoTable');
    context.element.appendChild(todoTable);

    for (var todoItem in data) {
      // Add a row for each todo item
      const todoRow = context.document.createElement('tr');
      todoRow.classList.add('todoRow');
      todoTable.appendChild(todoRow);
      // Add a cell for the todo text
      const todoCell = context.document.createElement('td');
      todoCell.innerHTML = data[todoItem].body;
      todoCell.classList.add('todoCell');
      todoRow.appendChild(todoCell);
      // Add a "Done" button to each todo item
      const todoCell2 = context.document.createElement('td');
      todoCell2.classList.add('todoCell');
      todoRow.appendChild(todoCell2);
      const todoButton = context.document.createElement('button');
      todoButton.innerHTML = 'Done';
      todoButton.classList.add('todoDoneButton');
      todoCell2.appendChild(todoButton);
    }
  }

  handleAPIError (context, data) {
    var message = data.responseJSON.message;
    context.showErrorMessage(context, message);
  }

  showErrorMessage (context, message) {
    var apiError = context.document.createElement('span');
    apiError.textContent = message;
    apiError.classList.add('api-error');
    context.element.appendChild(apiError);
  }
}
