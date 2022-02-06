class Tasklist {
    constructor() {
        //UI vars
        this.form = document.querySelector("#task-form");
        this.tasklist = document.querySelector("#tasklist");
        this.clearTasks = document.querySelector("#clear-tasks");
        this.clearCompTasks = document.querySelector("#clear-completed-tasks");
        this.filterEl = document.querySelector("#filter");
        this.taskInput = document.querySelector("#task");

        //app vars
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.deferredReorderEvent = null;

        this.init();
    }

    init() {
        this.tasks.forEach(task => this.renderTask(task));
        this.filterTasks();

        //event listeners
        this.form.addEventListener("submit", (event) => this.add(event));
        this.tasklist.addEventListener("click", (event) => this.remove(event));
        this.tasklist.addEventListener("mouseup", (event) => this.complete(event));
        this.tasklist.addEventListener("drag", (event) => this.reorder(event));
        this.tasklist.addEventListener("dragend", (event) => this.reorder(event));
        this.clearTasks.addEventListener("click", (event) => this.deleteAll(event));
        this.clearCompTasks.addEventListener("click", (event) => this.deleteAllCompleted(event));
        this.filterEl.addEventListener("keyup", (event) => this.filterTasks(event));
    }

    /**
     * reders a single task to the bottom
     * @param {object} task
     */
    renderTask(task) {
        let checked = task.status === 'completed' ? 'checked' : 'pending';

        const html = `
            <li class="d-flex list-group-item list-group-item-action task" data-id="${task.date}" draggable="true">
                <div class="form-check ms-2">
                    <input type="checkbox" ${checked} class="form-check-input" id="task_${task.date}">
                    <label class="form-check-label" for="task_${task.date}">${task.name}</label>
                </div>
                <a href="#" class="ms-auto delete-task text-decoration-none">
                    <i class="far fa-trash-alt"></i>
                </a>
                <a href="#" class="ms-4 d-flex align-items-center text-decoration-none drag-handle">
                    <i class="fas fa-grip-lines"></i>
                </a>
            </li>`;

        let doc = new DOMParser().parseFromString(html.trim(), 'text/html')
        let taskNode = doc.body.querySelector('li');
        this.tasklist.appendChild(taskNode);
    }

    reorder(event) {
        event.preventDefault();

        if (event.target.classList.contains('drag-handle')) {
            event.target.offsetParent.classList.add('dragging');

            const holdingElement = this.tasklist.querySelector('.dragging');
            const draggablePositions = [...this.tasklist.querySelectorAll('li:not(.dragging)')];

            const holdingOverElement = draggablePositions.reduce((closestElement, element) => {
                //check whether the center of the underlying element has been crossed
                const box = element.getBoundingClientRect();
                const offset = event.clientY - box.top - box.height / 2;

                if (offset < 0 && offset > closestElement.offset) {
                    return {offset, element} //if so, return new element with offset
                }

                return closestElement
            }, {offset: Number.NEGATIVE_INFINITY}).element;

            if (event.type === 'dragend') {
                event.target.offsetParent.classList.remove('dragging');

                if (holdingOverElement === undefined) {
                    this.tasklist.appendChild(holdingElement);
                } else {
                    this.tasklist.insertBefore(holdingElement, holdingOverElement);
                }

                const newOrdering = [...this.tasklist.querySelectorAll('label')].map(task => task.innerHTML)
                this.tasks.sort((a, b) => newOrdering.findIndex((task) => task === a.name) - newOrdering.findIndex((task) => task === b.name))
                localStorage.setItem('tasks', JSON.stringify(this.tasks));
            }
        }
    }

    add(event) {
        event.preventDefault();
        console.log(this.taskInput);
        let taskName = this.taskInput.value.trim();

        if (taskName.length) {
            let task = {
                name: taskName,
                status: 'pending',
                date: new Date().getTime(),
                order: '',
            }

            this.tasks.push(task);
            this.renderTask(task);

            this.form.reset();
            localStorage.setItem('tasks', JSON.stringify(this.tasks));

            this.filterTasks();
        }
    }

    remove(event) {
        if (event.target.parentElement.classList.contains('delete-task')) {
            event.preventDefault();
            if (confirm('Delete task: ' + event.target.parentElement.parentElement.textContent.trim())) {
                let date = parseInt(event.target.offsetParent.dataset.id)
                console.log(this.tasks)
                this.tasks = this.tasks.filter(task => task.date !== date)
                event.target.offsetParent.remove()

                localStorage.setItem('tasks', JSON.stringify(this.tasks));
                this.filterTasks();
            }
        }
    }

    complete(event) {
        if (event.target.parentElement.classList.contains('form-check')) {
            let date = parseInt(event.target.offsetParent.dataset.id)
            const task = this.tasks.find(task => task.date === date);
            task.status = task.status === "completed" ? "pending" : "completed";
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        }
    }

    deleteAll() {
        if (confirm('This will delete ALL tasks')) {
            this.tasklist.innerHTML = ''
            localStorage.removeItem('tasks');
            window.location.reload()
        }
    }

    deleteAllCompleted() {
        if (confirm('This will delete ALL COMPLETED tasks')) {
            this.tasks.forEach(task => {
                if (task.status === 'completed')
                    document.querySelector(`[data-id="${task.date}"]`).remove();
            });
            this.tasks = this.tasks.filter(task => task.status !== 'completed');
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
            this.filterTasks();
        }
    }

    filterTasks(event) {
        if (this.tasks.length > 2) {
            document.querySelector('#clear-tasks').style.display = 'inline-block';
            document.querySelector('#clear-completed-tasks').style.display = 'inline-block';
            document.querySelector('#filter-wrapper').style.display = 'block';
        } else {
            document.querySelector('#clear-tasks').style.display = 'none';
            document.querySelector('#clear-completed-tasks').style.display = 'none';
            document.querySelector('#filter-wrapper').style.display = 'none';
        }

        if (event) {
            const text = event.target.value.toLowerCase();
            document.querySelectorAll(".task").forEach(function (task) {
                if (task.querySelector(".form-check-label").textContent.toLowerCase().trim().indexOf(text) !== -1) {
                    task.setAttribute('style', "display: flex !important");
                } else {
                    task.setAttribute('style', "display: none !important ");
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    new Tasklist();
});
