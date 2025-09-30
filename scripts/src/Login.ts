main();

function getData(key: string) {
   const jsonValue = localStorage.getItem(key);

   const value = jsonValue != null ? JSON.parse(jsonValue) : null;

   return value;
}

function setData(key: string, data: string) {
   localStorage.setItem(key, data);
}

function loadHomePage() {
   window.location.href = "../pages/KanbanBoard.html";
}

function checkValidUser() {
   const emailElement = document.querySelector('.js-email') as HTMLInputElement;
   const email = emailElement?.value;

   const passwordElement = document.querySelector('.js-password') as HTMLInputElement;
   const password = passwordElement.value;
   
   const users = loadUsers();

   for (let user in users) {
      if (users[user].email === email && users[user].password === password) {
         const currUser = {
            id: user,
            username: users[user].username
         };

         setData('currUser', JSON.stringify(currUser));

         setTimeout(async function() {
            await loadHomePage();
         }, 1000);

         return;
      }
   }

   alert('Invalid email or password, authentication failed.');
}

function main() {
   document.querySelector('.js-login-button')
      ?.addEventListener('click', function() {
         checkValidUser();
      });

   document.querySelector('.js-registration-link')
      ?.addEventListener('click', function() {
         window.location.href = '../pages/RegistrationPage.html';
      });
}

function loadUsers() {
   return getData('users');
}