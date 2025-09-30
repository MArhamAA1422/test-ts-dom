"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
main();
function getData(key) {
    const jsonValue = localStorage.getItem(key);
    const value = jsonValue != null ? JSON.parse(jsonValue) : null;
    return value;
}
function currentUser() {
    return getData('currUser');
}
function loadLoginPage() {
    window.location.href = "../pages/LoginPage.html";
}
function main() {
    const currUser = currentUser();
    if (currUser === null) {
        loadLoginPage();
        return;
    }
    const kanbanBoard = getData('kanbanBoard');
    // console.log(kanbanBoard, typeof kanbanBoard);
    loadKanbanBoard();
    document.querySelector('.js-log-out')
        .addEventListener('click', function () {
        localStorage.removeItem('currUser');
        loadLoginPage();
    });
    document.querySelector('.js-todo-add').addEventListener('click', function () {
        addTask('todo');
    });
    document.querySelector('.js-inprogress-add').addEventListener('click', function () {
        addTask('inprogress');
    });
    document.querySelector('.js-testing-add').addEventListener('click', function () {
        addTask('testing');
    });
    document.querySelector('.js-finished-add').addEventListener('click', function () {
        addTask('finished');
    });
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const taskId = button.dataset.taskId;
            deleteTask(taskId);
        });
    });
    const moveButtons = document.querySelectorAll('.move-button');
    moveButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const taskId = button.dataset.taskId;
            const moveType = button.dataset.moveType;
            // console.log(taskId, moveType);
            setTimeout(async function () {
                await moveTask(taskId, moveType);
            }, 1500);
        });
    });
    const assignedUsersButtons = document.querySelectorAll('.js-assigned-users-button');
    assignedUsersButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const taskId = button.dataset.taskId;
            showAssignedUsers(taskId);
        });
    });
}
function addTask(section) {
    document.querySelector(`.new-task-info-${section}`).classList.remove('hidden');
    document.querySelector(`.add-task-button-${section}`)
        .addEventListener('click', function () {
        // console.log('clicked');
        const taskTitle = document.querySelector(`.js-${section}-title`).value;
        const taskDescription = document.querySelector(`.js-${section}-description`).value;
        // console.log(taskTitle, taskDescription);
        document.querySelector(`.new-task-info-${section}`).classList.add('hidden');
        addTaskToUserBoard(section, taskTitle, taskDescription);
    });
}
function deleteTask(taskId) {
    let kanbanBoard = getData('kanbanBoard');
    kanbanBoard = kanbanBoard.filter(function (task) {
        if (task.id - taskId === 0)
            return false;
        return true;
    });
    // console.log(kanbanBoard);
    setData('kanbanBoard', JSON.stringify(kanbanBoard));
    main();
}
function moveTask(taskId, moveType) {
    let kanbanBoard = getData('kanbanBoard');
    kanbanBoard = kanbanBoard.map(function (task) {
        // console.log(task);
        if (task.id - taskId === 0) {
            task.type = moveType;
        }
        // console.log(task);
        return task;
    });
    // console.log(kanbanBoard);
    setData('kanbanBoard', JSON.stringify(kanbanBoard));
    main();
}
async function showAssignedUsers(taskId) {
    const kanbanBoard = getData('kanbanBoard');
    let usersListHTML = '';
    kanbanBoard.forEach(function (task) {
        if (task.id - taskId === 0) {
            task.assignedUser?.forEach(function (user) {
                usersListHTML += `<div class="userlist-name">${user}</div>`;
            });
        }
    });
    const assignedUsersListElement = document.querySelector(`.js-assigned-users-list-${taskId}`);
    assignedUsersListElement.classList.remove('hidden');
    assignedUsersListElement.innerHTML = usersListHTML;
    await setTimeout(function () {
        assignedUsersListElement.classList.add('hidden');
    }, 2000);
}
function isAlpha(v) {
    if (v >= 'a' && v <= 'z')
        return true;
    if (v >= 'A' && v <= 'Z')
        return true;
    return false;
}
function addTaskToUserBoard(section, title, description) {
    let valid = false;
    const currUser = currentUser();
    for (let c of title) {
        if (isAlpha(c)) {
            valid = true;
        }
    }
    if (!valid) {
        alert('Please write valid task title');
        return;
    }
    let kanbanBoard = getData('kanbanBoard');
    if (!kanbanBoard)
        kanbanBoard = [];
    let ID = getData('taskId');
    if (ID === null)
        ID = 0;
    const id = ID + 1;
    setData('taskId', JSON.stringify(ID + 1));
    switch (section) {
        case 'todo':
            kanbanBoard.push({
                id,
                title,
                type: 'todo',
                createdBy: currUser.username,
                description,
                assignedUser: [],
            });
            break;
        case 'inprogress':
            kanbanBoard.push({
                id,
                title,
                type: 'inprogress',
                createdBy: currUser.username,
                description,
                assignedUser: [],
            });
            break;
        case 'testing':
            kanbanBoard.push({
                id,
                title,
                type: 'testing',
                createdBy: currUser.username,
                description,
                assignedUser: [],
            });
            break;
        case 'finished':
            kanbanBoard.push({
                id,
                title,
                type: 'finished',
                createdBy: currUser.username,
                description,
                assignedUser: [],
            });
    }
    setData('kanbanBoard', JSON.stringify(kanbanBoard));
    main();
}
;
function setData(key, data) {
    localStorage.setItem(key, data);
}
function loadKanbanBoard() {
    const kanbanBoard = getData('kanbanBoard');
    let todoHTML = '';
    let inProgressHTML = '';
    let testingHTML = '';
    let finishedHTML = '';
    if (kanbanBoard) {
        kanbanBoard.forEach(function (task) {
            const description = task.description ? task.description : '';
            if (task.type === 'todo') {
                todoHTML += `
               <div class="task task-${task.id}">
                  <div class="task-title">Title: ${task.title}</div>
                  <div class="task-description">
                     ${description}
                  </div>
                  <div class="task-assigned-users">
                     <button class="assigned-users-button js-assigned-users-button" data-task-id=${task.id}>See Assigned Users</button>

                     <div class="assigned-users-list js-assigned-users-list-${task.id} hidden">
                        <div class="userlist-name"></div>
                     </div>

                     <input class="input-username" placeholder="Write username">
                     <button class="add-user-button">Add User</button>
                  </div>
                  <div class="task-created-by">Created By <span style="font-weight: bold;">${task.createdBy}</span></div>
                     <div class="task-move-button-container">
                        <button class="move-button" data-task-id=${task.id} data-move-type="inprogress">Move To In-Progress</button>
                        <button class="move-button" data-task-id=${task.id} data-move-type="testing">Move To Testing</button>
                        <button class="move-button" data-task-id=${task.id} data-move-type="finished">Move To Finished</button>
                        <button class="delete-button" data-task-id=${task.id}>Delete This Task</button>
                     </div>
               </div>
            `;
            }
            else if (task.type === 'inprogress') {
                inProgressHTML += `
               <div class="task task-${task.id}">
                  <div class="task-title">Title: ${task.title}</div>
                  <div class="task-description">
                     ${description}
                  </div>
                  <div class="task-assigned-users">
                     <button class="assigned-users-button js-assigned-users-button" data-task-id=${task.id}>See Assigned Users</button>

                     <div class="assigned-users-list js-assigned-users-list-${task.id} hidden">
                        <div class="userlist-name"></div>
                     </div>

                     <input class="input-username" placeholder="Write username">
                     <button class="add-user-button">Add User</button>
                  </div>
                  <div class="task-created-by">Created By <span style="font-weight: bold;">${task.createdBy}</span></div>
                     <div class="task-move-button-container">
                        <button class="move-button" data-task-id=${task.id} data-move-type="todo">Move To TODO</button>
                        <button class="move-button" data-task-id=${task.id} data-move-type="testing">Move To Testing</button>
                        <button class="move-button" data-task-id=${task.id} data-move-type="finished">Move To Finished</button>
                        <button class="delete-button" data-task-id=${task.id}>Delete This Task</button>
                     </div>
               </div>
            `;
            }
            else if (task.type === 'testing') {
                testingHTML += `
               <div class="task task-${task.id}">
                  <div class="task-title">Title: ${task.title}</div>
                  <div class="task-description">
                     ${description}
                  </div>
                  <div class="task-assigned-users">
                     <button class="assigned-users-button js-assigned-users-button" data-task-id=${task.id}>See Assigned Users</button>

                     <div class="assigned-users-list js-assigned-users-list-${task.id} hidden">
                        <div class="userlist-name"></div>
                     </div>

                     <input class="input-username" placeholder="Write username">
                     <button class="add-user-button">Add User</button>
                  </div>
                  <div class="task-created-by">Created By <span style="font-weight: bold;">${task.createdBy}</span></div>
                     <div class="task-move-button-container">
                        <button class="move-button" data-task-id=${task.id} data-move-type="todo">Move To TODO</button>
                        <button class="move-button" data-task-id=${task.id} data-move-type="inprogress">Move To In-Progress</button>
                        <button class="move-button" data-task-id=${task.id} data-move-type="finished">Move To Finished</button>
                        <button class="delete-button" data-task-id=${task.id}>Delete This Task</button>
                     </div>
               </div>
            `;
            }
            else if (task.type === 'finished') {
                finishedHTML += `
               <div class="task task-${task.id}">
                  <div class="task-title">Title: ${task.title}</div>
                  <div class="task-description">
                     ${description}
                  </div>
                  <div class="task-assigned-users">
                     <button class="assigned-users-button js-assigned-users-button" data-task-id=${task.id}>See Assigned Users</button>

                     <div class="assigned-users-list js-assigned-users-list-${task.id} hidden">
                        <div class="userlist-name"></div>
                     </div>

                     <input class="input-username" placeholder="Write username">
                     <button class="add-user-button" data-task-id=${task.id}">Add User</button>
                  </div>
                  <div class="task-created-by">Created By <span style="font-weight: bold;">${task.createdBy}</span></div>
                     <div class="task-move-button-container">
                        <button class="move-button" data-task-id=${task.id} data-move-type="todo">Move To TODO</button>
                        <button class="move-button" data-task-id=${task.id} data-move-type="inprogress">Move To In-Progress</button>
                        <button class="move-button" data-task-id=${task.id} data-move-type="testing">Move To Testing</button>
                        <button class="delete-button" data-task-id=${task.id}>Delete This Task</button>
                     </div>
               </div>
            `;
            }
        });
    }
    document.querySelector('.todo-tasks').innerHTML = todoHTML;
    document.querySelector('.inprogress-tasks').innerHTML = inProgressHTML;
    document.querySelector('.testing-tasks').innerHTML = testingHTML;
    document.querySelector('.finished-tasks').innerHTML = finishedHTML;
}
//# sourceMappingURL=KanbanBoard.js.map