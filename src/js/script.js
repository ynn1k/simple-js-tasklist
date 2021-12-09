//UI vars
const form = document.querySelector("#task-form");
const tasklist = document.querySelector(".tasklist");
const clearTasks = document.querySelector(".clear-tasks");
const filter = document.querySelector("#filter");
const taskInput = document.querySelector("#task");

//app vars
let tasks = [];
let completed = [];

class Tasklist {
    static init() {
        if(localStorage.getItem('tasks') !== null) {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }

        if(localStorage.getItem('completed') !== null) {
            completed = JSON.parse(localStorage.getItem('completed'));
        }

        tasks.forEach(function(task){
            Tasklist.renderTask(task)
        });
        
        Tasklist.filter();
    }

    static renderTask(task) {
        let checked;
        if(completed.indexOf(task) > -1){checked = "checked"}
        const markup = `
                <li class="d-flex list-group-item list-group-item-action task">
                    <div class="form-check ms-1">
                        <input type="checkbox" ${checked} class="form-check-input" id="${task}">
                        <label class="form-check-label" for="${task}">${task}</label>
                    </div>
                    <a href="#" class="ms-auto delete-task">
                        <i class="far fa-trash-alt"></i>
                    </a>
                </li>`;
        const frag = document.createRange().createContextualFragment(markup.trim());
        tasklist.appendChild(frag);
    }

    static add(e) {
        e.preventDefault();

        if(taskInput.value === "") {
            alert("No task name given.");
        } else {
            tasks.push(taskInput.value);
            Tasklist.renderTask(taskInput.value);
            taskInput.value = "";
            Tasklist.store(tasks);
            Tasklist.filter();
        }
    }

    static remove(e) {
        if(e.target.parentElement.classList.contains('delete-task')){
            e.preventDefault();
            if(confirm('Delete task: ' + e.target.parentElement.parentElement.textContent.trim())) {
                tasks.forEach(function (task, i) {
                    if(e.target.parentElement.parentElement.textContent.trim() === task) {
                        e.target.parentElement.parentElement.remove();
                        tasks.splice(i, 1);
                    }
                });
                Tasklist.store();
                Tasklist.filter();
            }
        }
    }

    static complete(e) {
        if(e.target.parentElement.classList.contains('form-check')){
            if(completed.includes(e.target.parentElement.parentElement.textContent.trim())) {
                completed.forEach(function (task, i) {
                    if(e.target.parentElement.parentElement.textContent.trim() === task) {
                        completed.splice(i, 1);
                    }
                });
            } else {
                completed.push(e.target.parentElement.parentElement.textContent.trim());
            }
            Tasklist.store();
        }
    }

    static store() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('completed', JSON.stringify(completed));
    }

    static deleteAll() {
        if(confirm('This will delete ALL tasks')) {
            while (tasklist.firstChild) {
                tasklist.removeChild(tasklist.firstChild);
            }
            localStorage.removeItem('tasks');
            localStorage.removeItem('completed');
            tasks = [];
            Tasklist.init();
        }
    }

    static filter(e) {
        if(tasks.length > 1) {
            document.querySelector('.clear-tasks').style.display = 'inline-block';
            document.querySelector('.filter-wrapper').style.display = 'block';
        } else {
            document.querySelector('.clear-tasks').style.display = 'none';
            document.querySelector('.filter-wrapper').style.display = 'none';
        }

        if(e){
            const text = e.target.value.toLowerCase();
            document.querySelectorAll(".task").forEach(function(task){
                if(task.querySelector(".form-check-label").textContent.toLowerCase().trim().indexOf(text) !== -1) {
                    task.setAttribute( 'style', "display: flex !important");
                } else {
                    task.setAttribute( 'style', "display: none !important ");
                }
            });
        }
    }
}

//event listeners
document.addEventListener('DOMContentLoaded', Tasklist.init);
form.addEventListener("submit", Tasklist.add);
tasklist.addEventListener("click", Tasklist.remove);
tasklist.addEventListener("mouseup", Tasklist.complete);
clearTasks.addEventListener("click", Tasklist.deleteAll);
filter.addEventListener("keyup", Tasklist.filter);

if (module.hot) {
    module.hot.dispose(function () {
        window.location.reload();
    });
}
