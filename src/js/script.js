//UI vars
const taskListForm = document.querySelector('#tasklist-form');
const taskListInput = document.querySelector('#tasklist');
const accordian = document.querySelector('#accordionTaskList');

//app vars
let tasklists = JSON.parse(localStorage.getItem('tasklists')) || {};
let selected = 0;
let tasklistId = 1;

function addTaskList(event) {
  //If it is page load just render the collapse stuff
  if (event.target == document) {
    for (let list in tasklists) {
      tasklists[list].rendered = false;
      const html = `
                <div>
                  <div class="card">
                    <div class="card-header" id="heading${list}">
                      <h5 class="mb-0">
                        <button
                          class="btn btn-link"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse${list}"
                          aria-expanded="true"
                          aria-controls="collapse${list}"
                          data-indexNum=${list}
                        >
                          ${tasklists[list].name}
                        </button>
                      </h5>
                    </div>

                    <div id="collapse${list}" class="collapse" aria-labelledby="heading${list}" data-bs-parent="#accordionTaskList">
                      <div class="card-body">
                        <div class="form-floating" id="filter-wrapper${list}">
                          <input type="text" name="filter${list}" id="filter${list}" class="form-control" placeholder="filter" />
                          <label for="filter${list}">Search for task</label>
                        </div>

                        <ol class="list-group list-group-numbered mt-3 mb-3" id="tasklist${list}"></ol>

                        <a href="#" class="btn btn-sm btn-outline-danger" id="clear-tasks${list}">Clear tasks</a>
                        <a href="#" class="btn btn-sm btn-outline-danger" id="clear-comp-tasks${list}">Clear completed tasks</a>

                        <hr />

                        <form id="task-form${list}" class="d-flex">
                          <div class="form-floating d-flex flex-fill">
                            <input type="text" name="task" id="task${list}" class="form-control me-3" placeholder="New Task" />
                            <label for="task${list}">Name new task</label>
                          </div>
                          <input type="submit" class="btn btn-success" value="Add new task" />
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        `;

      let doc = new DOMParser().parseFromString(html.trim(), 'text/html');
      let taskListNode = doc.body.querySelector('div');
      accordian.appendChild(taskListNode);

      const taskform = accordian.querySelector(`#task-form${list}`);
      const tasklist = accordian.querySelector(`#tasklist${list}`);
      const clearTasks = accordian.querySelector(`#clear-tasks${list}`);
      const clearCompTasks = accordian.querySelector(`#clear-comp-tasks${list}`);
      const filter = accordian.querySelector(`#filter${list}`);

      taskListNode.querySelector('button').addEventListener('click', (event) => {
        selected = event.target.dataset.indexnum;
        Tasklist.init();
      });

      taskform.addEventListener('click', Tasklist.add);
      tasklist.addEventListener('click', Tasklist.remove);
      tasklist.addEventListener('mouseup', Tasklist.complete);
      clearTasks.addEventListener('click', Tasklist.deleteAll);
      clearCompTasks.addEventListener('click', Tasklist.deleteAllCompleted);
      filter.addEventListener('keyup', Tasklist.filter);
    }
  } else {
    event.preventDefault();

    const taskListName = taskListInput.value.trim();

    const html = `
              <div>
                <div class="card">
                  <div class="card-header" id="heading${tasklistId}">
                    <h5 class="mb-0">
                      <button
                        class="btn btn-link"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse${tasklistId}"
                        aria-expanded="true"
                        aria-controls="collapse${tasklistId}"
                        data-indexNum=${tasklistId}
                      >
                        ${taskListName}
                      </button>
                    </h5>
                  </div>

                  <div id="collapse${tasklistId}" class="collapse" aria-labelledby="heading${tasklistId}" data-bs-parent="#accordionTaskList">
                    <div class="card-body">
                      <div class="form-floating" id="filter-wrapper${tasklistId}">
                        <input type="text" name="filter${tasklistId}" id="filter${tasklistId}" class="form-control" placeholder="filter" />
                        <label for="filter${tasklistId}">Search for task</label>
                      </div>

                      <ol class="list-group list-group-numbered mt-3 mb-3" id="tasklist${tasklistId}"></ol>

                      <a href="#" class="btn btn-sm btn-outline-danger" id="clear-tasks${tasklistId}">Clear tasks</a>
                      <a href="#" class="btn btn-sm btn-outline-danger" id="clear-comp-tasks${tasklistId}">Clear completed tasks</a>

                      <hr />

                      <form id="task-form${tasklistId}" class="d-flex">
                        <div class="form-floating d-flex flex-fill">
                          <input type="text" name="task" id="task${tasklistId}" class="form-control me-3" placeholder="New Task" />
                          <label for="task${tasklistId}">Name new task</label>
                        </div>
                        <input type="submit" class="btn btn-success" value="Add new task" />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      `;

    let doc = new DOMParser().parseFromString(html.trim(), 'text/html');
    let taskListNode = doc.body.querySelector('div');
    accordian.appendChild(taskListNode);

    const taskform = accordian.querySelector(`#task-form${tasklistId}`);
    const tasklist = accordian.querySelector(`#tasklist${tasklistId}`);
    const clearTasks = accordian.querySelector(`#clear-tasks${tasklistId}`);
    const clearCompTasks = accordian.querySelector(`#clear-comp-tasks${tasklistId}`);
    const filter = accordian.querySelector(`#filter${tasklistId}`);

    taskListNode.querySelector('button').addEventListener('click', (event) => {
      selected = event.target.dataset.indexnum;
      Tasklist.init();
    });

    taskform.addEventListener('click', Tasklist.add);
    tasklist.addEventListener('click', Tasklist.remove);
    tasklist.addEventListener('mouseup', Tasklist.complete);
    clearTasks.addEventListener('click', Tasklist.deleteAll);
    clearCompTasks.addEventListener('click', Tasklist.deleteAllCompleted);
    filter.addEventListener('keyup', Tasklist.filter);

    tasklists[tasklistId] = {
      name: taskListName,
      tasks: [],
    };
    ++tasklistId;
    localStorage.setItem('tasklists', JSON.stringify(tasklists));
  }
}

class Tasklist {
  static init() {
    //Only render tasks from init once otherwise tasks added everytime tasklist is opened
    if (!('rendered' in tasklists[selected]) || tasklists[selected].rendered == false) {
      tasklists[selected].rendered = true;
      localStorage.setItem('tasklists', JSON.stringify(tasklists));
      tasklists[selected].tasks.forEach((task) => Tasklist.renderTask(task));
    }
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
    document.querySelector(`#tasklist${selected}`).appendChild(taskNode);
  }

  static add(event) {
    event.preventDefault();

    let taskName = document.querySelector(`#task${selected}`).value.trim();

    if (taskName.length) {
      let task = {
        name: taskName,
        status: 'pending',
        date: new Date().getTime(),
        order: '',
      };

      tasklists[selected].tasks.push(task);
      Tasklist.renderTask(task);

      document.querySelector(`#task-form${selected}`).reset();
      localStorage.setItem('tasklists', JSON.stringify(tasklists));

      Tasklist.filter();
    }
  }

  static remove(event) {
    if (event.target.parentElement.classList.contains('delete-task')) {
      event.preventDefault();
      if (confirm('Delete task: ' + event.target.parentElement.parentElement.textContent.trim())) {
        let date = parseInt(event.target.offsetParent.dataset.id);
        tasklists[selected].tasks = tasklists[selected].tasks.filter((task) => task.date !== date);
        event.target.offsetParent.remove();

        localStorage.setItem('tasklists', JSON.stringify(tasklists));
        Tasklist.filter();
      }
    }
  }

  static complete(event) {
    if (event.target.parentElement.classList.contains('form-check')) {
      let date = parseInt(event.target.offsetParent.dataset.id);
      tasklists[selected].tasks.find((task) => task.date === date).status = 'completed';
      localStorage.setItem('tasklists', JSON.stringify(tasklists));
    }
  }

  static deleteAll() {
    if (confirm('This will delete ALL tasks')) {
      document.querySelector(`#tasklist${selected}`).innerHTML = '';
      tasklists[selected].tasks.splice(0, tasklists[selected].tasks.length);
      localStorage.setItem('tasklists', JSON.stringify(tasklists));
      window.location.reload();
    }
  }

  static deleteAllCompleted() {
    if (confirm('This will delete ALL completed tasks')) {
      tasklists[selected].tasks.forEach((task) => {
        if (task.status === 'completed') document.querySelector(`[data-id="${task.date}"]`).remove();
      });
      tasklists[selected].tasks = tasklists[selected].tasks.filter((task) => task.status !== 'completed');
      localStorage.setItem('tasklists', JSON.stringify(tasklists));
      Tasklist.filter();
    }
  }

  static filter(event) {
    if (tasklists[selected].tasks.length > 2) {
      document.querySelector(`#clear-tasks${selected}`).style.display = 'inline-block';
      document.querySelector(`#clear-comp-tasks${selected}`).style.display = 'inline-block';
      document.querySelector(`#filter-wrapper${selected}`).style.display = 'block';
    } else {
      document.querySelector(`#clear-tasks${selected}`).style.display = 'none';
      document.querySelector(`#clear-comp-tasks${selected}`).style.display = 'none';
      document.querySelector(`#filter-wrapper${selected}`).style.display = 'none';
    }

    if (event) {
      const text = event.target.value.toLowerCase();
      document.querySelectorAll(`#tasklist${selected}`).forEach(function (task) {
        if (task.querySelector('.form-check-label').textContent.toLowerCase().trim().indexOf(text) !== -1) {
          task.setAttribute('style', 'display: flex !important');
        } else {
          task.setAttribute('style', 'display: none !important ');
        }
      });
    }
  }
}

//tasklist event listener
document.addEventListener('DOMContentLoaded', addTaskList);
taskListForm.addEventListener('submit', addTaskList);
