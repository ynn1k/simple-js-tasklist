//UI vars
const form = document.querySelector("#task-form");
const tasklist = document.querySelector(".tasklist");
const clearTasks = document.querySelector(".clear-tasks");
const filter = document.querySelector("#filter");
const taskInput = document.querySelector("#task");

//app vars
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

class Tasklist {
    static init() {
        tasks.forEach(task => Tasklist.renderTask(task));

        Tasklist.filter();//TODO: ???
    }

    /**
     * reders a single task to the bottom
     * @param {object} task
     */
    static renderTask(task) {
        let checked

        if(task.status === 'completed') {
            checked = 'checked'
        } else {
            checked = 'pending'
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

        let doc = new DOMParser().parseFromString(html.trim(), 'text/html')
        let taskNode = doc.body.querySelector('li');
        tasklist.appendChild(taskNode);
    }

    static add(event) {
        event.preventDefault();
        let taskName = taskInput.value.trim();

        if(taskName.length) {
            let task = {
                name: taskName,
                status: 'pending',
                date: new Date().getTime(),
                order: '',
            }

            tasks.push(task);
            Tasklist.renderTask(task);

            form.reset();
            localStorage.setItem('tasks', JSON.stringify(tasks));

            Tasklist.filter();
        }
    }

    static remove(event) {
        if(event.target.parentElement.classList.contains('delete-task')){
            event.preventDefault();
            if(confirm('Delete task: ' + event.target.parentElement.parentElement.textContent.trim())) {
                let date = parseInt(event.target.offsetParent.dataset.id)
                tasks = tasks.filter(task => task.date !== date)
                event.target.offsetParent.remove()

                localStorage.setItem('tasks', JSON.stringify(tasks));
                Tasklist.filter();
            }
        }
    }

    static complete(event) {
        if(event.target.parentElement.classList.contains('form-check')){
            let date = parseInt(event.target.offsetParent.dataset.id)
            tasks.find(task => task.date === date).status = 'completed';
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    static deleteAll() {
        if(confirm('This will delete ALL tasks')) {
            tasklist.innerHTML = ''
            localStorage.removeItem('tasks');
            window.location.reload()
        }
    }

    static filter(event) {
        if(tasks.length > 2) {
            document.querySelector('.clear-tasks').style.display = 'inline-block';
            document.querySelector('.filter-wrapper').style.display = 'block';
        } else {
            document.querySelector('.clear-tasks').style.display = 'none';
            document.querySelector('.filter-wrapper').style.display = 'none';
        }

        if(event){
            const text = event.target.value.toLowerCase();
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
