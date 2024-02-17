import { testConnection } from './connectionTest/test.js';
const fs = window.require('node:fs');
const app = document.getElementById("app")
const status = document.getElementById("loadStatusText")
var pagedata = null;
var initialized = false;

function readFile(filePath) {
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            window.console.log(err)
            return err;
        }
        window.console.log(data)
        pagedata = data;
        return data;
    })
}

export function startUp(url) {
var response = testConnection(url)

if (response) {
    status.innerHTML = "Connection successful, loading app..."
    window.location.href = "./src/pages/dashboard/index.html"
}
}