//UI vars
const form = document.querySelector("#task-form");
const tasklist = document.querySelector(".tasklist");
const clearTasks = document.querySelector(".clear-tasks");
const filter = document.querySelector("#filter");
const taskInput = document.querySelector("#task");
//Application vars
let tasks = [];
if(JSON.parse(localStorage.getItem('tasks')) !== null) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
}
let completed = [];
if(JSON.parse(localStorage.getItem('completed')) !== null) {
    completed = JSON.parse(localStorage.getItem('completed'));
}

//event listeners
function loadEventListeners() {
    document.addEventListener('DOMContentLoaded', renderTasks(tasks));
    form.addEventListener("submit", syncTasks);
    tasklist.addEventListener("click", syncTasks);
    clearTasks.addEventListener("click", clearAllTasks);
    filter.addEventListener("keyup", filterTasks);
}
loadEventListeners();

function syncTasks(e) {
    if( e.target.id === "task-form" ||
        e.target.parentElement.classList.contains('delete-task') ||
        e.target.classList.contains('form-check-input')) {
        //add task
        if (e.target.id === "task-form") {
            if(taskInput.value === "") {
                alert("No task name given.");
            } else {
                tasks.push(taskInput.value);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                taskInput.value = "";
            }
            e.preventDefault();
        //remove task
        } else if(e.target.parentElement.classList.contains('delete-task')) {
            if(confirm('Delete task: ' + e.target.parentElement.parentElement.textContent.trim())) {
                tasks.forEach(function (task, i) {
                    if(e.target.parentElement.parentElement.textContent.trim() === task) {
                        tasks.splice(i, 1);
                    }
                });
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
            e.preventDefault();
        //complete task
        } else if(e.target.classList.contains('form-check-input')) {

            if(completed.indexOf(e.target.id) > -1) {
                completed.splice(completed.indexOf(e.target.id), 1);
            } else {
                completed.push(e.target.id);
            }

            localStorage.setItem('completed', JSON.stringify(completed));
        }

        while (tasklist.firstChild) {
            tasklist.removeChild(tasklist.firstChild);
        }
        filter.value = "";
        renderTasks(tasks);
    }
}

function renderTasks(tasks) {
    tasks.forEach(function(task){
        let checked;
        if(completed.indexOf(task) > -1){checked = "checked"}
        const markup = `
            <li class="d-flex list-group-item task">
                <div class="form-check">
                    <input type="checkbox" ${checked} class="form-check-input" id="${task}">
                    <label class="form-check-label" for="${task}">${task}</label>
                </div>
                <a href="#" class="ml-auto delete-task">
                    <i class="far fa-trash-alt"></i>
                </a>
            </li>
        `;
        const frag = document.createRange().createContextualFragment(markup.trim());
        tasklist.appendChild(frag);
    });

    if(tasks.length > 1) {
        document.querySelector('.clear-tasks').style.display = 'block';
        document.querySelector('.filter-wrapper').style.display = 'block';
    } else {
        document.querySelector('.clear-tasks').style.display = 'none';
        document.querySelector('.filter-wrapper').style.display = 'none';
    }
}

function clearAllTasks() {
    if(confirm('This will delete ALL tasks')) {
        while (tasklist.firstChild) {
            tasklist.removeChild(tasklist.firstChild);
        }
    }

    localStorage.clear();
}

function filterTasks(e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(".task").forEach(function(task){
        if(task.querySelector(".form-check-label").textContent.toLowerCase().trim().indexOf(text) !== -1) {
            task.setAttribute( 'style', "display: flex !important");
        } else {
            task.setAttribute( 'style', "display: none !important ");
        }
    })
}
