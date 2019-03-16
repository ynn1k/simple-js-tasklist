//UI vars
const form = document.querySelector("#task-form");
const tasklist = document.querySelector(".tasklist");
const clearTasks = document.querySelector(".clear-tasks");
const filter = document.querySelector("#filter");
const taskInput = document.querySelector("#task");

//load all event listeners
loadEventListeners();
function loadEventListeners() {
    form.addEventListener("submit", addTask);
    tasklist.addEventListener("click", removeTask);
    clearTasks.addEventListener("click", clearAllTasks);
    filter.addEventListener("keyup", filterTasks);

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
        taskInput.value = "";

        e.preventDefault();
    }
};

function removeTask(e) {
    if(e.target.parentElement.classList.contains('delete-task')) {
        if(confirm('Delete task:'+e.target.parentElement.parentElement.textContent+'')) {
            e.target.parentElement.parentElement.remove();
        }
        console.log(e.target);
    }
};

function clearAllTasks() {
    if(confirm('This will delete ALL tasks')) {
        while (tasklist.firstChild) {
            tasklist.removeChild(tasklist.firstChild);
        }
    }
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
}