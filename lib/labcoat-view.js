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

    const apiToken = atom.config.get('labcoat.gitlabAPI');
    if (apiToken === undefined || apiToken === '') {
      this.showErrorMessage(this, 'No API Token set!');
    } else {
      $.ajax({
        url: this.apiUrl + 'todos',
        type: 'GET',
        data: {'state': 'pending'},
        headers: {'Private-Token': apiToken},
        success: this.processAPIRequest.bind(null, this),
        error: this.handleAPIError.bind(null, this)
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
    const apiToken = atom.config.get('labcoat.gitlabAPI');

    const todoHeader = context.document.createElement('div');
    todoHeader.classList.add('todoHeader');
    context.element.appendChild(todoHeader);

    const todoHeaderTitle = context.document.createElement('span');
    todoHeaderTitle.innerHTML = 'Todos';
    todoHeaderTitle.classList.add('todoHeader');
    todoHeader.appendChild(todoHeaderTitle);

    const todoHeaderBadge = context.document.createElement('span');
    todoHeaderBadge.innerHTML = data.length;
    todoHeaderBadge.classList.add('countBadge');
    todoHeader.appendChild(todoHeaderBadge);

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
      var attr = context.document.createAttribute('id');
      attr.value = data[todoItem].id;
      todoButton.attributes.setNamedItem(attr);
      todoButton.onclick = function () {
        $.ajax({
          url: context.apiUrl + 'todos/' + this.attributes.id.value + '/mark_as_done',
          type: 'POST',
          success: context.handleTodoMarkedDone.bind(null, context),
          // error: context.handleAPIError.bind(null, this),
          headers: {'Private-Token': apiToken}
        });
      };
      todoCell2.appendChild(todoButton);
    }
  }

  handleTodoMarkedDone (context, data) {
    var row = context
      .element
      .querySelector('button[id="' + data.id + '"]');
    row.parentElement.parentElement.remove();
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
