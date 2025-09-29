main();

type taskObject = {
   title: string,
   description?: string,
   assignedUser?: string[],
};

type userBoardType = {
   todo: taskObject[],
   inprogress: taskObject[],
   testing: taskObject[],
   finished: taskObject[],
} | null;

function getData(key: string) {
   const jsonValue = localStorage.getItem(key);

   const value = jsonValue != null ? JSON.parse(jsonValue) : null;

   return value;
}

function currentUser() {
   return getData('currUser');
}

function getCurrentUserBoard(currUser: any) {
   const KanbanBoard = getData('kanbanBoard');
   if (KanbanBoard === null) {
      return null;
   }

   let currUserBoard: userBoardType = null;

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
   const userBoard: userBoardType = getCurrentUserBoard(currUser);

   console.log(userBoard);

   loadKanbanBoard(userBoard);

   (document.querySelector('.add-new-task-button') as Element).addEventListener('click', function() {
      console.log('here');
   });
} 

function loadKanbanBoard(userBoard: userBoardType) {
   let todoHTML: string = '';
   let inProgressHTML: string = '';
   let testingHTML: string = '';
   let finishedHTML: string ='';

   if (userBoard) {
      userBoard.todo.forEach(function(task) {
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

      userBoard.inprogress.forEach(function(task) {
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

      userBoard.testing.forEach(function(task) {
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

      userBoard.finished.forEach(function(task) {
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

   (document.querySelector('.todo-tasks') as HTMLElement).innerHTML = todoHTML;

   (document.querySelector('.inprogress-tasks') as HTMLElement).innerHTML = inProgressHTML;

   (document.querySelector('.testing-tasks') as HTMLElement).innerHTML = testingHTML;

   (document.querySelector('.finished-tasks') as HTMLElement).innerHTML = finishedHTML;
}

function setData(key: string, data: string) {
   localStorage.setItem(key, data);
}