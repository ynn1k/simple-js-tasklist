//UI vars
const form = document.querySelector("#task-form");
const tasklist = document.querySelector(".tasklist");
const clearTasks = document.querySelector(".clear-tasks");
const filter = document.querySelector("#filter");
const taskInput = document.querySelector("#task");

//load all event listeners
function loadEventListeners() {
    document.addEventListener('DOMContentLoaded', getTasks);
    form.addEventListener("submit", addTask);
    tasklist.addEventListener("click", removeTask);
    clearTasks.addEventListener("click", clearAllTasks);
    filter.addEventListener("keyup", filterTasks);
}
loadEventListeners();

function getTasks() {
    let tasks;

    if(localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function(task){
        //create li elemement
        const li = document.createElement("li");
        li.className = "task";
        li.appendChild(document.createTextNode(task));

        //create wrapping deleting link
        const delLink = document.createElement("a");
        delLink .className = "delete-task";
        delLink .innerHTML = "<i class=\"far fa-trash-alt\"></i>";

        //insert li into delition link
        li.appendChild(delLink );

        //append new task-item to list
        tasklist.appendChild(li)
    });
}

// add a task
function addTask(e) {
    if(taskInput.value === "") {
        alert("No task name given.");
        e.preventDefault();
    } else {
        //create li elemement
        const li = document.createElement("li");
        li.className = "task";
        li.appendChild(document.createTextNode(taskInput.value));

        //create wrapping deleting link
        const delLink = document.createElement("a");
        delLink .className = "delete-task";
        delLink .innerHTML = "<i class=\"far fa-trash-alt\"></i>";

        //insert li into delition link
        li.appendChild(delLink );

        //append new task-item to list
        tasklist.appendChild(li)

        storeTaskLS(taskInput.value);

        taskInput.value = "";
        e.preventDefault();
    }
};

function storeTaskLS(task) {
    let tasks;

    if(localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function removeTask(e) {
    if(e.target.parentElement.classList.contains('delete-task')) {
        if(confirm('Delete task:'+e.target.parentElement.parentElement.textContent+'')) {
            e.target.parentElement.parentElement.remove();
            removeTaskLS(e.target.parentElement.parentElement);
        }
    }
};

function removeTaskLS(taskToRemove) {
    let tasks;

    if(localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function (task, i) {
        if(taskToRemove.textContent === task) {
            tasks.splice(i, 1);
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function clearAllTasks() {
    if(confirm('This will delete ALL tasks')) {
        while (tasklist.firstChild) {
            tasklist.removeChild(tasklist.firstChild);
        }
    }

    localStorage.clear();
};

function filterTasks(e) {
    const text = e.target.value.toLowerCase();

    document.querySelectorAll(".task").forEach(function(task){
        if(task.firstChild.textContent.toLowerCase().indexOf(text) !== -1) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    })
};