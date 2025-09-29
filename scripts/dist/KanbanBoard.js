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
function getCurrentUserBoard(currUser) {
    const KanbanBoard = getData('kanbanBoard');
    if (KanbanBoard === null) {
        return null;
    }
    let currUserBoard = null;
    for (let key of KanbanBoard) {
        if (key === currUser.id) {
            currUserBoard = key;
            break;
        }
    }
    return currUserBoard;
}
function main() {
    const currUser = currentUser();
    const userBoard = getCurrentUserBoard(currUser);
    console.log(userBoard);
    loadKanbanBoard(userBoard);
    document.querySelector('.add-new-task-button').addEventListener('click', function () {
        console.log('here');
    });
}
function loadKanbanBoard(userBoard) {
    let todoHTML = '';
    let inProgressHTML = '';
    let testingHTML = '';
    let finishedHTML = '';
    if (userBoard) {
        userBoard.todo.forEach(function (task) {
            const description = task.description ? task.description : '';
            todoHTML += `
            <div class="task">
               <div class="task-title">${task.title}</div>
               <div class="task-description">
                  ${description}
               </div>
               <div class="task-assigned-users">
                  <button class="assigned-users-button">See Assigned Users</button>

                  <div class="assigned-users-list hidden">
                     <div class="userlist-name">User 1</div>
                  </div>

                  <input class="input-username" placeholder="Write username">
                  <button class="add-user-button">Add User</button>
               </div>
               <div class="task-created-by">Created By <span style="font-weight: bold;">Test</span></div>
               <div class="task-move-button-container">
                  <button class="move-button">Move To In-Progress</button>
                  <button class="move-button">Move To Testing</button>
                  <button class="move-button">Move To Finished</button>
                  <button class="delete-button">Delete This Task</button>
               </div>
            </div>
         `;
        });
        userBoard.inprogress.forEach(function (task) {
            const description = task.description ? task.description : '';
            inProgressHTML += `
            <div class="task">
               <div class="task-title">${task.title}</div>
               <div class="task-description">
                  ${description}
               </div>
               <div class="task-assigned-users">
                  <button class="assigned-users-button">See Assigned Users</button>

                  <div class="assigned-users-list hidden">
                     <div class="userlist-name">User 1</div>
                  </div>

                  <input class="input-username" placeholder="Write username">
                  <button class="add-user-button">Add User</button>
               </div>
               <div class="task-created-by">Created By <span style="font-weight: bold;">Test</span></div>
               <div class="task-move-button-container">
                  <button class="move-button">Move To TODO</button>
                  <button class="move-button">Move To Testing</button>
                  <button class="move-button">Move To Finished</button>
                  <button class="delete-button">Delete This Task</button>
               </div>
            </div>
         `;
        });
        userBoard.testing.forEach(function (task) {
            const description = task.description ? task.description : '';
            testingHTML += `
            <div class="task">
               <div class="task-title">${task.title}</div>
               <div class="task-description">
                  ${description}
               </div>
               <div class="task-assigned-users">
                  <button class="assigned-users-button">See Assigned Users</button>

                  <div class="assigned-users-list hidden">
                     <div class="userlist-name">User 1</div>
                  </div>

                  <input class="input-username" placeholder="Write username">
                  <button class="add-user-button">Add User</button>
               </div>
               <div class="task-created-by">Created By <span style="font-weight: bold;">Test</span></div>
               <div class="task-move-button-container">
                  <button class="move-button">Move To TODO</button>
                  <button class="move-button">Move To In-Progress</button>
                  <button class="move-button">Move To Finished</button>
                  <button class="delete-button">Delete This Task</button>
               </div>
            </div>
         `;
        });
        userBoard.finished.forEach(function (task) {
            const description = task.description ? task.description : '';
            finishedHTML += `
            <div class="task">
               <div class="task-title">${task.title}</div>
               <div class="task-description">
                  ${description}
               </div>
               <div class="task-assigned-users">
                  <button class="assigned-users-button">See Assigned Users</button>

                  <div class="assigned-users-list hidden">
                     <div class="userlist-name">User 1</div>
                  </div>

                  <input class="input-username" placeholder="Write username">
                  <button class="add-user-button">Add User</button>
               </div>
               <div class="task-created-by">Created By <span style="font-weight: bold;">Test</span></div>
               <div class="task-move-button-container">
                  <button class="move-button">Move To TODO</button>
                  <button class="move-button">Move To In-Progress</button>
                  <button class="move-button">Move To Testing</button>
                  <button class="delete-button">Delete This Task</button>
               </div>
            </div>
         `;
        });
    }
    document.querySelector('.todo-tasks').innerHTML = todoHTML;
    document.querySelector('.inprogress-tasks').innerHTML = inProgressHTML;
    document.querySelector('.testing-tasks').innerHTML = testingHTML;
    document.querySelector('.finished-tasks').innerHTML = finishedHTML;
}
function setData(key, data) {
    localStorage.setItem(key, data);
}
//# sourceMappingURL=KanbanBoard.js.map