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

//load all event listeners
function loadEventListeners() {
    document.addEventListener('DOMContentLoaded', renderTasks(tasks));
    form.addEventListener("submit", syncTasks);
    tasklist.addEventListener("click", syncTasks);
    clearTasks.addEventListener("click", clearAllTasks);
    filter.addEventListener("keyup", filterTasks);
}
loadEventListeners();

function syncTasks(e) {
    //add task
    if (e.target.id === "task-form") {
        if(taskInput.value === "") {
            alert("No task name given.");
        } else {
            tasks.push(taskInput.value);
            localStorage.setItem('tasks', JSON.stringify(tasks))
            taskInput.value = "";
        }
        e.preventDefault();
    //remove task
    } else if(e.target.parentElement.classList.contains('delete-task')) {
        if(confirm('Delete task:'+e.target.parentElement.parentElement.textContent+'')) {
            tasks.forEach(function (task, i) {
                if(e.target.parentElement.parentElement.textContent === task) {
                    tasks.splice(i, 1);
                }
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
        e.preventDefault();
    }

    while (tasklist.firstChild) {
        tasklist.removeChild(tasklist.firstChild);
    }

    renderTasks(tasks);
}

function renderTasks(tasks) {
    tasks.forEach(function(task){
        //create li elemement
        const li = document.createElement("li");
        li.className = "task";
        li.appendChild(document.createTextNode(task));

        //create wrapping delete link
        const delLink = document.createElement("a");
        delLink.className = "delete-task";
        delLink.innerHTML = "<i class=\"far fa-trash-alt\"></i>";

        //insert li into delition link
        li.appendChild(delLink);

        //append new task-item to list
        tasklist.appendChild(li);
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
        if(task.firstChild.textContent.toLowerCase().indexOf(text) !== -1) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    })
}
