// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

if (taskList === null) {
    tasklist = [];
}
if (nextId === null) {
    nextId = 1;
}

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const newTaskId = nextId;
    nextId += 1;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return newTaskId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let statusClass = "";
    switch (task.status) {
        case "todo":
            statusClass = "task-todo";
            break;
        case "in-progress":
            statusClass = "task-in-progress";
            break;
        case "done":
            statusClass = "task-done";
            break;
    }
    return `
    <div class="task-card ${statusClass}" data-id="${task.id}">
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Due: ${task.dueDate}</p>
        <button onclick="handleDeleteTask(event)">Delete</button>
    </div>
    `;


}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    taskList.foreach(task => {
        const taskcard = createTaskCard(task);
        $('#${task.status}-cards').append(taskcard)
    });

    $(".task-card").draggable({
        revert: "invalid",
        helper: "clone"


    });

}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    const title = $("#task-title").val();
    const description = $("#task-description").val();
    const dueDate = $("#task-due-date").val();

    if (title && dueDate) {
        const newTask = {
            id: generateTaskId(),
            title: title,
            description: description,
            dueDate: dueDate,
            status: "todo"
        };

        taskList.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(taskList));

        renderTaskList();
        $("#task-form")[0].reset();
        $("addTaskModal").modal('hide');
    } else {
        alert("Title and due date are required!");
    }
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(event.target).closest('.task-card').data('id');
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList();

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = $(ui.draggable).data('id');
    const newStatus = $(this).attr('id').split('-')[0];

    const task = taskList.find(task => task.id === taskid);
    if (task) {
        task.status = newStatus
        localStorage.setItem("tasks", JSON.stringify(taskList));

        renderTaskList();
    }

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $("#task-form").on("submit", handleAddTask);
    $("#task-due-date").datepicker();

});
