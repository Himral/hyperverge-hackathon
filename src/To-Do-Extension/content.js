class TodoList extends HTMLElement {
  static styles = `
    <style>
      :host {
        display: block;
        width: 100%;
        max-width: 600px;
        margin: auto;
        font-family: Arial, sans-serif;
      }
      #tasks {
        margin-top: 20px;
      }
      .task {
        display: flex;
        align-items: center;
        padding: 10px;
        border: 1px solid #ccc;
        margin-bottom: 10px;
        border-radius: 4px;
        background-color: rgba(241, 229, 209, 0.1);
      }
      .task.completed {
        background-color: rgba(241, 229, 209, 0.1);
      }
      .task span {
        flex-grow: 1;
        margin-left: 10px;
        text-decoration: none;
        font-size: 15px;
      }
      .task.completed span {
        text-decoration: line-through;
        color: #888;
      }
      .delete {
        border: none;
        background: none;
        cursor: pointer;
        color: red;
        margin-left: 10px;
      }
      .delete:hover {
        color: darkred;
      }
    </style>
  `;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.init();
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${TodoList.styles}
      <div id="newtask">
        <input type="text" placeholder="Add a new task">
        <button id="push">Add Task</button>
      </div>
      <div id="tasks"></div>
    `;
  }

  init() {
    const pushButton = this.shadowRoot.querySelector('#push');
    const newTaskInput = this.shadowRoot.querySelector('#newtask input');
    const tasksContainer = this.shadowRoot.querySelector('#tasks');

    pushButton.addEventListener('click', () => {
      if (newTaskInput.value.length === 0) {
        alert('Please Enter a Task');
      } else {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        taskDiv.innerHTML = `
          <input type="checkbox">
          <span id="taskname">${newTaskInput.value}</span>
          <button class="delete">
            <i class="far fa-trash-alt"></i>
          </button>
        `;

        tasksContainer.appendChild(taskDiv);

        // Checkbox event listener to toggle completed class
        taskDiv.querySelector('input[type="checkbox"]').addEventListener('change', function() {
          if (this.checked) {
            this.parentNode.classList.add('completed');
          } else {
            this.parentNode.classList.remove('completed');
          }
        });

        // Delete button event listener
        taskDiv.querySelector('.delete').addEventListener('click', function() {
          this.parentNode.remove();
        });

        newTaskInput.value = '';
      }
    });
  }
}

customElements.define('todo-list', TodoList);
