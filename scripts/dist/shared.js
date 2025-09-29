"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function loadHomePage() {
    window.location.href = "../pages/KanbanBoard.html";
}
function loadLoginPage() {
    window.location.href = "../pages/LoginPage.html";
}
function getData(key) {
    const jsonValue = localStorage.getItem(key);
    const value = jsonValue != null ? JSON.parse(jsonValue) : null;
    return value;
}
function setData(key, data) {
    localStorage.setItem(key, data);
}
// export = { loadHomePage, loadLoginPage, setData }
//# sourceMappingURL=shared.js.map