//UI vars
const form = document.querySelector('#task-form');
const tasklist = document.querySelector('.tasklist');
const clearTasks = document.querySelector('.clear-tasks');
const clearCompTasks = document.querySelector('.clear-comp-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');
const mainUi = document.querySelector('#mainUi');

//app vars
let tasklists = JSON.parse(localStorage.getItem('tasklists')) || [];
let selected = 0;

function addTaskList(params) {
  let html = `
            <div class="accordion" id="accordionExample">
              <div class="card">
                <div class="card-header" id="headingOne">
                  <h5 class="mb-0">
                    <button
                      class="btn btn-link"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      Collapsible Group Item #1
                    </button>
                  </h5>
                </div>

                <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div class="card-body">testing</div>
                </div>
              </div>
            </div>
            <div class="form-floating filter-wrapper">
              <input type="text" name="filter" id="filter" class="form-control" placeholder="filter" />
              <label for="filter">Search for task</label>
            </div>

            <ol class="list-group list-group-numbered mt-3 mb-3 tasklist"></ol>

            <a href="#" class="btn btn-sm btn-outline-danger clear-tasks">Clear tasks</a>
            <a href="#" class="btn btn-sm btn-outline-danger clear-comp-tasks">Clear completed tasks</a>
            <hr />

            <form id="task-form" class="d-flex">
              <div class="form-floating d-flex flex-fill">
                <input type="text" name="task" id="task" class="form-control me-3" placeholder="New Task" />
                <label for="task">Name new task</label>
              </div>
              <input type="submit" class="btn btn-success" value="Add new task" />
            </form>
          </div>
    `;
}

class Tasklist {
  static init() {
    tasklists[selected].forEach((task) => Tasklist.renderTask(task));
    Tasklist.filter(); //TODO: ???
  }

  /**
   * reders a single task to the bottom
   * @param {object} task
   */
  static renderTask(task) {
    let checked;

    if (task.status === 'completed') {
      checked = 'checked';
    } else {
      checked = 'pending';
    }

    const html = `
            <li class="d-flex list-group-item list-group-item-action task" data-id="${task.date}">
                <div class="form-check ms-1">
                    <input type="checkbox" ${checked} class="form-check-input" id="task_${task.date}">
                    <label class="form-check-label" for="task_${task.date}">${task.name}</label>
                </div>
                <a href="#" class="ms-auto delete-task">
                    <i class="far fa-trash-alt"></i>
                </a>
            </li>`;

    let doc = new DOMParser().parseFromString(html.trim(), 'text/html');
    let taskNode = doc.body.querySelector('li');
    tasklist.appendChild(taskNode);
  }

  static add(event) {
    event.preventDefault();
    let taskName = taskInput.value.trim();

    if (taskName.length) {
      let task = {
        name: taskName,
        status: 'pending',
        date: new Date().getTime(),
        order: '',
      };

      tasklists[selected].push(task);
      Tasklist.renderTask(task);

      form.reset();
      localStorage.setItem('tasklists', JSON.stringify(tasklists));

      Tasklist.filter();
    }
  }

  static remove(event) {
    if (event.target.parentElement.classList.contains('delete-task')) {
      event.preventDefault();
      if (confirm('Delete task: ' + event.target.parentElement.parentElement.textContent.trim())) {
        let date = parseInt(event.target.offsetParent.dataset.id);
        tasklists[selected] = tasklists[selected].filter((task) => task.date !== date);
        event.target.offsetParent.remove();

        localStorage.setItem('tasklists', JSON.stringify(tasklists));
        Tasklist.filter();
      }
    }
  }

  static complete(event) {
    if (event.target.parentElement.classList.contains('form-check')) {
      let date = parseInt(event.target.offsetParent.dataset.id);
      tasklists[selected].find((task) => task.date === date).status = 'completed';
      localStorage.setItem('tasklists', JSON.stringify(tasklists));
    }
  }

  static deleteAll() {
    if (confirm('This will delete ALL tasks')) {
      tasklist.innerHTML = '';
      localStorage.removeItem('tasklists');
      window.location.reload();
    }
  }

  static deleteAllCompleted() {
    if (confirm('This will delete ALL completed tasks')) {
      tasklists[selected].forEach((task) => {
        if (task.status === 'completed') document.querySelector(`[data-id="${task.date}"]`).remove();
      });
      tasklists[selected] = tasklists[selected].filter((task) => task.status !== 'completed');
      localStorage.setItem('tasklists', JSON.stringify(tasklists));
      Tasklist.filter();
    }
  }

  static filter(event) {
    if (tasklists[selected].length > 2) {
      document.querySelector('.clear-tasks').style.display = 'inline-block';
      document.querySelector('.clear-comp-tasks').style.display = 'inline-block';
      document.querySelector('.filter-wrapper').style.display = 'block';
    } else {
      document.querySelector('.clear-tasks').style.display = 'none';
      document.querySelector('.clear-comp-tasks').style.display = 'none';
      document.querySelector('.filter-wrapper').style.display = 'none';
    }

    if (event) {
      const text = event.target.value.toLowerCase();
      document.querySelectorAll('.task').forEach(function (task) {
        if (task.querySelector('.form-check-label').textContent.toLowerCase().trim().indexOf(text) !== -1) {
          task.setAttribute('style', 'display: flex !important');
        } else {
          task.setAttribute('style', 'display: none !important ');
        }
      });
    }
  }
}

//event listeners
form.addEventListener('submit', Tasklist.add);
tasklist.addEventListener('click', Tasklist.remove);
tasklist.addEventListener('mouseup', Tasklist.complete);
clearTasks.addEventListener('click', Tasklist.deleteAll);
clearCompTasks.addEventListener('click', Tasklist.deleteAllCompleted);
filter.addEventListener('keyup', Tasklist.filter);
