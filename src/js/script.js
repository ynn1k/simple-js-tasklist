//UI vars
const form = document.querySelector("#task-form");
const tasklist = document.querySelector(".tasklist");
const clearTasks = document.querySelector(".clear-tasks");
const filter = document.querySelector("#filter");
const taskInput = document.querySelector("#task");
//app vars
let tasks = [];

class Tasklist {
    static init() {
        if(localStorage.getItem('tasks') !== null) {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }
        
        tasks.forEach(function(task){
            Tasklist.renderTask(task)
        });
        
        Tasklist.filter();
    }

    static renderTask(task) {
        let checked;
        //if(completed.indexOf(task) > -1){checked = "checked"}
        const markup = `
                <li class="d-flex list-group-item task">
                    <div class="form-check">
                        <input type="checkbox" ${checked} class="form-check-input" id="${task}">
                        <label class="form-check-label" for="${task}">${task}</label>
                    </div>
                    <a href="#" class="ml-auto delete-task">
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

    static store() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    static deleteAll() {
        if(confirm('This will delete ALL tasks')) {
            while (tasklist.firstChild) {
                tasklist.removeChild(tasklist.firstChild);
            }
            localStorage.removeItem('tasks');
            localStorage.removeItem('completed');
        }
    }

    static filter(e) {
        if(tasks.length > 1) {
            document.querySelector('.clear-tasks').style.display = 'block';
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
clearTasks.addEventListener("click", Tasklist.deleteAll);
filter.addEventListener("keyup", Tasklist.filter);
