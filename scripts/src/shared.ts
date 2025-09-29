function loadHomePage() {
   window.location.href = "../pages/KanbanBoard.html";
}

function loadLoginPage() {
   window.location.href = "../pages/LoginPage.html";
}

function getData(key: string) {
   const jsonValue = localStorage.getItem(key);

   const value = jsonValue != null ? JSON.parse(jsonValue) : null;

   return value;
}

function setData(key: string, data: string) {
   localStorage.setItem(key, data);
}

// export = { loadHomePage, loadLoginPage, setData }