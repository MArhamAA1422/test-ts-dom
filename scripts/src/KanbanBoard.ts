init();

function reloadPage() {
   setTimeout(async function() {
      await (window.location.href = '../pages/KanbanBoard.html');
   }, 10);
}

function init() {
   const kanbanBoard: KanbanBoardType = getData('kanbanBoard');
   main(kanbanBoard);
}

type TaskType = 'todo' | 'inprogress' | 'testing' | 'finished';

type Task = {
   id: number,
   title: string,
   type: TaskType,
   createdBy: string,
   description?: string,
   assignedUser?: string[],
};

type KanbanBoardType = Task[];

function getData(key: string) {
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

function main(kanbanBoard: KanbanBoardType) {
   const currUser = currentUser();
   if (currUser === null) {
      loadLoginPage();
      return;
   }

   (document.querySelector('.js-display-username') as Element).innerHTML = `User: <span class="username">${currUser.username}</span>`;

   // console.log(kanbanBoard, typeof kanbanBoard);

   loadKanbanBoard(kanbanBoard);

   (document.querySelector('.js-log-out') as Element)
      .addEventListener('click', function() {
         localStorage.removeItem('currUser');
         loadLoginPage();
      });

   (document.querySelector('.js-search-button') as Element)
      .addEventListener('click', function(event) {
         const searchInput = (document.querySelector('.js-search-input') as HTMLInputElement).value;
         
         loadKanbanBoardByUsername(searchInput);
      });

   (document.querySelector('.js-todo-add') as Element).addEventListener('click', function() {
      addTask('todo');
   });

   (document.querySelector('.js-inprogress-add') as Element).addEventListener('click', function() {
      addTask('inprogress');
   });

   (document.querySelector('.js-testing-add') as Element).addEventListener('click', function() {
      addTask('testing');
   });

   (document.querySelector('.js-finished-add') as Element).addEventListener('click', function() {
      addTask('finished');
   });

   const deleteButtons = (document.querySelectorAll('.delete-button') as any);

   deleteButtons.forEach(function(button: any) {
      button.addEventListener('click', function() {
         const taskId = button.dataset.taskId;
         deleteTask(taskId);
      });
   });

   const moveButtons = (document.querySelectorAll('.move-button') as any);

   moveButtons.forEach(function(button: any) {
      button.addEventListener('click', function() {
         const taskId = button.dataset.taskId;
         const moveType = button.dataset.moveType;
         // console.log(taskId, moveType);
         setTimeout(async function() {
            await moveTask(taskId, moveType);
         }, 1500);
      });
   });

   const assignedUsersButtons = (document.querySelectorAll('.js-assigned-users-button') as any);

   assignedUsersButtons.forEach(function(button: any) {
      button.addEventListener('click', function() {
         const taskId = button.dataset.taskId;
         showAssignedUsers(taskId);
      });
   });

   const addUserButtons = (document.querySelectorAll('.add-user-button') as any);

   addUserButtons.forEach(function(button: any) {
      button.addEventListener('click', function() {
         const taskId = button.dataset.taskId;
         addUserToTask(taskId);
      });
   });
}

function addTask(section: string) {
   (document.querySelector(`.new-task-info-${section}`) as Element).classList.remove('hidden');

   (document.querySelector(`.add-task-button-${section}`) as Element)
      .addEventListener('click', function() {
         // console.log('clicked');

         const taskTitle = (document.querySelector(`.js-${section}-title`) as HTMLInputElement).value;

         const taskDescription = (document.querySelector(`.js-${section}-description`) as HTMLInputElement).value;

         // console.log(taskTitle, taskDescription);

         let valid = false;
         for (let c of taskTitle) {
            if (isAlpha(c)) {
               valid = true;
            }
         }

         if (!valid) {
            alert('Please write valid task title');
            (document.querySelector(`.new-task-info-${section}`) as Element).classList.add('hidden');
            return;
         }

         (document.querySelector(`.js-add-task-tooltip-${section}`) as Element).classList.remove('hidden');

         setTimeout(async function() {
            const handleAsync = function() {
               (document.querySelector(`.new-task-info-${section}`) as Element).classList.add('hidden');

               addTaskToUserBoard(section, taskTitle, taskDescription);
            }

            await handleAsync();
            (document.querySelector(`.js-add-task-tooltip-${section}`) as Element).classList.add('hidden');
            alert('Task added successfully.');
         }, 1500);
      });
}

function isAlpha(v: any) {
   if (v >= 'a' && v <= 'z') return true;
   if (v >= 'A' && v <= 'Z') return true;
   return false;
}

function addTaskToUserBoard(section: string, title: string, description: string) {
   const currUser = currentUser();

   let kanbanBoard: KanbanBoardType = getData('kanbanBoard');

   if (!kanbanBoard) kanbanBoard = [];

   let ID = getData('taskId');
   if (ID === null) ID = 0;

   const id = ID + 1;
   setData('taskId', JSON.stringify(ID+1));

   switch(section) {
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

   // (document.querySelector(`.js-${section}-add`) as Element).removeEventListener('click', function() {
   //    // console.log('done');
   //    addTask('todo');
   // });

   reloadPage();
};

function addUserToTask(taskId: number) {
   const kanbanBoard: KanbanBoardType = getData('kanbanBoard');
   const username = (document.querySelector(`.js-input-username-${taskId}`) as HTMLInputElement).value as string;

   kanbanBoard.forEach(function(task) {
      if (task.id - taskId === 0) {
         if (isValidUsername(username)) {
            // console.log(alreadyExist(taskId, username));
            if (!alreadyExist(taskId, username)) {
               task.assignedUser?.push(username);
               setData('kanbanBoard', JSON.stringify(kanbanBoard));
               alert(`${username} is assigned.`);
               return;
            }
         } else {
            alert('Please give valid username.');
         }
      }
   });
}

function deleteTask(taskId: number) {
   let kanbanBoard: KanbanBoardType = getData('kanbanBoard');

   kanbanBoard = kanbanBoard.filter(function(task) {
      if (task.id - taskId === 0) return false;
      return true;
   });

   // console.log(kanbanBoard);

   setData('kanbanBoard', JSON.stringify(kanbanBoard));

   reloadPage();
}

function moveTask(taskId: number, moveType: TaskType) {
   let kanbanBoard: KanbanBoardType = getData('kanbanBoard');

   kanbanBoard = kanbanBoard.map(function(task) {
      // console.log(task);
      if (task.id - taskId === 0) {
         task.type = moveType;
      }
      // console.log(task);
      return task;
   });

   // console.log(kanbanBoard);

   setData('kanbanBoard', JSON.stringify(kanbanBoard));

   reloadPage();
}

async function showAssignedUsers(taskId: number) {
   const kanbanBoard: KanbanBoardType = getData('kanbanBoard');
   let usersListHTML = '';

   kanbanBoard.forEach(function(task) {
      if (task.id - taskId === 0) {
         task.assignedUser?.forEach(function(user) {
            usersListHTML += `<div class="userlist-name">${user}</div>`
         });
      }
   });

   const assignedUsersListElement = (document.querySelector(`.js-assigned-users-list-${taskId}`) as Element);

   assignedUsersListElement.classList.remove('hidden');
   assignedUsersListElement.innerHTML = usersListHTML;

   await setTimeout(function() {
      assignedUsersListElement.classList.add('hidden');
   }, 2000);
}

function isValidUsername(username: string): boolean {
   const users = getData('users');
   for (let key in users) {
      if (users[key].username === username) {
         return true;
      }
   }

   return false;
}

function alreadyExist(taskId: number, username: string): boolean {
   const kanbanBoard: KanbanBoardType = getData('kanbanBoard');
   let found = false;

   kanbanBoard.forEach(function(task) {
      if (task.id - taskId === 0) {
         task.assignedUser?.forEach(function(user) {
            if (user === username) found = true;
         });
      }
   });
   return found;
}

function setData(key: string, data: string) {
   localStorage.setItem(key, data);
}

function loadKanbanBoardByUsername(username: string) {
   const kanbanBoard: KanbanBoardType = getData('kanbanBoard');
   
   const newKanbanBoard = kanbanBoard.filter(function(task) {
      let found = false;
      task.assignedUser?.forEach(function(user) {
         if (user === username) {
            found = true;
         }
      });
      return found;
   });

   if (newKanbanBoard.length) {
      alert('Loading items by search');
      main(newKanbanBoard);
   } else {
      reloadPage();
   }
}

function userListToAssign() {
   const users = getData('users');

   let userListToAssignHTML = '';

   for (let key in users) {
      userListToAssignHTML += `
         <option value=${users[key].username}>${users[key].username}</option>
      `;
   }
   
   // console.log(userListToAssignHTML);
   return userListToAssignHTML;
};

function loadKanbanBoard(kanbanBoard: KanbanBoardType) {
   let todoHTML: string = '';
   let inProgressHTML: string = '';
   let testingHTML: string = '';
   let finishedHTML: string ='';

   if (kanbanBoard) {
      const userListToAssignHTML = userListToAssign();
      kanbanBoard.forEach(function(task) {
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

                     <select name="Users" class="select-user js-input-username-${task.id}">
                        ${userListToAssignHTML}
                     </select>

                     <button class="add-user-button js-add-user-button-${task.id}" data-task-id=${task.id}>Assign User</button>
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
         } else if (task.type === 'inprogress') {
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

                     <select name="Users" class="select-user js-input-username-${task.id}">
                        ${userListToAssignHTML}
                     </select>

                     <button class="add-user-button js-add-user-button-${task.id}" data-task-id=${task.id}>Assign User</button>
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
         } else if (task.type === 'testing') {
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

                     <select name="Users" class="select-user js-input-username-${task.id}">
                        ${userListToAssignHTML}
                     </select>

                     <button class="add-user-button js-add-user-button-${task.id}" data-task-id=${task.id}>Assign User</button>
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
         } else if (task.type === 'finished') {
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

                     <select name="Users" class="select-user js-input-username-${task.id}">
                        ${userListToAssignHTML}
                     </select>

                     <button class="add-user-button js-add-user-button-${task.id}" data-task-id=${task.id} data-task-id=${task.id}">Assign User</button>
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

   (document.querySelector('.todo-tasks') as HTMLElement).innerHTML = todoHTML;

   (document.querySelector('.inprogress-tasks') as HTMLElement).innerHTML = inProgressHTML;

   (document.querySelector('.testing-tasks') as HTMLElement).innerHTML = testingHTML;

   (document.querySelector('.finished-tasks') as HTMLElement).innerHTML = finishedHTML;
}