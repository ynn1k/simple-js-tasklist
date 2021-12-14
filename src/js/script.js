class Tasklist {
    constructor() {
        this.form = document.querySelector("#task-form");
        this.tasklist = document.querySelector(".tasklist");
        this.clearTasks = document.querySelector(".clear-tasks");
        this.filterEl = document.querySelector("#filter");
        this.taskInput = document.querySelector("#task");
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || []

        this.loadTasks();
        this.bindEvents();
    
        this.filter = this.filter.bind(this);
    }

    loadTasks() {
        this.tasks.forEach(task => this.renderTask(task));
        this.filter();
    }

    bindEvents() {
        this.form.addEventListener("submit", (e) => this.add(e));
        this.tasklist.addEventListener("click", (e) => this.remove(e));
        this.tasklist.addEventListener("mouseup", (e) => this.complete(e));
        this.clearTasks.addEventListener("click", (e) => this.deleteAll(e));
        this.filterEl.addEventListener("keyup", (e) => this.filter(e));
    }

    renderTask(task) {
        let checked = task.status === 'completed' ? 'checked' : "pending";
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
        this.tasklist.appendChild(taskNode);
    }

    add(event) {
        event.preventDefault();
        let taskName = this.taskInput.value.trim();

        if(taskName.length) {
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

            this.filter();
        }
    }

    remove(event) {
        if(event.target.parentElement.classList.contains('delete-task')){
            event.preventDefault();
            if(confirm('Delete task: ' + event.target.parentElement.parentElement.textContent.trim())) {
                let date = parseInt(event.target.offsetParent.dataset.id)
                this.tasks = this.tasks.filter(task => task.date !== date)
                event.target.offsetParent.remove()

                localStorage.setItem('tasks', JSON.stringify(this.tasks));
                this.filter();
            }
        }
    }

    complete(event) {
        if(event.target.parentElement.classList.contains('form-check')){
            let date = parseInt(event.target.offsetParent.dataset.id)
            this.tasks.find(task => task.date === date).status = 'completed';
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        }
    }

    deleteAll() {
        if(confirm('This will delete ALL tasks')) {
            this.tasklist.innerHTML = ''
            localStorage.removeItem('tasks');
            window.location.reload()
        }
    }

    filter(event) {
        if(this.tasks.length > 2) {
            document.querySelector('.clear-tasks').style.display = 'inline-block';
            document.querySelector('.filter-wrapper').style.display = 'block';
        } else {
            document.querySelector('.clear-tasks').style.display = 'none';
            document.querySelector('.filter-wrapper').style.display = 'none';
        }

        if(event){
            const text = event.target.value.toLowerCase();
            document.querySelectorAll(".task").forEach(function(task){
                const label = task.querySelector(".form-check-label");
                if(label.textContent.toLowerCase().trim().indexOf(text) !== -1) {
                    task.setAttribute( 'style', "display: flex !important");
                    return;
                } 
                task.setAttribute( 'style', "display: none !important ");
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new Tasklist();  
});