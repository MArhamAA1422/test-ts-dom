main();

function loadLoginPage() {
   window.location.href = "../pages/LoginPage.html";
}

function fetchInfo() {
   const nameElement = document.querySelector('.js-name') as HTMLInputElement;
   const name = nameElement.value;

   const emailElement = document.querySelector('.js-email') as HTMLInputElement;
   const email = emailElement.value;

   const passwordElement = document.querySelector('.js-password') as HTMLInputElement;
   const password = passwordElement.value;

   if (name && email && password) {
      saveToDB(name, email, password);
      loadLoginPage();

   } else {
      alert('Provide correct information.');
   }
}

function main() {
   document.querySelector('.js-login-link')
      ?.addEventListener('click', function() {
         window.location.href = '../pages/LoginPage.html';
      });

   document.querySelector('.js-name')
      ?.addEventListener('keydown', function(event) {
         setTimeout(function() {
            checkValidity("name", nameCheck);
         }, 5);
      //   checkValidity("name", nameCheck);
      });

   document.querySelector('.js-email')
      ?.addEventListener('keydown', function(event) {
         setTimeout(function() {
            checkValidity("email", emailCheck);
         }, 5);
         // checkValidity("email", emailCheck);
      });

   document.querySelector('.js-password')
      ?.addEventListener('keyup', function(event) {
         // setTimeout(function() {
         //    checkValidity("password", passwordCheck);
         // }, 5);
         checkValidity("password", passwordCheck);
      });
   
   document.querySelector('.js-create-button')
      ?.addEventListener('click', function() {
         setTimeout(function() {
            if (checkValidity("name", nameCheck) && checkValidity("email", emailCheck) && checkValidity("password", passwordCheck)) {
               fetchInfo();
            }
         }, 5);
      });
}

function checkValidity(input: string, checkFunction: any) {
   const curr = (document.querySelector(`.js-${input}`) as HTMLInputElement).value;
   let valid = checkFunction(curr);

   if (valid) {
      document.querySelector(`.invalid-${input}`)
         ?.classList.add('hidden');
   } else {
      document.querySelector(`.invalid-${input}`)
         ?.classList.remove('hidden');
   }

   return valid;
}

function nameCheck(curr: string) {
   let valid = true;

   for (let c of curr) {
      if (c < 'A' || c > 'z') {
         if (c !== ' ') {
            valid = false;
         }
      }
   }

   return valid;
}

function isNumber(v: any) {
   if (v >= '0' && v <= '9') return true;
   return false;
}

function isAlpha(v: any) {
   if (v >= 'a' && v <= 'z') return true;
   if (v >= 'A' && v <= 'Z') return true;
   return false;
}

function isDot(v: any) {
   return v === '.';
}

function isDash(v: any) {
   return v === '-';
}

function isSpecial(v: any) {
   if (!isAlpha(v) && !isNumber(v)) return true;
   return false;
}

function emailCheck(curr: string) {
   let valid = true;
   let at = false;

   if (!isNumber(curr[0]) && !isAlpha(curr[0])) {
      valid = false;
   }

   for (let i = 0; i < curr.length; i++) {
      let c = curr[i];
      if (c === '@') {
         if (i > 0) {
            if (!isAlpha(curr[i-1]) && !isNumber(curr[i-1]) && !isDash(curr[i-1])) {
               valid = false;
            }
            if (i+1 < curr.length) {
               if (!isAlpha(curr[i+1]) && !isNumber(curr[i+1]) && !isDash(curr[i+1])) {
                  valid = false;
               }
            }
         }
         at = true;
         let j = i+1, dot = false;
         let lst = -1;
         while (j < curr.length) {
            if (!isAlpha(curr[j]) && !isNumber(curr[j]) && !isDash(curr[j]) && !isDot(curr[j])) {
               valid = false;
               break;
            }
            if (isDot(curr[j])) {
               lst = j;
               dot = true;
               if (isDot(curr[j-1])) valid = false;
               if (j+1 < curr.length) {
                  if (isDot(curr[j+1])) valid = false;
               } else valid = false;
            }
            j++;
         }

         if (dot === false) valid = false;

         for (let j = lst+1; j < curr.length; j++) {
            if (!isAlpha(curr[j])) {
               valid = false;
            }
         }

         if (curr.length - lst <= 2) valid = false;
         break;
      } else if (!isNumber(c) && !isAlpha(c) && !isDash(c) && !isDot(c)) {
         valid = false;
      }
   }

   if (at === false) valid = false;

   return valid;
}

function passwordCheck(curr: string) {
   let alpha = false, num = false, len = false, sp = false;
   if (curr.length >= 6) len = true;

   // console.log(curr);

   for (let c of curr) {
      if (isAlpha(c)) alpha = true;
      if (isNumber(c)) num = true;
      if (isSpecial(c)) sp = true;
   }

   return len && alpha && num && sp;
}

function saveToDB(username: string, email: string, password: string) {
   let id;
   let users = getData('users') || {};

   id = Object.keys(users).length + 1;

   const userObj = {
      username,
      email,
      password
   };

   users[id] = userObj;
   // console.log(users);

   setData('users', JSON.stringify(users));
}

function setData(key: string, data: string) {
   localStorage.setItem(key, data);
}

function getData(key: string) {
   const jsonValue = localStorage.getItem(key);

   const value = jsonValue != null ? JSON.parse(jsonValue) : null;

   return value;
}